const fs = require('fs').promises
const Joi = require('joi')

const productSchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
  barcode: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.number().integer().min(1).required(),
  stock: Joi.number().integer().required()
})

// csv file like
// id,barcode,name,price,stock
// 1,123456789,Potatoes,2500,5
const readProductsFromFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8')
    const lines = data.trim().split('\n')
    const header = lines.shift().trim().split(',')
    const products = lines.map((line, index) => {
      const values = line.split(',')
      const productData = {}

      header.forEach((key, index) => {
        productData[key] = values[index].trim()
      })

      const { error, value } = productSchema.validate(productData)

      if (error) {
        throw new Error(`Invalid product data at line ${index + 1}: ${error.message}`)
      } else {
        return value
      }
    })
    return products
  } catch (error) {
    console.log('readProductsFromFile error: ', error)
    throw error
  }
}

/**
 * write products to a file
 * @param {string} filePath - path to the file
 * @param {Array} products - array of products
 * @returns {Promise<void>}
 */
const writeProductsToJSONFile = async (filePath, products) => {
  try {
    const data = JSON.stringify(products)
    await fs.writeFile(filePath, data)
  } catch (error) {
    console.log('writeProductsToFile error: ', error)
    throw error
  }
}

const readProductsFromJSONFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8')
    const products = JSON.parse(data)
    return products
  } catch (error) {
    console.log('readProductsFromJSONFile error: ', error)
    throw error
  }
}

module.exports = {
  readProductsFromFile,
  writeProductsToJSONFile,
  readProductsFromJSONFile
}
