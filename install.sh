#!/bin/bash

echo "╔═══════════════════════════════════════╗"
echo "║   🚗 Ride Flex Installation Script   ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..
echo ""

echo "╔═══════════════════════════════════════╗"
echo "║   ✅ Installation Complete!           ║"
echo "╚═══════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "1. Make sure MongoDB is running"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start frontend: cd frontend && npm run dev"
echo ""
echo "For detailed instructions, see SETUP.md"
