// 代码生成时间: 2025-10-13 03:40:23
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

// 启动Electron应用
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  });

  // 加载应用的HTML文件
  mainWindow.loadFile('index.html');

  // 打开开发者工具
  mainWindow.webContents.openDevTools();
}

// 当Electron完成初始化并准备好创建浏览器窗口时，调用此函数
app.whenReady().then(createWindow);

// 全局引用，防止被垃圾回收器回收
let mainWindow;

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

// 预加载脚本：用于暴露Node.js功能给渲染进程
const preload = `
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // 提供一个方法来获取知识点推荐
  getKnowledgeRecommendations: async () => {
    return ipcRenderer.invoke('get-knowledge-recommendations');
  },
});
`;

// 保存预加载脚本到文件
fs.writeFileSync(path.join(__dirname, 'preload.js'), preload, 'utf-8');

// IPC通信：渲染进程请求知识点推荐
ipcMain.on('get-knowledge-recommendations', async (event) => {
  try {
    // 模拟一个API请求获取知识点推荐
    const response = await axios.get('https://api.example.com/knowledge-recommendations');
    const $ = cheerio.load(response.data);
    const recommendations = [];

    // 从响应中解析知识点推荐
    $('ul.knowledge-list li').each((index, element) => {
      const title = $(element).find('h2').text().trim();
      const description = $(element).find('p').text().trim();
      recommendations.push({ title, description });
    });

    // 返回知识点推荐
    event.returnValue = recommendations;
  } catch (error) {
    console.error('Error fetching knowledge recommendations:', error);
    event.returnValue = null;
  }
});
