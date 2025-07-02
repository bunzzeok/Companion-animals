const express = require('express');
const Pet = require('../models/Pet');
const User = require('../models/User');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/about/statistics - Get platform statistics
router.get('/statistics', optionalAuth, async (req, res) => {
  try {
    // Get various platform statistics
    const [
      totalPets,
      availablePets,
      adoptedPets,
      totalUsers,
      adopters,
      providers,
      totalAdoptions,
      recentAdoptions
    ] = await Promise.all([
      Pet.countDocuments(),
      Pet.countDocuments({ status: 'available' }),
      Pet.countDocuments({ status: 'adopted' }),
      User.countDocuments(),
      User.countDocuments({ userType: 'adopter' }),
      User.countDocuments({ userType: 'provider' }),
      Pet.countDocuments({ status: 'adopted' }),
      Pet.countDocuments({ 
        status: 'adopted',
        adoptedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      })
    ]);

    // Calculate adoption success rate
    const adoptionRate = totalPets > 0 ? Math.round((adoptedPets / totalPets) * 100) : 0;

    // Get pet type distribution
    const petTypeStats = await Pet.aggregate([
      { $match: { status: 'available' } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get location distribution
    const locationStats = await Pet.aggregate([
      { $match: { status: 'available' } },
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get urgent pets count
    const urgentPets = await Pet.countDocuments({ 
      status: 'available', 
      urgency: 'high' 
    });

    const statistics = {
      // Main stats for homepage
      adoptions: adoptedPets,
      families: adopters,
      shelters: providers,
      support: '24/7',
      
      // Detailed stats
      pets: {
        total: totalPets,
        available: availablePets,
        adopted: adoptedPets,
        urgent: urgentPets,
        adoptionRate: `${adoptionRate}%`
      },
      users: {
        total: totalUsers,
        adopters: adopters,
        providers: providers
      },
      platform: {
        totalAdoptions: totalAdoptions,
        recentAdoptions: recentAdoptions,
        successRate: adoptionRate,
        activeListings: availablePets
      },
      distribution: {
        byType: petTypeStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byLocation: locationStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    };

    res.json({
      success: true,
      data: statistics
    });

    console.log(`✅ Platform statistics retrieved`);

  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve platform statistics'
    });
  }
});

// GET /api/about/team - Get team information
router.get('/team', async (req, res) => {
  try {
    // Mock team data - in a real app, this would come from a database
    const teamMembers = [
      {
        id: 1,
        name: '김대표',
        position: '대표이사',
        department: '경영진',
        bio: '반려동물 복지 향상을 위해 노력하는 Companion Animals의 대표입니다.',
        image: '/team/ceo.jpg',
        email: 'ceo@companionanimals.co.kr'
      },
      {
        id: 2,
        name: '이개발',
        position: '개발팀장',
        department: '기술',
        bio: '플랫폼의 기술적 발전을 이끌고 있습니다.',
        image: '/team/dev-lead.jpg',
        email: 'dev@companionanimals.co.kr'
      },
      {
        id: 3,
        name: '박운영',
        position: '운영팀장',
        department: '운영',
        bio: '사용자들의 원활한 입양 과정을 지원합니다.',
        image: '/team/ops-lead.jpg',
        email: 'ops@companionanimals.co.kr'
      }
    ];

    res.json({
      success: true,
      data: teamMembers
    });

  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve team information'
    });
  }
});

// GET /api/about/history - Get company history
router.get('/history', async (req, res) => {
  try {
    // Mock history data
    const history = [
      {
        year: '2024',
        quarter: 'Q2',
        title: 'Companion Animals 플랫폼 론칭',
        description: '반려동물 입양 중개 플랫폼 정식 서비스 시작',
        milestone: true
      },
      {
        year: '2024',
        quarter: 'Q1',
        title: '베타 테스트 시작',
        description: '선별된 사용자들과 함께 플랫폼 베타 테스트 진행',
        milestone: false
      },
      {
        year: '2023',
        quarter: 'Q4',
        title: '개발 완료',
        description: '플랫폼 핵심 기능 개발 완료 및 내부 테스트',
        milestone: false
      },
      {
        year: '2023',
        quarter: 'Q1',
        title: '프로젝트 시작',
        description: 'Companion Animals 프로젝트 기획 및 개발 시작',
        milestone: true
      }
    ];

    res.json({
      success: true,
      data: history
    });

  } catch (error) {
    console.error('Get company history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve company history'
    });
  }
});

// GET /api/about/company - Get company information
router.get('/company', async (req, res) => {
  try {
    const companyInfo = {
      name: 'Companion Animals',
      founded: '2023',
      mission: '모든 반려동물이 사랑받는 가정을 찾을 수 있도록 돕는 것',
      vision: '반려동물과 가족을 연결하는 최고의 플랫폼',
      values: [
        '투명성: 모든 과정이 투명하고 신뢰할 수 있어야 합니다',
        '책임감: 반려동물의 복지를 최우선으로 생각합니다',
        '혁신: 기술을 통해 더 나은 입양 경험을 제공합니다',
        '공감: 모든 이해관계자의 입장을 이해하고 배려합니다'
      ],
      contact: {
        email: 'info@companionanimals.co.kr',
        phone: '02-1234-5678',
        address: '서울특별시 강남구 테헤란로 123',
        hours: '평일 09:00 - 18:00 (주말, 공휴일 휴무)'
      },
      licenses: [
        '동물보호법 준수',
        '개인정보보호법 준수',
        '전자상거래법 준수'
      ]
    };

    res.json({
      success: true,
      data: companyInfo
    });

  } catch (error) {
    console.error('Get company info error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve company information'
    });
  }
});

module.exports = router;