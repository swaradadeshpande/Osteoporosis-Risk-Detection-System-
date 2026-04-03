@echo off
echo ============================================
echo  OsteoAI Frontend Setup ^& Start
echo ============================================

cd /d "%~dp0"

echo Installing frontend dependencies...
npm install

echo.
echo ============================================
echo  Starting React frontend on port 3000
echo ============================================
npm run dev
pause
