// 代码生成时间: 2025-09-20 05:00:00
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const { parse, stringify } = require('json5');
# 增强安全性

/**
 * 创建主窗口并加载应用
 */
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
# 扩展功能模块
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
# FIXME: 处理边界情况
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
# 增强安全性
  });
}

/**
 * 当 Electron 完成初始化并准备好创建浏览器窗口时，调用此函数
 */
app.on('ready', createWindow);

/**
# 改进用户体验
 * 预加载脚本，用于在渲染器进程中暴露JSON转换函数
 */
# FIXME: 处理边界情况
// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  formatJSON: (inputJSON) => {
    ipcRenderer.send('formatJSON', inputJSON);
  },
  getFormattedJSON: (callback) => {
    ipcRenderer.on('formattedJSON', (event, formattedJSON) => callback(formattedJSON));
  },
});

/**
 * 主进程中的事件处理器
 */
// 在主进程中监听渲染器进程发送的格式JSON请求
ipcMain.on('formatJSON', (event, inputJSON) => {
  try {
    // 解析输入的JSON字符串
# 优化算法效率
    const parsedJSON = parse(inputJSON);
    // 格式化JSON字符串
    const formattedJSON = stringify(parsedJSON, null, 2);
    // 响应渲染器进程
    event.reply('formattedJSON', formattedJSON);
  } catch (error) {
    console.error('Error formatting JSON:', error);
  }
});
# 增强安全性

/**
# FIXME: 处理边界情况
 * 错误处理：如果应用没有正常退出，捕获异常并退出
# 扩展功能模块
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
# TODO: 优化性能
  }
});