// const io = require('socket.io-client');
const User = require('../models/User');
const mongoose = require('mongoose');
require('dotenv').config();

console.log('🧪 Testing Socket.IO connection...');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/companion-animals')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

async function testSocketConnection() {
  try {
    // Get test user
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.error('❌ Test user not found');
      return;
    }
    
    // Create JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: testUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('🔑 Token created for user:', testUser.name);
    console.log('🔌 Connecting to Socket.IO server...');
    
    // Connect to Socket.IO server
    const socket = io('http://localhost:3001', {
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      timeout: 20000
    });
    
    socket.on('connect', () => {
      console.log('✅ Socket connected successfully!');
      console.log('🆔 Socket ID:', socket.id);
      
      // Test joining a room
      socket.emit('room:join', { roomId: '6863cb79f7985f300527ae4e' });
      
      // Test sending a message
      setTimeout(() => {
        console.log('📤 Sending test message...');
        socket.emit('message:send', {
          roomId: '6863cb79f7985f300527ae4e',
          content: 'Socket.IO 테스트 메시지입니다!',
          messageType: 'text'
        });
      }, 1000);
    });
    
    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
    });
    
    socket.on('room:joined', (data) => {
      console.log('🏠 Successfully joined room:', data.roomId);
    });
    
    socket.on('message:new', (message) => {
      console.log('📨 Received new message:', {
        id: message._id,
        content: message.content,
        sender: message.sender.name
      });
    });
    
    socket.on('message:sent', (data) => {
      console.log('✅ Message sent confirmation:', data.messageId);
    });
    
    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });
    
    // Clean up after 5 seconds
    setTimeout(() => {
      console.log('🏁 Test completed, disconnecting...');
      socket.disconnect();
      mongoose.connection.close();
      process.exit(0);
    }, 5000);
    
  } catch (error) {
    console.error('❌ Test error:', error);
    process.exit(1);
  }
}

testSocketConnection();