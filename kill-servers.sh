#!/bin/bash

# 🛑 Companion Animals - 서버 종료 스크립트
# 실행 중인 모든 서버를 안전하게 종료합니다

echo "🛑 Companion Animals 서버들을 종료하는 중..."
echo "======================================="

# Next.js 서버 종료
echo "📱 Frontend 서버 종료 중..."
pkill -f "next" && echo "✅ Next.js 서버 종료됨" || echo "ℹ️  Next.js 서버가 실행 중이 아님"

# Nodemon 종료
echo "🔧 Nodemon 서버 종료 중..."
pkill -f "nodemon" && echo "✅ Nodemon 서버 종료됨" || echo "ℹ️  Nodemon 서버가 실행 중이 아님"

# Express 서버 종료
echo "⚙️  Backend 서버 종료 중..."
pkill -f "server.js" && echo "✅ Backend 서버 종료됨" || echo "ℹ️  Backend 서버가 실행 중이 아님"

# Node.js 프로세스 정리
echo "🧹 Node.js 프로세스 정리 중..."
pkill -f "node.*companion" 2>/dev/null

# 포트 5000-5002 사용 프로세스 확인 및 종료
echo "🔍 포트 사용 프로세스 확인 중..."
for port in 3000 5000 5001 5002; do
    PID=$(lsof -ti :$port 2>/dev/null)
    if [ ! -z "$PID" ]; then
        echo "⚠️  포트 $port 사용 중인 프로세스 종료: $PID"
        kill -9 $PID 2>/dev/null
    fi
done

# 종료 확인
sleep 2
echo ""
echo "🔍 실행 중인 서버 확인..."
RUNNING=$(ps aux | grep -E "next|nodemon|server.js" | grep -v grep | wc -l)

if [ "$RUNNING" -eq 0 ]; then
    echo "✅ 모든 서버가 성공적으로 종료되었습니다!"
else
    echo "⚠️  일부 프로세스가 여전히 실행 중일 수 있습니다:"
    ps aux | grep -E "next|nodemon|server.js" | grep -v grep
fi

echo ""
echo "🚀 새로 시작하려면: ./start.sh"
echo "======================================="