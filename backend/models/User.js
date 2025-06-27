const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 사용자 스키마 정의
const userSchema = new mongoose.Schema({
  // 기본 인증 정보
  email: {
    type: String,
    required: [true, 'Email is required'], // 이메일 필수 입력
    unique: true, // 중복 방지
    lowercase: true, // 소문자로 저장
    trim: true, // 공백 제거
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'] // 이메일 형식 검증
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'], // 비밀번호 필수 입력
    minlength: [6, 'Password must be at least 6 characters long'], // 최소 6자리
    select: false // 기본적으로 조회 시 비밀번호 제외
  },
  
  // 개인 정보
  name: {
    type: String,
    required: [true, 'Name is required'], // 이름 필수 입력
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'] // 최대 50자
  },
  
  phone: {
    type: String,
    required: [true, 'Phone number is required'], // 전화번호 필수 입력
    trim: true,
    match: [/^[0-9-+().\s]+$/, 'Please enter a valid phone number'] // 전화번호 형식 검증
  },
  
  // 사용자 타입 - 입양희망자, 분양자, 관리자
  userType: {
    type: String,
    required: [true, 'User type is required'],
    enum: {
      values: ['adopter', 'provider', 'admin'],
      message: 'User type must be either adopter, provider, or admin'
    },
    default: 'adopter'
  },
  
  // 프로필 정보
  profileImage: {
    type: String, // 이미지 파일 경로
    default: null
  },
  
  address: {
    city: {
      type: String,
      trim: true
    },
    district: {
      type: String,
      trim: true
    },
    fullAddress: {
      type: String,
      trim: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'], // 최대 500자
    trim: true
  },
  
  // 계정 상태 관리
  isVerified: {
    type: Boolean,
    default: false // 기본적으로 미인증 상태
  },
  
  emailVerificationToken: {
    type: String,
    select: false // 보안상 기본 조회 시 제외
  },
  
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  
  passwordResetToken: {
    type: String,
    select: false
  },
  
  passwordResetExpires: {
    type: Date,
    select: false
  },
  
  // 활동 통계
  statistics: {
    petsPosted: {
      type: Number,
      default: 0 // 등록한 펫 수
    },
    adoptionsCompleted: {
      type: Number,
      default: 0 // 완료된 입양 수
    },
    profileViews: {
      type: Number,
      default: 0 // 프로필 조회수
    }
  },
  
  // 설정
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true // 이메일 알림 수신 여부
      },
      push: {
        type: Boolean,
        default: true // 푸시 알림 수신 여부
      }
    },
    privacy: {
      showPhone: {
        type: Boolean,
        default: false // 전화번호 공개 여부
      },
      showEmail: {
        type: Boolean,
        default: false // 이메일 공개 여부
      }
    }
  },
  
  // 계정 상태
  status: {
    type: String,
    enum: ['active', 'suspended', 'deactivated'],
    default: 'active'
  },
  
  lastLoginAt: {
    type: Date,
    default: null
  },
  
  // 소셜 로그인 정보 (나중에 구현)
  socialAuth: {
    google: {
      id: String,
      email: String
    },
    kakao: {
      id: String,
      email: String
    },
    naver: {
      id: String,
      email: String
    }
  }
}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
  toJSON: { virtuals: true }, // JSON 변환 시 virtual 필드 포함
  toObject: { virtuals: true }
});

// 인덱스 설정
userSchema.index({ email: 1 }); // 이메일 인덱스
userSchema.index({ userType: 1 }); // 사용자 타입 인덱스
userSchema.index({ 'address.city': 1, 'address.district': 1 }); // 지역 검색용 인덱스

// Virtual 필드 - 등록한 펫들
userSchema.virtual('pets', {
  ref: 'Pet',
  localField: '_id',
  foreignField: 'owner'
});

// Virtual 필드 - 입양 신청들
userSchema.virtual('adoptionRequests', {
  ref: 'Adoption',
  localField: '_id',
  foreignField: 'adopter'
});

// 비밀번호 저장 전 해싱 미들웨어
userSchema.pre('save', async function(next) {
  // 비밀번호가 수정되지 않았으면 그대로 진행
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // bcrypt를 사용해 비밀번호 해싱 (salt rounds: 12)
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 인스턴스 메서드 - 비밀번호 검증
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // 입력된 비밀번호와 저장된 해시 비교
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// 인스턴스 메서드 - 비밀번호 리셋 토큰 생성
userSchema.methods.createPasswordResetToken = function() {
  const crypto = require('crypto');
  
  // 랜덤 토큰 생성
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // 토큰을 해시하여 DB에 저장
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // 토큰 만료 시간 설정 (10분)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
  return resetToken; // 원본 토큰 반환 (이메일로 전송용)
};

// 인스턴스 메서드 - 이메일 인증 토큰 생성
userSchema.methods.createEmailVerificationToken = function() {
  const crypto = require('crypto');
  
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  // 토큰 만료 시간 설정 (24시간)
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  
  return verificationToken;
};

// 스태틱 메서드 - 이메일로 사용자 찾기
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// 스태틱 메서드 - 활성 사용자만 조회
userSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

// 마지막 로그인 시간 업데이트 메서드
userSchema.methods.updateLastLogin = function() {
  this.lastLoginAt = new Date();
  return this.save({ validateBeforeSave: false });
};

// JSON 응답에서 민감한 정보 제거
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  
  // 민감한 정보 제거
  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  delete userObject.emailVerificationToken;
  delete userObject.emailVerificationExpires;
  delete userObject.__v;
  
  return userObject;
};

// 모델 생성 및 내보내기
const User = mongoose.model('User', userSchema);

module.exports = User;