const { Menu } = require('electron')
const { FileActions } = require('./file.actions')

class MenuManager {
  /**
   * Creates an instance of MenuManager.
   * @param {Electron.BrowserWindow} window
   */
  constructor (window) {
    this.window = window
    this.fileActions = new FileActions(window)
  }

  setupMenu () {
    const template = [
      {
        label: 'File',
        submenu: [
          {
            label: 'Add Products',
            click: () => {
              this.fileActions.addProductsAction()
            }
          },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' }
        ]
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        role: 'window',
        submenu: [
          { role: 'minimize' },
          { role: 'zoom' },
          { type: 'separator' },
          { role: 'front' }
        ]
      },
      {
        role: 'help',
        submenu: [{ label: 'Learn More' }]
      }
    ]
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  }
}

module.exports = {
  MenuManager
}
