const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// 모델들 import
const User = require('../models/User');
const Pet = require('../models/Pet');
const Community = require('../models/Community');
const Comment = require('../models/Comment');
const Adoption = require('../models/Adoption');
const { ChatRoom, Message } = require('../models/Chat');

// MongoDB 연결
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/companion-animals';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB 연결 성공');
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error.message);
    process.exit(1);
  }
};

// 샘플 사용자 데이터
const createUsers = async () => {
  console.log('👥 사용자 데이터 생성 중...');
  
  const users = [
    {
      email: 'admin@example.com',
      password: 'admin123!',
      name: '관리자',
      phone: '010-1111-1111',
      userType: 'admin',
      address: {
        city: '서울특별시',
        district: '강남구'
      },
      bio: '반려동물 플랫폼 관리자입니다.',
      isVerified: true
    },
    {
      email: 'provider1@example.com',
      password: 'provider123!',
      name: '김분양',
      phone: '010-2222-2222',
      userType: 'provider',
      address: {
        city: '서울특별시',
        district: '성동구'
      },
      bio: '건강한 고양이들을 분양합니다. 20년 경력의 브리더입니다.',
      isVerified: true,
      statistics: { petsPosted: 5, adoptionsCompleted: 12 }
    },
    {
      email: 'provider2@example.com',
      password: 'provider123!',
      name: '이보호',
      phone: '010-3333-3333',
      userType: 'provider',
      address: {
        city: '부산광역시',
        district: '해운대구'
      },
      bio: '유기견 보호소를 운영하며 새 가족을 찾아드립니다.',
      isVerified: true,
      statistics: { petsPosted: 8, adoptionsCompleted: 20 }
    },
    {
      email: 'adopter1@example.com',
      password: 'adopter123!',
      name: '박입양',
      phone: '010-4444-4444',
      userType: 'adopter',
      address: {
        city: '서울특별시',
        district: '마포구'
      },
      bio: '반려동물과 함께 살고 있는 5년차 집사입니다.',
      isVerified: true
    },
    {
      email: 'adopter2@example.com',
      password: 'adopter123!',
      name: '최사랑',
      phone: '010-5555-5555',
      userType: 'adopter',
      address: {
        city: '경기도',
        district: '성남시'
      },
      bio: '처음으로 반려동물을 키우려고 합니다.',
      isVerified: true
    }
  ];

  const createdUsers = [];
  for (const userData of users) {
    try {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`✅ 사용자 생성: ${user.name} (${user.email})`);
    } catch (error) {
      if (error.code === 11000) {
        console.log(`⚠️  사용자 이미 존재: ${userData.email}`);
        const existingUser = await User.findOne({ email: userData.email });
        createdUsers.push(existingUser);
      } else {
        console.error(`❌ 사용자 생성 실패: ${userData.email}`, error.message);
      }
    }
  }
  
  return createdUsers;
};

// 샘플 펫 데이터
const createPets = async (users) => {
  console.log('🐾 펫 데이터 생성 중...');
  
  const providers = users.filter(u => u.userType === 'provider');
  
  const pets = [
    {
      name: '나비',
      type: 'cat',
      breed: '코리안 숏헤어',
      age: 'young',
      gender: 'female',
      size: 'small',
      color: '검은색과 흰색',
      weight: 3.2,
      healthStatus: 'healthy',
      isVaccinated: true,
      isNeutered: true,
      medicalNotes: '최근 건강검진 완료. 모든 예방접종 완료.',
      temperament: ['친화적', '활발함', '호기심 많음'],
      goodWithKids: true,
      goodWithPets: true,
      goodWithStrangers: false,
      location: {
        city: '서울특별시',
        district: '성동구',
        address: '왕십리역 근처'
      },
      description: '매우 활발하고 사람을 좋아하는 고양이입니다. 다른 고양이들과도 잘 지내며, 아이들이 있는 가정에서도 문제없을 것 같아요. 화장실 훈련이 완벽하게 되어있고, 스크래처 사용법도 알고 있어서 가구를 망가뜨리지 않습니다.',
      adoptionFee: 0,
      urgency: 'medium',
      specialNeeds: '특별한 돌봄이 필요하지 않습니다.',
      images: ['/pets/cat1-1.jpg', '/pets/cat1-2.jpg'],
      owner: providers[0]._id,
      views: 156,
      featured: true
    },
    {
      name: '멍멍이',
      type: 'dog',
      breed: '골든 리트리버',
      age: 'adult',
      gender: 'male',
      size: 'large',
      color: '골든',
      weight: 28.5,
      healthStatus: 'healthy',
      isVaccinated: true,
      isNeutered: true,
      medicalNotes: '건강한 상태. 정기 검진 받고 있음.',
      temperament: ['온순함', '충성스러움', '똑똑함'],
      goodWithKids: true,
      goodWithPets: true,
      goodWithStrangers: true,
      location: {
        city: '부산광역시',
        district: '해운대구',
        address: '해운대 해수욕장 근처'
      },
      description: '매우 온순하고 똑똑한 골든 리트리버입니다. 아이들을 특히 좋아하며, 다른 강아지들과도 잘 어울립니다. 기본적인 명령어(앉아, 기다려, 손 등)를 모두 알고 있으며, 산책을 매우 좋아합니다.',
      adoptionFee: 100000,
      urgency: 'low',
      images: ['/pets/dog1-1.jpg', '/pets/dog1-2.jpg', '/pets/dog1-3.jpg'],
      owner: providers[1]._id,
      views: 243,
      featured: true
    },
    {
      name: '치즈',
      type: 'cat',
      breed: '페르시안',
      age: 'adult',
      gender: 'female',
      size: 'medium',
      color: '크림색',
      weight: 4.1,
      healthStatus: 'healthy',
      isVaccinated: true,
      isNeutered: true,
      temperament: ['조용함', '독립적', '우아함'],
      goodWithKids: false,
      goodWithPets: false,
      goodWithStrangers: false,
      location: {
        city: '서울특별시',
        district: '성동구'
      },
      description: '조용하고 우아한 페르시안 고양이입니다. 혼자 있는 시간을 좋아하며, 조용한 환경을 선호합니다. 성인 위주의 가정에 적합합니다.',
      adoptionFee: 200000,
      urgency: 'low',
      images: ['/pets/cat2-1.jpg'],
      owner: providers[0]._id,
      views: 89
    },
    {
      name: '복동이',
      type: 'dog',
      breed: '포메라니안',
      age: 'young',
      gender: 'male',
      size: 'small',
      color: '오렌지색',
      weight: 2.8,
      healthStatus: 'healthy',
      isVaccinated: true,
      isNeutered: false,
      temperament: ['활발함', '애교많음', '경계심 있음'],
      goodWithKids: true,
      goodWithPets: false,
      goodWithStrangers: false,
      location: {
        city: '부산광역시',
        district: '해운대구'
      },
      description: '작지만 용감한 포메라니안입니다. 주인에게는 매우 애교가 많지만, 낯선 사람에게는 경계심을 보입니다. 활발하고 놀기 좋아합니다.',
      adoptionFee: 150000,
      urgency: 'medium',
      images: ['/pets/dog2-1.jpg', '/pets/dog2-2.jpg'],
      owner: providers[1]._id,
      views: 178
    },
    {
      name: '까망이',
      type: 'cat',
      breed: '믹스',
      age: 'baby',
      gender: 'male',
      size: 'small',
      color: '검은색',
      weight: 1.2,
      healthStatus: 'healthy',
      isVaccinated: false,
      isNeutered: false,
      temperament: ['호기심 많음', '장난기 많음'],
      goodWithKids: true,
      goodWithPets: true,
      goodWithStrangers: true,
      location: {
        city: '서울특별시',
        district: '성동구'
      },
      description: '아직 어린 새끼 고양이입니다. 호기심이 많고 매우 활발합니다. 예방접종과 중성화 수술이 필요합니다.',
      adoptionFee: 0,
      urgency: 'high',
      specialNeeds: '예방접종과 중성화 수술 필요',
      images: ['/pets/cat3-1.jpg'],
      owner: providers[0]._id,
      views: 302,
      featured: true
    },
    {
      name: '초코',
      type: 'dog',
      breed: '시바이누',
      age: 'adult',
      gender: 'female',
      size: 'medium',
      color: '갈색',
      weight: 10.5,
      healthStatus: 'healthy',
      isVaccinated: true,
      isNeutered: true,
      temperament: ['독립적', '조용함', '충성스러움'],
      goodWithKids: false,
      goodWithPets: false,
      goodWithStrangers: false,
      location: {
        city: '서울특별시',
        district: '성동구'
      },
      description: '독립적이고 조용한 성격의 시바이누입니다. 혼자서도 잘 지내며, 주인에게는 매우 충성스럽습니다.',
      adoptionFee: 300000,
      urgency: 'low',
      images: ['/pets/dog3-1.jpg'],
      owner: providers[0]._id,
      views: 95
    },
    {
      name: '뽀미',
      type: 'dog',
      breed: '말티즈',
      age: 'senior',
      gender: 'female',
      size: 'small',
      color: '흰색',
      weight: 3.5,
      healthStatus: 'needs_treatment',
      isVaccinated: true,
      isNeutered: true,
      medicalNotes: '관절염이 있어 정기적인 약물 치료가 필요합니다.',
      temperament: ['조용함', '온순함', '애교많음'],
      goodWithKids: true,
      goodWithPets: true,
      goodWithStrangers: true,
      location: {
        city: '부산광역시',
        district: '해운대구'
      },
      description: '나이가 있지만 여전히 건강하고 사랑스러운 말티즈입니다. 관절염 때문에 약물 치료가 필요하지만, 일상생활에는 문제없습니다.',
      adoptionFee: 0,
      urgency: 'high',
      specialNeeds: '관절염 치료를 위한 정기적인 약물 투여 필요',
      images: ['/pets/dog4-1.jpg'],
      owner: providers[1]._id,
      views: 203
    },
    {
      name: '루나',
      type: 'cat',
      breed: '러시안 블루',
      age: 'young',
      gender: 'female',
      size: 'medium',
      color: '회색',
      weight: 3.8,
      healthStatus: 'healthy',
      isVaccinated: true,
      isNeutered: true,
      temperament: ['조용함', '신중함', '우아함'],
      goodWithKids: false,
      goodWithPets: true,
      goodWithStrangers: false,
      location: {
        city: '서울특별시',
        district: '성동구'
      },
      description: '우아하고 조용한 러시안 블루입니다. 신중한 성격으로 새로운 환경에 적응하는데 시간이 필요하지만, 한 번 마음을 열면 매우 애정깊습니다.',
      adoptionFee: 250000,
      urgency: 'low',
      images: ['/pets/cat4-1.jpg'],
      owner: providers[0]._id,
      views: 67
    }
  ];

  const createdPets = [];
  for (const petData of pets) {
    try {
      const pet = new Pet(petData);
      await pet.save();
      createdPets.push(pet);
      console.log(`✅ 펫 생성: ${pet.name} (${pet.type})`);
    } catch (error) {
      console.error(`❌ 펫 생성 실패: ${petData.name}`, error.message);
    }
  }
  
  return createdPets;
};

// 샘플 커뮤니티 게시글 데이터
const createCommunityPosts = async (users) => {
  console.log('📝 커뮤니티 게시글 데이터 생성 중...');
  
  const posts = [
    {
      title: '반려동물 첫 입양 시 주의사항',
      content: `처음으로 반려동물을 입양하시는 분들을 위한 가이드입니다.

1. 충분한 준비 기간을 갖기
- 반려동물용품 미리 준비
- 병원 알아보기
- 가족 구성원들과 충분한 상의

2. 첫 주간 관리
- 환경 적응 시간 주기
- 스트레스 최소화
- 규칙적인 생활 패턴 만들어주기

3. 건강 관리
- 입양 후 즉시 건강검진
- 예방접종 스케줄 확인
- 정기적인 병원 방문

더 궁금한 점이 있으시면 댓글로 남겨주세요!`,
      author: users[1]._id,
      category: 'information',
      tags: ['입양', '초보집사', '가이드'],
      views: 1234,
      isPinned: true
    },
    {
      title: '우리 나비가 드디어 새 가족을 찾았어요! ❤️',
      content: `지난달에 올렸던 나비가 드디어 좋은 가족을 만났습니다!

입양해주신 분이 정말 세심하게 돌봐주시고, 나비도 새 환경에 잘 적응하고 있다고 하네요. 매일 사진을 보내주시는데 정말 행복해 보여요.

좋은 분양 플랫폼 덕분에 이런 좋은 인연을 만들 수 있었네요. 감사합니다!`,
      author: users[1]._id,
      category: 'adoption_story',
      tags: ['입양후기', '고양이', '성공사례'],
      images: ['/community/adoption-success-1.jpg'],
      views: 567
    },
    {
      title: '강아지 산책 시간은 얼마나 하시나요?',
      content: `우리 복동이(포메라니안)를 키우고 있는데요, 산책 시간이 궁금해서 질문드립니다.

현재는 하루에 2번, 각각 30분씩 산책시키고 있어요. 아침에 한 번, 저녁에 한 번인데 이 정도면 충분할까요?

다른 분들은 어떻게 하시는지 경험 공유 부탁드려요!`,
      author: users[3]._id,
      category: 'question',
      tags: ['강아지', '산책', '포메라니안'],
      views: 234
    },
    {
      title: '고양이 모래 추천 부탁드려요',
      content: `안녕하세요! 고양이 키운지 3개월 된 초보 집사입니다.

현재 벤토나이트 모래를 사용하고 있는데, 먼지가 너무 많이 나는 것 같아서 다른 모래로 바꿔보려고 합니다.

혹시 먼지 적고 냄새 잡는 효과 좋은 모래 추천해주실 수 있나요? 가격대는 상관없습니다!`,
      author: users[4]._id,
      category: 'question',
      tags: ['고양이', '모래', '추천'],
      views: 189
    },
    {
      title: '긴급! 길고양이 구조했는데 도움 필요해요',
      content: `오늘 아침에 다친 길고양이를 발견해서 집으로 데려왔습니다.

뒷다리를 조금 절고 있고, 전체적으로 영양상태가 좋지 않아 보여요. 일단 병원에 데려가긴 했는데, 임시보호가 가능한 분이나 입양을 고려하실 분 계신가요?

위치: 서울 마포구
상태: 수컷 추정, 나이 1-2세 정도

급하게 도움이 필요합니다. 연락 주세요!`,
      author: users[3]._id,
      category: 'emergency',
      tags: ['긴급', '길고양이', '구조', '임시보호'],
      isUrgent: true,
      urgentUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1주일
      location: {
        city: '서울특별시',
        district: '마포구'
      },
      views: 789
    },
    {
      title: '반려동물 건강검진 주기는 어떻게 되나요?',
      content: `우리 집 강아지가 올해로 5살이 되었는데요, 건강검진을 얼마나 자주 받아야 하는지 궁금합니다.

현재까지는 매년 한 번씩 받았는데, 나이가 들면서 더 자주 받아야 하는 건 아닌지요?

경험 있으신 분들의 조언 부탁드립니다!`,
      author: users[4]._id,
      category: 'question',
      tags: ['건강검진', '강아지', '건강관리'],
      views: 345
    }
  ];

  const createdPosts = [];
  for (const postData of posts) {
    try {
      const post = new Community(postData);
      await post.save();
      createdPosts.push(post);
      console.log(`✅ 게시글 생성: ${post.title}`);
    } catch (error) {
      console.error(`❌ 게시글 생성 실패: ${postData.title}`, error.message);
    }
  }
  
  return createdPosts;
};

// 샘플 댓글 데이터
const createComments = async (posts, users) => {
  console.log('💬 댓글 데이터 생성 중...');
  
  const comments = [
    {
      content: '정말 유용한 정보 감사합니다! 저도 곧 고양이 입양 예정인데 많은 도움이 되었어요.',
      author: users[3]._id,
      post: posts[0]._id
    },
    {
      content: '첫 주간이 정말 중요하죠. 저희 집 강아지도 처음에 스트레스 받아서 고생했어요.',
      author: users[4]._id,
      post: posts[0]._id
    },
    {
      content: '나비 정말 예쁘네요! 새 가족분께 잘 부탁드려요 ㅠㅠ',
      author: users[2]._id,
      post: posts[1]._id
    },
    {
      content: '소형견은 하루 1시간 정도면 충분해요. 날씨 안 좋을 때는 실내 놀이로 대체하셔도 됩니다.',
      author: users[1]._id,
      post: posts[2]._id
    },
    {
      content: '두부모래 추천드려요! 먼지도 적고 고양이가 좋아해요.',
      author: users[2]._id,
      post: posts[3]._id
    },
    {
      content: '벤토나이트 중에서도 저먼지 제품들이 있어요. 브랜드별로 차이가 꽤 있으니 여러 개 써보시는 걸 추천해요.',
      author: users[1]._id,
      post: posts[3]._id
    },
    {
      content: '정말 고생 많으셨어요. 임시보호는 어렵지만 후원은 가능할 것 같아요!',
      author: users[2]._id,
      post: posts[4]._id
    },
    {
      content: '성견은 6개월에 한 번씩 받는 게 좋다고 들었어요. 시니어견(7세 이상)은 3-4개월마다 권장한대요.',
      author: users[1]._id,
      post: posts[5]._id
    }
  ];

  const createdComments = [];
  for (const commentData of comments) {
    try {
      const comment = new Comment(commentData);
      await comment.save();
      
      // 게시글의 댓글 수 업데이트
      await Community.findByIdAndUpdate(comment.post, { $inc: { commentsCount: 1 } });
      
      createdComments.push(comment);
      console.log(`✅ 댓글 생성`);
    } catch (error) {
      console.error(`❌ 댓글 생성 실패:`, error.message);
    }
  }
  
  return createdComments;
};

// 샘플 입양 신청 데이터
const createAdoptions = async (pets, users) => {
  console.log('📋 입양 신청 데이터 생성 중...');
  
  const adopters = users.filter(u => u.userType === 'adopter');
  const providers = users.filter(u => u.userType === 'provider');
  
  const adoptions = [
    {
      pet: pets[0]._id, // 나비
      adopter: adopters[0]._id, // 박입양
      provider: providers[0]._id, // 김분양
      message: '안녕하세요! 나비에게 관심이 있어서 연락드립니다. 고양이 키운 경험이 5년 정도 있고, 현재 혼자 살고 있어 충분한 관심을 줄 수 있습니다.',
      experience: '현재 3살 된 고양이 한 마리를 키우고 있습니다. 5년 전부터 반려동물과 함께 살면서 많은 것을 배웠습니다.',
      livingSituation: '원룸이지만 넓은 편이고, 고양이를 위한 공간을 충분히 확보해두었습니다. 재택근무를 하고 있어 집에 있는 시간이 많습니다.',
      additionalInfo: {
        hasOtherPets: true,
        otherPetsDetails: '3살 된 암컷 고양이(중성화 완료)',
        hasChildren: false,
        workSchedule: '재택근무',
        homeType: 'apartment',
        monthlyBudget: 300000
      },
      status: 'approved'
    },
    {
      pet: pets[1]._id, // 멍멍이
      adopter: adopters[1]._id, // 최사랑
      provider: providers[1]._id, // 이보호
      message: '골든 리트리버를 꼭 키워보고 싶었는데, 멍멍이가 정말 예쁘네요! 강아지는 처음이지만 충분히 준비하고 있습니다.',
      experience: '반려동물 경험은 없지만, 관련 서적을 많이 읽고 강아지 키우기 클래스도 수강했습니다.',
      livingSituation: '마당이 있는 단독주택에 살고 있어서 대형견을 키우기에 좋은 환경입니다.',
      additionalInfo: {
        hasOtherPets: false,
        hasChildren: false,
        workSchedule: '오전 9시-오후 6시',
        homeType: 'house',
        hasYard: true,
        monthlyBudget: 500000
      },
      status: 'pending'
    },
    {
      pet: pets[3]._id, // 복동이
      adopter: adopters[0]._id, // 박입양
      provider: providers[1]._id, // 이보호
      message: '포메라니안에게 관심이 있습니다. 작은 강아지와 함께 살아본 경험이 있어서 잘 돌볼 수 있을 것 같아요.',
      experience: '포메라니안을 5년간 키웠던 경험이 있습니다. 소형견의 특성을 잘 알고 있어요.',
      livingSituation: '아파트 거주 중이며, 소형견에게 적합한 환경을 조성해두었습니다.',
      additionalInfo: {
        hasOtherPets: true,
        otherPetsDetails: '고양이 1마리',
        hasChildren: false,
        workSchedule: '재택근무',
        homeType: 'apartment',
        monthlyBudget: 400000
      },
      status: 'rejected',
      providerResponse: {
        message: '죄송하지만 복동이는 고양이와 함께 지내기 어려워해서 다른 분께 분양하기로 결정했습니다.',
        respondedAt: new Date()
      }
    }
  ];

  const createdAdoptions = [];
  for (const adoptionData of adoptions) {
    try {
      const adoption = new Adoption(adoptionData);
      await adoption.save();
      createdAdoptions.push(adoption);
      console.log(`✅ 입양 신청 생성`);
    } catch (error) {
      console.error(`❌ 입양 신청 생성 실패:`, error.message);
    }
  }
  
  return createdAdoptions;
};

// 샘플 채팅방과 메시지 데이터
const createChats = async (users, pets, adoptions) => {
  console.log('💬 채팅 데이터 생성 중...');
  
  const adopters = users.filter(u => u.userType === 'adopter');
  const providers = users.filter(u => u.userType === 'provider');
  
  // 입양 관련 채팅방
  const chatRoom = new ChatRoom({
    type: 'adoption',
    participants: [
      { user: adopters[0]._id, role: 'member' },
      { user: providers[0]._id, role: 'member' }
    ],
    relatedPet: pets[0]._id,
    relatedAdoption: adoptions[0]._id,
    status: 'active'
  });
  
  await chatRoom.save();
  console.log('✅ 채팅방 생성');
  
  // 샘플 메시지들
  const messages = [
    {
      chatRoom: chatRoom._id,
      sender: adopters[0]._id,
      messageType: 'text',
      content: '안녕하세요! 나비에 대해서 더 자세히 알고 싶어서 연락드렸어요.'
    },
    {
      chatRoom: chatRoom._id,
      sender: providers[0]._id,
      messageType: 'text',
      content: '안녕하세요! 나비에게 관심 가져주셔서 감사합니다. 어떤 부분이 궁금하신가요?'
    },
    {
      chatRoom: chatRoom._id,
      sender: adopters[0]._id,
      messageType: 'text',
      content: '아직 어린 고양이인가요? 그리고 다른 고양이와 함께 지낼 수 있을까요?'
    },
    {
      chatRoom: chatRoom._id,
      sender: providers[0]._id,
      messageType: 'text',
      content: '나비는 1살 정도 되었고, 다른 고양이들과도 잘 어울려요. 현재 집에서 다른 고양이들과 함께 지내고 있어서 사회성이 좋습니다!'
    },
    {
      chatRoom: chatRoom._id,
      sender: adopters[0]._id,
      messageType: 'text',
      content: '그렇다면 언제 한 번 만나볼 수 있을까요? 직접 만나서 나비와 교감해보고 싶어요.'
    },
    {
      chatRoom: chatRoom._id,
      sender: providers[0]._id,
      messageType: 'text',
      content: '좋아요! 이번 주말 어떠세요? 토요일 오후에 시간 되시면 저희 집에서 만나보실 수 있어요.'
    }
  ];
  
  const createdMessages = [];
  for (const messageData of messages) {
    try {
      const message = new Message(messageData);
      await message.save();
      createdMessages.push(message);
    } catch (error) {
      console.error('❌ 메시지 생성 실패:', error.message);
    }
  }
  
  // 채팅방 마지막 메시지 업데이트
  const lastMessage = createdMessages[createdMessages.length - 1];
  if (lastMessage) {
    await chatRoom.updateLastMessage({
      content: lastMessage.content,
      sender: lastMessage.sender,
      messageType: lastMessage.messageType,
      createdAt: lastMessage.createdAt
    });
  }
  
  console.log(`✅ 메시지 ${createdMessages.length}개 생성`);
  
  return { chatRoom, messages: createdMessages };
};

// 통계 업데이트
const updateStatistics = async (users, pets) => {
  console.log('📊 통계 데이터 업데이트 중...');
  
  // 사용자별 통계 업데이트
  for (const user of users) {
    if (user.userType === 'provider') {
      const userPets = pets.filter(pet => pet.owner.toString() === user._id.toString());
      user.statistics.petsPosted = userPets.length;
      await user.save();
    }
  }
  
  console.log('✅ 통계 데이터 업데이트 완료');
};

// 메인 함수
const initializeDatabase = async () => {
  try {
    console.log('🚀 데이터베이스 초기화 시작...');
    
    await connectDB();
    
    // 기존 데이터 확인
    const existingUsers = await User.countDocuments();
    const existingPets = await Pet.countDocuments();
    const existingPosts = await Community.countDocuments();
    
    console.log(`📊 기존 데이터 현황:`);
    console.log(`   - 사용자: ${existingUsers}명`);
    console.log(`   - 펫: ${existingPets}마리`);
    console.log(`   - 게시글: ${existingPosts}개`);
    
    // 데이터가 이미 있으면 건너뛰기 옵션
    if (existingUsers > 0 && process.argv.includes('--skip-if-exists')) {
      console.log('⚠️  데이터가 이미 존재합니다. 초기화를 건너뜁니다.');
      process.exit(0);
    }
    
    // 전체 삭제 옵션
    if (process.argv.includes('--reset')) {
      console.log('🗑️  기존 데이터 삭제 중...');
      await User.deleteMany({});
      await Pet.deleteMany({});
      await Community.deleteMany({});
      await Comment.deleteMany({});
      await Adoption.deleteMany({});
      await ChatRoom.deleteMany({});
      await Message.deleteMany({});
      console.log('✅ 기존 데이터 삭제 완료');
    }
    
    // 단계별 데이터 생성
    const users = await createUsers();
    const pets = await createPets(users);
    const posts = await createCommunityPosts(users);
    const comments = await createComments(posts, users);
    const adoptions = await createAdoptions(pets, users);
    const chats = await createChats(users, pets, adoptions);
    
    await updateStatistics(users, pets);
    
    console.log('\n🎉 데이터베이스 초기화 완료!');
    console.log(`📊 생성된 데이터:`);
    console.log(`   - 사용자: ${users.length}명`);
    console.log(`   - 펫: ${pets.length}마리`);
    console.log(`   - 게시글: ${posts.length}개`);
    console.log(`   - 댓글: ${comments.length}개`);
    console.log(`   - 입양신청: ${adoptions.length}건`);
    console.log(`   - 채팅방: 1개`);
    console.log(`   - 메시지: ${chats.messages.length}개`);
    
    console.log('\n🔐 테스트 계정 정보:');
    console.log('   관리자: admin@example.com / admin123!');
    console.log('   분양자1: provider1@example.com / provider123!');
    console.log('   분양자2: provider2@example.com / provider123!');
    console.log('   입양자1: adopter1@example.com / adopter123!');
    console.log('   입양자2: adopter2@example.com / adopter123!');
    
  } catch (error) {
    console.error('❌ 데이터베이스 초기화 실패:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📝 데이터베이스 연결 종료');
  }
};

// 스크립트 실행
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };