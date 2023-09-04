const path = require('path')
const config = require('../../config/config')
const { createFolderIfNotExists } = require('../utils/file_manager')
const { readSalesFromJSONFile, writeSalesToJSONFile } = require('../storage/sales.storage')
const { convertArrayToCsv } = require('../utils/converters')

/**
 * Add a sale to the sales file
 * @param {Object} event
 * @param {Object} sale
 * @param {string} sale.barcode
 * @param {string} sale.name
 * @param {number} sale.quantity
 * @param {number} sale.price
 * @param {Date} sale.createdAt
 * @param {number} sale.total
 * @param {boolean} sale.owed
 * @param {string} sale.comment
 * @param {Object} sale.hiddenComment
 * @param {number} sale.productId
 * @param {boolean} sale.deleted
 * @param {string} sale.debtor
 * @param {number} sale.originalPrice
 * @param {string} sale.updatedAt
 * @param {string} date - date of the sale in the format YYYY-MM-DD
 * @returns
 */
const addSaleHandler = async (event, sale, date) => {
  try {
    const salesDate = new Date(date)
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

/**
 * Delete a sale from the sales file
 * @param {Object} event
 * @param {number} saleId
 * @param {string} saleDate - date of the sale in the format YYYY-MM-DD
 * @returns {Promise<Object>}
 */
const deleteSaleHandler = async (event, saleId, saleDate) => {
  try {
    const salesDate = new Date(saleDate)
    const year = salesDate.getUTCFullYear()
    const month = salesDate.getUTCMonth() + 1 // months from 1-12
    const day = salesDate.getUTCDate()
    const salesFileName = `${year}-${month}-${day}.json`
    const salesFilePath = path.join(config.salesPath, year.toString(), month.toString(), salesFileName)
    const sales = await readSalesFromJSONFile(salesFilePath)
    const saleIndex = sales.findIndex(sale => sale.id === saleId)
    if (saleIndex === -1) {
      return { error: 'Sale not found' }
    }
    sales[saleIndex].deleted = true
    await writeSalesToJSONFile(salesFilePath, sales)
    return { data: sales[saleIndex] }
  } catch (error) {
    console.log('ipcMain.handle error: ', error)
    return { error: error.message }
  }
}

const updateSaleHandler = async (event, sale, saleDate) => {
  try {
    const salesDate = new Date(saleDate)
    const year = salesDate.getUTCFullYear()
    const month = salesDate.getUTCMonth() + 1 // months from 1-12
    const day = salesDate.getUTCDate()
    const salesFileName = `${year}-${month}-${day}.json`
    const salesFilePath = path.join(config.salesPath, year.toString(), month.toString(), salesFileName)
    const sales = await readSalesFromJSONFile(salesFilePath)
    const saleIndex = sales.findIndex(saleItem => saleItem.id === sale.id)
    if (saleIndex === -1) {
      return { error: 'Sale not found' }
    }
    sales[saleIndex] = sale
    await writeSalesToJSONFile(salesFilePath, sales)
    return { data: sales[saleIndex] }
  } catch (error) {
    console.log('ipcMain.handle error: ', error)
    return { error: error.message }
  }
}

/**
 * Download sales as CSV
 * @param {Object} event
 * @param {string} date - date of the sale in the format YYYY-MM-DD
 * @returns {Promise<Object>}
 */
const downloadSalesAsCSVHandler = async (event, date) => {
  try {
    const salesDate = new Date(date)
    const year = salesDate.getUTCFullYear()
    const month = salesDate.getUTCMonth() + 1 // months from 1-12
    const day = salesDate.getUTCDate()
    const salesFileName = `${year}-${month}-${day}.json`
    const salesFilePath = path.join(config.salesPath, year.toString(), month.toString(), salesFileName)
    const sales = await readSalesFromJSONFile(salesFilePath)
    const csv = convertArrayToCsv(sales)
    return { data: csv }
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { error: 'No sales found' }
    }
    console.log('ipcMain.handle error: ', error)
    return { error: error.message }
  }
}

module.exports = {
  addSaleHandler,
  getSalesHandler,
  deleteSaleHandler,
  updateSaleHandler,
  downloadSalesAsCSVHandler
}
