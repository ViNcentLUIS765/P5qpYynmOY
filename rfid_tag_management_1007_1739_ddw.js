// 代码生成时间: 2025-10-07 17:39:04
// Import required modules
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// Define the RFID tag storage structure
class RFIDTagManager {
  constructor(storagePath) {
    this.storagePath = storagePath;
  }

  // Load RFID tags from storage
  loadTags() {
    try {
      const data = fs.readFileSync(this.storagePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading RFID tags:', error);
      return [];
    }
  }

  // Save RFID tags to storage
  saveTags(tags) {
    try {
      fs.writeFileSync(this.storagePath, JSON.stringify(tags, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving RFID tags:', error);
    }
  }

  // Add a new RFID tag
  addTag(tagId) {
    const tags = this.loadTags();
    if (tags.find(tag => tag.id === tagId)) {
      throw new Error('Tag already exists');
    }
    tags.push({ id: tagId, data: '' });
    this.saveTags(tags);
  }

  // Remove an RFID tag
  removeTag(tagId) {
    const tags = this.loadTags();
    const updatedTags = tags.filter(tag => tag.id !== tagId);
    this.saveTags(updatedTags);
  }

  // Update RFID tag data
  updateTagData(tagId, data) {
    const tags = this.loadTags();
    const tag = tags.find(tag => tag.id === tagId);
    if (!tag) {
      throw new Error('Tag not found');
    }
    tag.data = data;
    this.saveTags(tags);
  }
}

// Create the Electron application
class RFIDTagApp {
  constructor() {
    this.win = null;
  }

  // Initialize the application
  init() {
    // Create the main window
    this.createWindow();
  }

  // Create the main window
  createWindow() {
    this.win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
      },
    });

    // Load the index.html of the app
    this.win.loadFile('index.html');

    // Open the DevTools for debugging
    this.win.webContents.openDevTools();
  }

  // Handle window close event
  onClose() {
    this.win = null;
  }
}

// Main application logic
const appInstance = new RFIDTagApp();
appInstance.init();

// Handle application events
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    appInstance.createWindow();
  }
});