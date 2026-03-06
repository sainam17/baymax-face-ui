const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

let faceWindow;
let controlWindow;

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

  // ===== Control Panel Window — normal window on primary display =====
  controlWindow = new BrowserWindow({
    x: primaryDisplay.bounds.x + Math.round((primaryDisplay.bounds.width - 500) / 2),
    y: primaryDisplay.bounds.y + Math.round((primaryDisplay.bounds.height - 400) / 2),
    width: 500,
    height: 600,
    frame: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    backgroundColor: '#1a1a2e',
    title: 'BayMax Control Panel'
  });

  controlWindow.loadFile(path.join(__dirname, 'control.html'));

  controlWindow.on('closed', function () {
    controlWindow = null;
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
}

app.on('ready', createWindows);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (faceWindow === null && controlWindow === null) {
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
