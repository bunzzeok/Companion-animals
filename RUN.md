# 🚀 원클릭 실행 가이드

## 🎯 **3가지 실행 방법**

### 방법 1: 쉘 스크립트 (macOS/Linux) ⭐ 추천
```bash
./start.sh
```

### 방법 2: 배치 파일 (Windows)
```cmd
start.bat
```

### 방법 3: npm 명령어 (크로스 플랫폼)
```bash
npm start
```

---

## 📋 **각 방법의 특징**

### 🟢 방법 1: `./start.sh` (macOS/Linux)
- ✅ MongoDB 자동 시작/확인
- ✅ 의존성 자동 설치
- ✅ 데이터베이스 자동 초기화
- ✅ 서버 상태 확인
- ✅ 한 터미널에서 모든 서버 관리
- ⏹️ Ctrl+C로 모든 서버 한 번에 종료

### 🟡 방법 2: `start.bat` (Windows)
- ✅ MongoDB 자동 시작 시도
- ✅ 의존성 자동 설치
- ✅ 데이터베이스 자동 초기화
- ✅ 브라우저 자동 열기
- 📱 각 서버가 별도 창에서 실행

### 🔵 방법 3: `npm start` (모든 OS)
- ✅ Backend/Frontend 동시 실행
- ✅ 컬러풀한 로그 출력
- ✅ 브라우저 자동 열기 (8초 후)
- ⚠️ MongoDB는 별도 시작 필요

---

## 🛠️ **초기 설정 (한 번만 실행)**

### MongoDB가 설치되지 않은 경우:

#### macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

#### Windows:
1. [MongoDB Community Server](https://www.mongodb.com/try/download/community) 다운로드 설치
2. 서비스로 시작하거나 `mongod` 명령어로 실행

### 의존성 설치:
```bash
npm run setup
```

### 테스트 데이터 생성:
```bash
npm run init-db
```

---

## 🚀 **즉시 실행하는 방법**

### ⚡ 가장 빠른 방법 (macOS):
```bash
cd /Users/songchibong/Documents/GitHub/Companion-animals
./start.sh
```

### ⚡ npm 방법:
```bash
cd /Users/songchibong/Documents/GitHub/Companion-animals
npm start
```

---

## 🌐 **접속 주소**

실행 후 8초 정도 기다린 다음:

- **🏠 메인 사이트**: http://localhost:3000
- **🛡️ 관리자 대시보드**: http://localhost:3000/admin
- **🔌 API 서버**: http://localhost:5001

---

## 🔐 **테스트 계정**

### 관리자
- **이메일**: admin@companionanimals.com
- **비밀번호**: admin123

### 반려동물 제공자
- **이메일**: provider@test.com
- **비밀번호**: provider123

### 입양 희망자  
- **이메일**: adopter@test.com
- **비밀번호**: adopter123

---

## 🛑 **서버 종료 방법**

### 방법 1 (`./start.sh`):
- **Ctrl+C** 한 번 누르면 모든 서버 종료

### 방법 2 (`start.bat`):
- 각 서버 창을 개별적으로 닫기

### 방법 3 (`npm start`):
- **Ctrl+C** 한 번 누르면 모든 서버 종료

---

## 🔧 **개별 서버 실행**

필요시 개별적으로 실행 가능:

```bash
# Backend만 실행
npm run backend

# Frontend만 실행  
npm run frontend

# 두 서버만 실행 (브라우저 자동열기 없음)
npm run dev
```

---

## 🚨 **문제 해결**

### MongoDB 연결 오류:
```bash
brew services restart mongodb/brew/mongodb-community
```

### 포트 이미 사용 중:
```bash
lsof -i :3000  # Frontend 포트 확인
lsof -i :5001  # Backend 포트 확인
kill -9 <PID>  # 해당 프로세스 종료
```

### 의존성 오류:
```bash
npm run setup  # 모든 의존성 재설치
```

### 권한 오류 (macOS/Linux):
```bash
chmod +x start.sh
```

---

## 💡 **개발 팁**

- **실시간 변경사항 반영**: 코드 수정 시 자동 새로고침
- **로그 확인**: 터미널에서 Backend/Frontend 로그 동시 확인
- **디버깅**: 각 서버의 로그를 색상으로 구분
- **브라우저 개발자 도구**: F12로 네트워크, 콘솔 확인

---

**🎉 이제 한 번의 명령어로 전체 애플리케이션을 실행할 수 있습니다!**