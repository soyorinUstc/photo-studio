const { app, Tray, Menu, BrowserWindow, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let tray = null;
let mainWindow = null;
let backendProcess = null;

// 启动后端服务
function startBackend() {
  const backendPath = path.join(__dirname, '../backend');
  backendProcess = spawn('npm', ['run', 'dev'], {
    cwd: backendPath,
    shell: true
  });
  
  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, 'icon.png'),
    show: true
  });

  // 开发环境
  mainWindow.loadURL('http://localhost:5173');
  
  // 生产环境（打包后）
  // mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'));

  mainWindow.on('close', (e) => {
    e.preventDefault();
    mainWindow.hide();
  });
}

function createTray() {
  const iconPath = path.join(__dirname, 'icon.png');
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开 Photo Studio',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: '最小化到托盘',
      click: () => {
        mainWindow.hide();
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Photo Studio - RAW 照片管理');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  // 启动后端
  startBackend();
  
  // 等待后端启动
  setTimeout(() => {
    createWindow();
    createTray();
  }, 3000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
