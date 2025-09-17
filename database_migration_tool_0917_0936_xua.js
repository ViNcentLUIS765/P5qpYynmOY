// 代码生成时间: 2025-09-17 09:36:46
// Import necessary Electron modules and libraries
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const DatabaseMigrator = require('./DatabaseMigrator');

// Function to create a new BrowserWindow instance
function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        },
    });

    // Load the index.html of the app
    mainWindow.loadFile('index.html');

    // Open the devTools for debugging
    mainWindow.webContents.openDevTools();
}

// Handle creating/removing shortcuts on Windows when the app is installed
if (require('electron-squirrel-startup')) app.quit();

// Main application entry point
app.on('ready', createWindow);

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

/* DatabaseMigrator.js - A class for handling database migrations */
class DatabaseMigrator {
    constructor(dbConfig) {
        this.dbConfig = dbConfig;
    }

    // Function to run migrations
    async migrate() {
        try {
            // Check if the migrations folder exists
            const migrationsDir = path.join(__dirname, 'migrations');
            if (!fs.existsSync(migrationsDir)) {
                console.error('Migrations directory does not exist.');
                return;
            }

            // Read the migrations directory and sort files by name
            const migrationFiles = fs.readdirSync(migrationsDir)
                .filter(file => file.endsWith('.js'))
                .sort();

            // Connect to the database
            const db = await this.connectToDatabase();

            // Run each migration file
            for (const file of migrationFiles) {
                const migration = require(path.join(migrationsDir, file));
                await migration.up(db);
                console.log(`Migration ${file} applied successfully`);
            }

            // Close the database connection
            await db.close();
        } catch (error) {
            console.error('Failed to migrate database:', error);
        }
    }

    // Function to connect to the database
    async connectToDatabase() {
        // This function should be implemented based on the database being used
        // For example, using a PostgreSQL database:
        /*
        const { Pool } = require('pg');
        const pool = new Pool(this.dbConfig);
        return pool;
        */
        throw new Error('connectToDatabase method must be implemented');
    }
}

/* Preload.js - A preload script to expose the DatabaseMigrator to the renderer process */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    migrateDatabase: () => {
        ipcRenderer.send('migrate');
    },
});

ipcRenderer.on('migrate', async (event, arg) => {
    try {
        const dbMigrator = new DatabaseMigrator({ /* database configuration */ });
        await dbMigrator.migrate();
        console.log('Database migration completed successfully');
    } catch (error) {
        console.error('Database migration failed:', error);
    }
});
