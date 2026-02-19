#!/bin/bash

echo "=================================="
echo "BayMax Face UI Setup Script"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js first:"
    echo "  sudo apt update"
    echo "  sudo apt install nodejs npm -y"
    echo ""
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "To run the application:"
    echo "  npm start          (Production mode - fullscreen)"
    echo "  npm run dev        (Development mode - with logging)"
    echo ""
    echo "Press ESC to exit the application"
    echo ""
else
    echo ""
    echo "❌ Installation failed!"
    echo "Please check the error messages above"
    exit 1
fi
