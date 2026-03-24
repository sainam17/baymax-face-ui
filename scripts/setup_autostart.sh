#!/bin/bash

# setup_autostart.sh - BayMax Face UI & Emotion Service Autostart Installer
# This script sets up the systemd service for the backend and the desktop entry for the frontend.

PROJECT_DIR="/home/sainam/Desktop/baymax-face-ui"
USER_NAME="sainam"
VENV_DIR="$PROJECT_DIR/venv"

# 1. Create Systemd Service for FastAPI Emotion Service
echo "Creating systemd service for BayMax Emotion Service..."
SERVICE_FILE="/etc/systemd/system/baymax-emotion.service"

sudo bash -c "cat > $SERVICE_FILE" <<EOF
[Unit]
Description=BayMax Face Emotion API Service
After=network.target

[Service]
Type=simple
User=$USER_NAME
WorkingDirectory=$PROJECT_DIR
ExecStart=$VENV_DIR/bin/uvicorn src.pi5_face_service:app --host 0.0.0.0 --port 8767
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# 2. Reload systemd and enable service
echo "Reloading systemd and enabling baymax-emotion.service..."
sudo systemctl daemon-reload
sudo systemctl enable baymax-emotion.service
sudo systemctl restart baymax-emotion.service

# 3. Create Desktop Autostart for Electron Face UI
echo "Creating desktop autostart for BayMax Face UI..."
AUTOSTART_DIR="/home/$USER_NAME/.config/autostart"
DESKTOP_FILE="$AUTOSTART_DIR/baymax-face.desktop"

mkdir -p "$AUTOSTART_DIR"

cat > "$DESKTOP_FILE" <<EOF
[Desktop Entry]
Type=Application
Name=BayMax Face
Comment=Start BayMax Robot Face UI on login
Exec=bash -c "cd $PROJECT_DIR && npm start"
X-GNOME-Autostart-enabled=true
Terminal=false
Categories=Application;
EOF

chmod +x "$DESKTOP_FILE"

echo "-------------------------------------------------------"
echo "Autostart setup complete!"
echo "1. Backend: baymax-emotion.service is now running and enabled."
echo "2. Frontend: Robot Face UI will 'pop up' automatically on next login."
echo "-------------------------------------------------------"
echo "To check backend status: systemctl status baymax-emotion.service"
echo "To check backend logs: journalctl -u baymax-emotion.service -f"
