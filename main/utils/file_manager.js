const fs = require('fs').promises

async function createFolderIfNotExists (folderPath) {
  try {
    await fs.access(folderPath) // Check if the folder exists
  } catch (error) {
    // Folder doesn't exist, so create it
    await fs.mkdir(folderPath)
    console.log('Folder created successfully.')
  }
}

module.exports = {
  createFolderIfNotExists
}
