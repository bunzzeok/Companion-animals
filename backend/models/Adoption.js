const mongoose = require('mongoose');

// 입양 신청 스키마 정의
const adoptionSchema = new mongoose.Schema({
  // 관련 정보
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet', // Pet 모델 참조
    required: [true, 'Pet is required'] // 입양하려는 펫 필수
  },
  
  adopter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // User 모델 참조 (입양 신청자)
    required: [true, 'Adopter is required'] // 입양 신청자 필수
  },
  
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // User 모델 참조 (분양자)
    required: [true, 'Provider is required'] // 분양자 필수
  },
  
  // 신청 정보
  message: {
    type: String,
    required: [true, 'Application message is required'], // 신청 메시지 필수
    trim: true,
    minlength: [10, 'Message must be at least 10 characters long'], // 최소 10자
    maxlength: [1000, 'Message cannot exceed 1000 characters'] // 최대 1000자
  },
  
  experience: {
    type: String,
    required: [true, 'Pet experience is required'], // 반려동물 경험 필수
    trim: true,
    maxlength: [500, 'Experience description cannot exceed 500 characters']
  },
  
  livingSituation: {
    type: String,
    required: [true, 'Living situation is required'], // 거주 환경 필수
    trim: true,
    maxlength: [500, 'Living situation description cannot exceed 500 characters']
  },
  
  // 추가 정보 (선택사항)
  additionalInfo: {
    hasOtherPets: {
      type: Boolean,
      default: false // 다른 반려동물 보유 여부
    },
    
    otherPetsDetails: {
      type: String,
      maxlength: [300, 'Other pets details cannot exceed 300 characters'],
      trim: true
    },
    
    hasChildren: {
      type: Boolean,
      default: false // 자녀 유무
    },
    
    childrenAges: [{
      type: Number,
      min: [0, 'Age cannot be negative'],
      max: [18, 'Age cannot exceed 18']
    }], // 자녀 나이 배열
    
    workSchedule: {
      type: String,
      maxlength: [200, 'Work schedule cannot exceed 200 characters'],
      trim: true
    },
    
    homeType: {
      type: String,
      enum: ['apartment', 'house', 'studio', 'other'],
      default: 'apartment'
    },
    
    hasYard: {
      type: Boolean,
      default: false // 마당 유무
    },
    
    monthlyBudget: {
      type: Number,
      min: [0, 'Budget cannot be negative'],
      max: [1000000, 'Budget cannot exceed 1,000,000']
    }
  },
  
  // 상태 관리
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
      message: 'Status must be pending, approved, rejected, completed, or cancelled'
    },
    default: 'pending'
  },
  
  // 상태 변경 기록
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // 상태를 변경한 사용자
    },
    reason: {
      type: String,
      maxlength: [500, 'Reason cannot exceed 500 characters'],
      trim: true
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      trim: true
    }
  }],
  
  // 만남 일정 관리
  meeting: {
    isScheduled: {
      type: Boolean,
      default: false // 만남 일정 잡힘 여부
    },
    
    scheduledDate: {
      type: Date,
      validate: {
        validator: function(v) {
          return !v || v > Date.now(); // 미래 날짜여야 함
        },
        message: 'Meeting date must be in the future'
      }
    },
    
    location: {
      type: String,
      maxlength: [200, 'Meeting location cannot exceed 200 characters'],
      trim: true
    },
    
    notes: {
      type: String,
      maxlength: [500, 'Meeting notes cannot exceed 500 characters'],
      trim: true
    },
    
    completed: {
      type: Boolean,
      default: false // 만남 완료 여부
    },
    
    completedAt: {
      type: Date
    },
    
    feedback: {
      fromAdopter: {
        type: String,
        maxlength: [500, 'Feedback cannot exceed 500 characters'],
        trim: true
      },
      fromProvider: {
        type: String,
        maxlength: [500, 'Feedback cannot exceed 500 characters'],
        trim: true
      }
    }
  },
  
  // 승인 및 거절 관련
  providerResponse: {
    respondedAt: {
      type: Date
    },
    
    message: {
      type: String,
      maxlength: [500, 'Response message cannot exceed 500 characters'],
      trim: true
    },
    
    requiresInterview: {
      type: Boolean,
      default: false // 면접 필요 여부
    },
    
    interviewQuestions: [{
      question: {
        type: String,
        maxlength: [200, 'Question cannot exceed 200 characters']
      },
      answer: {
        type: String,
        maxlength: [500, 'Answer cannot exceed 500 characters']
      }
    }]
  },
  
  // 입양 완료 정보
  completion: {
    completedAt: {
      type: Date
    },
    
    adoptionFeeReceived: {
      type: Number,
      min: [0, 'Adoption fee cannot be negative'],
      default: 0
    },
    
    followUpScheduled: {
      type: Boolean,
      default: false // 사후 관리 일정 여부
    },
    
    followUpDate: {
      type: Date
    },
    
    notes: {
      type: String,
      maxlength: [1000, 'Completion notes cannot exceed 1000 characters'],
      trim: true
    }
  },
  
  // 사후 관리 및 추적
  followUp: {
    updates: [{
      date: {
        type: Date,
        default: Date.now
      },
      message: {
        type: String,
        maxlength: [500, 'Update message cannot exceed 500 characters']
      },
      photos: [{
        type: String // 사진 경로
      }],
      submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    
    lastContactDate: {
      type: Date
    },
    
    isSuccessful: {
      type: Boolean,
      default: null // null: 진행중, true: 성공, false: 실패
    }
  },
  
  // 신고 및 문제 사항
  issues: [{
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    
    issueType: {
      type: String,
      enum: ['fraud', 'animal_abuse', 'false_information', 'other']
    },
    
    description: {
      type: String,
      required: true,
      maxlength: [1000, 'Issue description cannot exceed 1000 characters']
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
    
    resolution: {
      type: String,
      maxlength: [500, 'Resolution cannot exceed 500 characters']
    }
  }],
  
  // 우선순위 (여러 신청이 있을 때)
  priority: {
    type: Number,
    default: 0, // 0: 일반, 1: 높음, -1: 낮음
    min: [-1, 'Priority cannot be less than -1'],
    max: [1, 'Priority cannot be greater than 1']
  },
  
  // 관리자 노트
  adminNotes: {
    type: String,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters'],
    trim: true
  },
  
  // 자동 만료 (오래된 신청 자동 처리)
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30일 후 만료
    }
  }
}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 인덱스 설정
adoptionSchema.index({ pet: 1, status: 1 }); // 펫별 신청 조회
adoptionSchema.index({ adopter: 1, status: 1 }); // 신청자별 조회
adoptionSchema.index({ provider: 1, status: 1 }); // 분양자별 조회
adoptionSchema.index({ status: 1, createdAt: -1 }); // 상태별 최신순
adoptionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL 인덱스
adoptionSchema.index({ 'meeting.scheduledDate': 1 }); // 만남 일정 조회

// 복합 인덱스 - 중복 신청 방지
adoptionSchema.index({ pet: 1, adopter: 1 }, { unique: true });

// Virtual 필드 - 신청 기간 계산
adoptionSchema.virtual('daysSinceApplication').get(function() {
  const diffTime = Math.abs(new Date() - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual 필드 - 만료까지 남은 일수
adoptionSchema.virtual('daysUntilExpiry').get(function() {
  const diffTime = this.expiresAt - new Date();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
});

// 미들웨어 - 저장 전 상태 변경 기록
adoptionSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    // 상태 변경 기록 추가
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
      // changedBy는 라우터에서 설정
    });
    
    // 특정 상태 변경 시 자동 처리
    if (this.status === 'completed') {
      this.completion.completedAt = new Date();
    }
  }
  next();
});

// 인스턴스 메서드 - 상태 업데이트
adoptionSchema.methods.updateStatus = function(newStatus, changedBy, reason, notes) {
  this.status = newStatus;
  
  // 상태 변경 기록에 추가 정보 포함
  const lastHistory = this.statusHistory[this.statusHistory.length - 1];
  if (lastHistory && lastHistory.status === newStatus) {
    lastHistory.changedBy = changedBy;
    lastHistory.reason = reason;
    lastHistory.notes = notes;
  }
  
  return this.save();
};

// 인스턴스 메서드 - 만남 일정 설정
adoptionSchema.methods.scheduleMeeting = function(date, location, notes) {
  this.meeting.isScheduled = true;
  this.meeting.scheduledDate = date;
  this.meeting.location = location;
  this.meeting.notes = notes;
  
  return this.save();
};

// 인스턴스 메서드 - 만남 완료 처리
adoptionSchema.methods.completeMeeting = function(adopterFeedback, providerFeedback) {
  this.meeting.completed = true;
  this.meeting.completedAt = new Date();
  this.meeting.feedback.fromAdopter = adopterFeedback;
  this.meeting.feedback.fromProvider = providerFeedback;
  
  return this.save();
};

// 인스턴스 메서드 - 입양 완료 처리
adoptionSchema.methods.completeAdoption = function(adoptionFee, notes) {
  this.status = 'completed';
  this.completion.completedAt = new Date();
  this.completion.adoptionFeeReceived = adoptionFee || 0;
  this.completion.notes = notes;
  
  return this.save();
};

// 인스턴스 메서드 - 사후 업데이트 추가
adoptionSchema.methods.addFollowUpUpdate = function(message, photos, submittedBy) {
  this.followUp.updates.push({
    message,
    photos: photos || [],
    submittedBy
  });
  this.followUp.lastContactDate = new Date();
  
  return this.save();
};

// 스태틱 메서드 - 대기 중인 신청 조회
adoptionSchema.statics.findPending = function() {
  return this.find({ status: 'pending' })
    .populate('pet', 'name type images')
    .populate('adopter', 'name email profileImage')
    .sort({ createdAt: -1 });
};

// 스태틱 메서드 - 분양자의 받은 신청 조회
adoptionSchema.statics.findByProvider = function(providerId, status) {
  const query = { provider: providerId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('pet', 'name type images status')
    .populate('adopter', 'name email profileImage')
    .sort({ createdAt: -1 });
};

// 스태틱 메서드 - 입양자의 신청 조회
adoptionSchema.statics.findByAdopter = function(adopterId, status) {
  const query = { adopter: adopterId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('pet', 'name type images status')
    .populate('provider', 'name email profileImage')
    .sort({ createdAt: -1 });
};

// 스태틱 메서드 - 만료 예정 신청 조회
adoptionSchema.statics.findExpiringSoon = function(days = 3) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);
  
  return this.find({
    status: 'pending',
    expiresAt: { $lte: expiryDate }
  })
  .populate('pet', 'name')
  .populate('adopter', 'name email')
  .populate('provider', 'name email');
};

// 스태틱 메서드 - 통계 조회
adoptionSchema.statics.getStats = function(providerId) {
  const matchStage = providerId ? { provider: mongoose.Types.ObjectId(providerId) } : {};
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$count' },
        stats: {
          $push: {
            status: '$_id',
            count: '$count'
          }
        }
      }
    }
  ]);
};

// 스태틱 메서드 - 성공적인 입양 조회
adoptionSchema.statics.findSuccessfulAdoptions = function(limit = 10) {
  return this.find({ status: 'completed' })
    .populate('pet', 'name type images')
    .populate('adopter', 'name profileImage')
    .populate('provider', 'name profileImage')
    .sort({ 'completion.completedAt': -1 })
    .limit(limit);
};

// 모델 생성 및 내보내기
const Adoption = mongoose.model('Adoption', adoptionSchema);

module.exports = Adoption;