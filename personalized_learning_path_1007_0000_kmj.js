// 代码生成时间: 2025-10-07 00:00:33
// Import necessary Electron modules
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// Define a class to handle personalized learning path
class LearningPathManager {
  /**
   * Initializes a new instance of LearningPathManager.
   * @param {string} userDataPath - The path where user data is stored.
   */
  constructor(userDataPath) {
    this.userDataPath = userDataPath;
  }

  /**
   * Creates a new learning path for a user.
   * @param {string} userName - The name of the user.
   * @param {object} learningPath - The learning path object.
   */
  createLearningPath(userName, learningPath) {
    try {
      const filePath = path.join(this.userDataPath, `${userName}.json`);
      fs.writeFileSync(filePath, JSON.stringify(learningPath, null, 2));
      console.log(`Learning path for ${userName} created successfully!`);
    } catch (error) {
      console.error('Error creating learning path:', error);
    }
  }

  /**
   * Retrieves a user's learning path.
   * @param {string} userName - The name of the user.
   * @returns {object} The learning path object.
   */
  getLearningPath(userName) {
    try {
      const filePath = path.join(this.userDataPath, `${userName}.json`);
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error retrieving learning path:', error);
      return null;
    }
  }
}

// Create main application window
function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // Load the index.html of the app.
  win.loadFile('index.html');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS, it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. On macOS it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Example usage of LearningPathManager
// const userDataPath = app.getPath('userData');
// const learningPathManager = new LearningPathManager(userDataPath);
// learningPathManager.createLearningPath('johnDoe', { courses: ['Math', 'Science', 'History'] });
// const johnDoeLearningPath = learningPathManager.getLearningPath('johnDoe');
