const { contextBridge, ipcRenderer } = require('electron')

const productLoadTopic = 'products-load'
const productGetTopic = 'get-products'
const addSaleTopic = 'add-sale'
const getSalesTopic = 'get-sales'

contextBridge.exposeInMainWorld('electronApi', {
  chrome: () => 'su puta madre',
  onProductsLoaded: (callback) => ipcRenderer.on(productLoadTopic, callback),
  removeListener: (channel, callback) => ipcRenderer.removeListener(channel, callback),
  getProducts: () => ipcRenderer.invoke(productGetTopic),
  addSale: (sale, date) => ipcRenderer.invoke(addSaleTopic, sale, date),
  getSales: (date) => ipcRenderer.invoke(getSalesTopic, date)
  // we can also expose variables, not just functions
})
