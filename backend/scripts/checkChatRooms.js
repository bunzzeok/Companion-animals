const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const { ChatRoom, Message } = require('../models/Chat');
const User = require('../models/User');
const Pet = require('../models/Pet');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/companion-animals')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

async function checkChatRooms() {
  try {
    console.log('💬 Checking existing chat rooms...\n');

    const chatRooms = await ChatRoom.find({})
      .populate('participants.user', 'name email')
      .populate('relatedPet', 'name type');

    console.log(`📊 Found ${chatRooms.length} chat rooms:\n`);

    for (let i = 0; i < chatRooms.length; i++) {
      const room = chatRooms[i];
      console.log(`💬 Chat Room ${i + 1}:`);
      console.log(`   ID: ${room._id}`);
      console.log(`   Type: ${room.type}`);
      console.log(`   Name: ${room.name || 'Unnamed'}`);
      
      if (room.relatedPet) {
        console.log(`   Pet: ${room.relatedPet.name} (${room.relatedPet.type})`);
      }
      
      console.log(`   Participants:`);
      room.participants.forEach((p, index) => {
        console.log(`     ${index + 1}. ${p.user.name} (${p.user.email})`);
      });
      
      // Count messages in this room
      const messageCount = await Message.countDocuments({ chatRoom: room._id });
      console.log(`   Messages: ${messageCount}`);
      console.log(`   Created: ${room.createdAt}`);
      console.log('');
    }

    // Find specific chat rooms for our test users
    const testUser1 = await User.findOne({ email: 'test@example.com' });
    const testUser2 = await User.findOne({ email: 'test2@example.com' });

    if (testUser1 && testUser2) {
      const testChatRoom = await ChatRoom.findOne({
        'participants.user': { $all: [testUser1._id, testUser2._id] }
      }).populate('participants.user', 'name email');

      if (testChatRoom) {
        console.log('✅ Found chat room between test users:');
        console.log(`   Room ID: ${testChatRoom._id}`);
        console.log(`   Participants: ${testChatRoom.participants.map(p => p.user.name).join(' ↔ ')}`);
        
        const messages = await Message.find({ chatRoom: testChatRoom._id })
          .populate('sender', 'name')
          .sort({ createdAt: 1 });
        
        console.log(`   Messages (${messages.length}):`);
        messages.forEach((msg, index) => {
          console.log(`     ${index + 1}. ${msg.sender.name}: ${msg.content}`);
        });
      } else {
        console.log('❌ No chat room found between test users');
      }
    }

  } catch (error) {
    console.error('❌ Error checking chat rooms:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkChatRooms();