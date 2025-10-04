// 代码生成时间: 2025-10-04 18:46:58
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// 定义常量
const DATA_FILE_NAME = 'large_data_file.dat';
const PARTITION_SIZE = 1024 * 1024; // 1MB
const OUTPUT_FOLDER = 'partitioned_data';

// 创建输出目录
function createOutputDirectory() {
  const outputDir = path.join(__dirname, OUTPUT_FOLDER);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
}

// 读取大文件并分片
function partitionData(inputPath) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(inputPath);
    let partIndex = 1;
    let totalSize = 0;

    readStream.on('data', (chunk) => {
      totalSize += chunk.length;
      if (totalSize >= PARTITION_SIZE) {
        const outputPath = path.join(__dirname, OUTPUT_FOLDER, `part_${partIndex}.dat`);
        fs.writeFileSync(outputPath, chunk);
        partIndex++;
        totalSize = 0;
      }
    });

    readStream.on('end', () => {
      resolve(partIndex - 1); // 返回分片数量
    });

    readStream.on('error', (error) => {
      reject(error);
    });
  });
}

// 启动Electron主进程
app.on('ready', () => {
  createOutputDirectory();
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile('index.html');

  // 打开文件对话框选择大文件
  dialog.showOpenDialog({ properties: ['openFile'] }).then(({ filePaths }) => {
    if (filePaths.length > 0) {
      const inputPath = filePaths[0];
      partitionData(inputPath)
        .then((partitionCount) => {
          console.log(`Data partitioned into ${partitionCount} parts.`);
        })
        .catch((error) => {
          console.error('Error partitioning data:', error);
        });
    }
  });
});

// 确保在Electron关闭时清理资源
app.on('will-quit', () => {
  // 清理资源
});

// 错误处理和日志记录
app.on('error', (error) => {
  console.error('Electron app error:', error);
});

// 简单的HTML页面用于交互
/*
<!DOCTYPE html>
<html>
<head>
  <title>Data Partition Tool</title>
</head>
<body>
  <h1>Data Partition Tool</h1>
  <button id="open-file">Open File</button>
  <script>
    document.getElementById('open-file').addEventListener('click', () => {
      // 调用Electron的API打开文件对话框
      const { ipcRenderer } = require('electron');
      ipcRenderer.send('open-file-dialog');
    });
  </script>
</body>
</html>
*/
