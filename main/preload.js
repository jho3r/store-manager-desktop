const { contextBridge, ipcRenderer } = require('electron')

const productLoadTopic = 'products-load'
const productGetTopic = 'get-products'
const addSaleTopic = 'add-sale'
const getSalesTopic = 'get-sales'
const deleteSaleTopic = 'delete-sale'
const editSaleTopic = 'edit-sale'

contextBridge.exposeInMainWorld('electronApi', {
  chrome: () => 'su puta madre',
  onProductsLoaded: (callback) => ipcRenderer.on(productLoadTopic, callback),
  removeListener: (channel, callback) => ipcRenderer.removeListener(channel, callback),
  getProducts: () => ipcRenderer.invoke(productGetTopic),
  addSale: (sale, date) => ipcRenderer.invoke(addSaleTopic, sale, date),
  getSales: (date) => ipcRenderer.invoke(getSalesTopic, date),
  deleteSale: (saleId, saleDate) => ipcRenderer.invoke(deleteSaleTopic, saleId, saleDate),
  editSale: (sale, saleDate) => ipcRenderer.invoke(editSaleTopic, sale, saleDate)
  // we can also expose variables, not just functions
})
