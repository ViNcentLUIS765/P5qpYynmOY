// 代码生成时间: 2025-10-01 22:02:35
const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

/**
 * 创建一个文件上传窗口
 * @param {string} filePath - 上传文件的路径
 */
function createUploadWindow(filePath) {
  const win = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
  // 传递文件路径给渲染进程
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('initial-file-path', filePath);
  });

  win.on('closed', () => {
    win = null;
  });
}

// 监听文件上传事件
app.on('ready', () => {
  // 打开文件对话框让用户选择文件
  dialog.showOpenDialog({
    properties: ['openFile'],
  }, (fileNames) => {
    if (fileNames === undefined) return;

    // 获取第一个文件的路径
    const filePath = fileNames[0];

    // 创建上传窗口
    createUploadWindow(filePath);
  });
});

// 错误处理
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createUploadWindow();
  }
});

// 导出函数以供外部调用
module.exports = {
  createUploadWindow,
};
