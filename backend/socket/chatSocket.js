const { ChatRoom, Message } = require('../models/Chat');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 연결된 사용자들을 추적하는 Map
const connectedUsers = new Map();

// Socket.IO 인증 미들웨어
const authenticateSocket = async (socket, next) => {
  try {
    console.log('🔐 Socket authentication attempt');
    console.log('🔐 Auth data:', socket.handshake.auth);
    console.log('🔐 Headers:', socket.handshake.headers);
    
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
    
    if (!token) {
      console.error('❌ No authentication token provided');
      return next(new Error('Authentication token required'));
    }

    console.log('🔑 Token found, length:', token.length);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token decoded successfully for user:', decoded.userId);
      
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        console.error('❌ User not found:', decoded.userId);
        return next(new Error('User not found'));
      }
      
      if (user.status !== 'active') {
        console.error('❌ User account disabled:', user.email);
        return next(new Error('Account disabled'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      console.log('✅ Socket authentication successful for user:', user.name);
      next();
    } catch (jwtError) {
      console.error('❌ JWT verification failed:', jwtError.message);
      return next(new Error('Invalid token: ' + jwtError.message));
    }
  } catch (error) {
    console.error('❌ Socket authentication error:', error.message);
    next(new Error('Authentication failed: ' + error.message));
  }
};

// 채팅 소켓 이벤트 핸들러
const setupChatSocket = (io) => {
  console.log('🚀 Setting up Socket.IO chat handlers');
  
  // 인증 미들웨어 적용
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.name} (${socket.userId})`);
    console.log(`🆔 Socket ID: ${socket.id}`);
    
    // 연결된 사용자 추가
    connectedUsers.set(socket.userId, {
      socketId: socket.id,
      userId: socket.userId,
      name: socket.user.name,
      profileImage: socket.user.profileImage,
      connectedAt: new Date()
    });

    // 다른 사용자들에게 온라인 상태 알림
    socket.broadcast.emit('user:online', {
      userId: socket.userId,
      name: socket.user.name,
      profileImage: socket.user.profileImage
    });

    // 채팅방 입장
    socket.on('room:join', async (data) => {
      try {
        const { roomId } = data;
        
        console.log(`🔍 Checking room access for user ${socket.userId} in room ${roomId}`);
        
        // 채팅방 존재 및 참여 권한 확인
        const room = await ChatRoom.findById(roomId);
        if (!room) {
          console.error(`❌ Room ${roomId} not found`);
          socket.emit('error', { message: '채팅방을 찾을 수 없습니다.' });
          return;
        }

        console.log(`📋 Room participants:`, room.participants.map(p => ({ user: p.user.toString(), name: p.name || 'Unknown' })));
        
        const isParticipant = room.participants.some(p => 
          p.user.toString() === socket.userId
        );

        if (!isParticipant) {
          console.error(`❌ User ${socket.userId} not authorized for room ${roomId}`);
          socket.emit('error', { message: '채팅방 접근 권한이 없습니다.' });
          return;
        }
        
        console.log(`✅ User ${socket.userId} authorized for room ${roomId}`);

        // 소켓을 채팅방에 입장시킴
        socket.join(roomId);
        console.log(`🏠 Socket ${socket.id} joined room ${roomId}`);
        
        // 입장 확인 응답
        socket.emit('room:joined', { roomId });
        
        // 다른 참여자들에게 입장 알림
        socket.to(roomId).emit('user:joined_room', {
          userId: socket.userId,
          name: socket.user.name,
          profileImage: socket.user.profileImage
        });

        console.log(`📱 User ${socket.user.name} (${socket.id}) joined room ${roomId}`);
        
      } catch (error) {
        console.error('Room join error:', error);
        socket.emit('error', { message: '채팅방 입장에 실패했습니다.' });
      }
    });

    // 채팅방 나가기
    socket.on('room:leave', (data) => {
      const { roomId } = data;
      
      socket.leave(roomId);
      
      // 다른 참여자들에게 나가기 알림
      socket.to(roomId).emit('user:left_room', {
        userId: socket.userId,
        name: socket.user.name
      });

      console.log(`📱 User ${socket.user.name} left room ${roomId}`);
    });

    // 메시지 전송
    socket.on('message:send', async (data) => {
      try {
        console.log('📨 Received message:send event:', {
          roomId: data.roomId,
          content: data.content,
          messageType: data.messageType,
          userId: socket.userId,
          userName: socket.user.name
        });
        
        const { roomId, content, messageType = 'text', replyTo } = data;
        
        if (!roomId || !content) {
          console.error('❌ Missing required fields:', { roomId, content });
          socket.emit('message:error', { error: '메시지 내용과 채팅방 ID가 필요합니다.' });
          return;
        }
        
        // 채팅방 권한 확인
        const room = await ChatRoom.findById(roomId);
        if (!room) {
          socket.emit('error', { message: '채팅방을 찾을 수 없습니다.' });
          return;
        }

        const isParticipant = room.participants.some(p => 
          p.user.toString() === socket.userId
        );

        if (!isParticipant) {
          socket.emit('error', { message: '메시지 전송 권한이 없습니다.' });
          return;
        }

        // 메시지 생성
        const messageData = {
          chatRoom: roomId,
          sender: socket.userId,
          content,
          messageType,
          replyTo: replyTo || null
        };

        const message = await Message.create(messageData);
        
        // 메시지 populate
        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'name profileImage')
          .populate('replyTo', 'content sender messageType');

        // 채팅방의 마지막 메시지 업데이트
        await room.updateLastMessage(message);

        // 다른 참여자들의 읽지 않은 메시지 수 증가 (발신자 제외)
        room.participants.forEach(participant => {
          if (participant.user.toString() !== socket.userId) {
            participant.unreadCount += 1;
          }
        });
        await room.save();

        // 채팅방의 모든 참여자에게 메시지 전송 (발신자 포함)
        console.log(`📤 Broadcasting message to room ${roomId}`);
        console.log(`📤 Room participants: ${room.participants.length}`);
        console.log(`📤 Message content: ${populatedMessage.content}`);
        console.log(`📤 Message sender: ${populatedMessage.sender.name}`);
        
        // 발신자에게도 메시지 전송 (확실하게)
        socket.emit('message:new', populatedMessage);
        
        // 같은 방의 다른 사용자들에게 메시지 전송
        socket.to(roomId).emit('message:new', populatedMessage);
        
        // 채팅방 참여자들에게 글로벌 알림 전송 (홈페이지 등에서 받기 위함)
        console.log(`📡 Starting global broadcast to participants`);
        room.participants.forEach(participant => {
          const userId = participant.user.toString();
          console.log(`📡 Sending global notification to user ${userId} (${participant.name || 'Unknown'})`);
          
          // 연결된 모든 소켓에서 해당 사용자 찾기
          const allSockets = Array.from(io.sockets.sockets.values());
          console.log(`📡 Total connected sockets: ${allSockets.length}`);
          
          const userSockets = allSockets.filter(s => s.userId === userId);
          console.log(`📡 Found ${userSockets.length} sockets for user ${userId}`);
          
          userSockets.forEach(userSocket => {
            console.log(`📡 Emitting to socket ${userSocket.id} for user ${userId}`);
            userSocket.emit('message:new', populatedMessage);
          });
        });
        console.log(`📡 Global broadcast completed`);
        
        console.log(`✅ Message sent to sender, room ${roomId}, and all participant devices`);
        
        // 발신자에게 전송 확인
        socket.emit('message:sent', { 
          messageId: message._id
        });

        console.log(`💬 Message sent and broadcasted in room ${roomId} by ${socket.user.name}`);
        
      } catch (error) {
        console.error('Message send error:', error);
        socket.emit('message:error', { 
          error: '메시지 전송에 실패했습니다.' 
        });
      }
    });

    // 메시지 읽음 처리
    socket.on('message:read', async (data) => {
      try {
        const { messageId, roomId } = data;
        
        const message = await Message.findById(messageId);
        if (message) {
          await message.markAsRead(socket.userId);
          
          // 채팅방의 다른 참여자들에게 읽음 상태 알림
          socket.to(roomId).emit('message:read_by', {
            messageId,
            userId: socket.userId,
            readAt: new Date()
          });
        }
      } catch (error) {
        console.error('Message read error:', error);
      }
    });

    // 채팅방 모든 메시지 읽음 처리
    socket.on('room:mark_read', async (data) => {
      try {
        const { roomId } = data;
        
        console.log('📖 Socket room:mark_read event:', { roomId, userId: socket.userId });
        
        const room = await ChatRoom.findById(roomId);
        if (room) {
          await room.markAsRead(socket.userId);
          
          // 채팅방의 모든 참여자들에게 읽음 상태 알림 (발신자 포함)
          io.to(roomId).emit('room:read_by', {
            roomId,
            userId: socket.userId,
            readAt: new Date()
          });
          
          console.log('✅ Room marked as read and broadcasted');
        }
      } catch (error) {
        console.error('Room mark read error:', error);
      }
    });

    // 타이핑 상태 알림
    socket.on('typing:start', (data) => {
      const { roomId } = data;
      socket.to(roomId).emit('typing:user_start', {
        userId: socket.userId,
        name: socket.user.name
      });
    });

    socket.on('typing:stop', (data) => {
      const { roomId } = data;
      socket.to(roomId).emit('typing:user_stop', {
        userId: socket.userId,
        name: socket.user.name
      });
    });

    // 메시지 반응 (이모지)
    socket.on('message:reaction', async (data) => {
      try {
        const { messageId, emoji, roomId } = data;
        
        const message = await Message.findById(messageId);
        if (message) {
          await message.addReaction(socket.userId, emoji);
          
          const updatedMessage = await Message.findById(messageId)
            .populate('sender', 'name profileImage');
          
          // 채팅방의 모든 참여자에게 반응 업데이트 알림
          io.to(roomId).emit('message:reaction_updated', {
            messageId,
            reactions: updatedMessage.reactions,
            updatedBy: socket.userId
          });
        }
      } catch (error) {
        console.error('Message reaction error:', error);
      }
    });

    // 온라인 사용자 목록 요청
    socket.on('users:get_online', () => {
      const onlineUsers = Array.from(connectedUsers.values())
        .filter(user => user.userId !== socket.userId);
      
      socket.emit('users:online_list', onlineUsers);
    });

    // 연결 해제 처리
    socket.on('disconnect', (reason) => {
      console.log(`❌ User disconnected: ${socket.user.name} (${reason})`);
      
      // 연결된 사용자 목록에서 제거
      connectedUsers.delete(socket.userId);
      
      // 다른 사용자들에게 오프라인 상태 알림
      socket.broadcast.emit('user:offline', {
        userId: socket.userId,
        name: socket.user.name
      });
    });

    // 에러 처리
    socket.on('error', (error) => {
      console.error(`Socket error for user ${socket.user.name}:`, error);
    });
  });
};

// 특정 사용자에게 메시지 전송 (서버에서 호출)
const sendToUser = (userId, event, data) => {
  const user = connectedUsers.get(userId.toString());
  if (user) {
    io.to(user.socketId).emit(event, data);
    return true;
  }
  return false;
};

// 채팅방의 모든 참여자에게 메시지 전송 (서버에서 호출)
const sendToRoom = (roomId, event, data) => {
  io.to(roomId).emit(event, data);
};

// 온라인 사용자 수 조회
const getOnlineUsersCount = () => {
  return connectedUsers.size;
};

// 특정 사용자 온라인 상태 확인
const isUserOnline = (userId) => {
  return connectedUsers.has(userId.toString());
};

module.exports = {
  setupChatSocket,
  sendToUser,
  sendToRoom,
  getOnlineUsersCount,
  isUserOnline
};