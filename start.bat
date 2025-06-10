@echo off
REM Book Collection Manager - Windows Startup Script
REM Starts both Rails backend and React frontend

echo 🚀 Starting Book Collection Manager...
echo.

REM Check if we're in the right directory
if not exist "wishlist_backend" (
    echo ❌ Error: Please run this script from the ruby-app root directory
    echo    Expected structure:
    echo    ruby-app/
    echo    ├── wishlist_backend/
    echo    ├── wishlist_frontend/
    echo    └── start.bat
    pause
    exit /b 1
)

if not exist "wishlist_frontend" (
    echo ❌ Error: Please run this script from the ruby-app root directory
    echo    Expected structure:
    echo    ruby-app/
    echo    ├── wishlist_backend/
    echo    ├── wishlist_frontend/
    echo    └── start.bat
    pause
    exit /b 1
)

echo 🔍 Checking prerequisites...

REM Check Ruby
ruby --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Ruby not found. Please install Ruby 3.4+
    pause
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed
echo.

echo 🔧 Starting Rails backend (port 3001)...
cd wishlist_backend

REM Check if Gemfile.lock exists (dependencies installed)
if not exist "Gemfile.lock" (
    echo 📦 Installing backend dependencies...
    call bundle install
)

REM Setup database if needed
echo 🗄️  Setting up database...
call rails db:create db:migrate db:seed >nul 2>&1

REM Start Rails server in new window
start "Rails Backend" cmd /k "rails server -p 3001"

echo ✅ Rails backend starting in new window
cd..

echo 🎨 Starting React frontend (port 5173)...
cd wishlist_frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    call npm install
)

REM Start React dev server in new window  
start "React Frontend" cmd /k "npm run dev"

echo ✅ React frontend starting in new window
cd..

echo.
echo 🎉 Book Collection Manager is starting!
echo.
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:3001
echo.
echo 👤 Demo Account:
echo    Email:    demo@example.com
echo    Password: password123
echo.
echo ℹ️  Both servers are running in separate windows
echo    Close the terminal windows to stop the servers
echo.
pause