# 🧪 테스트 계정 정보

## 서버 상태 확인
- ✅ **프론트엔드**: http://localhost:3000 (Next.js 15.3.4)
- ✅ **백엔드**: http://localhost:5001 (Express.js + MongoDB)
- ✅ **데이터베이스**: MongoDB 연결됨
- ✅ **채팅 API**: 구현 완료 및 테스트 성공

## 🔐 테스트 계정

### 기본 사용자 계정
- **이메일**: `test@example.com`
- **비밀번호**: `Test123456`
- **이름**: `TestUser`
- **전화번호**: `010-1234-5678`
- **사용자 타입**: `adopter` (입양희망자)
- **계정 상태**: 활성화됨

### JWT 토큰 (로그인 후 받은 토큰)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODVlZDYyZTRhZjQ1ZjFiYjNkMGU4ODkiLCJpYXQiOjE3NTEwNDU3NjUsImV4cCI6MTc1MTY1MDU2NSwiYXVkIjoiY29tcGFuaW9uLWFuaW1hbHMtdXNlcnMiLCJpc3MiOiJjb21wYW5pb24tYW5pbWFscyJ9.g3Ihka0-S0UD2iISf9r3exd2I8aUYLbVoZCzsVNiehE
```

## 🧪 API 테스트 결과

### ✅ 인증 API
- **회원가입**: `POST /api/auth/register` - 성공
- **로그인**: `POST /api/auth/login` - 성공
- **사용자 정보**: `GET /api/auth/me` - 성공

### ✅ 채팅 API
- **채팅방 목록**: `GET /api/chat/rooms` - 성공
- **채팅방 생성**: `POST /api/chat/rooms/create` - 성공
- **메시지 조회**: `GET /api/chat/rooms/:roomId/messages` - 구현됨
- **메시지 전송**: `POST /api/chat/messages` - 구현됨

### 📱 채팅 시스템 테스트 완료
1. 새 채팅방 생성됨: `room-1751045806140-s6woeos4j`
2. 시스템 메시지 자동 생성: "채팅이 시작되었습니다."
3. 실시간 채팅 준비 완료

## 🎯 테스트 방법

### 1. 웹 브라우저에서 테스트
1. http://localhost:3000 접속
2. 우상단 "회원가입" 또는 "로그인" 클릭
3. 위 테스트 계정으로 로그인
4. "분양보기" → 동물 카드의 "채팅하기" 버튼 클릭
5. 채팅 페이지에서 메시지 주고받기 테스트

### 2. API 직접 테스트 (curl)
```bash
# 1. 로그인
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}'

# 2. 채팅방 목록 조회
curl -X GET http://localhost:5001/api/chat/rooms \
  -H "Authorization: Bearer [위에서_받은_토큰]"

# 3. 새 채팅방 생성
curl -X POST http://localhost:5001/api/chat/rooms/create \
  -H "Authorization: Bearer [토큰]" \
  -H "Content-Type: application/json" \
  -d '{"petId":"pet1","petOwnerId":"user2"}'
```

## 🚀 구현 완료된 기능

### 📱 프론트엔드
- ✅ 메인 홈페이지 (반응형)
- ✅ 분양 동물 목록 (`/pets`)
- ✅ 동물 상세페이지 (`/pets/[id]`)
- ✅ 채팅 메인 페이지 (`/chat`)
- ✅ 개별 채팅방 (`/chat/[id]`)
- ✅ 분양 등록 페이지 (`/post-pet`)
- ✅ 입양 신청 페이지 (`/adoption`)
- ✅ 커뮤니티 페이지 (`/community`)
- ✅ 도움말/문의/신고 페이지
- ✅ 개인정보처리방침/이용약관/회사소개

### 🔧 백엔드
- ✅ Express.js 서버 설정
- ✅ MongoDB 연결 및 모델 정의
- ✅ JWT 인증 시스템
- ✅ 사용자 인증 API (회원가입/로그인/프로필)
- ✅ 채팅 API (채팅방 생성/메시지 전송/조회)
- ✅ 펫 관련 API 구조
- ✅ 보안 미들웨어 (CORS, Rate Limiting, Helmet)

### 🎨 디자인 특징
- ✅ 당근마켓 스타일 UI/UX
- ✅ 모바일 퍼스트 반응형 디자인
- ✅ iPhone SE 호환성
- ✅ 한국어 인터페이스
- ✅ 오렌지 컬러 테마

## ⚠️ 주의사항
- 현재 MongoDB는 로컬에서 실행 중
- 채팅 시스템은 REST API 기반 (실시간 WebSocket 미구현)
- 이미지 업로드는 UI만 구현됨 (실제 파일 업로드 미구현)
- 이메일 발송 기능은 콘솔 로그로 대체

## 🔄 다음 단계
1. WebSocket 실시간 채팅 구현
2. 파일/이미지 업로드 기능
3. Push 알림 시스템
4. 실제 펫 데이터 CRUD
5. 결제 시스템 연동