# Installation Guide — BayMax Face UI

> **Platform:** Ubuntu 22.04 / Raspberry Pi OS (64-bit)  
> **Stack:** Electron (face UI) + FastAPI (emotion HTTP API)

---

## Project Structure

```
baymax-face-ui/
├── src/
│   ├── index.html        # Robot face UI (fullscreen Electron window)
│   ├── control.html      # Local control panel window
│   ├── main.js           # Electron main process + IPC bridge (port 8768)
│   └── pi5_face_service.py  # FastAPI /face_emotion endpoint
├── scripts/
│   ├── set_face.js       # CLI helper: pushes expression into Electron renderer
│   ├── install.sh        # Auto-installer (Node + Electron deps)
│   ├── setup.sh          # Quick setup helper
│   └── check-system.sh   # Dependency checker
├── docs/
│   ├── Design.md         # API & system design spec
│   ├── progress.md       # Sprint progress log
│   ├── QUICKSTART.md     # Quick reference
│   └── INSTALLATION.md   # This file
└── package.json
```

---

## Part 1 — Electron Face UI

### Option A: Auto-install (recommended)

```bash
cd baymax-face-ui
chmod +x scripts/install.sh scripts/check-system.sh
./scripts/install.sh
```

### Option B: Manual

#### 1. Install Node.js 20.x

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version   # v20.x.x
```

#### 2. Install system libraries required by Electron

```bash
sudo apt install -y \
    libgtk-3-0 libnotify-dev libnss3 libxss1 \
    libasound2 libxtst6 xauth xvfb libgbm1 \
    libx11-xcb1 libxcb-dri3-0 libdrm2 build-essential
```

#### 3. Install npm dependencies

```bash
cd baymax-face-ui
npm install
```

#### 4. Run

```bash
npm start        # production — fullscreen, no devtools
npm run dev      # development — with devtools, ESC to quit
```

---

## Part 2 — FastAPI Emotion Service

Runs on the same machine (Raspberry Pi 5) as the Electron app.

#### 1. Create a Python virtual environment

```bash
cd baymax-face-ui
python3 -m venv venv
source venv/bin/activate
```

#### 2. Install Python dependencies

```bash
pip install fastapi uvicorn
```

#### 3. Run the service

```bash
uvicorn src.pi5_face_service:app --host 0.0.0.0 --port 7000
```

#### 4. Test it

```bash
# Set face to Happy
curl -X POST http://localhost:7000/face_emotion \
     -H "Content-Type: application/json" -d '{"emotion": 2}'

# Health check
curl http://localhost:7000/health
```

#### Emotion codes

| Code | Label     | Expression shown |
|:----:|-----------|-----------------|
| `0`  | Normal    | `idle`          |
| `1`  | Searching | `scanning`      |
| `2`  | Happy     | `happy`         |
| `3`  | Talking   | `talking`       |
| `4`  | Thinking  | `thinking`      |

---

## Option C — Automated Autostart Setup

I've created a script that handles both the backend and frontend autostart configuration:

```bash
chmod +x scripts/setup_autostart.sh
sudo ./scripts/setup_autostart.sh
```

This will:
- Create and enable `baymax-emotion.service` (background).
- Create `~/.config/autostart/baymax-face.desktop` (popup on login).

---

## How the two services connect

```
GPU Server  POST /face_emotion {emotion:N}
               ↓
  pi5_face_service.py  :7000
               ↓  node scripts/set_face.js <expression>
  scripts/set_face.js
               ↓  POST 127.0.0.1:8768/set-expression
  main.js  startIpcBridge()
               ↓  executeJavaScript("setExpression('...')")
  src/index.html  →  face changes
```

---

## Auto-start on Boot (systemd)

### Electron face

```bash
sudo nano /etc/systemd/system/baymax-face.service
```

```ini
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

```bash
sudo systemctl enable baymax-face.service
sudo systemctl start baymax-face.service
```

### FastAPI emotion service

```bash
sudo nano /etc/systemd/system/baymax-emotion.service
```

```ini
[Unit]
Description=BayMax Face Emotion API
After=network.target baymax-face.service

[Service]
Type=simple
User=YOUR_USERNAME
WorkingDirectory=/path/to/baymax-face-ui
ExecStart=/path/to/baymax-face-ui/venv/bin/uvicorn src.pi5_face_service:app --host 0.0.0.0 --port 7000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable baymax-emotion.service
sudo systemctl start baymax-emotion.service
```

---

## Port reference

| Port | Service | Accessible from |
|------|---------|----------------|
| `7000` | FastAPI `/face_emotion` | Any host (GPU server → PI 5) |
| `8768` | Electron IPC bridge | `127.0.0.1` only (internal) |

---

## Troubleshooting

**Port 7000 already in use:**
```bash
fuser -k 7000/tcp
```

**Electron black screen (headless):**
```bash
xvfb-run npm start
```

**Check what's using a port:**
```bash
lsof -i :7000
```
