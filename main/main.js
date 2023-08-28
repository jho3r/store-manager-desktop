const { app, BrowserWindow, ipcMain } = require('electron')
const { MenuManager } = require('./menu/menu')
const path = require('path')
const config = require('../config/config')
const { getProductsHandler } = require('./handlers/products.handler')
const { createFolderIfNotExists } = require('./storage/file_manager')

const createNeededFolders = () => {
  const folderPaths = [config.dataPath, config.salesPath]
  folderPaths.forEach((folderPath) => {
    createFolderIfNotExists(folderPath)
  })
}

const createWindow = () => {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.maximize()
  win.show()

  // production
  win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
  // develop
  // win.loadURL('http://localhost:3000')

  const menuManager = new MenuManager(win)
  menuManager.setupMenu()
}

app.whenReady().then(() => {
  ipcMain.handle(config.productGetTopic, getProductsHandler)
  createWindow()
  createNeededFolders()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
