@echo off
echo ╔═══════════════════════════════════════╗
echo ║   🚗 Ride Flex Installation Script   ║
echo ╚═══════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install backend dependencies
    exit /b 1
)
echo ✅ Backend dependencies installed successfully
cd ..
echo.

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install frontend dependencies
    exit /b 1
)
echo ✅ Frontend dependencies installed successfully
cd ..
echo.

echo ╔═══════════════════════════════════════╗
echo ║   ✅ Installation Complete!           ║
echo ╚═══════════════════════════════════════╝
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Start backend: cd backend ^&^& npm run dev
echo 3. Start frontend: cd frontend ^&^& npm run dev
echo.
echo For detailed instructions, see SETUP.md
pause
