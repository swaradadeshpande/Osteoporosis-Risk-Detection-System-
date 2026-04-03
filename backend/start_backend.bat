@echo off
echo ============================================
echo  OsteoAI Backend Setup ^& Start
echo ============================================

cd /d "%~dp0"

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing backend dependencies...
pip install -r requirements.txt

echo.
echo ============================================
echo  Starting FastAPI backend on port 8000
echo ============================================
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
