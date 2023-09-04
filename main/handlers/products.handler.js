const path = require('path')
const config = require('../../config/config')
const { readProductsFromJSONFile } = require('../storage/product.storage')

/**
 * Get products from the products file
 * @param {Object} event
 * @returns {Promise<Object>}
 */
const getProductsHandler = async (event) => {
  try {
    const productsFilePath = path.join(
      config.dataPath,
      config.productsFileName
    )
    const products = await readProductsFromJSONFile(productsFilePath)
    return { data: products }
  } catch (error) {
    console.log('ipcMain.handle error: ', error)
    return { error: error.message }
  }
}

module.exports = {
  getProductsHandler
}
