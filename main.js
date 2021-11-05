const {app, BrowserWindow,ipcMain} = require('electron');
const path = require('path');
const fs = require('fs');
let mainWindow;
function createWindow(){
     mainWindow = new BrowserWindow({
        title:"work",
        width:500,
        height:600,
        webPreferences:{
            nodeIntegration:false,
            contextIsolation:true,
            enableRemoteModule:false,
            preload: path.join(__dirname, "preload.js"),// use a preload script

            // contextIsolation:false
        },
          // frame:false
          titleBarStyle:"customButtonsOnHover",
          frame:false
    })

    mainWindow.setMenuBarVisibility(false) //partially
    mainWindow.loadFile('./app/index.html')

     ipcMain.on('windowControls:maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore()
    } else {
      mainWindow.maximize()
    }
  })

  ipcMain.on('windowControls:minimize', () => {
    mainWindow.minimize()
  })

  ipcMain.on('windowControls:close', () => {
    mainWindow.close()
  })
}
// custom title bar

let files = []
function ThroughDirectory(Directory) {
    fs.readdirSync(Directory).forEach(File => {
        const Absolute = path.join(Directory, File);
        if (fs.statSync(Absolute).isDirectory()) return ThroughDirectory(Absolute);
        else return files.push(Absolute);
    });
}

ipcMain.on("toMain",(evt,path)=>{
  mainWindow.webContents
  .executeJavaScript('localStorage.getItem("folderPaths");', true)
  .then(item => {
    const folders = handleFiles(item);
  mainWindow.webContents.send('fromMain',folders);
  });
})

function handleFiles(paths){
  const folders = [];
  folderPaths = JSON.parse(paths);
  for (const folder of folderPaths) {
    const pathSplit = folder.split("/");
    const folderName = pathSplit[pathSplit.length-1];
    ThroughDirectory(path.resolve(folder));
    folders.push({folderName,filesArr:files});
    files = [];
  }
  return folders;

}

// app.on('ready',createWindow)
app.whenReady().then(() => {
  createWindow()
//    mainWindow.webContents.on('did-finish-load', () => {
// mainWindow.webContents.send('fromMain', files);
//   })
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
