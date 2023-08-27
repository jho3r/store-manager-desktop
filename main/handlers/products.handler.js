const path = require('path')
const config = require('../../config/config')
const { readProductsFromJSONFile } = require('../storage/file_manager')

const getProductsHandler = async (event) => {
  try {
    const productsFilePath = path.join(config.dataPath, config.productsFileName)
    const products = await readProductsFromJSONFile(productsFilePath)
    return products
  } catch (error) {
    console.log('ipcMain.handle error: ', error)
    return []
  }
}

module.exports = {
  getProductsHandler
}
