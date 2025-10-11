// 代码生成时间: 2025-10-11 17:05:29
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { dialog } = require('electron');

// FolderOrganizer class definition
class FolderOrganizer {
  constructor() {
    this.workspace = path.join(os.homedir(), 'Desktop', 'organized'); // Default workspace
  }

  // Function to prompt the user for a source folder
  async getSourceFolder() {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      defaultPath: this.workspace
    });
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    throw new Error('User canceled the folder selection');
  }

  // Function to organize the folder contents
  async organizeFolder(folderPath) {
    try {
      const files = await fs.readdir(folderPath);
      const organized = {};

      // Organize files by type
      files.forEach(file => {
        const extension = path.extname(file).toLowerCase();
        if (!organized[extension]) {
          organized[extension] = [];
        }
        organized[extension].push(path.join(folderPath, file));
      });

      // Create directories for each file type
      await Promise.all(Object.keys(organized).map(async (ext) => {
        const dirPath = path.join(folderPath, ext.slice(1)); // Remove the dot
        await fs.ensureDir(dirPath); // Ensure the directory exists
        organized[ext].forEach(file => {
          fs.rename(file, path.join(dirPath, path.basename(file))); // Move files into their respective folders
        });
      }));

      console.log('Folder organized successfully!');
    } catch (error) {
      console.error('Error organizing folder:', error);
      throw error;
    }
  }

  // Function to start the organization process
  async start() {
    try {
      const sourceFolder = await this.getSourceFolder();
      await this.organizeFolder(sourceFolder);
    } catch (error) {
      dialog.showErrorBox('Error', error.message);
    }
  }
}

// Main function to run the Folder Organizer
async function main() {
  const organizer = new FolderOrganizer();
  await organizer.start();
}

// Run the main function when the script is executed
main();