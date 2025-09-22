// 代码生成时间: 2025-09-23 05:09:44
const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { createHash } = require('crypto');

// 哈希值计算工具的主函数
function createHashTool() {
  // 初始化Electron窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // 加载主页面
  mainWindow.loadFile('index.html');

  // 打开开发者工具
  mainWindow.webContents.openDevTools();

  // 窗口关闭时退出应用
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  // 处理哈希计算请求
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('hash-calculate-request', '准备好计算哈希值');
  });

  // 接收文件哈希值计算请求
  app.on('hash-calculate-request', (event, filePath) => {
    calculateFileHash(filePath)
      .then((hash) => {
        event.sender.send('hash-result', hash);
      })
      .catch((error) => {
        dialog.showErrorBox('错误', error.message);
      });
  });
}

// 计算文件哈希值
function calculateFileHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256');
    const fileStream = fs.createReadStream(filePath);

    fileStream.on('data', (chunk) => {
      hash.update(chunk);
    });

    fileStream.on('end', () => {
      resolve(hash.digest('hex'));
    });

    fileStream.on('error', (error) => {
      reject(error);
    });
  });
}

// 应用启动时创建窗口
app.whenReady().then(createHashTool);

// 主页面HTML模板，需要与JS文件同级目录下创建index.html文件
// <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8">
//     <title>哈希值计算工具</title>
//   </head>
//   <body>
//     <h1>哈希值计算工具</h1>
//     <input type="file" id="fileInput"/>
//     <button onclick="openFile">计算哈希值</button>
//     <p id="hashResult"></p>
//     <script>
//       const { ipcRenderer } = require('electron');
//       document.getElementById('fileInput').addEventListener('change', (event) => {
//         const file = event.target.files[0];
//         if (file) {
//           ipcRenderer.send('hash-calculate-request', file.path);
//         }
//       });
//       ipcRenderer.on('hash-result', (event, hash) => {
//         document.getElementById('hashResult').innerText = `哈希值: ${hash}`;
//       });
//       ipcRenderer.on('hash-calculate-request', (event) => {
//         console.log('已接收到哈希计算请求');
//       });
//       function openFile() {
//         document.getElementById('fileInput').click();
//       }
//     </script>
//   </body>
// </html>