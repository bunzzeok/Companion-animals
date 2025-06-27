const mongoose = require('mongoose');

// 펫(반려동물) 스키마 정의
const petSchema = new mongoose.Schema({
  // 기본 정보
  name: {
    type: String,
    required: [true, 'Pet name is required'], // 반려동물 이름 필수
    trim: true,
    maxlength: [50, 'Pet name cannot exceed 50 characters']
  },
  
  type: {
    type: String,
    required: [true, 'Pet type is required'], // 동물 종류 필수
    enum: {
      values: ['cat', 'dog', 'other'],
      message: 'Pet type must be cat, dog, or other'
    }
  },
  
  breed: {
    type: String,
    required: [true, 'Pet breed is required'], // 품종 필수
    trim: true,
    maxlength: [100, 'Breed name cannot exceed 100 characters']
  },
  
  // 나이 및 신체 정보
  age: {
    type: String,
    required: [true, 'Pet age is required'],
    enum: {
      values: ['baby', 'young', 'adult', 'senior'],
      message: 'Age must be baby, young, adult, or senior'
    }
  },
  
  gender: {
    type: String,
    required: [true, 'Pet gender is required'],
    enum: {
      values: ['male', 'female', 'unknown'],
      message: 'Gender must be male, female, or unknown'
    }
  },
  
  size: {
    type: String,
    required: [true, 'Pet size is required'],
    enum: {
      values: ['small', 'medium', 'large'],
      message: 'Size must be small, medium, or large'
    }
  },
  
  color: {
    type: String,
    required: [true, 'Pet color is required'], // 색상 필수
    trim: true,
    maxlength: [100, 'Color description cannot exceed 100 characters']
  },
  
  weight: {
    type: Number,
    min: [0.1, 'Weight must be at least 0.1 kg'], // 최소 0.1kg
    max: [100, 'Weight cannot exceed 100 kg'], // 최대 100kg
    validate: {
      validator: function(v) {
        return v == null || v > 0; // null이거나 0보다 커야 함
      },
      message: 'Weight must be a positive number'
    }
  },
  
  // 건강 정보
  healthStatus: {
    type: String,
    required: [true, 'Health status is required'],
    enum: {
      values: ['healthy', 'needs_treatment', 'chronic_condition'],
      message: 'Health status must be healthy, needs_treatment, or chronic_condition'
    },
    default: 'healthy'
  },
  
  isVaccinated: {
    type: Boolean,
    required: [true, 'Vaccination status is required'], // 예방접종 여부 필수
    default: false
  },
  
  isNeutered: {
    type: Boolean,
    required: [true, 'Neutering status is required'], // 중성화 여부 필수
    default: false
  },
  
  medicalNotes: {
    type: String,
    maxlength: [1000, 'Medical notes cannot exceed 1000 characters'], // 의료 기록 최대 1000자
    trim: true
  },
  
  // 성격 및 특성
  temperament: [{
    type: String,
    trim: true,
    maxlength: [50, 'Each temperament trait cannot exceed 50 characters']
  }], // 성격 배열 (예: ['friendly', 'playful', 'calm'])
  
  goodWithKids: {
    type: Boolean,
    required: [true, 'Good with kids status is required'], // 아이들과의 관계 필수
    default: false
  },
  
  goodWithPets: {
    type: Boolean,
    required: [true, 'Good with pets status is required'], // 다른 동물과의 관계 필수
    default: false
  },
  
  goodWithStrangers: {
    type: Boolean,
    required: [true, 'Good with strangers status is required'], // 낯선 사람과의 관계 필수
    default: false
  },
  
  // 위치 정보
  location: {
    city: {
      type: String,
      required: [true, 'City is required'], // 도시 필수
      trim: true
    },
    district: {
      type: String,
      required: [true, 'District is required'], // 구/군 필수
      trim: true
    },
    address: {
      type: String,
      trim: true // 상세 주소 (선택사항)
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
  
  // 분양 상태
  status: {
    type: String,
    enum: {
      values: ['available', 'pending', 'adopted', 'removed'],
      message: 'Status must be available, pending, adopted, or removed'
    },
    default: 'available'
  },
  
  // 미디어 파일
  images: [{
    type: String, // 이미지 파일 경로
    required: [true, 'At least one image is required'] // 최소 1개 이미지 필수
  }],
  
  videos: [{
    type: String // 비디오 파일 경로 (선택사항)
  }],
  
  // 상세 정보
  description: {
    type: String,
    required: [true, 'Pet description is required'], // 상세 설명 필수
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'], // 최소 10자
    maxlength: [2000, 'Description cannot exceed 2000 characters'] // 최대 2000자
  },
  
  adoptionFee: {
    type: Number,
    min: [0, 'Adoption fee cannot be negative'], // 분양비 0 이상
    max: [1000000, 'Adoption fee cannot exceed 1,000,000'], // 최대 100만원
    default: 0 // 기본값은 무료
  },
  
  urgency: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Urgency must be low, medium, or high'
    },
    default: 'low' // 기본값은 낮음
  },
  
  specialNeeds: {
    type: String,
    maxlength: [500, 'Special needs cannot exceed 500 characters'], // 특별한 돌봄 최대 500자
    trim: true
  },
  
  // 분양자 정보
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // User 모델 참조
    required: [true, 'Pet owner is required'] // 분양자 필수
  },
  
  // 통계 정보
  views: {
    type: Number,
    default: 0, // 조회수 기본값 0
    min: [0, 'Views cannot be negative']
  },
  
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // 좋아요를 누른 사용자들
  }],
  
  // 입양 관련
  adoptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 입양한 사용자
    default: null
  },
  
  adoptedAt: {
    type: Date,
    default: null // 입양 완료 날짜
  },
  
  // 시스템 정보
  featured: {
    type: Boolean,
    default: false // 추천 여부
  },
  
  reportCount: {
    type: Number,
    default: 0 // 신고 횟수
  },
  
  lastUpdated: {
    type: Date,
    default: Date.now // 마지막 업데이트 시간
  }
}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 인덱스 설정 - 검색 성능 최적화
petSchema.index({ type: 1, status: 1 }); // 동물 타입과 상태로 검색
petSchema.index({ 'location.city': 1, 'location.district': 1 }); // 지역 검색
petSchema.index({ age: 1, size: 1 }); // 나이와 크기로 검색
petSchema.index({ createdAt: -1 }); // 최신순 정렬
petSchema.index({ views: -1 }); // 인기순 정렬
petSchema.index({ urgency: -1, createdAt: -1 }); // 긴급도와 날짜순
petSchema.index({ owner: 1 }); // 분양자별 검색
petSchema.index({ featured: -1, createdAt: -1 }); // 추천 순서

// 텍스트 검색을 위한 인덱스
petSchema.index({
  name: 'text',
  breed: 'text',
  description: 'text',
  'location.city': 'text',
  'location.district': 'text'
});

// Virtual 필드 - 좋아요 수
petSchema.virtual('likesCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual 필드 - 입양 신청들
petSchema.virtual('adoptionRequests', {
  ref: 'Adoption',
  localField: '_id',
  foreignField: 'pet'
});

// Virtual 필드 - 나이를 개월 수로 변환 (추정)
petSchema.virtual('estimatedAgeInMonths').get(function() {
  const ageMap = {
    'baby': 3, // 3개월
    'young': 12, // 1년
    'adult': 36, // 3년
    'senior': 84 // 7년
  };
  return ageMap[this.age] || 0;
});

// 미들웨어 - 저장 전 마지막 업데이트 시간 갱신
petSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// 미들웨어 - 상태 변경 시 입양 정보 업데이트
petSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'adopted') {
    this.adoptedAt = new Date();
  }
  next();
});

// 인스턴스 메서드 - 조회수 증가
petSchema.methods.incrementViews = function() {
  this.views = (this.views || 0) + 1;
  return this.save({ validateBeforeSave: false });
};

// 인스턴스 메서드 - 좋아요 토글
petSchema.methods.toggleLike = function(userId) {
  const userIdStr = userId.toString();
  const likeIndex = this.likes.findIndex(like => like.toString() === userIdStr);
  
  if (likeIndex > -1) {
    // 이미 좋아요를 눌렀다면 제거
    this.likes.splice(likeIndex, 1);
    return { liked: false, count: this.likes.length };
  } else {
    // 좋아요 추가
    this.likes.push(userId);
    return { liked: true, count: this.likes.length };
  }
};

// 인스턴스 메서드 - 입양 완료 처리
petSchema.methods.markAsAdopted = function(adopterId) {
  this.status = 'adopted';
  this.adoptedBy = adopterId;
  this.adoptedAt = new Date();
  return this.save();
};

// 스태틱 메서드 - 분양 가능한 펫 조회
petSchema.statics.findAvailable = function() {
  return this.find({ status: 'available' });
};

// 스태틱 메서드 - 지역별 펫 조회
petSchema.statics.findByLocation = function(city, district) {
  const query = { status: 'available' };
  if (city) query['location.city'] = new RegExp(city, 'i');
  if (district) query['location.district'] = new RegExp(district, 'i');
  return this.find(query);
};

// 스태틱 메서드 - 검색 기능
petSchema.statics.search = function(searchTerm, filters = {}) {
  const query = { status: 'available' };
  
  // 텍스트 검색
  if (searchTerm) {
    query.$text = { $search: searchTerm };
  }
  
  // 필터 적용
  if (filters.type) query.type = filters.type;
  if (filters.age) query.age = filters.age;
  if (filters.size) query.size = filters.size;
  if (filters.gender) query.gender = filters.gender;
  if (filters.urgency) query.urgency = filters.urgency;
  if (filters.city) query['location.city'] = new RegExp(filters.city, 'i');
  if (filters.district) query['location.district'] = new RegExp(filters.district, 'i');
  
  // 숫자 필터
  if (filters.maxFee !== undefined) {
    query.adoptionFee = { $lte: filters.maxFee };
  }
  
  // 불린 필터
  if (filters.goodWithKids !== undefined) query.goodWithKids = filters.goodWithKids;
  if (filters.goodWithPets !== undefined) query.goodWithPets = filters.goodWithPets;
  if (filters.isVaccinated !== undefined) query.isVaccinated = filters.isVaccinated;
  if (filters.isNeutered !== undefined) query.isNeutered = filters.isNeutered;
  
  return this.find(query);
};

// 스태틱 메서드 - 추천 펫 조회
petSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ status: 'available', featured: true })
    .limit(limit)
    .sort({ createdAt: -1 });
};

// 스태틱 메서드 - 인기 펫 조회 (조회수 기준)
petSchema.statics.findPopular = function(limit = 10) {
  return this.find({ status: 'available' })
    .limit(limit)
    .sort({ views: -1, createdAt: -1 });
};

// 스태틱 메서드 - 긴급 펫 조회
petSchema.statics.findUrgent = function(limit = 10) {
  return this.find({ status: 'available', urgency: 'high' })
    .limit(limit)
    .sort({ createdAt: -1 });
};

// 모델 생성 및 내보내기
const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;