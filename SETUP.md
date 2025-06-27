# 🐾 Companion Animals - 로컬 실행 가이드

## 📋 준비사항

### 1. 필수 소프트웨어 설치
- **Node.js** (v18 이상) - [다운로드](https://nodejs.org/)
- **MongoDB** (Community Edition)
- **Homebrew** (macOS 사용자)

### 2. MongoDB 설치 및 실행 (macOS)
```bash
# MongoDB 설치
brew tap mongodb/brew
brew install mongodb-community

# MongoDB 서비스 시작
brew services start mongodb/brew/mongodb-community

# MongoDB 연결 확인
mongosh
```

### 3. MongoDB 설치 (Windows)
1. [MongoDB Community Server](https://www.mongodb.com/try/download/community) 다운로드
2. 설치 후 MongoDB Compass 실행
3. `mongodb://localhost:27017` 연결

## 🚀 실행 방법

### 1단계: 프로젝트 클론
```bash
git clone <repository-url>
cd Companion-animals
```

### 2단계: Backend 서버 실행
```bash
# Backend 디렉토리로 이동
cd backend

# 의존성 설치
npm install

# 환경변수 설정 확인 (.env 파일)
# 이미 설정되어 있음 - 필요시 수정

# 서버 실행
npm start
```

**✅ Backend 실행 성공 메시지:**
```
🚀 Server is running on port 5001
📍 Environment: development
🌐 Server URL: http://localhost:5001
✅ MongoDB connected successfully
```

### 3단계: Frontend 서버 실행 (새 터미널)
```bash
# Frontend 디렉토리로 이동
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

**✅ Frontend 실행 성공 메시지:**
```
▲ Next.js 15.3.4 (Turbopack)
- Local:        http://localhost:3000
- Network:      http://192.168.219.101:3000
✓ Ready in 735ms
```

## 🌐 접속 주소

### 웹 애플리케이션
- **메인 사이트**: http://localhost:3000
- **Admin 대시보드**: http://localhost:3000/admin

### API 서버
- **Backend API**: http://localhost:5001
- **API 문서**: http://localhost:5001/api-docs (Swagger - 추후 구현)

### 주요 페이지
- **홈페이지**: http://localhost:3000
- **로그인**: http://localhost:3000/login
- **회원가입**: http://localhost:3000/register
- **반려동물 조회**: http://localhost:3000/pets
- **반려동물 등록**: http://localhost:3000/post-pet
- **프로필**: http://localhost:3000/profile
- **관리자**: http://localhost:3000/admin

## 📱 모바일 앱 실행

### Android 앱 실행
```bash
cd frontend

# 모바일 빌드
npm run build:mobile

# Android 앱 실행 (Android Studio 필요)
npm run mobile:android
```

### iOS 앱 실행 (macOS에서만)
```bash
cd frontend

# iOS 앱 실행 (Xcode 필요)
npm run mobile:ios
```

## 🗄️ 데이터베이스 관리

### MongoDB 관리 도구
1. **MongoDB Compass** (GUI) - 권장
2. **mongosh** (CLI)
3. **Studio 3T** (고급 기능)

### 데이터베이스 연결 정보
- **Host**: localhost
- **Port**: 27017
- **Database**: companion-animals

### 주요 컬렉션
- `users` - 사용자 정보
- `pets` - 반려동물 정보
- `adoptions` - 입양 요청 정보

## 🔧 환경변수 설정

### Backend (.env)
```env
# 서버 설정
PORT=5001
NODE_ENV=development

# 데이터베이스 설정
MONGODB_URI=mongodb://localhost:27017/companion-animals

# JWT 설정
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# 클라이언트 URL 설정
CLIENT_URL=http://localhost:3000

# 파일 업로드 설정
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

## 🛠️ 개발 도구

### 유용한 명령어
```bash
# Backend
cd backend
npm run dev        # 개발 모드 (nodemon)
npm start          # 프로덕션 모드
npm test           # 테스트 실행

# Frontend
cd frontend
npm run dev        # 개발 서버
npm run build      # 프로덕션 빌드
npm run build:mobile  # 모바일 앱 빌드
npm run lint       # ESLint 검사
```

### 로그 확인
- **Backend 로그**: 터미널에서 실시간 확인
- **Frontend 로그**: 브라우저 개발자 도구 Console
- **MongoDB 로그**: MongoDB Compass 또는 mongosh

## ⚠️ 문제 해결

### 자주 발생하는 문제

1. **MongoDB 연결 실패**
   ```bash
   # MongoDB 서비스 상태 확인
   brew services list | grep mongodb
   
   # MongoDB 재시작
   brew services restart mongodb/brew/mongodb-community
   ```

2. **포트 충돌**
   ```bash
   # 포트 사용 중인 프로세스 확인
   lsof -i :3000  # Frontend
   lsof -i :5001  # Backend
   
   # 프로세스 종료
   kill -9 <PID>
   ```

3. **의존성 설치 오류**
   ```bash
   # 노드 모듈 재설치
   rm -rf node_modules package-lock.json
   npm install
   ```

### 성능 최적화
- **메모리 사용량**: MongoDB 및 Node.js 서버 모니터링
- **디스크 공간**: uploads 폴더 정기적 정리
- **네트워크**: 로컬 환경에서는 문제없음

## 📞 지원

문제가 발생하면 다음을 확인하세요:
1. MongoDB 서비스 실행 상태
2. 포트 충돌 여부 (3000, 5001)
3. 환경변수 설정
4. Node.js 버전 (v18 이상)

---

**🎉 설치 완료!** 이제 Companion Animals 플랫폼을 로컬에서 사용할 수 있습니다.