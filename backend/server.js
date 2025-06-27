// 필요한 모듈들을 불러오기
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

// Express 앱 인스턴스 생성
const app = express();

// 환경 변수에서 PORT를 가져오거나 기본값 5000 사용
const PORT = process.env.PORT || 5000;

// 보안 헤더 설정을 위한 helmet 미들웨어 사용
app.use(helmet());

// CORS 설정 - 프론트엔드에서 API 접근 허용
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // 클라이언트 URL 설정
    credentials: true // 쿠키와 인증 정보 허용
}));

// 세션 설정 - 조회수 추적 등에 사용
app.use(session({
    secret: process.env.SESSION_SECRET || 'companion-animals-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS에서만 secure cookie
        maxAge: 24 * 60 * 60 * 1000 // 24시간
    }
}));

// 정적 파일 서빙 - 업로드된 이미지와 비디오 제공
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 요청 속도 제한 설정 - DDoS 및 스팸 방지
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15분 시간 창
    max: 1000, // 15분 동안 최대 1000회 요청 허용
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});
app.use(limiter);

// JSON 파싱 미들웨어 - 요청 본문을 JSON으로 파싱
app.use(express.json({ limit: '10mb' })); // 최대 10MB까지 허용

// URL 인코딩된 데이터 파싱 미들웨어
app.use(express.urlencoded({ extended: true }));

// MongoDB 연결 설정
const connectDB = async () => {
    try {
        // MongoDB 연결 시도
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/companion-animals');
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        // 연결 실패 시 프로세스 종료
        process.exit(1);
    }
};

// 데이터베이스 연결 실행
connectDB();

// 기본 라우트 - API 상태 확인용
app.get('/', (req, res) => {
    res.json({ 
        message: 'Companion Animals API is running!',
        version: '1.0.0',
        status: 'active'
    });
});

// API 라우트들 설정
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pets', require('./routes/pets'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/adoptions', require('./routes/adoptions'));

// 존재하지 않는 라우트에 대한 404 에러 처리
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// 글로벌 에러 핸들링 미들웨어
app.use((error, req, res, next) => {
    console.error('❌ Error:', error.stack);
    
    res.status(error.status || 500).json({
        error: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : error.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Server URL: http://localhost:${PORT}`);
});

// 프로세스 종료 시 MongoDB 연결 정리
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
});