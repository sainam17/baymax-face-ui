# BayMax Face UI - Command Reference Card

Quick reference for all installation and usage commands.

## 📦 Installation Commands

### Check System Requirements
```bash
./check-system.sh
```

### Automatic Installation
```bash
./install.sh
```

### Manual Installation - Node.js
```bash
# Check if installed
node --version
npm --version

# Install from Ubuntu repo
sudo apt update
sudo apt install -y nodejs npm

# Install latest LTS (recommended)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Manual Installation - Dependencies
```bash
# Build tools
sudo apt install -y build-essential

# Electron system libraries
sudo apt install -y libgtk-3-0 libnotify-dev libgconf-2-4 libnss3 \
    libxss1 libasound2 libxtst6 xauth xvfb libgbm1 libx11-xcb1 \
    libxcb-dri3-0 libdrm2

# Install npm packages
npm install
```

---

## 🚀 Running the App

### Production Mode (Fullscreen)
```bash
npm start
```

### Development Mode (with DevTools)
```bash
npm run dev
```

### Exit the App
- Press `ESC` key
- Or: `Ctrl+C` in terminal

---

## 🔧 Testing & Debugging

### Check Installation
```bash
npm list --depth=0
```

### Verify Electron
```bash
ls node_modules/electron
./node_modules/.bin/electron --version
```

### Run with Verbose Logging
```bash
npm start --verbose
```

### Test in Virtual Display (Headless)
```bash
xvfb-run npm start
```

---

## 🎨 Controlling the Face (JavaScript Console)

Open DevTools (`npm run dev`) and use console:

```javascript
// Change expressions
window.robotFace.setExpression('idle');
window.robotFace.setExpression('happy');
window.robotFace.setExpression('thinking');
window.robotFace.setExpression('scanning');
window.robotFace.setExpression('talking');
window.robotFace.setExpression('surprised');

// Manual blink
window.robotFace.blink();

// Update status
window.robotFace.setStatus('Custom message');
```

---

## 🖥️ Display Configuration

### Check Current Resolution
```bash
xrandr
```

### Set Resolution for 7-inch (1024x600)
```bash
xrandr --output HDMI-1 --mode 1024x600
```

### Raspberry Pi - Edit Boot Config
```bash
sudo nano /boot/config.txt

# Add these lines:
hdmi_group=2
hdmi_mode=87
hdmi_cvt=1024 600 60 6 0 0 0

# Save and reboot
sudo reboot
```

---

## 🤖 Auto-start on Boot

### Method 1: Desktop Entry
```bash
mkdir -p ~/.config/autostart
nano ~/.config/autostart/baymax-face.desktop
```

Add:
```
[Desktop Entry]
Type=Application
Name=BayMax Face
Exec=/usr/bin/npm start --prefix /full/path/to/baymax-face-ui
X-GNOME-Autostart-enabled=true
```

### Method 2: systemd Service
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

Enable:
```bash
sudo systemctl enable baymax-face.service
sudo systemctl start baymax-face.service
```

---

## 🔌 ROS2 Integration (Future)

### Install ROS2 Node.js Bridge
```bash
npm install rclnodejs --break-system-packages
```

### Test ROS2 Topic
```bash
# Publish expression change
ros2 topic pub /robot/face/expression std_msgs/msg/String "data: 'happy'"

# Publish status update
ros2 topic pub /robot/face/status std_msgs/msg/String "data: 'Navigating...'"
```

---

## 🧠 LLM Integration (Future)

### Send IPC Events from Renderer
```javascript
const { ipcRenderer } = require('electron');

// Listening state
ipcRenderer.send('llm-listening');

// Processing state
ipcRenderer.send('llm-processing');

// Speaking state
ipcRenderer.send('llm-speaking-start');
ipcRenderer.send('llm-speaking-end');

// Error state
ipcRenderer.send('llm-error', { message: 'Error details' });

// Return to idle
ipcRenderer.send('llm-idle');
```

---

## 🛠️ Troubleshooting Commands

### Fix npm Permissions
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Clear npm Cache
```bash
npm cache clean --force
```

### Reinstall Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Check Missing Libraries
```bash
ldd node_modules/electron/dist/electron | grep "not found"
```

### Kill Electron Process
```bash
pkill electron
```

---

## 📁 Project Files

| File | Purpose |
|------|---------|
| `main.js` | Electron main process |
| `index.html` | UI and animations |
| `package.json` | Dependencies |
| `install.sh` | Auto-install script |
| `check-system.sh` | System diagnostics |
| `ros2-bridge.js` | ROS2 integration template |
| `llm-integration.js` | LLM integration template |
| `README.md` | Full documentation |
| `INSTALLATION.md` | Detailed install guide |
| `QUICKSTART.md` | Quick start guide |

---

## 📊 System Requirements

- **OS**: Ubuntu 20.04+ or Raspberry Pi OS
- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher
- **RAM**: 512 MB minimum (1 GB recommended)
- **Disk**: 500 MB free space
- **Display**: 7-inch (1024x600) or any resolution

---

## 🎯 Quick Start Checklist

- [ ] Install Node.js and npm
- [ ] Install system dependencies
- [ ] Run `npm install`
- [ ] Test with `npm start`
- [ ] Customize expressions in `index.html`
- [ ] Set up auto-start (optional)
- [ ] Integrate with ROS2 (optional)
- [ ] Integrate with LLM (optional)

---

## 📞 Getting Help

**Documentation:**
- README.md - Complete guide
- INSTALLATION.md - Detailed installation
- QUICKSTART.md - Quick reference

**Online Resources:**
- Electron Docs: https://www.electronjs.org/docs
- Node.js Docs: https://nodejs.org/docs
- ROS2 Docs: https://docs.ros.org

**Commands to Share When Asking for Help:**
```bash
node --version
npm --version
npm list --depth=0
./check-system.sh
```

---

**Save this file for quick reference! 📌**
