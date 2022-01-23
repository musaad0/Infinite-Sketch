const {app, BrowserWindow,ipcMain,Menu,MenuItem} = require('electron');
const {autoUpdater} = require("electron-updater");
const path = require('path');
const fs = require('fs');
const Store = require("electron-store");
const store = new Store();

let mainWindow;
let alwaysOnTopToggle = store.get("alwaysOnTopToggle");

if(alwaysOnTopToggle === undefined) alwaysOnTopToggle = true;

// Disable Refresh 
const menu = new Menu()
menu.append(new MenuItem({
  label: 'Electron',
  submenu: [{
    role: 'Disable refresh',
    accelerator: process.platform === 'darwin' ? 'Cmd+R' : 'Ctrl+R',
    click: () => {return}
  }]
}))

Menu.setApplicationMenu(menu)

function createWindow(){
  
  // get last saved window state
  let state = store.get('state');
  let x = "center";
  let y = "center";
  let width = 500;
  let height = 700;
  if(state){
      x = state.x
      y = state.y
      width = state.width;
      height = state.height;
  }

     mainWindow = new BrowserWindow({
        width,
        height,
        x,
        y,
        minWidth:400,
        minHeight:300,
        icon:path.join(__dirname,"assets/icon.ico"),
        autoHideMenuBar:true,
        webPreferences:{
            devTools:false,
            nodeIntegration:false,
            contextIsolation:true,
            enableRemoteModule:false,
            nativeWindowOpen:true,
            preload: path.join(__dirname, "preload.js"),

        },
          frame:false,
          show:false

    })


    mainWindow.on("ready-to-show",mainWindow.show);
    mainWindow.setMenuBarVisibility(false) 
    mainWindow.setAlwaysOnTop(alwaysOnTopToggle);
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


  ipcMain.on('show-context-menu',(ev)=>{
    const template = [
      { 
        label: 'Always On Top',
        type: 'checkbox',
        checked: alwaysOnTopToggle,
        click:()=>{
          alwaysOnTopToggle =!alwaysOnTopToggle
          store.set("alwaysOnTopToggle",alwaysOnTopToggle);
          mainWindow.setAlwaysOnTop(alwaysOnTopToggle);
        }
      }
    ]
    const menu = Menu.buildFromTemplate(template)
    menu.popup(BrowserWindow.fromWebContents(ev.sender))
  })

}

let files = []
function ThroughDirectory(Directory) {
    fs.readdirSync(Directory).forEach(File => {
        const Absolute = path.join(Directory, File);
        if (fs.statSync(Absolute).isDirectory()) return ThroughDirectory(Absolute);
        else return files.push(Absolute);
    });
}

// change to STORE package implementation later
ipcMain.on("toMain",(evt,path)=>{
  mainWindow.webContents
  .executeJavaScript('localStorage.getItem("folderPaths");', true)
  .then(item => {
    const folders = handleFiles(item);
    mainWindow.webContents.send('fromMain',folders);
  })
  .catch(err => console.log(err))
  
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

app.whenReady().then(() => {
  createWindow()
  autoUpdater.checkForUpdatesAndNotify();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
  mainWindow.on("resize", saveBoundsSoon);
  mainWindow.on("move", saveBoundsSoon);


})

let saveBoundsCookie;
function saveBoundsSoon() {
  if (saveBoundsCookie) clearTimeout(saveBoundsCookie);

  saveBoundsCookie = setTimeout(() => {
    saveBoundsCookie = undefined;

    const state = mainWindow.getNormalBounds();

    store.set("state",state);
  }, 1000);

}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
