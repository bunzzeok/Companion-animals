const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT 토큰 생성 함수
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, // 페이로드에 사용자 ID 포함
    process.env.JWT_SECRET, // 환경변수에서 시크릿 키 가져오기
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '7d', // 만료 시간 (기본 7일)
      issuer: 'companion-animals', // 토큰 발급자
      audience: 'companion-animals-users' // 토큰 대상
    }
  );
};

// JWT 토큰 검증 미들웨어
const authenticate = async (req, res, next) => {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No valid token provided.'
      });
    }

    // Bearer 접두사 제거하고 토큰만 추출
    const token = authHeader.substring(7);

    // JWT 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 토큰에서 사용자 ID 추출하여 데이터베이스에서 사용자 조회
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token. User not found.'
      });
    }

    // 계정 상태 확인
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        error: 'Account is suspended or deactivated.'
      });
    }

    // 요청 객체에 사용자 정보 추가
    req.user = user;
    next();

  } catch (error) {
    console.error('Authentication error:', error);
    
    // JWT 관련 에러 처리
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token format.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token has expired. Please login again.'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Authentication failed.'
    });
  }
};

// 선택적 인증 미들웨어 (토큰이 있으면 사용자 정보 설정, 없어도 통과)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // 토큰이 없어도 통과
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (user && user.status === 'active') {
      req.user = user;
    }
    
    next();
  } catch (error) {
    // 에러가 있어도 통과 (로그만 남김)
    console.log('Optional auth error (non-critical):', error.message);
    next();
  }
};

// 사용자 타입별 접근 권한 검증 미들웨어
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.'
      });
    }

    // 허용된 역할에 사용자의 역할이 포함되어 있는지 확인
    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};

// 관리자 권한 검증 미들웨어
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required.'
    });
  }

  if (req.user.userType !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required.'
    });
  }

  next();
};

// 자신의 리소스에 대한 접근인지 확인하는 미들웨어
const requireOwnership = (userIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.'
      });
    }

    // 관리자는 모든 리소스에 접근 가능
    if (req.user.userType === 'admin') {
      return next();
    }

    // URL 파라미터, 요청 본문, 또는 쿼리에서 사용자 ID 찾기
    const targetUserId = req.params[userIdField] || 
                        req.body[userIdField] || 
                        req.query[userIdField];

    if (!targetUserId || targetUserId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only access your own resources.'
      });
    }

    next();
  };
};

// 이메일 인증 필요 미들웨어
const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required.'
    });
  }

  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      error: 'Email verification required. Please verify your email address.',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }

  next();
};

// 비밀번호 재설정 토큰 검증 미들웨어
const validateResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Password reset token is required.'
      });
    }

    // 토큰을 해시하여 데이터베이스와 비교
    const crypto = require('crypto');
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // 토큰이 유효하고 만료되지 않은 사용자 찾기
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Password reset token is invalid or has expired.'
      });
    }

    // 요청에 사용자 정보 추가
    req.user = user;
    req.resetToken = token;
    
    next();
  } catch (error) {
    console.error('Reset token validation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Token validation failed.'
    });
  }
};

// 요청 속도 제한을 위한 사용자별 요청 횟수 추적
const userRequestTracker = {};

// 사용자별 요청 속도 제한 미들웨어
const rateLimitByUser = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(); // 인증되지 않은 사용자는 일반 속도 제한에 의존
    }

    const userId = req.user._id.toString();
    const now = Date.now();
    
    // 사용자의 요청 기록 초기화
    if (!userRequestTracker[userId]) {
      userRequestTracker[userId] = [];
    }

    // 윈도우 시간 이전의 요청들 제거
    userRequestTracker[userId] = userRequestTracker[userId].filter(
      requestTime => now - requestTime < windowMs
    );

    // 현재 윈도우에서의 요청 수 확인
    if (userRequestTracker[userId].length >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    // 현재 요청 시간 기록
    userRequestTracker[userId].push(now);
    
    next();
  };
};

// 토큰 블랙리스트 (로그아웃된 토큰 관리)
const tokenBlacklist = new Set();

// 토큰 블랙리스트 확인 미들웨어
const checkBlacklist = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({
        success: false,
        error: 'Token has been invalidated. Please login again.'
      });
    }
  }
  
  next();
};

// 토큰을 블랙리스트에 추가하는 함수
const blacklistToken = (token) => {
  tokenBlacklist.add(token);
  
  // 메모리 관리를 위해 24시간 후 자동 제거
  setTimeout(() => {
    tokenBlacklist.delete(token);
  }, 24 * 60 * 60 * 1000);
};

module.exports = {
  generateToken,
  authenticate,
  optionalAuth,
  authorize,
  requireAdmin,
  requireOwnership,
  requireEmailVerification,
  validateResetToken,
  rateLimitByUser,
  checkBlacklist,
  blacklistToken,
  protect: authenticate // alias for convenience
};