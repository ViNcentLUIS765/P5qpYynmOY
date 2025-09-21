// 代码生成时间: 2025-09-21 11:56:42
// Import necessary Electron modules and other dependencies.
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

// Function to create a new window.
function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
  });

  // Load the index.html of the app.
  win.loadFile('index.html');
}

// Function to format the API response.
function formatApiResponse(rawResponse) {
  try {
    // Attempt to parse the raw response as JSON.
    const parsedResponse = JSON.parse(rawResponse);
    // Return the formatted JSON string with indentation.
    return JSON.stringify(parsedResponse, null, 2);
  } catch (error) {
    // Handle any errors in parsing the JSON.
    return `Error parsing JSON: ${error.message}`;
  }
}

// Function to handle file loading and formatting.
function handleFileLoad(filePath) {
  try {
    // Read the file content.
    const fileContent = fs.readFileSync(filePath, 'utf8');
    // Format the API response.
    const formattedResponse = formatApiResponse(fileContent);
    // Display the formatted response in the main window.
    // mainWindow.webContents.send('formatted-response', formattedResponse);
    console.log(formattedResponse); // For simplicity, log to console.
  } catch (error) {
    // Handle any file reading errors.
    dialog.showErrorBox('Error', `Failed to read file: ${error.message}`);
  }
}

// Handle when the app is ready.
app.on('ready', createWindow);

// Handle when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle when the app is activated.
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Expose the function to load a file and format the response.
exports.handleFileLoad = handleFileLoad;