/**
 * Converts an array of objects to a CSV string
 * @param {Array} array - array of objects
 * @returns {string} - CSV string
 */
const convertArrayToCsv = (array) => {
  // header in snake_case
  const header = Object.keys(array[0]).map(key => key.replace(/([A-Z])/g, '_$1').toLowerCase()).join(',')
  const lines = array.map(item => Object.values(item).join(','))
  return `${header}\n${lines.join('\n')}`
}

module.exports = {
  convertArrayToCsv
}
