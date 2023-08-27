const { dialog } = require('electron')
const {
  readProductsFromFile,
  writeProductsToJSONFile
} = require('../storage/file_manager')
const config = require('../../config/config')
const path = require('path')

class FileActions {
  /**
   * Creates an instance of FileActions.
   * @param {Electron.BrowserWindow} window
   */
  constructor (window) {
    this.window = window
  }

  /**
   * Add products from a CSV file
   */
  async addProductsAction () {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'CSV Files', extensions: ['csv'] }]
    })

    if (!filePaths || filePaths.length === 0) {
      return
    }

    const selectedFile = filePaths[0]

    try {
      const products = await readProductsFromFile(selectedFile)
      const productsFilePath = path.join(
        config.dataPath,
        config.productsFileName
      )
      await writeProductsToJSONFile(productsFilePath, products)

      this.window.webContents.send(config.productLoadTopic, {
        error: null
      })
    } catch (error) {
      this.window.webContents.send(config.productLoadTopic, {
        error: error.message
      })
    }
  }
}

module.exports = {
  FileActions
}
