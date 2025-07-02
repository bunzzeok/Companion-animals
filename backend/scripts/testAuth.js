const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

console.log('🧪 Testing JWT token generation...');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/companion-animals')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

async function testAuth() {
  try {
    // Get test user
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.error('❌ Test user not found');
      return;
    }
    
    console.log('✅ Found test user:', {
      id: testUser._id,
      name: testUser.name,
      email: testUser.email,
      status: testUser.status
    });
    
    // Create JWT token
    const token = jwt.sign(
      { userId: testUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('🔑 Generated token:', token.substring(0, 50) + '...');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verification successful:', decoded);
    
    console.log('🔧 JWT_SECRET length:', process.env.JWT_SECRET.length);
    
  } catch (error) {
    console.error('❌ Auth test error:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

testAuth();