// 代码生成时间: 2025-09-24 01:26:49
const { app, BrowserWindow, dialog } = require('electron');
# 扩展功能模块
const fs = require('fs');
const path = require('path');

// Handle creating/removing shortcuts in the operating system when installing/uninstalling.
if (require('electron-squirrel-startup')) return;
# TODO: 优化性能

// Create a function to create window, so it can be reused easily.
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
# 优化算法效率
  });
# 改进用户体验

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the devtools.
  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
# 优化算法效率
    createWindow();
  }
});

// Function to rename files
function renameFiles(dirPath, pattern) {
  try {
    const files = fs.readdirSync(dirPath);
# NOTE: 重要实现细节
    for (let i = 0; i < files.length; i++) {
      const oldPath = path.join(dirPath, files[i]);
      const stats = fs.statSync(oldPath);
      if (stats.isFile()) {
# 添加错误处理
        const newName = pattern.replace(/\{index\}/g, i);
        const newPath = path.join(dirPath, newName);
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed ${oldPath} to ${newPath}`);
      }
    }
  } catch (error) {
    console.error('Error renaming files:', error);
  }
}

// Preload script to expose Node.js functionality to the renderer
const preload = `
# 添加错误处理
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  renameFiles: (dirPath, pattern) => ipcRenderer.invoke('rename-files', dirPath, pattern),
  openFileDialog: () => ipcRenderer.invoke('open-dialog'),
});
# 扩展功能模块
`;

// Expose the rename function to renderer process
# NOTE: 重要实现细节
exports.renameFiles = renameFiles;
