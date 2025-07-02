const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 업로드 디렉토리 생성
const createUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 파일 저장 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    // 파일 타입에 따라 폴더 구분
    if (file.fieldname === 'images' || file.mimetype.startsWith('image/')) {
      uploadPath += 'images/';
    } else if (file.fieldname === 'videos' || file.mimetype.startsWith('video/')) {
      uploadPath += 'videos/';
    } else if (file.fieldname === 'documents' || file.mimetype === 'application/pdf') {
      uploadPath += 'documents/';
    } else {
      uploadPath += 'others/';
    }
    
    // 날짜별 폴더 생성
    const today = new Date();
    const dateFolder = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
    uploadPath += dateFolder;
    
    createUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // 고유한 파일명 생성
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    
    // 파일명에서 특수문자 제거
    const cleanBaseName = baseName.replace(/[^a-zA-Z0-9가-힣]/g, '_');
    
    cb(null, `${cleanBaseName}_${uniqueSuffix}${extension}`);
  }
});

// 파일 필터링
const fileFilter = (req, file, cb) => {
  // 허용된 MIME 타입
  const allowedMimeTypes = [
    // 이미지
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    // 비디오
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/webm',
    // 문서
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // 오디오
    'audio/mpeg',
    'audio/wav',
    'audio/ogg'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`파일 타입이 허용되지 않습니다: ${file.mimetype}`), false);
  }
};

// 기본 multer 설정
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10 // 최대 10개 파일
  }
});

// 이미지만 업로드
const uploadImages = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 8 // 최대 8개 이미지
  }
});

// 비디오만 업로드
const uploadVideos = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('비디오 파일만 업로드 가능합니다.'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 3 // 최대 3개 비디오
  }
});

// 문서만 업로드
const uploadDocuments = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('PDF, DOC, DOCX 파일만 업로드 가능합니다.'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5 // 최대 5개 문서
  }
});

// 오디오만 업로드 (음성 메시지용)
const uploadAudio = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('오디오 파일만 업로드 가능합니다.'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1 // 1개 오디오 파일
  }
});

// 프로필 이미지 업로드 (단일 파일)
const uploadProfileImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = 'uploads/profiles/';
      createUploadDir(uploadPath);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      cb(null, `profile_${uniqueSuffix}${extension}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 1
  }
});

// 에러 처리 미들웨어
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '파일 크기가 너무 큽니다.',
        error: 'FILE_TOO_LARGE'
      });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: '업로드 가능한 파일 수를 초과했습니다.',
        error: 'TOO_MANY_FILES'
      });
    }
    
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: '예상치 못한 필드에서 파일이 업로드되었습니다.',
        error: 'UNEXPECTED_FIELD'
      });
    }
  }
  
  if (error.message) {
    return res.status(400).json({
      success: false,
      message: error.message,
      error: 'UPLOAD_ERROR'
    });
  }
  
  next(error);
};

// 파일 삭제 유틸리티 함수
const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err && err.code !== 'ENOENT') {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// 다중 파일 삭제
const deleteFiles = async (filePaths) => {
  const deletePromises = filePaths.map(filePath => deleteFile(filePath));
  try {
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('File deletion error:', error);
  }
};

// 파일 정보 검증
const validateFileInfo = (file) => {
  return {
    originalName: file.originalname,
    fileName: file.filename,
    path: file.path,
    size: file.size,
    mimeType: file.mimetype,
    uploadedAt: new Date()
  };
};

module.exports = {
  upload,
  uploadImages,
  uploadVideos,
  uploadDocuments,
  uploadAudio,
  uploadProfileImage,
  handleUploadError,
  deleteFile,
  deleteFiles,
  validateFileInfo
};