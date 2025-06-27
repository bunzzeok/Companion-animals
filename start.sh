#!/bin/bash

# 🐾 Companion Animals - 원클릭 실행 스크립트
# 모든 서버를 한 번에 시작합니다

echo "🚀 Companion Animals 시작 중..."
echo "======================================"

# 현재 디렉토리 확인
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "📁 프로젝트 디렉토리: $PROJECT_DIR"

# MongoDB 서비스 시작 확인
echo ""
echo "🗄️  MongoDB 상태 확인 중..."
if brew services list | grep -q "mongodb-community.*started"; then
    echo "✅ MongoDB가 이미 실행 중입니다"
else
    echo "🔄 MongoDB 시작 중..."
    brew services start mongodb/brew/mongodb-community
    echo "✅ MongoDB 시작 완료"
fi

# MongoDB 연결 대기
echo "⏳ MongoDB 연결 대기 중..."
sleep 3

# Backend 의존성 확인 및 설치
echo ""
echo "📦 Backend 의존성 확인 중..."
cd "$PROJECT_DIR/backend"
if [ ! -d "node_modules" ]; then
    echo "🔄 Backend 의존성 설치 중..."
    npm install
fi

# Frontend 의존성 확인 및 설치
echo ""
echo "📦 Frontend 의존성 확인 중..."
cd "$PROJECT_DIR/frontend"
if [ ! -d "node_modules" ]; then
    echo "🔄 Frontend 의존성 설치 중..."
    npm install
fi

# 데이터베이스 초기화 (처음 실행 시만)
echo ""
echo "🗄️  데이터베이스 초기화 확인 중..."
cd "$PROJECT_DIR/backend"

# MongoDB에 데이터가 있는지 확인
if mongosh --quiet --eval "db.users.countDocuments()" companion-animals 2>/dev/null | grep -q "^0$"; then
    echo "🔄 테스트 데이터 생성 중..."
    npm run init-db
    echo "✅ 테스트 데이터 생성 완료"
else
    echo "✅ 데이터베이스에 데이터가 이미 있습니다"
fi

# 서버 시작
echo ""
echo "🚀 서버들을 시작합니다..."
echo "======================================"
echo "📍 Backend: http://localhost:5001"
echo "📍 Frontend: http://localhost:3000"
echo "📍 Admin: http://localhost:3000/admin"
echo "======================================"
echo ""
echo "🔐 테스트 계정:"
echo "   관리자: admin@companionanimals.com / admin123"
echo "   제공자: provider@test.com / provider123"
echo "   입양자: adopter@test.com / adopter123"
echo ""
echo "⏹️  종료하려면 Ctrl+C를 누르세요"
echo ""

# 병렬로 서버 실행
cd "$PROJECT_DIR"

# Backend 서버 실행 (백그라운드)
echo "🔥 Backend 서버 시작..."
cd "$PROJECT_DIR/backend"
npm start &
BACKEND_PID=$!

# 잠시 대기
sleep 3

# Frontend 서버 실행
echo "🔥 Frontend 서버 시작..."
cd "$PROJECT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

# 종료 시그널 처리
cleanup() {
    echo ""
    echo "🛑 서버들을 종료하는 중..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ 모든 서버가 종료되었습니다"
    exit 0
}

# Ctrl+C 처리
trap cleanup SIGINT SIGTERM

# 서버 실행 상태 확인
sleep 5
echo ""
echo "🔍 서버 상태 확인 중..."

# Backend 상태 확인
if curl -s http://localhost:5001 >/dev/null 2>&1; then
    echo "✅ Backend 서버 실행 중 (http://localhost:5001)"
else
    echo "⚠️  Backend 서버 확인 중..."
fi

# Frontend 상태 확인
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Frontend 서버 실행 중 (http://localhost:3000)"
else
    echo "⚠️  Frontend 서버 확인 중..."
fi

echo ""
echo "🎉 모든 서버가 실행되었습니다!"
echo "🌐 브라우저에서 http://localhost:3000 을 열어보세요"

# 무한 대기 (서버들이 계속 실행되도록)
wait