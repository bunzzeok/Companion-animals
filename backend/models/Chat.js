const mongoose = require('mongoose');

// 채팅방 스키마 정의
const chatRoomSchema = new mongoose.Schema({
  // 채팅방 타입
  type: {
    type: String,
    enum: {
      values: ['direct', 'group', 'adoption'],
      message: 'Chat room type must be direct, group, or adoption'
    },
    default: 'direct'
  },
  
  // 참여자들
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    leftAt: {
      type: Date,
      default: null
    },
    role: {
      type: String,
      enum: ['member', 'admin', 'moderator'],
      default: 'member'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastReadAt: {
      type: Date,
      default: Date.now
    },
    unreadCount: {
      type: Number,
      default: 0
    },
    // 개별 알림 설정
    notifications: {
      muted: {
        type: Boolean,
        default: false
      },
      mutedUntil: {
        type: Date,
        default: null
      }
    }
  }],
  
  // 채팅방 이름 (그룹 채팅일 때)
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'Chat room name cannot exceed 100 characters']
  },
  
  // 채팅방 설명
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // 채팅방 아바타
  avatar: {
    type: String // 이미지 경로
  },
  
  // 관련 펫 정보 (입양 관련 채팅일 때)
  relatedPet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    default: null
  },
  
  // 관련 입양 신청
  relatedAdoption: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Adoption',
    default: null
  },
  
  // 마지막 메시지 정보 (캐시용)
  lastMessage: {
    content: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file', 'system'],
      default: 'text'
    },
    sentAt: {
      type: Date,
      default: Date.now
    }
  },
  
  // 채팅방 상태
  status: {
    type: String,
    enum: {
      values: ['active', 'archived', 'blocked', 'deleted'],
      message: 'Status must be active, archived, blocked, or deleted'
    },
    default: 'active'
  },
  
  // 채팅방 설정
  settings: {
    // 메시지 자동 삭제 (일 단위)
    autoDeleteAfterDays: {
      type: Number,
      default: null,
      min: [1, 'Auto delete must be at least 1 day'],
      max: [365, 'Auto delete cannot exceed 365 days']
    },
    
    // 파일 공유 허용
    allowFileSharing: {
      type: Boolean,
      default: true
    },
    
    // 이미지 공유 허용
    allowImageSharing: {
      type: Boolean,
      default: true
    },
    
    // 새 멤버 초대 허용
    allowInvites: {
      type: Boolean,
      default: true
    },
    
    // 관리자만 메시지 가능 (공지방 모드)
    adminOnly: {
      type: Boolean,
      default: false
    }
  },
  
  // 통계
  statistics: {
    totalMessages: {
      type: Number,
      default: 0
    },
    totalParticipants: {
      type: Number,
      default: 0
    },
    activeParticipants: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 메시지 스키마 정의
const messageSchema = new mongoose.Schema({
  // 채팅방 참조
  chatRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom',
    required: [true, 'Chat room is required']
  },
  
  // 발신자
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },
  
  // 메시지 타입
  messageType: {
    type: String,
    enum: {
      values: ['text', 'image', 'file', 'voice', 'video', 'location', 'contact', 'system'],
      message: 'Message type must be text, image, file, voice, video, location, contact, or system'
    },
    default: 'text'
  },
  
  // 메시지 내용
  content: {
    type: String,
    trim: true,
    maxlength: [2000, 'Message content cannot exceed 2000 characters']
  },
  
  // 미디어 파일들
  media: [{
    type: {
      type: String,
      enum: ['image', 'video', 'audio', 'document']
    },
    url: String,
    filename: String,
    size: Number, // 바이트 단위
    mimeType: String,
    duration: Number, // 초 단위 (오디오/비디오)
    thumbnail: String // 썸네일 (비디오)
  }],
  
  // 위치 정보 (location 타입일 때)
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
    placeName: String
  },
  
  // 연락처 정보 (contact 타입일 때)
  contact: {
    name: String,
    phone: String,
    email: String
  },
  
  // 답장하는 메시지
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  
  // 전달된 메시지
  forwardedFrom: {
    originalMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    originalSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    originalChatRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatRoom'
    }
  },
  
  // 메시지 상태
  status: {
    type: String,
    enum: {
      values: ['sent', 'delivered', 'read', 'failed', 'deleted'],
      message: 'Status must be sent, delivered, read, failed, or deleted'
    },
    default: 'sent'
  },
  
  // 읽음 상태 (각 참여자별)
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // 배달 상태
  deliveredTo: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    deliveredAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // 편집 정보
  isEdited: {
    type: Boolean,
    default: false
  },
  
  editedAt: {
    type: Date
  },
  
  editHistory: [{
    editedAt: {
      type: Date,
      default: Date.now
    },
    previousContent: String
  }],
  
  // 삭제 정보
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  deletedAt: {
    type: Date
  },
  
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // 시스템 메시지 정보
  systemMessage: {
    type: {
      type: String,
      enum: ['user_joined', 'user_left', 'user_added', 'user_removed', 'room_created', 'room_settings_changed', 'adoption_update']
    },
    data: mongoose.Schema.Types.Mixed // 추가 데이터
  },
  
  // 메시지 반응 (이모지)
  reactions: [{
    emoji: {
      type: String,
      required: true
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    count: {
      type: Number,
      default: 0
    }
  }],
  
  // 멘션된 사용자들
  mentions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }],
  
  // 자동 만료 (임시 메시지)
  expiresAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 인덱스 설정
chatRoomSchema.index({ 'participants.user': 1, status: 1 });
chatRoomSchema.index({ type: 1, status: 1 });
chatRoomSchema.index({ relatedPet: 1 });
chatRoomSchema.index({ relatedAdoption: 1 });
chatRoomSchema.index({ 'lastMessage.sentAt': -1 });

messageSchema.index({ chatRoom: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ status: 1 });
messageSchema.index({ messageType: 1 });
messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual 필드들
chatRoomSchema.virtual('activeParticipantsCount').get(function() {
  return this.participants.filter(p => p.isActive).length;
});

messageSchema.virtual('readCount').get(function() {
  return this.readBy ? this.readBy.length : 0;
});

messageSchema.virtual('deliveredCount').get(function() {
  return this.deliveredTo ? this.deliveredTo.length : 0;
});

// 채팅방 메서드들
chatRoomSchema.methods.addParticipant = function(userId, role = 'member') {
  const existingParticipant = this.participants.find(p => p.user.toString() === userId.toString());
  
  if (existingParticipant) {
    if (!existingParticipant.isActive) {
      existingParticipant.isActive = true;
      existingParticipant.joinedAt = new Date();
      existingParticipant.leftAt = null;
    }
  } else {
    this.participants.push({
      user: userId,
      role: role,
      joinedAt: new Date()
    });
  }
  
  this.statistics.activeParticipants = this.participants.filter(p => p.isActive).length;
  this.statistics.totalParticipants = this.participants.length;
  
  return this.save();
};

chatRoomSchema.methods.removeParticipant = function(userId) {
  const participant = this.participants.find(p => p.user.toString() === userId.toString());
  
  if (participant) {
    participant.isActive = false;
    participant.leftAt = new Date();
  }
  
  this.statistics.activeParticipants = this.participants.filter(p => p.isActive).length;
  
  return this.save();
};

chatRoomSchema.methods.updateLastMessage = function(messageData) {
  this.lastMessage = {
    content: messageData.content,
    sender: messageData.sender,
    messageType: messageData.messageType,
    sentAt: messageData.createdAt || new Date()
  };
  
  return this.save({ validateBeforeSave: false });
};

chatRoomSchema.methods.markAsRead = function(userId, messageId) {
  const participant = this.participants.find(p => p.user.toString() === userId.toString());
  
  if (participant) {
    participant.lastReadAt = new Date();
    participant.unreadCount = 0;
  }
  
  return this.save({ validateBeforeSave: false });
};

// 메시지 메서드들
messageSchema.methods.markAsRead = function(userId) {
  const readIndex = this.readBy.findIndex(r => r.user.toString() === userId.toString());
  
  if (readIndex === -1) {
    this.readBy.push({
      user: userId,
      readAt: new Date()
    });
  }
  
  return this.save({ validateBeforeSave: false });
};

messageSchema.methods.addReaction = function(userId, emoji) {
  let reaction = this.reactions.find(r => r.emoji === emoji);
  
  if (!reaction) {
    reaction = { emoji, users: [], count: 0 };
    this.reactions.push(reaction);
  }
  
  const userIndex = reaction.users.findIndex(u => u.toString() === userId.toString());
  
  if (userIndex === -1) {
    reaction.users.push(userId);
    reaction.count++;
  } else {
    reaction.users.splice(userIndex, 1);
    reaction.count--;
    
    if (reaction.count === 0) {
      this.reactions = this.reactions.filter(r => r.emoji !== emoji);
    }
  }
  
  return this.save();
};

// 스태틱 메서드들
chatRoomSchema.statics.findByParticipant = function(userId) {
  return this.find({
    'participants.user': userId,
    'participants.isActive': true,
    status: 'active'
  })
    .populate('participants.user', 'name profileImage')
    .populate('relatedPet', 'name type images')
    .sort({ 'lastMessage.sentAt': -1 });
};

chatRoomSchema.statics.findDirectChat = function(user1Id, user2Id) {
  return this.findOne({
    type: 'direct',
    'participants.user': { $all: [user1Id, user2Id] },
    'participants.isActive': true,
    status: 'active'
  });
};

messageSchema.statics.findByChatRoom = function(chatRoomId, options = {}) {
  const { limit = 50, before = null, after = null } = options;
  
  const query = { 
    chatRoom: chatRoomId, 
    isDeleted: false 
  };
  
  if (before) {
    query.createdAt = { $lt: before };
  }
  
  if (after) {
    query.createdAt = { $gt: after };
  }
  
  return this.find(query)
    .populate('sender', 'name profileImage')
    .populate('replyTo', 'content sender messageType')
    .sort({ createdAt: -1 })
    .limit(limit);
};

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = {
  ChatRoom,
  Message
};