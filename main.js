const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
 
  const win = new BrowserWindow({
    width: 1200,
    height: 700,
    backgroundColor: '#fbffa1', 
    //frame: false,
    show:false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
     
    }
  });

  win.once('ready-to-show', () =>{
    win.show();
  })
  win.webContents.openDevTools();
  win.loadFile('index.html')
    
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})