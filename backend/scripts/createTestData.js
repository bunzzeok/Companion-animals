const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Pet = require('../models/Pet');
const { ChatRoom, Message } = require('../models/Chat');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/companion-animals')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

async function createTestData() {
  try {
    console.log('🚀 Creating test data...');

    // 1. Create test users
    console.log('👤 Creating test users...');
    
    // User 1: test@example.com (기존 사용자)
    let user1 = await User.findOne({ email: 'test@example.com' });
    if (!user1) {
      const hashedPassword1 = await bcrypt.hash('password123', 12);
      user1 = await User.create({
        name: '김테스트',
        email: 'test@example.com',
        password: hashedPassword1,
        phone: '010-1234-5678',
        userType: 'adopter',
        status: 'active'
      });
      console.log('✅ User 1 created:', user1.email);
    } else {
      console.log('ℹ️ User 1 already exists:', user1.email);
    }

    // User 2: test2@example.com
    let user2 = await User.findOne({ email: 'test2@example.com' });
    if (!user2) {
      const hashedPassword2 = await bcrypt.hash('password123', 12);
      user2 = await User.create({
        name: '이테스트',
        email: 'test2@example.com',
        password: hashedPassword2,
        phone: '010-9876-5432',
        userType: 'provider',
        status: 'active'
      });
      console.log('✅ User 2 created:', user2.email);
    } else {
      console.log('ℹ️ User 2 already exists:', user2.email);
    }

    // 2. Create test pets
    console.log('🐕 Creating test pets...');
    
    let pet1 = await Pet.findOne({ name: '테스트 강아지' });
    if (!pet1) {
      pet1 = await Pet.create({
        name: '테스트 강아지',
        type: 'dog',
        breed: '골든 리트리버',
        age: 'young',
        gender: 'male',
        size: 'large',
        color: '골든색',
        weight: 25,
        healthStatus: 'healthy',
        isVaccinated: true,
        isNeutered: true,
        images: ['/placeholder-dog.jpg'],
        location: {
          city: '서울특별시',
          district: '강남구'
        },
        description: '테스트용 강아지입니다. 매우 친근하고 활발한 성격입니다.',
        adoptionFee: 0,
        urgency: 'medium',
        owner: user2._id,
        status: 'available'
      });
      console.log('✅ Pet 1 created:', pet1.name);
    } else {
      console.log('ℹ️ Pet 1 already exists:', pet1.name);
    }

    let pet2 = await Pet.findOne({ name: '테스트 고양이' });
    if (!pet2) {
      pet2 = await Pet.create({
        name: '테스트 고양이',
        type: 'cat',
        breed: '페르시안',
        age: 'adult',
        gender: 'female',
        size: 'medium',
        color: '흰색',
        weight: 4,
        healthStatus: 'healthy',
        isVaccinated: true,
        isNeutered: true,
        images: ['/placeholder-cat.jpg'],
        location: {
          city: '서울특별시',
          district: '서초구'
        },
        description: '테스트용 고양이입니다. 조용하고 애교가 많습니다.',
        adoptionFee: 50000,
        urgency: 'low',
        owner: user1._id,
        status: 'available'
      });
      console.log('✅ Pet 2 created:', pet2.name);
    } else {
      console.log('ℹ️ Pet 2 already exists:', pet2.name);
    }

    // 3. Create test chat room
    console.log('💬 Creating test chat room...');
    
    let chatRoom = await ChatRoom.findOne({
      type: 'adoption',
      relatedPet: pet1._id,
      'participants.user': { $all: [user1._id, user2._id] }
    });

    if (!chatRoom) {
      chatRoom = await ChatRoom.create({
        type: 'adoption',
        participants: [
          { user: user1._id, role: 'member' },
          { user: user2._id, role: 'member' }
        ],
        relatedPet: pet1._id,
        name: `${pet1.name} 입양 상담`
      });
      console.log('✅ Chat room created for pet:', pet1.name);
    } else {
      console.log('ℹ️ Chat room already exists for pet:', pet1.name);
    }

    // 4. Create test messages
    console.log('📨 Creating test messages...');
    
    const existingMessages = await Message.find({ chatRoom: chatRoom._id });
    if (existingMessages.length === 0) {
      // Message 1: from user1 to user2
      const message1 = await Message.create({
        chatRoom: chatRoom._id,
        sender: user1._id,
        content: '안녕하세요! 테스트 강아지에 관심이 있어서 연락드렸습니다.',
        messageType: 'text'
      });

      // Message 2: from user2 to user1
      const message2 = await Message.create({
        chatRoom: chatRoom._id,
        sender: user2._id,
        content: '안녕하세요! 연락 주셔서 감사합니다. 어떤 부분이 궁금하신가요?',
        messageType: 'text'
      });

      // Message 3: from user1 to user2
      const message3 = await Message.create({
        chatRoom: chatRoom._id,
        sender: user1._id,
        content: '강아지의 성격이나 건강 상태에 대해 더 자세히 알고 싶습니다.',
        messageType: 'text'
      });

      // Update chat room's last message
      await chatRoom.updateLastMessage(message3);

      console.log('✅ Test messages created');
    } else {
      console.log('ℹ️ Test messages already exist');
    }

    console.log('\n🎉 Test data creation completed!');
    console.log('\n📋 Test Account Information:');
    console.log('----------------------------------------');
    console.log('👤 Account 1:');
    console.log('   Email: test@example.com');
    console.log('   Password: password123');
    console.log('   Name: 김테스트');
    console.log('   Role: adopter (입양자)');
    console.log('');
    console.log('👤 Account 2:');
    console.log('   Email: test2@example.com');
    console.log('   Password: password123');
    console.log('   Name: 이테스트');
    console.log('   Role: provider (분양자)');
    console.log('');
    console.log('🐕 Test Pets:');
    console.log('   1. 테스트 강아지 (owned by 이테스트)');
    console.log('   2. 테스트 고양이 (owned by 김테스트)');
    console.log('');
    console.log('💬 Chat Room:');
    console.log(`   Room ID: ${chatRoom._id}`);
    console.log('   Between: 김테스트 ↔ 이테스트');
    console.log('   About: 테스트 강아지');
    console.log('');
    console.log('🧪 Testing Instructions:');
    console.log('1. Open two browser windows (or use incognito)');
    console.log('2. In window 1: Login as test@example.com');
    console.log('3. In window 2: Login as test2@example.com');
    console.log('4. Go to chat page to see existing conversation');
    console.log('5. Send messages from both accounts to test real-time chat');

  } catch (error) {
    console.error('❌ Error creating test data:', error);
  } finally {
    mongoose.connection.close();
  }
}

createTestData();