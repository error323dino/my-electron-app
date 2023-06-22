const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
 
  const winLogin = new BrowserWindow({
    width: 1200,
    height: 700,
    backgroundColor: '#fbffa1', 
    //frame: false,
    show:false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
     
    }
  });
  winLogin.once('ready-to-show', () =>{
    winLogin.show();
  })
  winLogin.webContents.openDevTools();
  winLogin.loadFile('login.html')

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