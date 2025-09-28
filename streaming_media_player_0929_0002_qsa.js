// 代码生成时间: 2025-09-29 00:02:31
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

// 定义流媒体播放器窗口类
class StreamingMediaPlayer {
  constructor() {
    this.createWindow = this.createWindow.bind(this);
    this.loadMedia = this.loadMedia.bind(this);
  }

  // 创建Electron窗口
  createWindow() {
    this.win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    });

    // 加载index.html文件
    this.win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }));

    // 打开开发者工具
    this.win.webContents.openDevTools();
  }

  // 加载媒体文件
  loadMedia(file) {
    try {
      // 检查文件是否存在
      fs.accessSync(file, fs.constants.F_OK);
      // 读取文件内容
      const mediaContent = fs.readFileSync(file, { encoding: 'base64' });
      // 将文件内容传递给渲染进程
      this.win.webContents.send('load-media', mediaContent);
    } catch (error) {
      console.error('Error loading media file:', error);
    }
  }
}

// Electron应用生命周期事件监听器
app.on('ready', () => {
  const player = new StreamingMediaPlayer();
  player.createWindow();

  // 监听渲染进程发送的加载媒体请求
  player.win.webContents.on('did-finish-load', () => {
    player.win.webContents.send('load-media-request');
  });

  // 渲染进程加载媒体文件的响应
  player.win.webContents.on('media-file', (e, file) => {
    player.loadMedia(file);
  });
});

// 主进程错误监听器
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 渲染进程代码
// index.html
const mediaElement = document.querySelector('video');

// 接收主进程发送的媒体内容
ipcRenderer.on('load-media', (event, mediaContent) => {
  const blob = new Blob([atob(mediaContent)], { type: 'video/mp4' });
  const url = URL.createObjectURL(blob);
  mediaElement.src = url;
  mediaElement.play();
});

// 向主进程发送加载媒体请求
document.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.send('load-media-request');
});

// 响应主进程加载媒体文件的请求
ipcRenderer.on('media-file', (event) => {
  const file = document.getElementById('media-file-input').files[0];
  if (file) {
    ipcRenderer.sendToHost('media-file', file.path);
  } else {
    console.error('No media file selected');
  }
});