# 🚀 Companion Animals - 즉시 실행 가이드

## ✅ 현재 상태: 모든 설정 완료!

### 🎯 **3단계로 즉시 실행**

#### 1단계: Backend 서버 실행
```bash
cd /Users/songchibong/Documents/GitHub/Companion-animals/backend
npm start
```
**✅ 성공 메시지:** `✅ MongoDB connected successfully`

#### 2단계: Frontend 서버 실행 (새 터미널)
```bash
cd /Users/songchibong/Documents/GitHub/Companion-animals/frontend  
npm run dev
```
**✅ 성공 메시지:** `✓ Ready in 735ms`

#### 3단계: 브라우저에서 접속
**🌐 메인 사이트:** http://localhost:3000

---

## 🔐 테스트 계정 (바로 로그인 가능!)

### 관리자 계정
- **이메일:** admin@companionanimals.com
- **비밀번호:** admin123
- **접속:** http://localhost:3000/admin

### 반려동물 제공자 계정  
- **이메일:** provider@test.com
- **비밀번호:** provider123

### 입양 희망자 계정
- **이메일:** adopter@test.com  
- **비밀번호:** adopter123

---

## 🐾 등록된 테스트 반려동물

1. **바둑이** (믹스견, 성견) - 강남구
2. **나비** (코리안숏헤어, 젊은 고양이) - 서초구  
3. **뽀미** (포메라니안, 성견) - 송파구

---

## 📱 주요 기능 테스트

### 🏠 메인 페이지 
- Karrot Market 스타일 디자인 ✅
- 반응형 레이아웃 (iPhone SE ~ Desktop) ✅

### 👤 사용자 기능
- 회원가입/로그인 ✅
- 프로필 관리 ✅  
- 반려동물 등록 ✅
- 반려동물 조회/검색 ✅

### 🛡️ 관리자 기능
- 사용자 관리 ✅
- 반려동물 관리 ✅
- 신고 처리 ✅
- 통계 대시보드 ✅

### 📱 모바일 앱 (선택사항)
```bash
cd /Users/songchibong/Documents/GitHub/Companion-animals/frontend
npm run mobile:android  # Android 앱
npm run mobile:ios      # iOS 앱 (Xcode 필요)
```

---

## 🗄️ 데이터베이스 정보

- **MongoDB**: localhost:27017 
- **데이터베이스명**: companion-animals
- **상태**: ✅ 실행 중 (brew services로 관리)

### 데이터베이스 재초기화 (필요시)
```bash
cd /Users/songchibong/Documents/GitHub/Companion-animals/backend
npm run init-db
```

---

## 🔧 서버 포트

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001  
- **MongoDB**: localhost:27017

---

## 💡 빠른 시작 팁

1. **데이터베이스 확인**: MongoDB Compass로 `companion-animals` 연결
2. **API 테스트**: Postman으로 `http://localhost:5001/api` 테스트
3. **반응형 테스트**: 브라우저 개발자 도구에서 모바일 뷰 확인
4. **관리자 기능**: admin 계정으로 로그인 후 `/admin` 접속

---

## 🚨 문제 해결

### MongoDB 연결 오류
```bash
brew services restart mongodb/brew/mongodb-community
```

### 포트 충돌  
```bash
lsof -i :3000    # Frontend 포트 확인
lsof -i :5001    # Backend 포트 확인
kill -9 <PID>    # 프로세스 종료
```

### 의존성 오류
```bash
rm -rf node_modules package-lock.json
npm install
```

---

**🎉 모든 준비 완료! 이제 Companion Animals를 체험해보세요!**