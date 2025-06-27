@echo off
chcp 65001 >nul
cls

echo 🐾 Companion Animals - 원클릭 실행 스크립트
echo ======================================

REM 현재 디렉토리를 프로젝트 디렉토리로 설정
set PROJECT_DIR=%~dp0
echo 📁 프로젝트 디렉토리: %PROJECT_DIR%

REM MongoDB 서비스 시작
echo.
echo 🗄️  MongoDB 시작 중...
net start MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MongoDB 시작 완료
) else (
    echo ⚠️  MongoDB가 이미 실행 중이거나 수동으로 시작해주세요
)

REM 잠시 대기
timeout /t 3 /nobreak >nul

REM Backend 의존성 확인
echo.
echo 📦 Backend 의존성 확인 중...
cd /d "%PROJECT_DIR%backend"
if not exist "node_modules" (
    echo 🔄 Backend 의존성 설치 중...
    npm install
)

REM Frontend 의존성 확인
echo.
echo 📦 Frontend 의존성 확인 중...
cd /d "%PROJECT_DIR%frontend"
if not exist "node_modules" (
    echo 🔄 Frontend 의존성 설치 중...
    npm install
)

REM 데이터베이스 초기화
echo.
echo 🗄️  데이터베이스 초기화...
cd /d "%PROJECT_DIR%backend"
npm run init-db

REM 서버 시작 안내
echo.
echo 🚀 서버들을 시작합니다...
echo ======================================
echo 📍 Backend: http://localhost:5001
echo 📍 Frontend: http://localhost:3000
echo 📍 Admin: http://localhost:3000/admin
echo ======================================
echo.
echo 🔐 테스트 계정:
echo    관리자: admin@companionanimals.com / admin123
echo    제공자: provider@test.com / provider123
echo    입양자: adopter@test.com / adopter123
echo.
echo ⏹️  종료하려면 이 창을 닫으세요
echo.

REM Backend 서버 시작 (새 창에서)
echo 🔥 Backend 서버 시작...
start "Companion Animals - Backend" cmd /k "cd /d %PROJECT_DIR%backend && npm start"

REM 잠시 대기
timeout /t 3 /nobreak >nul

REM Frontend 서버 시작 (새 창에서)
echo 🔥 Frontend 서버 시작...
start "Companion Animals - Frontend" cmd /k "cd /d %PROJECT_DIR%frontend && npm run dev"

REM 브라우저 자동 열기 (5초 후)
timeout /t 5 /nobreak >nul
echo.
echo 🌐 브라우저를 여는 중...
start http://localhost:3000

echo.
echo 🎉 모든 서버가 실행되었습니다!
echo 📱 브라우저에서 http://localhost:3000 을 확인하세요
echo.
echo 💡 팁: 서버 창들을 닫으면 해당 서버가 종료됩니다
echo.
pause