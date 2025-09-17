// 代码生成时间: 2025-09-17 19:21:23
// folder_structure_cleaner.js
// This script is designed to organize a folder's structure using Node.js and Electron framework.

const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs-extra');
const path = require('path');

// Define the main application window
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // Load the index.html of the app
    mainWindow.loadFile('index.html');

    // Open the dev tools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// IPC communication handler
ipcMain.on('get-folder-path', (event) => {
    // Open a dialog for user to select a folder
    dialog.showOpenDialog({ properties: ['openDirectory'] }).then((result) => {
        if (!result.canceled && result.filePaths.length > 0) {
            const folderPath = result.filePaths[0];
            event.reply('folder-path-received', folderPath);
        }
    });
});

ipcMain.on('organize-folder', (event, folderPath) => {
    try {
        // Check if the path exists and is a directory
        if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
            throw new Error('The selected path is not a valid directory.');
        }

        // Organize the folder's structure
        organizeFolderStructure(folderPath).then(() => {
            event.reply('folder-organized', `Folder at ${folderPath} has been organized successfully.`);
        }).catch((error) => {
            event.reply('error-occurred', error.message);
        });
    } catch (error) {
        event.reply('error-occurred', error.message);
    }
});

// Function to organize the folder's structure
function organizeFolderStructure(folderPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(folderPath, (err, files) => {
            if (err) {
                reject(err);
                return;
            }

            // Create a map of file types to new directories
            const directories = {
                'images': [],
                'documents': [],
                'videos': [],
                'audios': [],
                'others': []
            };

            files.forEach(file => {
                const filePath = path.join(folderPath, file);
                const fileExtension = path.extname(file).toLowerCase();

                // Determine the new directory based on file type
                switch (fileExtension) {
                    case '.jpg':
                    case '.jpeg':
                    case '.png':
                    case '.gif':
                        directories.images.push(filePath);
                        break;
                    case '.pdf':
                    case '.doc':
                    case '.docx':
                    case '.txt':
                        directories.documents.push(filePath);
                        break;
                    case '.mp4':
                    case '.avi':
                    case '.mov':
                        directories.videos.push(filePath);
                        break;
                    case '.mp3':
                    case '.wav':
                        directories.audios.push(filePath);
                        break;
                    default:
                        directories.others.push(filePath);
                        break;
                }
            });

            // Move files to their respective directories
            Promise.all(Object.keys(directories).map(dir => {
                const dirPath = path.join(folderPath, dir);
                return fs.ensureDir(dirPath).then(() => {
                    return Promise.all(directories[dir].map(file => {
                        return fs.move(file, path.join(dirPath, path.basename(file)), { overwrite: true });
                    }));
                });
            })).then(() => {
                resolve();
            }).catch(reject);
        });
    });
}
