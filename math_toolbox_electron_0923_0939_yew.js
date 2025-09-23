// 代码生成时间: 2025-09-23 09:39:20
// Import necessary modules
const { app, BrowserWindow } = require('electron');
const path = require('path');

// Function to create window
function createWindow () {
  // Create the browser window
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load the index.html of the app
  win.loadFile('index.html');

  // Open the devTools
  win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the main process scripts.
// For example, you can handle events or create additional windows.

// Example of a simple mathematical calculation module
class MathToolbox {
  /**
   * Calculate the sum of two numbers
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  add(a, b) {
    return a + b;
  }

  /**
   * Calculate the difference of two numbers
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  subtract(a, b) {
    return a - b;
  }

  /**
   * Calculate the product of two numbers
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  multiply(a, b) {
    return a * b;
  }

  /**
   * Calculate the division of two numbers
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  divide(a, b) {
    if (b === 0) throw new Error('Division by zero is not allowed.');
    return a / b;
  }
}

// Preload script for security and module exporting
const { contextBridge } = require('electron');
const mathToolbox = new MathToolbox();

module.exports = mathToolbox;

// Example usage in preload.js
contextBridge.exposeInMainWorld('electronAPI', {
  add: (a, b) => mathToolbox.add(a, b),
  subtract: (a, b) => mathToolbox.subtract(a, b),
  multiply: (a, b) => mathToolbox.multiply(a, b),
  divide: (a, b) => mathToolbox.divide(a, b)
});

// Example usage in index.html
// <script type="module">
//   import { add } from './preload.js';
//   console.log(add(5, 3));
// </script>