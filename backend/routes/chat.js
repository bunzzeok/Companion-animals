const express = require('express');
const { body, validationResult } = require('express-validator');
const { ChatRoom, Message } = require('../models/Chat');
const Pet = require('../models/Pet');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

// GET /api/chat/rooms - 채팅방 목록 조회
router.get('/rooms', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // 사용자가 참여한 채팅방 조회
    const chatRooms = await ChatRoom.findByParticipant(userId);
    
    const roomsWithDetails = chatRooms.map(room => {
      // 현재 사용자가 아닌 다른 참여자 찾기
      const otherParticipant = room.participants.find(p => 
        p.user._id.toString() !== userId.toString()
      );
      
      // 현재 사용자의 읽지 않은 메시지 수 계산
      const userParticipant = room.participants.find(p => 
        p.user._id.toString() === userId.toString()
      );
      
      return {
        _id: room._id,
        type: room.type,
        name: room.name || (room.relatedPet ? room.relatedPet.name : '채팅'),
        participants: room.participants.map(p => ({
          _id: p.user._id,
          name: p.user.name,
          profileImage: p.user.profileImage,
          isOnline: false // TODO: implement online status
        })),
        relatedPet: room.relatedPet ? {
          _id: room.relatedPet._id,
          name: room.relatedPet.name,
          images: room.relatedPet.images
        } : null,
        lastMessage: room.lastMessage ? {
          content: room.lastMessage.content,
          sender: room.lastMessage.sender,
          messageType: room.lastMessage.messageType,
          createdAt: room.lastMessage.sentAt || room.lastMessage.createdAt
        } : null,
        unreadCount: userParticipant ? userParticipant.unreadCount : 0,
        status: room.status,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt
      };
    });

    res.json({
      success: true,
      data: roomsWithDetails
    });

  } catch (error) {
    console.error('Get chat rooms error:', error);
    res.status(500).json({
      success: false,
      message: '채팅방 목록을 가져오는데 실패했습니다.',
      error: error.message
    });
  }
});

// GET /api/chat/rooms/:roomId - 특정 채팅방 정보 조회
router.get('/rooms/:roomId', protect, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;
    
    const room = await ChatRoom.findById(roomId)
      .populate('participants.user', 'name profileImage')
      .populate('relatedPet', 'name type breed age size images description location')
      .populate('relatedAdoption');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: '채팅방을 찾을 수 없습니다.'
      });
    }

    // 사용자가 해당 채팅방 참여자인지 확인
    const isParticipant = room.participants.some(p => 
      p.user._id.toString() === userId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: '채팅방 접근 권한이 없습니다.'
      });
    }

    // 다른 참여자 정보
    const otherParticipant = room.participants.find(p => 
      p.user._id.toString() !== userId.toString()
    );

    const roomData = {
      _id: room._id,
      type: room.type,
      name: room.name,
      description: room.description,
      participants: room.participants.map(p => ({
        _id: p.user._id,
        name: p.user.name,
        profileImage: p.user.profileImage,
        isOnline: false // TODO: implement online status
      })),
      relatedPet: room.relatedPet,
      relatedAdoption: room.relatedAdoption,
      lastMessage: room.lastMessage,
      status: room.status,
      settings: room.settings,
      statistics: room.statistics,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt
    };

    res.json({
      success: true,
      data: roomData
    });

  } catch (error) {
    console.error('Get chat room error:', error);
    res.status(500).json({
      success: false,
      message: '채팅방 정보를 가져오는데 실패했습니다.',
      error: error.message
    });
  }
});

// GET /api/chat/rooms/:roomId/messages - 채팅방 메시지 조회
router.get('/rooms/:roomId/messages', protect, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;
    const { limit = 50, before } = req.query;

    // Validate roomId
    if (!roomId || roomId === 'undefined' || roomId === 'null') {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 채팅방 ID입니다.'
      });
    }

    // 채팅방 존재 여부 및 권한 확인
    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: '채팅방을 찾을 수 없습니다.'
      });
    }

    const isParticipant = room.participants.some(p => 
      p.user._id.toString() === userId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: '채팅방 접근 권한이 없습니다.'
      });
    }

    // 메시지 조회 옵션 설정
    const options = {
      limit: parseInt(limit),
      before: before ? new Date(before) : null
    };

    const messages = await Message.findByChatRoom(roomId, options);

    res.json({
      success: true,
      data: messages
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: '메시지를 가져오는데 실패했습니다.',
      error: error.message
    });
  }
});

// POST /api/chat/messages - 메시지 전송
router.post('/messages', protect, upload.array('media', 5), [
  body('chatRoom')
    .notEmpty()
    .withMessage('Chat room ID is required'),
  
  body('content')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Message content cannot exceed 2000 characters'),
  
  body('messageType')
    .optional()
    .isIn(['text', 'image', 'video', 'file', 'voice', 'location', 'contact'])
    .withMessage('Invalid message type')
], async (req, res) => {
  try {
    // 유효성 검증
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '입력 데이터가 유효하지 않습니다.',
        details: errors.array()
      });
    }

    const { chatRoom, content, messageType = 'text', location, contact } = req.body;
    const userId = req.user._id;

    console.log('📨 Send message request:', {
      chatRoom,
      chatRoomType: typeof chatRoom,
      content: content?.substring(0, 50),
      messageType,
      userId,
      bodyKeys: Object.keys(req.body)
    });

    // Validate chatRoom ID
    if (!chatRoom || chatRoom === 'undefined' || chatRoom === 'null') {
      console.error('❌ Invalid chatRoom ID:', chatRoom);
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 채팅방 ID입니다.',
        debug: { chatRoom, chatRoomType: typeof chatRoom }
      });
    }

    // 채팅방 존재 여부 및 권한 확인
    const room = await ChatRoom.findById(chatRoom);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: '채팅방을 찾을 수 없습니다.'
      });
    }

    const isParticipant = room.participants.some(p => 
      p.user._id.toString() === userId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: '메시지 전송 권한이 없습니다.'
      });
    }

    // 메시지 데이터 준비
    const messageData = {
      chatRoom,
      sender: userId,
      messageType,
      content
    };

    // 미디어 파일 처리
    if (req.files && req.files.length > 0) {
      messageData.media = req.files.map(file => ({
        type: file.mimetype.startsWith('image/') ? 'image' : 
              file.mimetype.startsWith('video/') ? 'video' : 
              file.mimetype.startsWith('audio/') ? 'audio' : 'document',
        url: file.path,
        filename: file.originalname,
        size: file.size,
        mimeType: file.mimetype
      }));
    }

    // 위치 정보 처리
    if (messageType === 'location' && location) {
      messageData.location = JSON.parse(location);
    }

    // 연락처 정보 처리
    if (messageType === 'contact' && contact) {
      messageData.contact = JSON.parse(contact);
    }

    // 메시지 생성
    const message = await Message.create(messageData);

    // 채팅방의 마지막 메시지 업데이트
    await room.updateLastMessage(message);

    // 다른 참여자들의 읽지 않은 메시지 수 증가 (발신자 제외)
    room.participants.forEach(participant => {
      if (participant.user.toString() !== userId.toString()) {
        participant.unreadCount += 1;
      }
    });
    await room.save();

    // 메시지 populate 후 반환
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name profileImage');

    res.status(201).json({
      success: true,
      data: populatedMessage,
      message: '메시지가 전송되었습니다.'
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: '메시지 전송에 실패했습니다.',
      error: error.message
    });
  }
});

// PUT /api/chat/messages/:messageId/read - 메시지 읽음 처리
router.put('/messages/:messageId/read', protect, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: '메시지를 찾을 수 없습니다.'
      });
    }

    // 메시지를 읽음으로 표시
    await message.markAsRead(userId);

    res.json({
      success: true,
      message: '메시지를 읽음으로 표시했습니다.'
    });

  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({
      success: false,
      message: '메시지 읽음 처리에 실패했습니다.',
      error: error.message
    });
  }
});

// PUT /api/chat/rooms/:roomId/read - 채팅방의 모든 메시지 읽음 처리
router.put('/rooms/:roomId/read', protect, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: '채팅방을 찾을 수 없습니다.'
      });
    }

    // 채팅방 참여자 확인
    const isParticipant = room.participants.some(p => 
      p.user._id.toString() === userId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: '권한이 없습니다.'
      });
    }

    // 채팅방의 모든 메시지를 읽음으로 표시
    await room.markAsRead(userId);

    // Socket.IO를 통해 다른 참여자들에게 읽음 상태 알림
    const io = req.app.get('io');
    if (io) {
      io.to(roomId).emit('room:read_by', {
        roomId,
        userId,
        readAt: new Date()
      });
    }

    res.json({
      success: true,
      message: '모든 메시지를 읽음으로 표시했습니다.'
    });

  } catch (error) {
    console.error('Mark room messages as read error:', error);
    res.status(500).json({
      success: false,
      message: '메시지 읽음 처리에 실패했습니다.',
      error: error.message
    });
  }
});

// POST /api/chat/rooms - 채팅방 생성
router.post('/rooms', protect, [
  body('type')
    .isIn(['direct', 'group', 'adoption'])
    .withMessage('Invalid chat room type'),
  
  body('participantIds')
    .isArray({ min: 1 })
    .withMessage('At least one participant is required'),
  
  body('petId')
    .optional()
    .isMongoId()
    .withMessage('Invalid pet ID'),
  
  body('adoptionId')
    .optional()
    .isMongoId()
    .withMessage('Invalid adoption ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '입력 데이터가 유효하지 않습니다.',
        details: errors.array()
      });
    }

    const { type, participantIds, petId, adoptionId, name, description } = req.body;
    const userId = req.user._id;

    // 직접 채팅인 경우 기존 채팅방 확인
    if (type === 'direct' && participantIds.length === 1) {
      const otherUserId = participantIds[0];
      const existingRoom = await ChatRoom.findDirectChat(userId, otherUserId);
      
      if (existingRoom) {
        return res.json({
          success: true,
          data: existingRoom,
          message: '기존 채팅방이 있습니다.'
        });
      }
    }

    // 모든 참여자 배열 (현재 사용자 포함)
    const allParticipants = [userId, ...participantIds];

    // 참여자 정보 생성
    const participants = allParticipants.map(participantId => ({
      user: participantId,
      role: participantId.toString() === userId.toString() ? 'admin' : 'member'
    }));

    // 채팅방 데이터 준비
    const roomData = {
      type,
      participants,
      name,
      description,
      relatedPet: petId || null,
      relatedAdoption: adoptionId || null
    };

    // 채팅방 생성
    const room = await ChatRoom.create(roomData);

    // 시스템 메시지 생성
    const systemMessage = await Message.create({
      chatRoom: room._id,
      sender: userId,
      messageType: 'system',
      content: '채팅이 시작되었습니다.',
      systemMessage: {
        type: 'room_created',
        data: { roomId: room._id }
      }
    });

    // 채팅방의 마지막 메시지 업데이트
    await room.updateLastMessage(systemMessage);

    const populatedRoom = await ChatRoom.findById(room._id)
      .populate('participants.user', 'name profileImage')
      .populate('relatedPet', 'name type images')
      .populate('relatedAdoption');

    res.status(201).json({
      success: true,
      data: populatedRoom,
      message: '채팅방이 생성되었습니다.'
    });

  } catch (error) {
    console.error('Create chat room error:', error);
    res.status(500).json({
      success: false,
      message: '채팅방 생성에 실패했습니다.',
      error: error.message
    });
  }
});

// POST /api/chat/rooms/pet/:petId - 펫 기반 채팅방 생성/조회
router.post('/rooms/pet/:petId', protect, async (req, res) => {
  try {
    const { petId } = req.params;
    const userId = req.user._id;

    // 펫 정보 조회
    const pet = await Pet.findById(petId).populate('owner');
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: '펫을 찾을 수 없습니다.'
      });
    }

    const ownerId = pet.owner._id;

    // 자기 자신과 채팅방을 만들려고 하는 경우
    if (userId.toString() === ownerId.toString()) {
      return res.status(400).json({
        success: false,
        message: '자신의 펫에는 채팅을 시작할 수 없습니다.'
      });
    }

    // 기존 채팅방이 있는지 확인
    const existingRoom = await ChatRoom.findOne({
      type: 'adoption',
      relatedPet: petId,
      'participants.user': { $all: [userId, ownerId] },
      status: 'active'
    });

    if (existingRoom) {
      return res.json({
        success: true,
        data: { roomId: existingRoom._id, isNew: false },
        message: '기존 채팅방이 있습니다.'
      });
    }

    // 새 채팅방 생성
    const roomData = {
      type: 'adoption',
      participants: [
        { user: userId, role: 'member' },
        { user: ownerId, role: 'member' }
      ],
      relatedPet: petId,
      name: `${pet.name} 입양 상담`
    };

    const room = await ChatRoom.create(roomData);

    // 시스템 메시지 생성
    const systemMessage = await Message.create({
      chatRoom: room._id,
      sender: userId,
      messageType: 'system',
      content: `${pet.name}에 대한 입양 상담이 시작되었습니다.`,
      systemMessage: {
        type: 'room_created',
        data: { petId, petName: pet.name }
      }
    });

    await room.updateLastMessage(systemMessage);

    res.status(201).json({
      success: true,
      data: { roomId: room._id, isNew: true },
      message: '채팅방이 생성되었습니다.'
    });

  } catch (error) {
    console.error('Create pet chat room error:', error);
    res.status(500).json({
      success: false,
      message: '채팅방 생성에 실패했습니다.',
      error: error.message
    });
  }
});

// POST /api/chat/messages/:messageId/reaction - 메시지에 반응 추가/제거
router.post('/messages/:messageId/reaction', protect, [
  body('emoji')
    .notEmpty()
    .withMessage('Emoji is required')
], async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: '메시지를 찾을 수 없습니다.'
      });
    }

    await message.addReaction(userId, emoji);

    const updatedMessage = await Message.findById(messageId)
      .populate('sender', 'name profileImage');

    res.json({
      success: true,
      data: updatedMessage,
      message: '반응이 추가/제거되었습니다.'
    });

  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({
      success: false,
      message: '반응 처리에 실패했습니다.',
      error: error.message
    });
  }
});

// DELETE /api/chat/rooms/:roomId - 채팅방 나가기/삭제
router.delete('/rooms/:roomId', protect, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: '채팅방을 찾을 수 없습니다.'
      });
    }

    // 참여자에서 사용자 제거
    await room.removeParticipant(userId);

    res.json({
      success: true,
      message: '채팅방에서 나왔습니다.'
    });

  } catch (error) {
    console.error('Leave chat room error:', error);
    res.status(500).json({
      success: false,
      message: '채팅방 나가기에 실패했습니다.',
      error: error.message
    });
  }
});

module.exports = router;