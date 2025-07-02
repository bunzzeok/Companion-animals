const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/companion-animals')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

async function checkUsers() {
  try {
    console.log('🔍 Checking existing users in database...\n');

    const users = await User.find({}).select('name email userType status createdAt');
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
      return;
    }

    console.log(`📊 Found ${users.length} users:\n`);
    
    users.forEach((user, index) => {
      console.log(`👤 User ${index + 1}:`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Type: ${user.userType}`);
      console.log(`   Status: ${user.status}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('');
    });

    // Check if test users exist and are properly configured
    const testUser1 = await User.findOne({ email: 'test@example.com' });
    const testUser2 = await User.findOne({ email: 'test2@example.com' });

    console.log('🧪 Test User Status:');
    console.log(`test@example.com: ${testUser1 ? '✅ EXISTS' : '❌ NOT FOUND'}`);
    console.log(`test2@example.com: ${testUser2 ? '✅ EXISTS' : '❌ NOT FOUND'}`);

    if (testUser1) {
      console.log(`\n📋 test@example.com details:`);
      console.log(`   Name: ${testUser1.name}`);
      console.log(`   Status: ${testUser1.status}`);
      console.log(`   Type: ${testUser1.userType}`);
    }

    if (testUser2) {
      console.log(`\n📋 test2@example.com details:`);
      console.log(`   Name: ${testUser2.name}`);
      console.log(`   Status: ${testUser2.status}`);
      console.log(`   Type: ${testUser2.userType}`);
    }

  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkUsers();