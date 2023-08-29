const path = require('path')
const config = require('../../config/config')
const { createFolderIfNotExists } = require('../utils/file_manager')
const { readSalesFromJSONFile, writeSalesToJSONFile } = require('../storage/sales.storage')

/**
 * Add a sale to the sales file
 * @param {Object} event
 * @param {Object} sale
 * @param {string} sale.barcode
 * @param {string} sale.name
 * @param {number} sale.quantity
 * @param {number} sale.price
 * @param {Date} sale.time
 * @param {number} sale.total
 * @param {boolean} sale.owed
 * @param {string} sale.comment
 * @param {Object} sale.hiddenComment
 * @param {number} sale.productID
 * @param {boolean} sale.deleted
 * @param {string} sale.debtor
 * @param {string} date - date of the sale in the format YYYY-MM-DD
 * @returns
 */
const addSaleHandler = async (event, sale, date) => {
  try {
    const salesDate = new Date(date)
    console.log('args', sale)
    console.log('args.date', date)
    console.log('salesDate', salesDate)
    const year = salesDate.getUTCFullYear()
    const month = salesDate.getUTCMonth() + 1 // months from 1-12
    const day = salesDate.getUTCDate()
    // create container folders if they don't exist
    const folderPaths = [
      path.join(config.salesPath, year.toString()),
      path.join(config.salesPath, year.toString(), month.toString())
    ]

    folderPaths.forEach(async (folderPath) => {
      await createFolderIfNotExists(folderPath)
    })

    const salesFileName = `${year}-${month}-${day}.json`
    const salesFilePath = path.join(config.salesPath, year.toString(), month.toString(), salesFileName)
    const sales = await readSalesFromJSONFile(salesFilePath).catch((error) => {
      if (error.code === 'ENOENT') {
        return []
      } else {
        throw error
      }
    })

    const newSale = {
      id: sales.length + 1,
      ...sale
    }
    sales.push(newSale)
    await writeSalesToJSONFile(salesFilePath, sales)
    return { data: newSale }
  } catch (error) {
    console.log('ipcMain.handle error: ', error)
    return { error: error.message }
  }
}

/**
 * Get sales from the sales file
 * @param {Object} event
 * @param {string} date - date of the sale in the format YYYY-MM-DD
 * @returns {Promise<Object>}
 */
const getSalesHandler = async (event, date) => {
  try {
    const salesDate = new Date(date)
    const year = salesDate.getUTCFullYear()
    const month = salesDate.getUTCMonth() + 1 // months from 1-12
    const day = salesDate.getUTCDate()
    const salesFileName = `${year}-${month}-${day}.json`
    const salesFilePath = path.join(config.salesPath, year.toString(), month.toString(), salesFileName)
    const sales = await readSalesFromJSONFile(salesFilePath)
    return { data: sales }
  } catch (error) {
    console.log('ipcMain.handle error: ', error)
    if (error.code === 'ENOENT') {
      return { error: 'No sales found' }
    }
    return { error: error.message }
  }
}

module.exports = {
  addSaleHandler,
  getSalesHandler
}
