const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Mock data for demonstration
let chatRooms = [
  {
    id: 'room1',
    petId: 'pet1',
    petName: '귀여운 고양이',
    petImage: '/placeholder-cat.jpg',
    participants: ['user1', 'user2'],
    lastMessage: {
      content: '언제 만나볼 수 있을까요?',
      timestamp: new Date(),
      senderId: 'user2'
    },
    unreadCount: { user1: 2, user2: 0 },
    chatType: 'adoption',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'room2', 
    petId: 'pet2',
    petName: '착한 강아지',
    petImage: '/placeholder-dog.jpg',
    participants: ['user1', 'user3'],
    lastMessage: {
      content: '사진 더 보내주실 수 있나요?',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      senderId: 'user3'
    },
    unreadCount: { user1: 0, user3: 0 },
    chatType: 'adoption',
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(Date.now() - 3600000)
  }
];

let messages = [
  {
    id: 'msg1',
    roomId: 'room1',
    senderId: 'user2',
    receiverId: 'user1',
    content: '안녕하세요! 귀여운 고양이에 관심이 있어서 연락드렸어요.',
    type: 'text',
    timestamp: new Date(Date.now() - 3600000),
    read: true
  },
  {
    id: 'msg2',
    roomId: 'room1',
    senderId: 'user1',
    receiverId: 'user2',
    content: '안녕하세요! 연락 주셔서 감사합니다. 어떤 부분이 궁금하신가요?',
    type: 'text',
    timestamp: new Date(Date.now() - 3300000),
    read: true
  },
  {
    id: 'msg3',
    roomId: 'room1',
    senderId: 'user2',
    receiverId: 'user1',
    content: '건강상태는 어떤지, 그리고 접종은 완료되었는지 궁금합니다.',
    type: 'text',
    timestamp: new Date(Date.now() - 3000000),
    read: true
  },
  {
    id: 'msg4',
    roomId: 'room1',
    senderId: 'user1',
    receiverId: 'user2',
    content: '네, 건강해요! 기본 접종은 모두 완료했고 최근 건강검진도 받았습니다.',
    type: 'text',
    timestamp: new Date(Date.now() - 2700000),
    read: true
  },
  {
    id: 'msg5',
    roomId: 'room1',
    senderId: 'user2',
    receiverId: 'user1',
    content: '언제 만나볼 수 있을까요?',
    type: 'text',
    timestamp: new Date(),
    read: false
  }
];

// 채팅방 목록 조회
router.get('/rooms', authenticate, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    
    // 사용자가 참여한 채팅방 필터링
    const userChatRooms = chatRooms.filter(room => 
      room.participants.includes(userId)
    ).map(room => {
      // 상대방 정보 추가
      const otherUserId = room.participants.find(id => id !== userId);
      
      return {
        id: room.id,
        petId: room.petId,
        petName: room.petName,
        petImage: room.petImage,
        participantId: otherUserId,
        participantName: otherUserId === 'user2' ? '김민수' : '이지혜',
        participantAvatar: '/placeholder-user.jpg',
        lastMessage: room.lastMessage.content,
        lastMessageTime: formatTimeAgo(room.lastMessage.timestamp),
        unreadCount: room.unreadCount[userId] || 0,
        isOnline: Math.random() > 0.5, // Mock online status
        chatType: room.chatType,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt
      };
    });

    // 최근 메시지 순으로 정렬
    userChatRooms.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    res.json({
      success: true,
      data: {
        rooms: userChatRooms,
        totalCount: userChatRooms.length
      }
    });

  } catch (error) {
    console.error('Get chat rooms error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve chat rooms'
    });
  }
});

// 특정 채팅방 정보 조회
router.get('/rooms/:roomId', authenticate, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id.toString();
    
    const room = chatRooms.find(r => r.id === roomId);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Chat room not found'
      });
    }

    // 사용자가 해당 채팅방 참여자인지 확인
    if (!room.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this chat room'
      });
    }

    const otherUserId = room.participants.find(id => id !== userId);

    const roomData = {
      id: room.id,
      petId: room.petId,
      petName: room.petName,
      petImage: room.petImage,
      participantId: otherUserId,
      participantName: otherUserId === 'user2' ? '김민수' : '이지혜',
      participantAvatar: '/placeholder-user.jpg',
      lastMessage: room.lastMessage.content,
      lastMessageTime: formatTimeAgo(room.lastMessage.timestamp),
      unreadCount: room.unreadCount[userId] || 0,
      isOnline: Math.random() > 0.5,
      chatType: room.chatType,
      petInfo: {
        breed: '코리안 숏헤어',
        age: '성인 (3세)',
        location: '성동구, 서울특별시',
        adoptionFee: 0,
        status: '분양 가능'
      }
    };

    res.json({
      success: true,
      data: {
        room: roomData
      }
    });

  } catch (error) {
    console.error('Get chat room error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve chat room'
    });
  }
});

// 채팅방 메시지 조회
router.get('/rooms/:roomId/messages', authenticate, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id.toString();
    const { limit = 50, before } = req.query;

    // 채팅방 존재 여부 및 권한 확인
    const room = chatRooms.find(r => r.id === roomId);
    if (!room || !room.participants.includes(userId)) {
      return res.status(404).json({
        success: false,
        error: 'Chat room not found or access denied'
      });
    }

    // 해당 채팅방의 메시지 필터링
    let roomMessages = messages.filter(msg => msg.roomId === roomId);

    // 페이지네이션 (before 파라미터 사용)
    if (before) {
      const beforeDate = new Date(before);
      roomMessages = roomMessages.filter(msg => 
        new Date(msg.timestamp) < beforeDate
      );
    }

    // 최신 메시지부터 정렬하고 제한
    roomMessages.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    roomMessages = roomMessages.slice(0, parseInt(limit));

    // 메시지를 시간순으로 다시 정렬 (오래된 것부터)
    roomMessages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    res.json({
      success: true,
      data: {
        messages: roomMessages,
        hasMore: messages.filter(msg => msg.roomId === roomId).length > roomMessages.length
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve messages'
    });
  }
});

// 메시지 전송
router.post('/messages', authenticate, [
  body('roomId')
    .notEmpty()
    .withMessage('Room ID is required'),
  
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message content must be between 1 and 1000 characters'),
  
  body('type')
    .optional()
    .isIn(['text', 'image', 'file'])
    .withMessage('Message type must be text, image, or file')
], async (req, res) => {
  try {
    // 유효성 검증
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: errors.array()
      });
    }

    const { roomId, content, type = 'text', receiverId } = req.body;
    const userId = req.user._id.toString();

    // 채팅방 존재 여부 및 권한 확인
    const room = chatRooms.find(r => r.id === roomId);
    if (!room || !room.participants.includes(userId)) {
      return res.status(404).json({
        success: false,
        error: 'Chat room not found or access denied'
      });
    }

    // 수신자 ID 결정 (제공되지 않았다면 채팅방의 다른 참여자)
    const actualReceiverId = receiverId || room.participants.find(id => id !== userId);

    // 새 메시지 생성
    const newMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      roomId,
      senderId: userId,
      receiverId: actualReceiverId,
      content,
      type,
      timestamp: new Date(),
      read: false
    };

    // 메시지 추가
    messages.push(newMessage);

    // 채팅방의 마지막 메시지 업데이트
    const roomIndex = chatRooms.findIndex(r => r.id === roomId);
    if (roomIndex !== -1) {
      chatRooms[roomIndex].lastMessage = {
        content,
        timestamp: newMessage.timestamp,
        senderId: userId
      };
      chatRooms[roomIndex].updatedAt = new Date();
      
      // 수신자의 읽지 않은 메시지 카운트 증가
      if (!chatRooms[roomIndex].unreadCount[actualReceiverId]) {
        chatRooms[roomIndex].unreadCount[actualReceiverId] = 0;
      }
      chatRooms[roomIndex].unreadCount[actualReceiverId]++;
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message: newMessage
      }
    });

    console.log(`✅ Message sent in room ${roomId}: ${userId} -> ${actualReceiverId}`);

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message'
    });
  }
});

// 메시지 읽음 처리
router.put('/messages/:messageId/read', authenticate, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id.toString();

    const messageIndex = messages.findIndex(msg => 
      msg.id === messageId && msg.receiverId === userId
    );

    if (messageIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Message not found or access denied'
      });
    }

    // 메시지를 읽음으로 표시
    messages[messageIndex].read = true;

    res.json({
      success: true,
      message: 'Message marked as read'
    });

  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark message as read'
    });
  }
});

// 채팅방의 모든 메시지 읽음 처리
router.put('/rooms/:roomId/read', authenticate, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id.toString();

    // 사용자가 수신자인 해당 채팅방의 모든 메시지를 읽음으로 표시
    const updatedCount = messages.filter(msg => 
      msg.roomId === roomId && 
      msg.receiverId === userId && 
      !msg.read
    ).length;

    messages.forEach(msg => {
      if (msg.roomId === roomId && msg.receiverId === userId) {
        msg.read = true;
      }
    });

    // 채팅방의 읽지 않은 메시지 카운트 초기화
    const roomIndex = chatRooms.findIndex(r => r.id === roomId);
    if (roomIndex !== -1) {
      chatRooms[roomIndex].unreadCount[userId] = 0;
    }

    res.json({
      success: true,
      message: `${updatedCount} messages marked as read`
    });

  } catch (error) {
    console.error('Mark room messages as read error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark messages as read'
    });
  }
});

// 채팅방 생성 또는 조회 (펫 기반)
router.post('/rooms/create', authenticate, [
  body('petId')
    .notEmpty()
    .withMessage('Pet ID is required'),
  
  body('petOwnerId')
    .notEmpty()
    .withMessage('Pet owner ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: errors.array()
      });
    }

    const { petId, petOwnerId } = req.body;
    const userId = req.user._id.toString();

    // 자기 자신과 채팅방을 만들려고 하는 경우
    if (userId === petOwnerId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot create chat room with yourself'
      });
    }

    // 기존 채팅방이 있는지 확인
    let existingRoom = chatRooms.find(room => 
      room.petId === petId && 
      room.participants.includes(userId) && 
      room.participants.includes(petOwnerId)
    );

    if (existingRoom) {
      return res.json({
        success: true,
        message: 'Chat room already exists',
        data: {
          roomId: existingRoom.id,
          isNew: false
        }
      });
    }

    // 새 채팅방 생성
    const newRoomId = `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newRoom = {
      id: newRoomId,
      petId,
      petName: '새로운 분양 동물', // TODO: 실제 펫 정보에서 가져오기
      petImage: '/placeholder-pet.jpg',
      participants: [userId, petOwnerId],
      lastMessage: {
        content: '채팅이 시작되었습니다.',
        timestamp: new Date(),
        senderId: 'system'
      },
      unreadCount: { [userId]: 0, [petOwnerId]: 0 },
      chatType: 'adoption',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    chatRooms.push(newRoom);

    // 시스템 메시지 추가
    const systemMessage = {
      id: `msg-${Date.now()}`,
      roomId: newRoomId,
      senderId: 'system',
      receiverId: null,
      content: '채팅이 시작되었습니다. 반려동물에 대해 궁금한 점을 물어보세요!',
      type: 'system',
      timestamp: new Date(),
      read: true
    };

    messages.push(systemMessage);

    res.status(201).json({
      success: true,
      message: 'Chat room created successfully',
      data: {
        roomId: newRoomId,
        isNew: true
      }
    });

    console.log(`✅ New chat room created: ${newRoomId} for pet ${petId}`);

  } catch (error) {
    console.error('Create chat room error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create chat room'
    });
  }
});

// Helper function to format time ago
function formatTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  return `${Math.floor(diffInSeconds / 86400)}일 전`;
}

module.exports = router;