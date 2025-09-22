// 代码生成时间: 2025-09-22 14:14:41
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 哈希值计算工具的主类
class HashCalculator {
  // 构造函数，创建新的BrowserWindow实例
  constructor() {
    this.win = null;
  }

  // 初始化Electron窗口
  createWindow() {
    this.win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    this.win.loadFile('index.html');
  }

  // 处理文件选择和哈希值计算
  handleFileSelection() {
    ipcMain.on('file-selected', (event, filePath) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          dialog.showErrorBox('Error', 'Failed to read the file.');
          event.reply('hash-calculation', { error: 'Failed to read the file.' });
          return;
        }

        // 计算哈希值
        const hash = crypto.createHash('sha256').update(data).digest('hex');
        event.reply('hash-calculation', { hash: hash });
      });
    });
  }

  // 启动Electron应用
  start() {
    app.whenReady().then(() => {
      this.createWindow();

      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createWindow();
        }
      });
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }
}

// 创建一个实例并启动应用
const hashCalculator = new HashCalculator();
hashCalculator.start();