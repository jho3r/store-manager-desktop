const { contextBridge, ipcRenderer } = require('electron')

const productLoadTopic = 'products-load'
const productGetTopic = 'get-products'

contextBridge.exposeInMainWorld('electronApi', {
  chrome: () => 'su puta madre',
  onProductsLoaded: (callback) => ipcRenderer.on(productLoadTopic, callback),
  removeListener: (channel, callback) => ipcRenderer.removeListener(channel, callback),
  getProducts: () => ipcRenderer.invoke(productGetTopic)
  // we can also expose variables, not just functions
})
