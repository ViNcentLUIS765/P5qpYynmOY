// 代码生成时间: 2025-09-16 20:26:06
// Import required libraries
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const admZip = require('adm-zip');
const isDev = require('electron-is-dev');

// Define application's main window dimensions
const WINDOW_WIDTH = 800;
const WINDOW_HEIGHT = 600;

// Function to create a new BrowserWindow
function createWindow() {
    const win = new BrowserWindow({
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Load the index.html of the React app
    win.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, 'dist/index.html')}`);

    // Open DevTools.
    win.webContents.openDevTools();
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Event to handle app activation (OS X)
app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Function to unzip a file
function unzipFile(zipFilePath, outputDir) {
    try {
        // Read the zip file
        const zip = new admZip(zipFilePath);
        // Check if the zip is valid
        if (!zip.getEntries().length) {
            throw new Error('Invalid zip file.');
        }
        // Extract the zip file
        zip.extractAllTo(outputDir, /*overwrite*/true);
        console.log('Unzipped successfully.');
    } catch (error) {
        // Handle errors
        console.error('Error unzipping file:', error);
        throw error;
    }
}

// Expose the unzip function to the renderer process
module.exports = { unzipFile };