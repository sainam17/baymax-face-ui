#!/bin/bash

# BayMax Face UI - System Check Script
# This script checks if all required dependencies are installed

echo "=========================================="
echo "  BayMax Face UI - System Diagnostics"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# Function to check command
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        if [ ! -z "$2" ]; then
            VERSION=$($1 $2 2>&1 | head -1)
            echo "  Version: $VERSION"
        fi
        return 0
    else
        echo -e "${RED}✗${NC} $1 is NOT installed"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# Function to check library
check_library() {
    if ldconfig -p | grep -q $1; then
        echo -e "${GREEN}✓${NC} $1 library found"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} $1 library not found (may cause issues)"
        WARNINGS=$((WARNINGS + 1))
        return 1
    fi
}

# Function to check file/directory
check_path() {
    if [ -e "$1" ]; then
        echo -e "${GREEN}✓${NC} $2 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $2 not found"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

echo "1. Checking Core Dependencies..."
echo "-----------------------------------"
check_command node "--version"
check_command npm "--version"
check_command python3 "--version"
echo ""

echo "2. Checking Build Tools..."
echo "-----------------------------------"
check_command gcc "--version"
check_command g++ "--version"
check_command make "--version"
echo ""

echo "3. Checking Project Files..."
echo "-----------------------------------"
check_path "package.json" "package.json"
check_path "src/main.js" "src/main.js"
check_path "src/index.html" "src/index.html"
echo ""

echo "4. Checking npm Packages..."
echo "-----------------------------------"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules directory exists"
    
    if [ -d "node_modules/electron" ]; then
        echo -e "${GREEN}✓${NC} Electron is installed"
        ELECTRON_VER=$(npm list electron --depth=0 2>/dev/null | grep electron | awk '{print $2}')
        echo "  Version: $ELECTRON_VER"
    else
        echo -e "${RED}✗${NC} Electron is NOT installed"
        echo "  Run: npm install"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}✗${NC} node_modules directory not found"
    echo "  Run: npm install"
    ERRORS=$((ERRORS + 1))
fi
echo ""

echo "5. Checking System Libraries..."
echo "-----------------------------------"
check_library "libgtk-3"
check_library "libnss3"
check_library "libasound"
check_library "libgbm"
check_library "libX11"
echo ""

echo "6. Checking Display Server..."
echo "-----------------------------------"
if [ ! -z "$DISPLAY" ]; then
    echo -e "${GREEN}✓${NC} DISPLAY environment variable set: $DISPLAY"
else
    echo -e "${YELLOW}⚠${NC} DISPLAY not set (may need xvfb for headless)"
    WARNINGS=$((WARNINGS + 1))
fi

if command -v xrandr &> /dev/null; then
    echo -e "${GREEN}✓${NC} xrandr available"
    RESOLUTION=$(xrandr 2>/dev/null | grep '*' | awk '{print $1}' | head -1)
    if [ ! -z "$RESOLUTION" ]; then
        echo "  Current resolution: $RESOLUTION"
    fi
else
    echo -e "${YELLOW}⚠${NC} xrandr not available"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

echo "7. Checking Permissions..."
echo "-----------------------------------"
if [ -w "." ]; then
    echo -e "${GREEN}✓${NC} Write permission in current directory"
else
    echo -e "${RED}✗${NC} No write permission in current directory"
    ERRORS=$((ERRORS + 1))
fi
echo ""

echo "8. Checking Disk Space..."
echo "-----------------------------------"
AVAILABLE=$(df -h . | tail -1 | awk '{print $4}')
echo "  Available space: $AVAILABLE"

# Check if less than 500MB
AVAILABLE_MB=$(df -m . | tail -1 | awk '{print $4}')
if [ $AVAILABLE_MB -lt 500 ]; then
    echo -e "${YELLOW}⚠${NC} Low disk space (less than 500MB)"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✓${NC} Sufficient disk space"
fi
echo ""

echo "=========================================="
echo "             Diagnostic Summary"
echo "=========================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Your system is ready to run BayMax Face UI"
    echo "Run: npm start"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
    echo ""
    echo "System should work but may have minor issues"
    echo "Run: npm start"
else
    echo -e "${RED}✗ $ERRORS error(s) and $WARNINGS warning(s) found${NC}"
    echo ""
    echo "Please fix the errors above before running"
    echo ""
    echo "Quick fixes:"
    echo "  • Install Node.js: sudo apt install nodejs npm"
    echo "  • Install dependencies: npm install"
    echo "  • Install build tools: sudo apt install build-essential"
    echo "  • Install system libs: sudo apt install libgtk-3-0 libnss3 libasound2"
    echo ""
    echo "For detailed help, see INSTALLATION.md"
fi

echo ""
exit $ERRORS
