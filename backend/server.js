// 필요한 모듈들을 불러오기
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const path = require('path');
const { createServer } = require('http');
const { Server: SocketIO } = require('socket.io');
require('dotenv').config();

// Express 앱 인스턴스 생성
const app = express();

// HTTP 서버 생성 (Socket.IO를 위해)
const server = createServer(app);

// Socket.IO 서버 설정
const io = new SocketIO(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL || 'http://localhost:3000',
      'http://localhost:3001', // Next.js dev server alternative port
      'http://127.0.0.1:3000',
      '*' // 개발 환경에서는 모든 origin 허용
    ],
    credentials: true,
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['polling', 'websocket'],
  allowEIO3: true
});

// 환경 변수에서 PORT를 가져오거나 기본값 3001 사용 (5000은 macOS AirPlay가 사용)
const PORT = process.env.PORT || 3001;

// 보안 헤더 설정을 위한 helmet 미들웨어 사용
app.use(helmet());

// CORS 설정 - 프론트엔드에서 API 접근 허용
app.use(cors({
    origin: [
        process.env.CLIENT_URL || 'http://localhost:3000',
        'http://localhost:3001' // Next.js dev server alternative port
    ],
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

// Socket.IO 채팅 설정
const { setupChatSocket } = require('./socket/chatSocket');
setupChatSocket(io);

// Socket.IO 인스턴스를 글로벌하게 사용할 수 있도록 설정
global.io = io;
app.set('io', io);

// 기본 라우트 - API 상태 확인용
app.get('/', (req, res) => {
    res.json({ 
        message: 'Companion Animals API is running!',
        version: '1.0.0',
        status: 'active',
        socketConnections: io.engine.clientsCount
    });
});

// Socket.IO 연결 테스트 엔드포인트
app.get('/test-socket', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Socket.IO Test</title>
        </head>
        <body>
            <h1>Socket.IO Connection Test</h1>
            <div id="status">Connecting...</div>
            <div id="messages"></div>
            <script src="/socket.io/socket.io.js"></script>
            <script>
                const socket = io('http://localhost:5001', {
                    transports: ['polling', 'websocket'],
                    upgrade: true
                });
                
                const status = document.getElementById('status');
                const messages = document.getElementById('messages');
                
                socket.on('connect', () => {
                    status.textContent = 'Connected! Socket ID: ' + socket.id + ' Transport: ' + socket.io.engine.transport.name;
                    status.style.color = 'green';
                });
                
                socket.on('connect_error', (error) => {
                    status.textContent = 'Connection Error: ' + error.message;
                    status.style.color = 'red';
                    console.error('Socket connection error:', error);
                });
                
                socket.on('disconnect', (reason) => {
                    status.textContent = 'Disconnected: ' + reason;
                    status.style.color = 'orange';
                });
                
                socket.io.on('upgrade', () => {
                    status.textContent += ' -> Upgraded to: ' + socket.io.engine.transport.name;
                });
            </script>
        </body>
        </html>
    `);
});

// API 라우트들 설정
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pets', require('./routes/pets'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/community', require('./routes/community'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/adoptions', require('./routes/adoptions'));
app.use('/api/about', require('./routes/about'));

// 업로드 에러 처리 미들웨어
app.use(require('./middleware/upload').handleUploadError);

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

// 서버 시작 (Socket.IO와 함께)
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Server URL: http://localhost:${PORT}`);
    console.log(`💬 Socket.IO server is ready`);
});

// 프로세스 종료 시 MongoDB 연결 정리
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
});