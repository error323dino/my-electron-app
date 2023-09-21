const { app, BrowserWindow } = require('electron')
const path = require('path')
const electronReload = require('electron-reload');


// const axios = require('axios');

// axios.get('http://Kezzz.pythonanywhere.com/api/data')
//   .then(response => {
//     console.log(response.data);
//     // Process the response data received from the Flask API
//   })
//   .catch(error => {
//     console.error(error);
//     // Handle any errors that occurred during the request
//   });

electronReload(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
});

function createWindow () {
 
  const winLogin = new BrowserWindow({
    width: 1200,
    height: 700,
    backgroundColor: '#fbffa1', 
    resizable: false,
    //frame: false,
    show:false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
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