// 代码生成时间: 2025-09-16 13:16:37
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { setInterval } = require('timers');

/**
 * 定时任务调度器应用
 */
class SchedulerApp {
  constructor() {
    this.window = null;
    this.init();
  }

  init() {
    app.whenReady().then(() => {
      this.createWindow();
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });
  }

  /**
   * 创建窗口
   */
  createWindow() {
    this.window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    this.window.loadFile('index.html');

    this.window.on('closed', () => {
      this.window = null;
    });
  }
}

/**
 * 创建窗口的预加载脚本
 * 用于在渲染进程中引入node功能
 */
const preloadScript = `
  const { contextBridge, ipcRenderer } = require('electron');

  contextBridge.exposeInMainWorld('electronAPI', {
    createTask: () => ipcRenderer.send('create-task'),
    getTasks: () => ipcRenderer.send('get-tasks'),
    deleteTask: (taskId) => ipcRenderer.send('delete-task', taskId),
    updateTask: (taskId, newConfig) => ipcRenderer.send('update-task', { taskId, newConfig }),
  });
`;

fs.writeFileSync(path.join(__dirname, 'preload.js'), preloadScript, 'utf8');

/**
 * 定时任务管理器
 */
class TaskManager {
  constructor() {
    this.tasks = [];
  }

  /**
   * 创建新任务
   * @param {Object} taskConfig - 任务配置
   */
  createTask(taskConfig) {
    try {
      const taskId = this.generateTaskId();
      const task = { ...taskConfig, id: taskId };
      this.tasks.push(task);
      this.scheduleTask(task);
      return taskId;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  /**
   * 获取所有任务
   * @returns {Array} 任务列表
   */
  getTasks() {
    return this.tasks;
  }

  /**
   * 删除任务
   * @param {String} taskId - 任务ID
   */
  deleteTask(taskId) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }

  /**
   * 更新任务
   * @param {String} taskId - 任务ID
   * @param {Object} newConfig - 新的任务配置
   */
  updateTask(taskId, newConfig) {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    if (taskIndex > -1) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...newConfig };
      this.rescheduleTask(this.tasks[taskIndex]);
    }
  }

  /**
   * 生成任务ID
   * @returns {String} 任务ID
   */
  generateTaskId() {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * 调度任务
   * @param {Object} task - 任务对象
   */
  scheduleTask(task) {
    clearInterval(task.intervalId);
    task.intervalId = setInterval(() => {
      console.log(`Task ${task.id} executed at ${new Date().toISOString()}`);
      // 这里可以执行具体的任务逻辑
    }, task.interval);
  }

  /**
   * 重新调度任务
   * @param {Object} task - 任务对象
   */
  rescheduleTask(task) {
    clearInterval(task.intervalId);
    this.scheduleTask(task);
  }
}

const taskManager = new TaskManager();

// IPC通信事件监听
const { ipcMain } = require('electron');
ipcMain.handle('create-task', (event, taskConfig) => {
  return taskManager.createTask(taskConfig);
});
ipcMain.handle('get-tasks', () => {
  return taskManager.getTasks();
});
ipcMain.handle('delete-task', (event, taskId) => {
  taskManager.deleteTask(taskId);
});
ipcMain.handle('update-task', (event, { taskId, newConfig }) => {
  taskManager.updateTask(taskId, newConfig);
});

new SchedulerApp();