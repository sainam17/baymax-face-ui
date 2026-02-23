#!/bin/bash

# BayMax Face UI - Complete Installation Script for Ubuntu
# Run this script on your Ubuntu machine

set -e  # Exit on error

echo "========================================"
echo "  BayMax Face UI - Installation Script"
echo "========================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Step 1: Check if running on Ubuntu/Debian
echo "Step 1: Checking system..."
if [ -f /etc/os-release ]; then
    . /etc/os-release
    print_status "OS detected: $NAME $VERSION"
else
    print_warning "Could not detect OS, continuing anyway..."
fi
echo ""

# Step 2: Update package list
echo "Step 2: Updating package list..."
sudo apt update
print_status "Package list updated"
echo ""

# Step 3: Check and install Node.js
echo "Step 3: Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js is already installed: $NODE_VERSION"
    
    # Check if version is adequate (v16+)
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -lt 16 ]; then
        print_warning "Node.js version is too old. Installing newer version..."
        sudo apt install -y nodejs npm
    fi
else
    print_warning "Node.js not found. Installing..."
    sudo apt install -y nodejs npm
    print_status "Node.js installed: $(node --version)"
fi
echo ""

# Step 4: Check and install npm
echo "Step 4: Checking npm installation..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_status "npm is installed: $NPM_VERSION"
else
    print_error "npm not found. Please install npm manually."
    exit 1
fi
echo ""

# Step 5: Install build essentials (needed for some electron dependencies)
echo "Step 5: Installing build essentials..."
sudo apt install -y build-essential
print_status "Build essentials installed"
echo ""

# Step 6: Install additional dependencies for Electron
echo "Step 6: Installing Electron dependencies..."
sudo apt install -y \
    libgtk-3-0 \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xauth \
    xvfb \
    libgbm1 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libdrm2
print_status "Electron system dependencies installed"
echo ""

# Step 7: Install Electron
echo "Step 7: Installing Electron..."
npm install
if [ $? -eq 0 ]; then
    print_status "Electron and dependencies installed successfully!"
else
    print_error "Failed to install Electron. Check your internet connection."
    exit 1
fi
echo ""

# Step 8: Verify installation
echo "Step 8: Verifying installation..."
if [ -d "node_modules/electron" ]; then
    print_status "Electron is installed in node_modules"
    ELECTRON_VERSION=$(npm list electron --depth=0 | grep electron | awk '{print $2}')
    print_status "Electron version: $ELECTRON_VERSION"
else
    print_error "Electron installation verification failed"
    exit 1
fi
echo ""

# Step 9: Set up desktop entry (optional)
echo "Step 9: Would you like to create a desktop launcher? (y/n)"
read -r CREATE_LAUNCHER

if [[ "$CREATE_LAUNCHER" =~ ^[Yy]$ ]]; then
    DESKTOP_FILE="$HOME/.local/share/applications/baymax-face.desktop"
    CURRENT_DIR=$(pwd)
    
    mkdir -p "$HOME/.local/share/applications"
    
    cat > "$DESKTOP_FILE" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=BayMax Face UI
Comment=Robot Face Interface
Exec=/usr/bin/npm start --prefix $CURRENT_DIR
Icon=$CURRENT_DIR/icon.png
Terminal=false
Categories=Application;
EOF
    
    chmod +x "$DESKTOP_FILE"
    print_status "Desktop launcher created at $DESKTOP_FILE"
fi
echo ""

# Step 10: Display summary
echo "========================================"
echo "         Installation Complete!        "
echo "========================================"
echo ""
echo "Installed components:"
echo "  • Node.js: $(node --version)"
echo "  • npm: $(npm --version)"
echo "  • Electron: $ELECTRON_VERSION"
echo ""
echo "To run the application:"
echo "  ${GREEN}npm start${NC}          - Production mode (fullscreen)"
echo "  ${GREEN}npm run dev${NC}        - Development mode (with console)"
echo ""
echo "Press ${YELLOW}ESC${NC} to exit the application"
echo ""
echo "Documentation:"
echo "  • README.md - Full documentation"
echo "  • QUICKSTART.md - Quick start guide"
echo "  • ros2-bridge.js - ROS2 integration example"
echo "  • llm-integration.js - LLM integration example"
echo ""
print_status "Ready to launch! Run 'npm start' to begin."
echo ""
