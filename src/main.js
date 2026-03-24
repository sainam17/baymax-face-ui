const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const http = require('http');

let faceWindow;

function createWindows() {
  // Get all displays and pick the secondary (external) one
  const displays = screen.getAllDisplays();
  const primaryDisplay = screen.getPrimaryDisplay();
  const secondaryDisplay = displays.find(d => d.id !== primaryDisplay.id);
  const faceDisplay = secondaryDisplay || primaryDisplay;

  // ===== Robot Face Window — fullscreen on secondary display =====
  faceWindow = new BrowserWindow({
    x: faceDisplay.bounds.x,
    y: faceDisplay.bounds.y,
    width: faceDisplay.bounds.width,
    height: faceDisplay.bounds.height,
    fullscreen: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    backgroundColor: '#ffffff'
  });

  faceWindow.loadFile(path.join(__dirname, 'index.html'));

  // Hide cursor on robot display
  faceWindow.webContents.on('did-finish-load', () => {
    faceWindow.webContents.insertCSS('* { cursor: none !important; }');
  });

  faceWindow.on('closed', function () {
    faceWindow = null;
  });

  // ===== IPC: Forward commands from control panel to robot face =====
  ipcMain.on('set-expression', (event, expression) => {
    if (faceWindow && !faceWindow.isDestroyed()) {
      faceWindow.webContents.executeJavaScript(`setExpression('${expression}')`);
    }
  });

  ipcMain.on('blink', () => {
    if (faceWindow && !faceWindow.isDestroyed()) {
      faceWindow.webContents.executeJavaScript(`blink()`);
    }
  });

  ipcMain.on('head-direction', (event, direction) => {
    if (faceWindow && !faceWindow.isDestroyed()) {
      faceWindow.webContents.executeJavaScript(`moveEyes('${direction}')`);
    }
  });

  ipcMain.on('play-sound', (event, expression) => {
    if (faceWindow && !faceWindow.isDestroyed()) {
      faceWindow.webContents.executeJavaScript(`playSound('${expression}')`);
    }
  });

  ipcMain.on('teleop-cmd', (event, direction) => {
    console.log('Teleop command:', direction);
    // Forward to ROS2 bridge when available
    // e.g. ros2Bridge.publishTeleop(direction);
  });

  ipcMain.on('toggle-devscreen', () => {
    if (faceWindow && !faceWindow.isDestroyed()) {
      faceWindow.webContents.executeJavaScript(`devScreen.toggle()`);
    }
  });
}

app.on('ready', () => {
  createWindows();
  startIpcBridge();
});

// ── Internal IPC HTTP bridge (port 8768) ─────────────────────────────────────
// Called by scripts/set_face.js which is invoked by pi5_face_service.py.
// This lets the FastAPI service drive the Electron renderer without native IPC.
//
// POST http://127.0.0.1:8768/set-expression  { "expression": "talking" }
//
function startIpcBridge() {
  const VALID_EXPRESSIONS = new Set([
    'idle', 'happy', 'thinking', 'scanning', 'talking', 'surprised', 'warning',
  ]);

  const server = http.createServer((req, res) => {
    if (req.method !== 'POST' || req.url !== '/set-expression') {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { expression } = JSON.parse(body);
        if (!VALID_EXPRESSIONS.has(expression)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: `Unknown expression: ${expression}` }));
          return;
        }

        // Push to renderer via executeJavaScript (same as 'set-expression' IPC)
        if (faceWindow && !faceWindow.isDestroyed()) {
          faceWindow.webContents.executeJavaScript(`setExpression('${expression}')`);
          console.log(`[ipc-bridge] setExpression('${expression}')`);
        } else {
          console.warn('[ipc-bridge] faceWindow not available');
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', expression }));
      } catch (err) {
        console.error('[ipc-bridge] Error:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  });

  server.listen(8768, '127.0.0.1', () => {
    console.log('[ipc-bridge] Listening on http://127.0.0.1:8768');
  });
}


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (faceWindow === null) {
    createWindows();
  }
});

// Exit on Escape key for testing
app.on('browser-window-created', (_, window) => {
  window.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'Escape') {
      app.quit();
    }
  });
});
