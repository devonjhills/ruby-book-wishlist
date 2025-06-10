#!/bin/bash

# Book Collection Manager - Startup Script
# Starts both Rails backend and React frontend

echo "🚀 Starting Book Collection Manager..."
echo ""

# Check if we're in the right directory
if [ ! -d "wishlist_backend" ] || [ ! -d "wishlist_frontend" ]; then
    echo "❌ Error: Please run this script from the ruby-app root directory"
    echo "   Expected structure:"
    echo "   ruby-app/"
    echo "   ├── wishlist_backend/"
    echo "   ├── wishlist_frontend/"
    echo "   └── start.sh"
    exit 1
fi

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check Ruby
if ! command -v ruby &> /dev/null; then
    echo "❌ Ruby not found. Please install Ruby 3.4+"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL not found. Please install PostgreSQL 14+"
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready &> /dev/null; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first:"
    echo "   macOS: brew services start postgresql@14"
    echo "   Linux: sudo systemctl start postgresql"
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Function to kill background processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ Shutdown complete"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start backend
echo "🔧 Starting Rails backend (port 3001)..."
cd wishlist_backend

# Kill any existing Rails processes and clean up PID files
echo "🧹 Cleaning up any existing Rails processes..."
if [ -f "tmp/pids/server.pid" ]; then
    OLD_PID=$(cat tmp/pids/server.pid)
    if kill -0 $OLD_PID 2>/dev/null; then
        echo "   Killing existing Rails process (PID: $OLD_PID)"
        kill $OLD_PID 2>/dev/null
        sleep 2
        # Force kill if still running
        if kill -0 $OLD_PID 2>/dev/null; then
            kill -9 $OLD_PID 2>/dev/null
        fi
    fi
    rm -f tmp/pids/server.pid
fi

# Kill any processes listening on port 3001
if lsof -ti:3001 > /dev/null 2>&1; then
    echo "   Killing processes on port 3001"
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
fi

# Check if dependencies are installed
if [ ! -d "vendor/bundle" ] && [ ! -f "Gemfile.lock" ]; then
    echo "📦 Installing backend dependencies..."
    bundle install
fi

# Setup database if needed
if ! rails runner "ActiveRecord::Base.connection" &> /dev/null; then
    echo "🗄️  Setting up database..."
    rails db:create db:migrate db:seed
else
    echo "🔄 Running any pending migrations..."
    rails db:migrate
fi

# Start Rails server in background
rails server -p 3001 > ../backend.log 2>&1 &
BACKEND_PID=$!

# Wait a moment for Rails to start
sleep 3

# Check if Rails started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Failed to start Rails backend"
    echo "Check backend.log for details"
    exit 1
fi

echo "✅ Rails backend started (PID: $BACKEND_PID)"
cd ..

# Start frontend
echo "🎨 Starting React frontend (port 5173)..."
cd wishlist_frontend

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start React dev server in background
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait a moment for React to start
sleep 3

# Check if React started successfully
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "❌ Failed to start React frontend"
    echo "Check frontend.log for details"
    cleanup
fi

echo "✅ React frontend started (PID: $FRONTEND_PID)"
cd ..

echo ""
echo "🎉 Book Collection Manager is running!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:3001"
echo ""
echo "👤 Demo Account:"
echo "   Email:    demo@example.com"
echo "   Password: password123"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop the servers
wait $BACKEND_PID $FRONTEND_PID