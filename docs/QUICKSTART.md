# 🤖 BayMax Face UI - Quick Start Guide

## Installation (Ubuntu)

### Step 1: Install Node.js (if not already installed)
```bash
sudo apt update
sudo apt install nodejs npm -y
node --version  # Should be v16 or higher
```

### Step 2: Navigate to project and install dependencies
```bash
cd baymax-face-ui
./scripts/setup.sh
```

Or manually:
```bash
npm install
```

### Step 3: Run the application
```bash
# Production mode (fullscreen)
npm start

# Development mode (with console)
npm run dev
```

**Press ESC to exit**

---

## Testing the Face

Once running, you'll see:
- A white circular face with two black oval eyes (BayMax style)
- Control panel at the bottom to test expressions
- Status indicator at top-right

### Available Expressions:
1. **Idle** - Default calm state with occasional blinking
2. **Happy** - Squinting eyes, friendly look
3. **Thinking** - Slight eye movement, processing
4. **Scanning** - Eyes moving side to side
5. **Talking** - Pulsing glow effect
6. **Surprised** - Wide eyes

---

## Screen Configuration (7-inch Display)

### For Raspberry Pi or embedded Linux:

1. Set display resolution:
```bash
# Edit boot config
sudo nano /boot/config.txt

# Add these lines:
hdmi_group=2
hdmi_mode=87
hdmi_cvt=1024 600 60 6 0 0 0
```

2. Auto-start on boot:
```bash
# Create desktop entry
mkdir -p ~/.config/autostart
nano ~/.config/autostart/baymax-face.desktop
```

Add:
```
[Desktop Entry]
Type=Application
Name=BayMax Face
Exec=/usr/bin/npm start --prefix /path/to/baymax-face-ui
```

---

## Next Steps

### 1. For ROS2 Integration:
- See `integrations/ros2-bridge.js` for example code
- Install: `npm install rclnodejs --break-system-packages`
- Uncomment and configure ROS2 topics

### 2. For LLM Integration:
- See `integrations/llm-integration.js` for example code
- Integrate with your speech recognition
- Connect to your LLM service
- Use IPC events to control face

### 3. Customize the face:
- Edit `src/index.html` to change colors, size, or animations
- Modify eye shapes and movements
- Add new expressions

---

## Troubleshooting

**Problem: "electron: command not found"**
```bash
npm install
```

**Problem: Screen is too small/large**
- Edit face size in `src/index.html` (search for `w-96 h-96`)
- Adjust to `w-80 h-80` (smaller) or `w-[500px] h-[500px]` (larger)

**Problem: Can't exit fullscreen**
- Press ESC key
- Or force quit: Ctrl+Alt+F2, then `pkill electron`

**Problem: Black screen**
```bash
npm run dev  # Run with console to see errors
```

---

## Development Tips

### Control via JavaScript Console:
```javascript
window.robotFace.setExpression('happy');
window.robotFace.setStatus('Custom status');
window.robotFace.blink();
```

### Hide control panel for production:
Comment out the control panel div in `src/index.html`

### Test different expressions timing:
```javascript
// Sequence example
window.robotFace.setExpression('thinking');
setTimeout(() => window.robotFace.setExpression('happy'), 2000);
setTimeout(() => window.robotFace.setExpression('idle'), 4000);
```

---

## Project Structure

```
baymax-face-ui/
├── src/
│   ├── main.js              # Electron app setup
│   ├── index.html           # Face UI (edit for design)
│   └── control.html         # Control panel
├── integrations/
│   ├── ros2-bridge.js       # ROS2 example (future)
│   └── llm-integration.js   # LLM example (future)
├── scripts/
│   ├── install.sh           # Full installation script
│   ├── setup.sh             # Quick setup script
│   └── check-system.sh      # System diagnostics
├── docs/
│   ├── INSTALLATION.md      # Detailed install guide
│   ├── QUICKSTART.md        # This file
│   └── COMMANDS.md          # Command reference
├── package.json             # Dependencies
├── LICENSE                  # MIT license
└── README.md                # Full documentation
```

---

## Support

For issues or questions about:
- **Electron**: https://www.electronjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **ROS2**: https://docs.ros.org/en/humble/
- **Your capstone project**: Good luck! 🎓

---

**Created for your friendly robot capstone project! 🤖💙**
