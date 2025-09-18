// 代码生成时间: 2025-09-18 12:27:32
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Main application window
let win;

// Inventory data structure
class InventoryItem {
  constructor(id, name, quantity, price) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.price = price;
  }
}

// Inventory manager class
class InventoryManager {
  constructor() {
    this.items = [];
  }

  // Add item to inventory
  addItem(name, quantity, price) {
    const id = uuidv4();
    const newItem = new InventoryItem(id, name, quantity, price);
    this.items.push(newItem);
    return newItem;
  }

  // Remove item from inventory
  removeItem(id) {
    this.items = this.items.filter(item => item.id !== id);
  }

  // Update item quantity in inventory
  updateQuantity(id, newQuantity) {
    const item = this.items.find(item => item.id === id);
    if (item) {
      item.quantity = newQuantity;
    } else {
      throw new Error('Item not found');
    }
  }

  // Get inventory items
  getItems() {
    return this.items;
  }
}

// Load inventory data from file
function loadInventoryData() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'inventory.json'), 'utf8');
    const items = JSON.parse(data);
    return items.map(item => new InventoryItem(item.id, item.name, item.quantity, item.price));
  } catch (error) {
    console.error('Failed to load inventory data:', error);
    return [];
  }
}

// Save inventory data to file
function saveInventoryData(items) {
  try {
    const data = JSON.stringify(items, null, 2);
    fs.writeFileSync(path.join(__dirname, 'inventory.json'), data);
  } catch (error) {
    console.error('Failed to save inventory data:', error);
  }
}

// Create the main application window
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  win.loadFile('index.html');

  win.on('closed', () => {
    win = null;
  });
}

// Initialize the application
app.on('ready', () => {
  createWindow();
});

// Handle window close event
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle application activation event
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Preload script to expose inventory manager to renderer process
const preloadScript = `
  const { contextBridge, ipcRenderer } = require('electron');
  const inventoryManager = new InventoryManager(loadInventoryData());

  contextBridge.exposeInMainWorld('electronAPI', {
    addItem: (name, quantity, price) => {
      const newItem = inventoryManager.addItem(name, quantity, price);
      saveInventoryData(inventoryManager.getItems());
      ipcRenderer.send('item-added', newItem);
    },
    removeItem: (id) => {
      inventoryManager.removeItem(id);
      saveInventoryData(inventoryManager.getItems());
      ipcRenderer.send('item-removed', id);
    },
    updateQuantity: (id, newQuantity) => {
      try {
        inventoryManager.updateQuantity(id, newQuantity);
        saveInventoryData(inventoryManager.getItems());
        ipcRenderer.send('quantity-updated', { id, newQuantity });
      } catch (error) {
        console.error(error);
        ipcRenderer.send('update-error', error.message);
      }
    },
    getItems: () => inventoryManager.getItems(),
  });
`;

// Save preload script to file
fs.writeFileSync(path.join(__dirname, 'preload.js'), preloadScript);
