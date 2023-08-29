const fs = require('fs').promises

const readSalesFromJSONFile = async (salesFilePath) => {
  try {
    const data = await fs.readFile(salesFilePath, 'utf8')
    const sales = JSON.parse(data)
    return sales
  } catch (error) {
    console.log('readSalesFromJSONFile error: ', error)
    throw error
  }
}

const writeSalesToJSONFile = async (salesFilePath, sales) => {
  try {
    const data = JSON.stringify(sales)
    await fs.writeFile(salesFilePath, data)
  } catch (error) {
    console.log('writeSalesToJSONFile error: ', error)
    throw error
  }
}

module.exports = {
  readSalesFromJSONFile,
  writeSalesToJSONFile
}
