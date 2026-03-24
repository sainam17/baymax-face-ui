# BayMax Robot Face UI

A BayMax-inspired robot face interface built with **Electron** and **FastAPI** for a 7-inch display. Optimized for Raspberry Pi 5.

---

## 🌟 Features

- **BayMax Design**: Minimalist white face with expressive oval eyes.
- **Multiple Expressions**: Idle, Happy, Thinking, Scanning, Talking.
- **Background API**: FastAPI service on **Port 7000** for remote control.
- **Autostart**: Automated scripts to launch the face on boot.
- **Fullscreen**: Clean, borderless UI for embedded displays.

---

## 📖 Documentation & Tutorial

Looking for a step-by-step guide? Check out the **[Quick Start & Tutorial](docs/QUICKSTART.md)**.

Other documents:
- **[Installation Guide](docs/INSTALLATION.md)**: Manual setup and systemd details.
- **[Design Spec](docs/Design.md)**: API endpoints and emotion mapping.
- **[Progress Log](docs/progress.md)**: Development history and sprint status.

---

## 🛠 Quick Installation

```bash
cd baymax-face-ui
chmod +x scripts/setup_autostart.sh
sudo ./scripts/setup_autostart.sh
```

---

## 📂 Project Structure

```
baymax-face-ui/
├── src/
│   ├── index.html           # Face UI (HTML/CSS)
│   ├── main.js              # Electron Main Process
│   └── pi5_face_service.py  # Backend API (Port 7000)
├── scripts/
│   ├── setup_autostart.sh   # Autostart configuration
│   ├── set_face.js          # IPC helper
│   ├── install.sh           # Main installer
│   └── setup.sh             # Dependency installer
├── docs/
│   ├── QUICKSTART.md        # <-- RECOMMENDED TUTORIAL
│   ├── INSTALLATION.md      # Full setup guide
│   ├── Design.md            # Hardware/API spec
│   └── progress.md          # Development log
├── .gitignore
├── LICENSE
├── package.json
└── README.md                # This file
```

---

## 🚀 Usage

### To start manually:
1. **Frontend**: `npm start`
2. **Backend**: `uvicorn src.pi5_face_service:app --host 0.0.0.0 --port 7000`

### To test expressions:
```bash
curl -X POST http://localhost:7000/face_emotion -H "Content-Type: application/json" -d '{"emotion": 2}'
```

---

## ⚖️ License
MIT License - feel free to use in your capstone project! 🤖💙
