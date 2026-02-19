# Manual Installation Guide for Ubuntu

This guide will help you install all necessary packages for the BayMax Face UI step by step.

## Prerequisites

- Ubuntu 20.04 or later (also works on Raspberry Pi OS)
- Internet connection
- Terminal access
- sudo privileges

---

## Option 1: Automatic Installation (Recommended)

Simply run the installation script:

```bash
cd baymax-face-ui
chmod +x install.sh
./install.sh
```

The script will automatically install everything you need.

---

## Option 2: Manual Installation

If you prefer to install packages manually, follow these steps:

### Step 1: Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### Step 2: Install Node.js and npm

Check if Node.js is installed:
```bash
node --version
npm --version
```

If not installed or version is below v16:

**Method A: From Ubuntu repository (easier but older version)**
```bash
sudo apt install -y nodejs npm
```

**Method B: Using NodeSource (recommended for latest version)**
```bash
# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### Step 3: Install Build Tools

These are required for compiling native modules:

```bash
sudo apt install -y build-essential
```

### Step 4: Install Electron System Dependencies

Electron requires several system libraries:

```bash
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
```

### Step 5: Install Electron via npm

Navigate to the project directory and install:

```bash
cd baymax-face-ui
npm install
```

This will install Electron and all dependencies listed in `package.json`.

### Step 6: Verify Installation

Check if everything is installed correctly:

```bash
# Check if node_modules exists
ls node_modules/electron

# List installed packages
npm list --depth=0
```

You should see:
```
baymax-face-ui@1.0.0 /path/to/baymax-face-ui
└── electron@28.0.0
```

---

## Testing the Installation

### Run in Development Mode

```bash
npm run dev
```

This will:
- Open the app in fullscreen
- Show developer console for debugging
- Allow you to press ESC to exit

### Run in Production Mode

```bash
npm start
```

This will:
- Open the app in fullscreen
- Hide developer tools
- Press ESC to exit

---

## Troubleshooting

### Problem: "node: command not found"

**Solution:**
```bash
sudo apt install nodejs npm
```

### Problem: "Permission denied" errors during npm install

**Solution 1 - Fix npm permissions (recommended):**
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**Solution 2 - Use sudo (not recommended):**
```bash
sudo npm install
```

### Problem: Electron fails to start

**Check missing libraries:**
```bash
ldd node_modules/electron/dist/electron | grep "not found"
```

**Install missing libraries:**
```bash
sudo apt install -y libgtk-3-0 libnss3 libasound2
```

### Problem: "gyp ERR! build error"

**Solution:**
```bash
sudo apt install -y build-essential python3
npm rebuild
```

### Problem: Display issues or black screen

**For systems without display server:**
```bash
# Install virtual framebuffer
sudo apt install xvfb

# Run with xvfb
xvfb-run npm start
```

### Problem: App crashes on Raspberry Pi

**Reduce memory usage:**
Edit `main.js` and add:
```javascript
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');
```

---

## For 7-inch Touchscreen Displays

### Configure Display Resolution

#### Raspberry Pi:
```bash
sudo nano /boot/config.txt
```

Add:
```
hdmi_group=2
hdmi_mode=87
hdmi_cvt=1024 600 60 6 0 0 0
```

Reboot:
```bash
sudo reboot
```

#### Standard Ubuntu:
```bash
xrandr  # List available displays
xrandr --output HDMI-1 --mode 1024x600  # Set resolution
```

### Auto-start on Boot

#### Method 1: Desktop Entry
```bash
mkdir -p ~/.config/autostart
nano ~/.config/autostart/baymax-face.desktop
```

Add:
```
[Desktop Entry]
Type=Application
Name=BayMax Face
Exec=/usr/bin/npm start --prefix /path/to/baymax-face-ui
X-GNOME-Autostart-enabled=true
```

#### Method 2: systemd Service
```bash
sudo nano /etc/systemd/system/baymax-face.service
```

Add:
```
[Unit]
Description=BayMax Face UI
After=graphical.target

[Service]
Type=simple
User=YOUR_USERNAME
WorkingDirectory=/path/to/baymax-face-ui
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=graphical.target
```

Enable and start:
```bash
sudo systemctl enable baymax-face.service
sudo systemctl start baymax-face.service
```

---

## Additional Packages for Future Features

### For ROS2 Integration:

```bash
# Install ROS2 (Humble for Ubuntu 22.04)
# Follow official ROS2 installation guide
# https://docs.ros.org/en/humble/Installation.html

# Install Node.js ROS2 bridge
npm install rclnodejs --break-system-packages
```

### For Audio/TTS (Text-to-Speech):

```bash
# Install audio libraries
sudo apt install -y alsa-utils pulseaudio

# Test audio
speaker-test -t wav -c 2
```

### For Camera/Vision:

```bash
# Install v4l-utils for camera
sudo apt install -y v4l-utils

# List cameras
v4l2-ctl --list-devices
```

---

## Package Summary

Here's what gets installed:

| Package | Purpose |
|---------|---------|
| nodejs | JavaScript runtime |
| npm | Package manager |
| electron | Desktop app framework |
| build-essential | Compiler tools |
| libgtk-3-0 | GUI toolkit |
| libnss3 | Network Security Services |
| libasound2 | Audio library |
| libxss1 | X11 Screen Saver extension |
| xvfb | Virtual framebuffer (headless) |

---

## Disk Space Requirements

- Node.js + npm: ~50 MB
- Electron + dependencies: ~200 MB
- Build tools: ~100 MB
- **Total: ~350 MB**

Make sure you have at least 500 MB free space.

---

## Next Steps

After installation:

1. ✅ Test the app: `npm start`
2. ✅ Read README.md for full documentation
3. ✅ Check QUICKSTART.md for usage examples
4. ✅ Explore ros2-bridge.js for ROS2 integration
5. ✅ Review llm-integration.js for LLM integration

---

## Getting Help

If you encounter issues:

1. Check the error message carefully
2. Search for the error on Stack Overflow
3. Check Electron documentation: https://www.electronjs.org/docs
4. Verify all dependencies are installed: `npm list`

---

**Installation complete! You're ready to build your friendly robot face! 🤖💙**
