const { app, BrowserWindow, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const { MenuManager } = require('./menu/menu')
const { getProductsHandler } = require('./handlers/products.handler')
const {
  addSaleHandler,
  getSalesHandler,
  deleteSaleHandler,
  updateSaleHandler,
  downloadSalesAsCSVHandler
} = require('./handlers/sales.handler')
const { createFolderIfNotExists } = require('./utils/file_manager')
const config = require('../config/config')

const createNeededFolders = () => {
  const folderPaths = [config.dataPath, config.salesPath]
  folderPaths.forEach(async (folderPath) => {
    await createFolderIfNotExists(folderPath)
  })
}

const getDevConfig = () => {
  const { width, height } =
    require('electron').screen.getPrimaryDisplay().workAreaSize

  // Calculate the dimensions for the bottom right quarter
  const windowWidth = Math.round(width / 2)
  const windowHeight = Math.round(height / 2)
  const windowX = width - windowWidth
  const windowY = height - windowHeight

  return {
    width: windowWidth,
    height: windowHeight,
    x: windowX,
    y: windowY
  }
}

const getProdConfig = () => {
  return {
    show: false
  }
}

const createWindow = () => {
  const configs = isDev ? getDevConfig() : getProdConfig()

  const win = new BrowserWindow({
    ...configs,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (isDev) {
    console.log('Running in development')
    win.loadURL('http://localhost:3000')
  } else {
    console.log('Running in production')
    win.maximize()
    win.show()
    win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
  }

  const menuManager = new MenuManager(win)
  menuManager.setupMenu()
}

const setupIpc = () => {
  ipcMain.handle(config.productGetTopic, getProductsHandler)
  ipcMain.handle(config.addSaleTopic, addSaleHandler)
  ipcMain.handle(config.getSalesTopic, getSalesHandler)
  ipcMain.handle(config.deleteSaleTopic, deleteSaleHandler)
  ipcMain.handle(config.editSaleTopic, updateSaleHandler)
  ipcMain.handle(config.downloadSalesTopic, downloadSalesAsCSVHandler)
}

app.whenReady().then(() => {
  setupIpc()
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
