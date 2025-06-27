// 데이터베이스 초기화 스크립트
// 테스트용 데이터 생성

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// 모델 import
const User = require('../models/User');
const Pet = require('../models/Pet');

// MongoDB 연결
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/companion-animals');
    console.log('✅ MongoDB 연결 성공');
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error);
    process.exit(1);
  }
}

// 테스트 사용자 생성
async function createTestUsers() {
  console.log('👥 테스트 사용자 생성 중...');
  
  const testUsers = [
    {
      name: '김유진',
      email: 'admin@companionanimals.com',
      password: 'admin123',
      userType: 'admin',
      phone: '010-1234-5678',
      address: {
        city: '서울시',
        district: '강남구',
        street: '테헤란로 123'
      },
      isVerified: true
    },
    {
      name: '박민수',
      email: 'provider@test.com',
      password: 'provider123',
      userType: 'provider',
      phone: '010-2345-6789',
      address: {
        city: '서울시',
        district: '서초구',
        street: '서초대로 456'
      },
      isVerified: true
    },
    {
      name: '이수연',
      email: 'adopter@test.com',
      password: 'adopter123',
      userType: 'adopter',
      phone: '010-3456-7890',
      address: {
        city: '서울시',
        district: '송파구',
        street: '잠실로 789'
      },
      isVerified: true
    }
  ];

  for (const userData of testUsers) {
    try {
      // 이미 존재하는 사용자 확인
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`⚠️  사용자 이미 존재: ${userData.email}`);
        continue;
      }

      // 비밀번호 해싱
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      
      await user.save();
      console.log(`✅ 사용자 생성 완료: ${userData.name} (${userData.email})`);
    } catch (error) {
      console.error(`❌ 사용자 생성 실패: ${userData.email}`, error.message);
    }
  }
}

// 테스트 반려동물 생성
async function createTestPets() {
  console.log('🐾 테스트 반려동물 생성 중...');
  
  // Provider 사용자 찾기
  const provider = await User.findOne({ email: 'provider@test.com' });
  if (!provider) {
    console.log('⚠️  Provider 사용자를 찾을 수 없습니다.');
    return;
  }

  const testPets = [
    {
      name: '바둑이',
      type: 'dog',
      breed: '믹스견',
      age: 'adult',
      gender: 'male',
      size: 'medium',
      color: '갈색과 흰색',
      weight: 15.5,
      description: '사람을 매우 좋아하는 온순한 강아지입니다. 산책을 좋아하고 아이들과도 잘 어울려요.',
      temperament: ['friendly', 'active', 'loyal'],
      healthStatus: 'healthy',
      isVaccinated: true,
      isNeutered: true,
      medicalNotes: '정기 검진 완료, 건강 상태 양호',
      goodWithKids: true,
      goodWithPets: true,
      goodWithStrangers: true,
      location: {
        city: '서울시',
        district: '강남구',
        address: '테헤란로 123',
        coordinates: {
          lat: 37.4979,
          lng: 127.0276
        }
      },
      urgency: 'medium',
      owner: provider._id,
      status: 'available'
    },
    {
      name: '나비',
      type: 'cat',
      breed: '코리안숏헤어',
      age: 'young',
      gender: 'female',
      size: 'small',
      color: '회색 줄무늬',
      weight: 4.2,
      description: '조용하고 독립적인 성격의 고양이입니다. 사람보다는 혼자 있는 것을 좋아해요.',
      temperament: ['calm', 'independent', 'gentle'],
      healthStatus: 'healthy',
      isVaccinated: true,
      isNeutered: true,
      medicalNotes: '예방접종 완료, 건강한 상태',
      goodWithKids: false,
      goodWithPets: false,
      goodWithStrangers: false,
      location: {
        city: '서울시',
        district: '서초구',
        address: '서초대로 456',
        coordinates: {
          lat: 37.4837,
          lng: 127.0324
        }
      },
      urgency: 'low',
      owner: provider._id,
      status: 'available'
    },
    {
      name: '뽀미',
      type: 'dog',
      breed: '포메라니안',
      age: 'adult',
      gender: 'female',
      size: 'small',
      color: '크림색',
      weight: 3.8,
      description: '활발하고 장난기 많은 소형견입니다. 관심을 받는 것을 좋아하고 훈련이 잘 되어있어요.',
      temperament: ['playful', 'energetic', 'attention-seeking'],
      healthStatus: 'needs_treatment',
      isVaccinated: true,
      isNeutered: false,
      medicalNotes: '치아 관리 필요, 정기적인 치과 검진 권장',
      goodWithKids: true,
      goodWithPets: false,
      goodWithStrangers: true,
      location: {
        city: '서울시',
        district: '송파구',
        address: '잠실로 789',
        coordinates: {
          lat: 37.4959,
          lng: 127.0664
        }
      },
      urgency: 'high',
      owner: provider._id,
      status: 'available'
    }
  ];

  for (const petData of testPets) {
    try {
      // 이미 존재하는 반려동물 확인
      const existingPet = await Pet.findOne({ name: petData.name, owner: provider._id });
      if (existingPet) {
        console.log(`⚠️  반려동물 이미 존재: ${petData.name}`);
        continue;
      }

      const pet = new Pet(petData);
      await pet.save();
      console.log(`✅ 반려동물 생성 완료: ${petData.name} (${petData.type})`);
    } catch (error) {
      console.error(`❌ 반려동물 생성 실패: ${petData.name}`, error.message);
    }
  }
}

// 메인 함수
async function initializeDatabase() {
  console.log('🚀 데이터베이스 초기화 시작...');
  
  try {
    await connectDB();
    await createTestUsers();
    await createTestPets();
    
    console.log('\n🎉 데이터베이스 초기화 완료!');
    console.log('\n📋 테스트 계정 정보:');
    console.log('┌─────────────────────────────────────────┐');
    console.log('│ 관리자 계정                             │');
    console.log('│ 이메일: admin@companionanimals.com      │');
    console.log('│ 비밀번호: admin123                      │');
    console.log('├─────────────────────────────────────────┤');
    console.log('│ 제공자 계정                             │');
    console.log('│ 이메일: provider@test.com               │');
    console.log('│ 비밀번호: provider123                   │');
    console.log('├─────────────────────────────────────────┤');
    console.log('│ 입양자 계정                             │');
    console.log('│ 이메일: adopter@test.com                │');
    console.log('│ 비밀번호: adopter123                    │');
    console.log('└─────────────────────────────────────────┘');
    
  } catch (error) {
    console.error('❌ 초기화 중 오류 발생:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📡 데이터베이스 연결 종료');
    process.exit(0);
  }
}

// 스크립트 실행
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };