const express = require('express');
const router = express.Router();
const Adoption = require('../models/Adoption');
const Pet = require('../models/Pet');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// GET /api/adoptions - 입양 신청 목록 조회 (권한별 필터링)
router.get('/', protect, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      status, 
      type = 'all' // 'received', 'sent', 'all'
    } = req.query;

    let query = {};
    
    // 사용자 유형에 따른 필터링
    if (type === 'received' && req.user.userType === 'provider') {
      query.provider = req.user._id;
    } else if (type === 'sent' && req.user.userType === 'adopter') {
      query.adopter = req.user._id;
    } else if (type === 'all') {
      if (req.user.userType === 'provider') {
        query.provider = req.user._id;
      } else if (req.user.userType === 'adopter') {
        query.adopter = req.user._id;
      } else if (req.user.userType === 'admin') {
        // 관리자는 모든 신청 조회 가능
      } else {
        return res.status(403).json({
          success: false,
          message: '접근 권한이 없습니다.'
        });
      }
    }

    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const adoptions = await Adoption.find(query)
      .populate('pet', 'name type images status location')
      .populate('adopter', 'name profileImage email phone')
      .populate('provider', 'name profileImage email phone')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Adoption.countDocuments(query);

    res.json({
      success: true,
      data: adoptions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get adoptions error:', error);
    res.status(500).json({
      success: false,
      message: '입양 신청 목록을 가져오는데 실패했습니다.',
      error: error.message
    });
  }
});

// GET /api/adoptions/statistics - 입양 통계 (관리자 또는 제공자)
router.get('/statistics', protect, async (req, res) => {
  try {
    let providerId = null;
    
    if (req.user.userType === 'provider') {
      providerId = req.user._id;
    } else if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '통계 조회 권한이 없습니다.'
      });
    }

    const stats = await Adoption.getStats(providerId);
    
    // 최근 성공적인 입양 조회
    const recentSuccessful = await Adoption.findSuccessfulAdoptions(5);
    
    // 만료 예정 신청 조회
    const expiringSoon = await Adoption.findExpiringSoon(3);

    res.json({
      success: true,
      data: {
        statistics: stats[0] || { total: 0, stats: [] },
        recentSuccessful,
        expiringSoon
      }
    });
  } catch (error) {
    console.error('Get adoption statistics error:', error);
    res.status(500).json({
      success: false,
      message: '입양 통계를 가져오는데 실패했습니다.',
      error: error.message
    });
  }
});

// GET /api/adoptions/:id - 특정 입양 신청 상세 조회
router.get('/:id', protect, async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id)
      .populate('pet', 'name type breed age size images description location owner')
      .populate('adopter', 'name profileImage email phone address bio')
      .populate('provider', 'name profileImage email phone address bio')
      .populate('statusHistory.changedBy', 'name');

    if (!adoption) {
      return res.status(404).json({
        success: false,
        message: '입양 신청을 찾을 수 없습니다.'
      });
    }

    // 권한 확인 (관련 당사자 또는 관리자만 조회 가능)
    const isAuthorized = 
      adoption.adopter._id.toString() === req.user._id.toString() ||
      adoption.provider._id.toString() === req.user._id.toString() ||
      req.user.userType === 'admin';

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: '조회 권한이 없습니다.'
      });
    }

    res.json({
      success: true,
      data: adoption
    });
  } catch (error) {
    console.error('Get adoption error:', error);
    res.status(500).json({
      success: false,
      message: '입양 신청 정보를 가져오는데 실패했습니다.',
      error: error.message
    });
  }
});

// POST /api/adoptions - 입양 신청 생성 (입양 희망자만)
router.post('/', protect, authorize('adopter'), async (req, res) => {
  try {
    const {
      petId,
      message,
      experience,
      livingSituation,
      additionalInfo
    } = req.body;

    // 펫 존재 및 상태 확인
    const pet = await Pet.findById(petId).populate('owner');
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: '펫을 찾을 수 없습니다.'
      });
    }

    if (pet.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: '현재 입양 신청이 불가능한 펫입니다.'
      });
    }

    // 자신의 펫에 신청하는 것 방지
    if (pet.owner._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: '자신의 펫에는 입양 신청할 수 없습니다.'
      });
    }

    // 이미 신청한 펫인지 확인
    const existingApplication = await Adoption.findOne({
      pet: petId,
      adopter: req.user._id,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: '이미 신청한 펫입니다.'
      });
    }

    const adoptionData = {
      pet: petId,
      adopter: req.user._id,
      provider: pet.owner._id,
      message,
      experience,
      livingSituation,
      additionalInfo: additionalInfo || {}
    };

    const adoption = await Adoption.create(adoptionData);

    // 펫 상태를 pending으로 변경 (첫 번째 신청인 경우)
    const pendingApplicationsCount = await Adoption.countDocuments({
      pet: petId,
      status: 'pending'
    });

    if (pendingApplicationsCount === 1) {
      pet.status = 'pending';
      await pet.save();
    }

    const populatedAdoption = await Adoption.findById(adoption._id)
      .populate('pet', 'name type images')
      .populate('adopter', 'name profileImage')
      .populate('provider', 'name profileImage');

    res.status(201).json({
      success: true,
      data: populatedAdoption,
      message: '입양 신청이 성공적으로 제출되었습니다.'
    });
  } catch (error) {
    console.error('Create adoption error:', error);
    
    // 중복 신청 에러 처리
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: '이미 신청한 펫입니다.'
      });
    }

    res.status(400).json({
      success: false,
      message: '입양 신청 생성에 실패했습니다.',
      error: error.message
    });
  }
});

// PUT /api/adoptions/:id/status - 입양 신청 상태 변경 (제공자 또는 관리자)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, reason, notes } = req.body;
    
    const adoption = await Adoption.findById(req.params.id)
      .populate('pet')
      .populate('adopter', 'name email')
      .populate('provider', 'name email');

    if (!adoption) {
      return res.status(404).json({
        success: false,
        message: '입양 신청을 찾을 수 없습니다.'
      });
    }

    // 권한 확인 (제공자 또는 관리자만)
    const isAuthorized = 
      adoption.provider._id.toString() === req.user._id.toString() ||
      req.user.userType === 'admin';

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: '상태 변경 권한이 없습니다.'
      });
    }

    // 상태 변경 불가능한 경우 확인
    if (adoption.status === 'completed' || adoption.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: '이미 완료되거나 취소된 신청은 상태를 변경할 수 없습니다.'
      });
    }

    await adoption.updateStatus(status, req.user._id, reason, notes);

    // 상태별 추가 처리
    if (status === 'approved') {
      adoption.providerResponse.respondedAt = new Date();
      adoption.providerResponse.message = notes;
      await adoption.save();
    } else if (status === 'rejected') {
      adoption.providerResponse.respondedAt = new Date();
      adoption.providerResponse.message = notes;
      await adoption.save();
      
      // 다른 대기 중인 신청이 없으면 펫을 다시 available로 변경
      const otherPendingApplications = await Adoption.countDocuments({
        pet: adoption.pet._id,
        _id: { $ne: adoption._id },
        status: 'pending'
      });
      
      if (otherPendingApplications === 0) {
        adoption.pet.status = 'available';
        await adoption.pet.save();
      }
    } else if (status === 'completed') {
      // 펫을 입양 완료 상태로 변경
      adoption.pet.status = 'adopted';
      adoption.pet.adoptedBy = adoption.adopter._id;
      adoption.pet.adoptedAt = new Date();
      await adoption.pet.save();
      
      // 사용자 통계 업데이트
      await User.findByIdAndUpdate(adoption.provider._id, {
        $inc: { 'statistics.adoptionsCompleted': 1 }
      });
      
      // 같은 펫의 다른 신청들을 모두 취소
      await Adoption.updateMany(
        {
          pet: adoption.pet._id,
          _id: { $ne: adoption._id },
          status: { $in: ['pending', 'approved'] }
        },
        {
          status: 'cancelled',
          $push: {
            statusHistory: {
              status: 'cancelled',
              changedAt: new Date(),
              changedBy: req.user._id,
              reason: 'Other application was completed'
            }
          }
        }
      );
    }

    const updatedAdoption = await Adoption.findById(adoption._id)
      .populate('pet', 'name type images status')
      .populate('adopter', 'name profileImage')
      .populate('provider', 'name profileImage')
      .populate('statusHistory.changedBy', 'name');

    res.json({
      success: true,
      data: updatedAdoption,
      message: `입양 신청이 ${getStatusMessage(status)}되었습니다.`
    });
  } catch (error) {
    console.error('Update adoption status error:', error);
    res.status(400).json({
      success: false,
      message: '입양 신청 상태 변경에 실패했습니다.',
      error: error.message
    });
  }
});

// PUT /api/adoptions/:id/meeting - 만남 일정 설정/수정
router.put('/:id/meeting', protect, async (req, res) => {
  try {
    const { scheduledDate, location, notes } = req.body;
    
    const adoption = await Adoption.findById(req.params.id);
    if (!adoption) {
      return res.status(404).json({
        success: false,
        message: '입양 신청을 찾을 수 없습니다.'
      });
    }

    // 권한 확인 (관련 당사자만)
    const isAuthorized = 
      adoption.adopter.toString() === req.user._id.toString() ||
      adoption.provider.toString() === req.user._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: '만남 일정 설정 권한이 없습니다.'
      });
    }

    // 승인된 신청에만 만남 일정 설정 가능
    if (adoption.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: '승인된 신청에만 만남 일정을 설정할 수 있습니다.'
      });
    }

    await adoption.scheduleMeeting(new Date(scheduledDate), location, notes);

    const updatedAdoption = await Adoption.findById(adoption._id)
      .populate('pet', 'name type images')
      .populate('adopter', 'name profileImage')
      .populate('provider', 'name profileImage');

    res.json({
      success: true,
      data: updatedAdoption,
      message: '만남 일정이 설정되었습니다.'
    });
  } catch (error) {
    console.error('Schedule meeting error:', error);
    res.status(400).json({
      success: false,
      message: '만남 일정 설정에 실패했습니다.',
      error: error.message
    });
  }
});

// PUT /api/adoptions/:id/meeting/complete - 만남 완료 처리
router.put('/:id/meeting/complete', protect, async (req, res) => {
  try {
    const { feedback } = req.body;
    
    const adoption = await Adoption.findById(req.params.id);
    if (!adoption) {
      return res.status(404).json({
        success: false,
        message: '입양 신청을 찾을 수 없습니다.'
      });
    }

    // 권한 확인
    const isAdopter = adoption.adopter.toString() === req.user._id.toString();
    const isProvider = adoption.provider.toString() === req.user._id.toString();

    if (!isAdopter && !isProvider) {
      return res.status(403).json({
        success: false,
        message: '권한이 없습니다.'
      });
    }

    // 만남이 예정되어 있는지 확인
    if (!adoption.meeting.isScheduled) {
      return res.status(400).json({
        success: false,
        message: '예정된 만남이 없습니다.'
      });
    }

    // 피드백 추가
    if (isAdopter) {
      adoption.meeting.feedback.fromAdopter = feedback;
    } else if (isProvider) {
      adoption.meeting.feedback.fromProvider = feedback;
    }

    // 양쪽 모두 피드백을 제공했으면 만남 완료 처리
    if (adoption.meeting.feedback.fromAdopter && adoption.meeting.feedback.fromProvider) {
      adoption.meeting.completed = true;
      adoption.meeting.completedAt = new Date();
    }

    await adoption.save();

    const updatedAdoption = await Adoption.findById(adoption._id)
      .populate('pet', 'name type images')
      .populate('adopter', 'name profileImage')
      .populate('provider', 'name profileImage');

    res.json({
      success: true,
      data: updatedAdoption,
      message: '피드백이 저장되었습니다.'
    });
  } catch (error) {
    console.error('Complete meeting error:', error);
    res.status(400).json({
      success: false,
      message: '만남 완료 처리에 실패했습니다.',
      error: error.message
    });
  }
});

// POST /api/adoptions/:id/followup - 사후 업데이트 추가
router.post('/:id/followup', protect, upload.array('photos', 5), async (req, res) => {
  try {
    const { message } = req.body;
    
    const adoption = await Adoption.findById(req.params.id);
    if (!adoption) {
      return res.status(404).json({
        success: false,
        message: '입양 신청을 찾을 수 없습니다.'
      });
    }

    // 권한 확인 (입양자만)
    if (adoption.adopter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '사후 업데이트 권한이 없습니다.'
      });
    }

    // 완료된 입양에만 사후 업데이트 가능
    if (adoption.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: '완료된 입양에만 사후 업데이트를 할 수 있습니다.'
      });
    }

    const photos = req.files ? req.files.map(file => file.path) : [];

    await adoption.addFollowUpUpdate(message, photos, req.user._id);

    const updatedAdoption = await Adoption.findById(adoption._id)
      .populate('pet', 'name type images')
      .populate('adopter', 'name profileImage')
      .populate('provider', 'name profileImage')
      .populate('followUp.updates.submittedBy', 'name profileImage');

    res.json({
      success: true,
      data: updatedAdoption,
      message: '사후 업데이트가 추가되었습니다.'
    });
  } catch (error) {
    console.error('Add follow-up error:', error);
    res.status(400).json({
      success: false,
      message: '사후 업데이트 추가에 실패했습니다.',
      error: error.message
    });
  }
});

// DELETE /api/adoptions/:id - 입양 신청 취소 (신청자만)
router.delete('/:id', protect, async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id);
    if (!adoption) {
      return res.status(404).json({
        success: false,
        message: '입양 신청을 찾을 수 없습니다.'
      });
    }

    // 권한 확인 (신청자만)
    if (adoption.adopter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '취소 권한이 없습니다.'
      });
    }

    // 취소 가능한 상태 확인
    if (['completed', 'cancelled'].includes(adoption.status)) {
      return res.status(400).json({
        success: false,
        message: '이미 완료되거나 취소된 신청은 취소할 수 없습니다.'
      });
    }

    await adoption.updateStatus('cancelled', req.user._id, '신청자가 취소함');

    // 다른 대기 중인 신청이 없으면 펫을 다시 available로 변경
    const otherPendingApplications = await Adoption.countDocuments({
      pet: adoption.pet,
      _id: { $ne: adoption._id },
      status: 'pending'
    });

    if (otherPendingApplications === 0) {
      await Pet.findByIdAndUpdate(adoption.pet, { status: 'available' });
    }

    res.json({
      success: true,
      message: '입양 신청이 취소되었습니다.'
    });
  } catch (error) {
    console.error('Cancel adoption error:', error);
    res.status(500).json({
      success: false,
      message: '입양 신청 취소에 실패했습니다.',
      error: error.message
    });
  }
});

// GET /api/adoptions/pet/:petId - 특정 펫의 입양 신청 목록
router.get('/pet/:petId', protect, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId);
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: '펫을 찾을 수 없습니다.'
      });
    }

    // 펫 소유자 또는 관리자만 조회 가능
    if (pet.owner.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '조회 권한이 없습니다.'
      });
    }

    const { status } = req.query;
    const query = { pet: req.params.petId };
    if (status) query.status = status;

    const adoptions = await Adoption.find(query)
      .populate('adopter', 'name profileImage email phone address')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: adoptions
    });
  } catch (error) {
    console.error('Get pet adoptions error:', error);
    res.status(500).json({
      success: false,
      message: '펫의 입양 신청 목록을 가져오는데 실패했습니다.',
      error: error.message
    });
  }
});

// 헬퍼 함수 - 상태 메시지 반환
function getStatusMessage(status) {
  const messages = {
    'pending': '대기',
    'approved': '승인',
    'rejected': '거절',
    'completed': '완료',
    'cancelled': '취소'
  };
  return messages[status] || status;
}

module.exports = router;