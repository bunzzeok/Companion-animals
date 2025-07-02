const mongoose = require('mongoose');

// 댓글 스키마 정의
const commentSchema = new mongoose.Schema({
  // 댓글 내용
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    minlength: [1, 'Comment must be at least 1 character long'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  
  // 작성자
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Comment author is required']
  },
  
  // 게시글 참조
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: [true, 'Post reference is required']
  },
  
  // 부모 댓글 (대댓글인 경우)
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  
  // 댓글 깊이 (0: 최상위 댓글, 1: 대댓글, 2: 대대댓글...)
  depth: {
    type: Number,
    default: 0,
    min: [0, 'Depth cannot be negative'],
    max: [3, 'Maximum comment depth is 3'] // 최대 3단계까지
  },
  
  // 댓글 경로 (계층 구조 표현)
  path: {
    type: String,
    default: ''
  },
  
  // 상태
  status: {
    type: String,
    enum: {
      values: ['active', 'hidden', 'deleted', 'reported'],
      message: 'Status must be active, hidden, deleted, or reported'
    },
    default: 'active'
  },
  
  // 좋아요
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
  
  // 싫어요
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
  
  // 첨부파일 (이미지만 허용)
  images: [{
    type: String
  }],
  
  // 멘션된 사용자들
  mentions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String // 빠른 접근을 위한 캐시
  }],
  
  // 신고
  reports: [{
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: ['spam', 'inappropriate', 'harassment', 'other'],
      required: true
    },
    description: {
      type: String,
      maxlength: [300, 'Report description cannot exceed 300 characters']
    },
    reportedAt: {
      type: Date,
      default: Date.now
    },
    resolved: {
      type: Boolean,
      default: false
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
  
  // 고정 댓글 (게시글 작성자나 관리자가 고정 가능)
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
  
  // 채택된 답변 (Q&A 게시글에서)
  isAccepted: {
    type: Boolean,
    default: false
  },
  
  acceptedAt: {
    type: Date
  },
  
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 인덱스 설정
commentSchema.index({ post: 1, status: 1, createdAt: -1 });
commentSchema.index({ author: 1, status: 1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ path: 1 });
commentSchema.index({ post: 1, isPinned: -1, createdAt: -1 });

// Virtual 필드들
commentSchema.virtual('likesCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

commentSchema.virtual('dislikesCount').get(function() {
  return this.dislikes ? this.dislikes.length : 0;
});

commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment'
});

commentSchema.virtual('repliesCount').get(function() {
  return this.replies ? this.replies.length : 0;
});

// 미들웨어 - 저장 전 경로 설정
commentSchema.pre('save', async function(next) {
  if (this.isNew) {
    if (this.parentComment) {
      // 부모 댓글의 경로 가져오기
      const parentComment = await this.constructor.findById(this.parentComment);
      if (parentComment) {
        this.path = parentComment.path ? `${parentComment.path}/${this._id}` : this._id.toString();
        this.depth = parentComment.depth + 1;
        
        // 최대 깊이 체크
        if (this.depth > 3) {
          return next(new Error('Maximum comment depth exceeded'));
        }
      }
    } else {
      this.path = this._id.toString();
      this.depth = 0;
    }
  }
  next();
});

// 댓글 수정 기록
commentSchema.methods.addEditHistory = function() {
  this.editHistory.push({
    previousContent: this.content
  });
  this.isEdited = true;
  this.editedAt = new Date();
};

// 좋아요 토글
commentSchema.methods.toggleLike = function(userId) {
  const userIdStr = userId.toString();
  const likeIndex = this.likes.findIndex(like => like.user.toString() === userIdStr);
  const dislikeIndex = this.dislikes.findIndex(dislike => dislike.user.toString() === userIdStr);
  
  // 이미 싫어요를 눌렀다면 제거
  if (dislikeIndex > -1) {
    this.dislikes.splice(dislikeIndex, 1);
  }
  
  if (likeIndex > -1) {
    this.likes.splice(likeIndex, 1);
    return { liked: false, disliked: false, likesCount: this.likes.length, dislikesCount: this.dislikes.length };
  } else {
    this.likes.push({ user: userId });
    return { liked: true, disliked: false, likesCount: this.likes.length, dislikesCount: this.dislikes.length };
  }
};

// 싫어요 토글
commentSchema.methods.toggleDislike = function(userId) {
  const userIdStr = userId.toString();
  const likeIndex = this.likes.findIndex(like => like.user.toString() === userIdStr);
  const dislikeIndex = this.dislikes.findIndex(dislike => dislike.user.toString() === userIdStr);
  
  // 이미 좋아요를 눌렀다면 제거
  if (likeIndex > -1) {
    this.likes.splice(likeIndex, 1);
  }
  
  if (dislikeIndex > -1) {
    this.dislikes.splice(dislikeIndex, 1);
    return { liked: false, disliked: false, likesCount: this.likes.length, dislikesCount: this.dislikes.length };
  } else {
    this.dislikes.push({ user: userId });
    return { liked: false, disliked: true, likesCount: this.likes.length, dislikesCount: this.dislikes.length };
  }
};

// 답변 채택
commentSchema.methods.markAsAccepted = function(acceptedBy) {
  this.isAccepted = true;
  this.acceptedAt = new Date();
  this.acceptedBy = acceptedBy;
  return this.save();
};

// 스태틱 메서드들
commentSchema.statics.findByPost = function(postId, options = {}) {
  const { 
    limit = 20, 
    skip = 0, 
    sort = 'createdAt',
    order = -1,
    includeReplies = true 
  } = options;
  
  const query = { 
    post: postId, 
    status: 'active'
  };
  
  // 최상위 댓글만 가져올지 결정
  if (!includeReplies) {
    query.parentComment = null;
  }
  
  const sortObj = {};
  sortObj[sort] = order;
  
  return this.find(query)
    .populate('author', 'name profileImage')
    .populate({
      path: 'replies',
      match: { status: 'active' },
      populate: {
        path: 'author',
        select: 'name profileImage'
      },
      options: { sort: { createdAt: 1 } }
    })
    .sort(sortObj)
    .limit(limit)
    .skip(skip);
};

commentSchema.statics.findReplies = function(parentCommentId, limit = 10) {
  return this.find({ 
    parentComment: parentCommentId, 
    status: 'active' 
  })
    .populate('author', 'name profileImage')
    .sort({ createdAt: 1 })
    .limit(limit);
};

commentSchema.statics.getCommentTree = function(postId) {
  return this.aggregate([
    { $match: { post: mongoose.Types.ObjectId(postId), status: 'active' } },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author',
        pipeline: [{ $project: { name: 1, profileImage: 1 } }]
      }
    },
    { $unwind: '$author' },
    {
      $addFields: {
        likesCount: { $size: '$likes' },
        dislikesCount: { $size: '$dislikes' }
      }
    },
    { $sort: { path: 1, createdAt: 1 } }
  ]);
};

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;