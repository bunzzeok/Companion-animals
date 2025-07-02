const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/companion-animals')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

async function resetPasswords() {
  try {
    console.log('🔐 Resetting passwords for test accounts...\n');

    const newPassword = 'test123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update test@example.com password
    const user1 = await User.findOneAndUpdate(
      { email: 'test@example.com' },
      { password: hashedPassword },
      { new: true }
    );

    // Update test2@example.com password
    const user2 = await User.findOneAndUpdate(
      { email: 'test2@example.com' },
      { password: hashedPassword },
      { new: true }
    );

    if (user1) {
      console.log('✅ Password updated for:', user1.email);
      console.log(`   Name: ${user1.name}`);
      console.log(`   Type: ${user1.userType}`);
    }

    if (user2) {
      console.log('✅ Password updated for:', user2.email);
      console.log(`   Name: ${user2.name}`);
      console.log(`   Type: ${user2.userType}`);
    }

    console.log('\n🎯 Updated Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Account 1 (입양자):');
    console.log('   Email: test@example.com');
    console.log('   Password: test123');
    console.log('   Name: TestUser');
    console.log('   Role: adopter');
    console.log('');
    console.log('👤 Account 2 (분양자):');
    console.log('   Email: test2@example.com');
    console.log('   Password: test123');
    console.log('   Name: 이테스트');
    console.log('   Role: provider');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Also provide some existing accounts
    console.log('\n📋 Other Available Test Accounts:');
    console.log('----------------------------------------');
    console.log('👤 Account 3:');
    console.log('   Email: provider1@example.com');
    console.log('   Name: 김분양');
    console.log('   Type: provider');
    console.log('   Password: (기본값으로 설정됨)');
    console.log('');
    console.log('👤 Account 4:');
    console.log('   Email: adopter1@example.com');
    console.log('   Name: 박입양');
    console.log('   Type: adopter');
    console.log('   Password: (기본값으로 설정됨)');

    // Update passwords for other test accounts too
    const otherUsers = await User.find({
      email: { $in: ['provider1@example.com', 'adopter1@example.com', 'provider2@example.com', 'adopter2@example.com'] }
    });

    for (const user of otherUsers) {
      await User.findByIdAndUpdate(user._id, { password: hashedPassword });
      console.log(`✅ Password also updated for: ${user.email}`);
    }

    console.log('\n🧪 모든 테스트 계정의 비밀번호가 "test123"으로 통일되었습니다.');

  } catch (error) {
    console.error('❌ Error resetting passwords:', error);
  } finally {
    mongoose.connection.close();
  }
}

resetPasswords();