const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

let tray = null;
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'frontend/build/index.html'));

  // Minimize to tray on close
  mainWindow.on('close', (event) => {
    if (app.quitting) {
      mainWindow = null;
    } else {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  tray = new Tray(path.join(__dirname, 'logo_new.png')); // Replace 'path-to-your-icon/icon.png' with the actual path to your icon
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => mainWindow.show() },
    { label: 'Quit', click: () => { app.quitting = true; app.quit(); } }
  ]);
  tray.setToolTip('Your App Name');
  tray.setContextMenu(contextMenu);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});