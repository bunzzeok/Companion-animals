const express = require('express');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const { User } = require('../models');
const { 
  generateToken, 
  authenticate, 
  requireOwnership,
  blacklistToken,
  checkBlacklist
} = require('../middleware/auth');

const router = express.Router();

// 입력 유효성 검증 규칙들
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('phone')
    .matches(/^[0-9-+().\s]+$/)
    .withMessage('Please enter a valid phone number'),
  
  body('userType')
    .isIn(['adopter', 'provider'])
    .withMessage('User type must be either adopter or provider')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// 회원가입 엔드포인트
router.post('/register', registerValidation, async (req, res) => {
  try {
    // 유효성 검증 결과 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: errors.array()
      });
    }

    const { email, password, name, phone, userType, address, bio } = req.body;

    // 이미 존재하는 이메일인지 확인
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Email is already registered'
      });
    }

    // 새 사용자 생성
    const newUser = new User({
      email,
      password, // User 모델에서 자동으로 해싱됨
      name,
      phone,
      userType,
      address: address || {},
      bio: bio || ''
    });

    // 이메일 인증 토큰 생성
    const emailVerificationToken = newUser.createEmailVerificationToken();

    // 사용자 저장
    await newUser.save();

    // TODO: 이메일 인증 링크 발송 (이메일 서비스 구현 후)
    console.log(`📧 Email verification token for ${email}: ${emailVerificationToken}`);

    // JWT 토큰 생성
    const token = generateToken(newUser._id);

    // 응답에서 비밀번호 제외
    const userResponse = newUser.toJSON();

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification.',
      data: {
        user: userResponse,
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    });

    console.log(`✅ New user registered: ${email} (${userType})`);

  } catch (error) {
    console.error('Registration error:', error);
    
    // MongoDB 중복 키 에러 처리
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        error: `${field} is already in use`
      });
    }

    res.status(500).json({
      success: false,
      error: 'Registration failed. Please try again.'
    });
  }
});

// 로그인 엔드포인트
router.post('/login', checkBlacklist, loginValidation, async (req, res) => {
  try {
    // 유효성 검증 결과 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // 사용자 찾기 (비밀번호 포함하여 조회)
    const user = await User.findByEmail(email).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // 계정 상태 확인
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        error: 'Account is suspended or deactivated'
      });
    }

    // 비밀번호 검증
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // 마지막 로그인 시간 업데이트
    await user.updateLastLogin();

    // JWT 토큰 생성
    const token = generateToken(user._id);

    // 응답에서 비밀번호 제외
    const userResponse = user.toJSON();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    });

    console.log(`✅ User logged in: ${email}`);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed. Please try again.'
    });
  }
});

// 로그아웃 엔드포인트
router.post('/logout', authenticate, (req, res) => {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      // 토큰을 블랙리스트에 추가
      blacklistToken(token);
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });

    console.log(`✅ User logged out: ${req.user.email}`);

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
});

// 현재 사용자 정보 조회
router.get('/me', authenticate, async (req, res) => {
  try {
    // 최신 사용자 정보를 데이터베이스에서 조회
    const user = await User.findById(req.user._id)
      .populate('pets', 'name type status images')
      .populate('adoptionRequests', 'status createdAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user information'
    });
  }
});

// 프로필 업데이트
router.put('/profile', authenticate, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('phone')
    .optional()
    .matches(/^[0-9-+().\s]+$/)
    .withMessage('Please enter a valid phone number'),
  
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters')
], async (req, res) => {
  try {
    // 유효성 검증 결과 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: errors.array()
      });
    }

    const allowedUpdates = ['name', 'phone', 'bio', 'address', 'preferences'];
    const updates = {};

    // 허용된 필드만 업데이트 객체에 추가
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key) && req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    });

    // 업데이트할 내용이 없는 경우
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update'
      });
    }

    // 사용자 정보 업데이트
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { 
        new: true, // 업데이트된 문서 반환
        runValidators: true // 스키마 유효성 검증 실행
      }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser.toJSON()
      }
    });

    console.log(`✅ Profile updated: ${req.user.email}`);

  } catch (error) {
    console.error('Profile update error:', error);
    
    // 중복 키 에러 처리
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        error: `${field} is already in use`
      });
    }

    res.status(500).json({
      success: false,
      error: 'Profile update failed'
    });
  }
});

// 비밀번호 변경
router.put('/change-password', authenticate, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
], async (req, res) => {
  try {
    // 유효성 검증 결과 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // 현재 비밀번호와 새 비밀번호가 같은지 확인
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        error: 'New password must be different from current password'
      });
    }

    // 사용자 조회 (비밀번호 포함)
    const user = await User.findById(req.user._id).select('+password');

    // 현재 비밀번호 검증
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // 새 비밀번호 설정 및 저장
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

    console.log(`✅ Password changed: ${req.user.email}`);

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      error: 'Password change failed'
    });
  }
});

// 이메일 인증
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // 토큰을 해시하여 데이터베이스와 비교
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // 토큰이 유효하고 만료되지 않은 사용자 찾기
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Email verification token is invalid or has expired'
      });
    }

    // 이메일 인증 완료 처리
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

    console.log(`✅ Email verified: ${user.email}`);

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Email verification failed'
    });
  }
});

// 이메일 인증 재발송
router.post('/resend-verification', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // 이미 인증된 사용자인지 확인
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        error: 'Email is already verified'
      });
    }

    // 새 인증 토큰 생성
    const emailVerificationToken = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // TODO: 이메일 인증 링크 재발송 (이메일 서비스 구현 후)
    console.log(`📧 Email verification token resent for ${user.email}: ${emailVerificationToken}`);

    res.json({
      success: true,
      message: 'Verification email sent successfully'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resend verification email'
    });
  }
});

// 비밀번호 재설정 요청
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required')
], async (req, res) => {
  try {
    // 유효성 검증 결과 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    const { email } = req.body;

    // 사용자 찾기
    const user = await User.findByEmail(email);
    if (!user) {
      // 보안상 이유로 사용자가 존재하지 않아도 성공 메시지 반환
      return res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent'
      });
    }

    // 비밀번호 재설정 토큰 생성
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // TODO: 비밀번호 재설정 이메일 발송 (이메일 서비스 구현 후)
    console.log(`📧 Password reset token for ${email}: ${resetToken}`);

    res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process password reset request'
    });
  }
});

// 비밀번호 재설정 (토큰 사용)
router.post('/reset-password/:token', [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
], async (req, res) => {
  try {
    // 유효성 검증 결과 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid password format',
        details: errors.array()
      });
    }

    const { token } = req.params;
    const { password } = req.body;

    // 토큰을 해시하여 데이터베이스와 비교
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
        error: 'Password reset token is invalid or has expired'
      });
    }

    // 새 비밀번호 설정
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

    console.log(`✅ Password reset completed: ${user.email}`);

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      error: 'Password reset failed'
    });
  }
});

// 계정 비활성화
router.delete('/deactivate', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // 계정 상태를 비활성화로 변경
    user.status = 'deactivated';
    await user.save({ validateBeforeSave: false });

    // 현재 토큰을 블랙리스트에 추가
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      blacklistToken(token);
    }

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });

    console.log(`✅ Account deactivated: ${user.email}`);

  } catch (error) {
    console.error('Account deactivation error:', error);
    res.status(500).json({
      success: false,
      error: 'Account deactivation failed'
    });
  }
});

module.exports = router;