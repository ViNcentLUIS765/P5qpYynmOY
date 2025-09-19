// 代码生成时间: 2025-09-19 09:57:16
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// 订单模型
class Order {
  constructor(orderDetails) {
    this.id = uuidv4();
    this.details = orderDetails;
    this.status = 'pending';
  }

  // 处理订单
  processOrder() {
    switch (this.status) {
      case 'pending':
        this.status = 'processing';
        break;
      case 'processing':
        this.status = 'completed';
        break;
      default:
        throw new Error('Invalid order status for processing');
    }
  }
}

// 创建订单处理窗口
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  win.loadFile('order_processing.html');

  // 打开开发者工具
  win.webContents.openDevTools();
}

// 此预加载脚本用于在渲染器进程中暴露Node.js功能
const preloadScript = `
  // 预加载脚本可以在这里添加，用于暴露Node.js功能到渲染器进程
  const { contextBridge, ipcRenderer } = require('electron');

  contextBridge.exposeInMainWorld('electronAPI', {
    createOrder: async (orderDetails) => {
      return ipcRenderer.invoke('create-order', orderDetails);
    },
    processOrder: async (orderId) => {
      return ipcRenderer.invoke('process-order', orderId);
    },
  });
`;

fs.writeFileSync(path.join(__dirname, 'preload.js'), preloadScript, 'utf8');

// 设置主进程的IPC通信
app.on('ready', () => {
  createWindow();
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

  // 创建订单IPC处理程序
  app.on('create-order', (event, orderDetails) => {
    try {
      const order = new Order(orderDetails);
      fs.writeFileSync(
        path.join(__dirname, 'orders', `${order.id}.json`),
        JSON.stringify(order, null, 2),
        'utf8'
      );
      event.reply('order-created', { id: order.id, status: order.status });
    } catch (error) {
      event.reply('error', { message: error.message });
    }
  });

  // 处理订单IPC处理程序
  app.on('process-order', (event, orderId) => {
    const orderPath = path.join(__dirname, 'orders', `${orderId}.json`);
    try {
      const orderData = fs.readFileSync(orderPath, 'utf8');
      const order = JSON.parse(orderData);
      order.processOrder();
      fs.writeFileSync(orderPath, JSON.stringify(order, null, 2), 'utf8');
      event.reply('order-processed', { id: order.id, status: order.status });
    } catch (error) {
      event.reply('error', { message: error.message });
    }
  });

  // 错误处理IPC处理程序
  app.on('error', (event, message) => {
    console.error(message);
  });
});

// 确保只运行一个实例
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    createWindow();
  });
}

module.exports = { Order };
