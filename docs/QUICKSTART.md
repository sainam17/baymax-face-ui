# 🤖 BayMax Face UI — Quick Start & Tutorial

This guide will help you get the BayMax face up and running on your Raspberry Pi 5 in minutes.

---

## 🛠 Prerequisites
- **OS**: Raspberry Pi OS (64-bit) or Ubuntu.
- **Node.js**: v20 or higher.
- **Python**: 3.10 or higher.

---

## 🚀 1. Fast Setup (The "One-Click" Way)

If you just want everything to work, run the automated setup:

```bash
cd baymax-face-ui
chmod +x scripts/setup_autostart.sh
sudo ./scripts/setup_autostart.sh
```

**What this does:**
1. Sets up the **Backend** (port 7000) to start automatically in the background.
2. Sets up the **Frontend** (Face UI) to "pop up" automatically when you log in.

---

## 💻 2. Manual Start (For Development)

If you are editing code and want to run things manually:

### Part A: Start the Face UI
```bash
cd baymax-face-ui
npm start
```
*   **Keyboard Shortcut**: Press `ESC` at any time to quit the app.
*   **Note**: The app starts a bridge on `127.0.0.1:8768` to talk to the backend.

### Part B: Start the Emotion API
Open a **new terminal**:
```bash
cd baymax-face-ui
source venv/bin/activate
uvicorn src.pi5_face_service:app --host 0.0.0.0 --port 7000
```

---

## 🧪 3. Tutorial: How to control the face

Once both parts are running, you can change BayMax's expression using a simple command from **any** computer on your network (or the Pi itself).

### Change Expression (curl)
Open a terminal and run one of these:

```bash
# Happy BayMax
curl -X POST http://localhost:7000/face_emotion -H "Content-Type: application/json" -d '{"emotion": 2}'

# Talking BayMax
curl -X POST http://localhost:7000/face_emotion -H "Content-Type: application/json" -d '{"emotion": 3}'

# Thinking BayMax
curl -X POST http://localhost:7000/face_emotion -H "Content-Type: application/json" -d '{"emotion": 4}'
```

### Emotion Code Reference
| Code | Expression | Description |
|:---:|:---:|---|
| `0` | **Idle** | Default calm state |
| `1` | **Scanning** | Eyes moving left-right |
| `2` | **Happy** | Friendly squinting eyes |
| `3` | **Talking** | Animated mouth (for speaking) |
| `4` | **Thinking** | Loading/Processing look |

---

## 📂 Project Summary
- `src/index.html`: The actual face design (HTML/CSS).
- `src/pi5_face_service.py`: The Python API (Port 7000).
- `src/main.js`: The Electron engine.
- `docs/INSTALLATION.md`: Full technical details.

---

## ❓ Frequently Asked Questions

**Q: Can I still edit code while it's running?**  
Yes! The autostart runs in the background. You can open `VS Code` or another terminal and edit `src/index.html` anytime.

**Q: How do I stop the autostart?**  
- Backend: `sudo systemctl stop baymax-emotion`
- Frontend: Remove file `~/.config/autostart/baymax-face.desktop`

**Q: I changed the code but the face didn't update.**  
Restart the app. If using autostart, run `sudo systemctl restart baymax-emotion` for the backend, or just `npm start` manually for the frontend.
