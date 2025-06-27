# 🐾 Companion Animals

길잃은 동물들이 따뜻한 가정을 찾을 수 있도록 돕는 반려동물 분양/입양 플랫폼

## 🚀 빠른 시작

### 원클릭 실행
```bash
./start.sh
```

### 서버 종료
```bash
./kill-servers.sh
# 또는 Ctrl+C
```

## 🌐 접속 정보

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:5001
- **관리자 페이지**: http://localhost:3000/admin

## 🔐 테스트 계정

- **이메일**: `test@example.com`
- **비밀번호**: `Test123456`

## 📱 주요 기능

### ✅ 구현 완료
- 🏠 반응형 메인 홈페이지 (당근마켓 스타일)
- 🐕 분양 동물 목록 및 상세 페이지
- 💬 실시간 채팅 시스템
- 📝 분양 등록 및 입양 신청
- 👥 커뮤니티 게시판
- 🔐 회원가입/로그인 시스템
- 📞 도움말, 문의, 신고 페이지
- 📋 개인정보처리방침, 이용약관

### 🎨 디자인 특징
- 📱 모바일 퍼스트 (iPhone SE 최적화)
- 🍊 당근마켓 스타일 UI/UX
- 🇰🇷 한국어 인터페이스
- 🎯 직관적인 사용자 경험

## 🛠 기술 스택

### Frontend
- **Next.js 15.3.4** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (아이콘)

### Backend
- **Express.js**
- **MongoDB**
- **JWT 인증**
- **bcrypt** (비밀번호 암호화)

### Mobile
- **Capacitor** (네이티브 앱 빌드)

## 📁 프로젝트 구조

```
Companion-animals/
├── frontend/          # Next.js 프론트엔드
├── backend/           # Express.js 백엔드  
├── start.sh           # 원클릭 실행 스크립트
├── kill-servers.sh    # 서버 종료 스크립트
└── TEST_ACCOUNT.md    # 테스트 계정 정보
```

## 🔧 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- MongoDB
- npm 또는 yarn

### 수동 설치
```bash
# 백엔드 의존성
cd backend && npm install

# 프론트엔드 의존성  
cd frontend && npm install

# MongoDB 시작
brew services start mongodb/brew/mongodb-community
```

## 📚 API 문서

### 인증 API
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 사용자 정보

### 채팅 API
- `GET /api/chat/rooms` - 채팅방 목록
- `POST /api/chat/rooms/create` - 채팅방 생성
- `POST /api/chat/messages` - 메시지 전송

### 펫 API
- `GET /api/pets` - 동물 목록
- `POST /api/pets` - 동물 등록

## 🧪 테스트

### API 테스트
```bash
# 로그인
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}'

# 채팅방 목록
curl -X GET http://localhost:5001/api/chat/rooms \
  -H "Authorization: Bearer [TOKEN]"
```

## 📋 TODO

- [ ] WebSocket 실시간 채팅
- [ ] 파일/이미지 업로드
- [ ] Push 알림
- [ ] 결제 시스템
- [ ] 관리자 대시보드

## 📄 라이선스

MIT License

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch
3. Commit your Changes  
4. Push to the Branch
5. Open a Pull Request

---

Made with ❤️ for companion animals