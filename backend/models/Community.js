const mongoose = require('mongoose');

// 커뮤니티 게시글 스키마 정의
const communitySchema = new mongoose.Schema({
  // 기본 정보
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    minlength: [10, 'Content must be at least 10 characters long'],
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  
  // 작성자
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  
  // 카테고리
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['general', 'question', 'information', 'review', 'emergency', 'adoption_story'],
      message: 'Category must be one of: general, question, information, review, emergency, adoption_story'
    },
    default: 'general'
  },
  
  // 태그
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Each tag cannot exceed 30 characters']
  }],
  
  // 미디어 파일
  images: [{
    type: String // 이미지 파일 경로
  }],
  
  videos: [{
    type: String // 비디오 파일 경로
  }],
  
  // 상태 관리
  status: {
    type: String,
    enum: {
      values: ['active', 'hidden', 'deleted', 'reported'],
      message: 'Status must be active, hidden, deleted, or reported'
    },
    default: 'active'
  },
  
  // 게시글 타입
  postType: {
    type: String,
    enum: {
      values: ['text', 'image', 'video', 'poll'],
      message: 'Post type must be text, image, video, or poll'
    },
    default: 'text'
  },
  
  // 투표 기능 (poll 타입일 때)
  poll: {
    question: {
      type: String,
      maxlength: [200, 'Poll question cannot exceed 200 characters']
    },
    options: [{
      text: {
        type: String,
        maxlength: [100, 'Poll option cannot exceed 100 characters']
      },
      votes: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        votedAt: {
          type: Date,
          default: Date.now
        }
      }]
    }],
    allowMultiple: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date
    }
  },
  
  // 상호작용 통계
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  dislikes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    dislikedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // 댓글 수 (가상 필드로도 계산 가능하지만 성능을 위해 캐시)
  commentsCount: {
    type: Number,
    default: 0,
    min: [0, 'Comments count cannot be negative']
  },
  
  // 즐겨찾기
  bookmarks: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    bookmarkedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // 고정 게시글
  isPinned: {
    type: Boolean,
    default: false
  },
  
  pinnedAt: {
    type: Date
  },
  
  pinnedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // 긴급 게시글
  isUrgent: {
    type: Boolean,
    default: false
  },
  
  urgentUntil: {
    type: Date
  },
  
  // 위치 정보 (선택사항)
  location: {
    city: {
      type: String,
      trim: true
    },
    district: {
      type: String,
      trim: true
    },
    coordinates: {
      lat: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      lng: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
    }
  },
  
  // 신고 관련
  reports: [{
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: ['spam', 'inappropriate', 'harassment', 'fake_information', 'other'],
      required: true
    },
    description: {
      type: String,
      maxlength: [500, 'Report description cannot exceed 500 characters']
    },
    reportedAt: {
      type: Date,
      default: Date.now
    },
    resolved: {
      type: Boolean,
      default: false
    },
    resolvedAt: {
      type: Date
    },
    action: {
      type: String,
      enum: ['none', 'warning', 'hidden', 'deleted']
    }
  }],
  
  // 관리자 액션
  adminActions: [{
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    action: {
      type: String,
      enum: ['pin', 'unpin', 'hide', 'show', 'delete', 'feature']
    },
    reason: {
      type: String,
      maxlength: [200, 'Action reason cannot exceed 200 characters']
    },
    actionAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // SEO 및 메타데이터
  slug: {
    type: String,
    unique: true,
    sparse: true // null 값 허용하되 중복 방지
  },
  
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  
  // 편집 기록
  editHistory: [{
    editedAt: {
      type: Date,
      default: Date.now
    },
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    previousTitle: String,
    previousContent: String,
    reason: {
      type: String,
      maxlength: [200, 'Edit reason cannot exceed 200 characters']
    }
  }],
  
  // 통계 데이터
  engagement: {
    totalInteractions: {
      type: Number,
      default: 0
    },
    shareCount: {
      type: Number,
      default: 0
    },
    averageReadTime: {
      type: Number, // 초 단위
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 인덱스 설정
communitySchema.index({ author: 1, status: 1 });
communitySchema.index({ category: 1, status: 1, createdAt: -1 });
communitySchema.index({ status: 1, isPinned: -1, createdAt: -1 });
communitySchema.index({ status: 1, isUrgent: -1, urgentUntil: -1 });
communitySchema.index({ 'location.city': 1, 'location.district': 1 });
communitySchema.index({ tags: 1 });
communitySchema.index({ views: -1 });
communitySchema.index({ createdAt: -1 });
communitySchema.index({ slug: 1 });

// 텍스트 검색 인덱스
communitySchema.index({
  title: 'text',
  content: 'text',
  tags: 'text'
});

// 복합 인덱스
communitySchema.index({ status: 1, category: 1, createdAt: -1 });

// Virtual 필드들
communitySchema.virtual('likesCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

communitySchema.virtual('dislikesCount').get(function() {
  return this.dislikes ? this.dislikes.length : 0;
});

communitySchema.virtual('bookmarksCount').get(function() {
  return this.bookmarks ? this.bookmarks.length : 0;
});

communitySchema.virtual('commentsVirtual', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post'
});

// slug 자동 생성
communitySchema.pre('save', function(next) {
  if (this.isNew || this.isModified('title')) {
    const slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // 특수문자 제거
      .replace(/\s+/g, '-') // 공백을 하이픈으로
      .replace(/-+/g, '-') // 중복 하이픈 제거
      .replace(/^-|-$/g, ''); // 시작/끝 하이픈 제거
    
    this.slug = `${slug}-${this._id}`;
  }
  next();
});

// 조회수 증가
communitySchema.methods.incrementViews = function() {
  this.views = (this.views || 0) + 1;
  return this.save({ validateBeforeSave: false });
};

// 좋아요 토글
communitySchema.methods.toggleLike = function(userId) {
  const userIdStr = userId.toString();
  const likeIndex = this.likes.findIndex(like => like.user.toString() === userIdStr);
  const dislikeIndex = this.dislikes.findIndex(dislike => dislike.user.toString() === userIdStr);
  
  // 이미 싫어요를 눌렀다면 제거
  if (dislikeIndex > -1) {
    this.dislikes.splice(dislikeIndex, 1);
  }
  
  if (likeIndex > -1) {
    // 좋아요 제거
    this.likes.splice(likeIndex, 1);
    return { liked: false, disliked: false, likesCount: this.likes.length, dislikesCount: this.dislikes.length };
  } else {
    // 좋아요 추가
    this.likes.push({ user: userId });
    return { liked: true, disliked: false, likesCount: this.likes.length, dislikesCount: this.dislikes.length };
  }
};

// 싫어요 토글
communitySchema.methods.toggleDislike = function(userId) {
  const userIdStr = userId.toString();
  const likeIndex = this.likes.findIndex(like => like.user.toString() === userIdStr);
  const dislikeIndex = this.dislikes.findIndex(dislike => dislike.user.toString() === userIdStr);
  
  // 이미 좋아요를 눌렀다면 제거
  if (likeIndex > -1) {
    this.likes.splice(likeIndex, 1);
  }
  
  if (dislikeIndex > -1) {
    // 싫어요 제거
    this.dislikes.splice(dislikeIndex, 1);
    return { liked: false, disliked: false, likesCount: this.likes.length, dislikesCount: this.dislikes.length };
  } else {
    // 싫어요 추가
    this.dislikes.push({ user: userId });
    return { liked: false, disliked: true, likesCount: this.likes.length, dislikesCount: this.dislikes.length };
  }
};

// 즐겨찾기 토글
communitySchema.methods.toggleBookmark = function(userId) {
  const userIdStr = userId.toString();
  const bookmarkIndex = this.bookmarks.findIndex(bookmark => bookmark.user.toString() === userIdStr);
  
  if (bookmarkIndex > -1) {
    this.bookmarks.splice(bookmarkIndex, 1);
    return { bookmarked: false, count: this.bookmarks.length };
  } else {
    this.bookmarks.push({ user: userId });
    return { bookmarked: true, count: this.bookmarks.length };
  }
};

// 게시글 수정 기록
communitySchema.methods.addEditHistory = function(editedBy, reason) {
  this.editHistory.push({
    editedBy,
    previousTitle: this.title,
    previousContent: this.content,
    reason
  });
};

// 댓글 수 업데이트
communitySchema.methods.updateCommentsCount = function(increment = true) {
  if (increment) {
    this.commentsCount = (this.commentsCount || 0) + 1;
  } else {
    this.commentsCount = Math.max(0, (this.commentsCount || 0) - 1);
  }
  return this.save({ validateBeforeSave: false });
};

// 스태틱 메서드들
communitySchema.statics.findByCategory = function(category) {
  return this.find({ status: 'active', category })
    .populate('author', 'name profileImage')
    .sort({ isPinned: -1, createdAt: -1 });
};

communitySchema.statics.findPopular = function(limit = 10) {
  return this.find({ status: 'active' })
    .populate('author', 'name profileImage')
    .sort({ views: -1, createdAt: -1 })
    .limit(limit);
};

communitySchema.statics.findRecent = function(limit = 10) {
  return this.find({ status: 'active' })
    .populate('author', 'name profileImage')
    .sort({ createdAt: -1 })
    .limit(limit);
};

communitySchema.statics.search = function(searchTerm, filters = {}) {
  const query = { status: 'active' };
  
  if (searchTerm) {
    query.$text = { $search: searchTerm };
  }
  
  if (filters.category) query.category = filters.category;
  if (filters.tags && filters.tags.length > 0) query.tags = { $in: filters.tags };
  if (filters.author) query.author = filters.author;
  if (filters.city) query['location.city'] = new RegExp(filters.city, 'i');
  if (filters.district) query['location.district'] = new RegExp(filters.district, 'i');
  
  return this.find(query)
    .populate('author', 'name profileImage')
    .sort({ isPinned: -1, createdAt: -1 });
};

const Community = mongoose.model('Community', communitySchema);

module.exports = Community;