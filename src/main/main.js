// const { app, BrowserWindow, ipcMain, Menu, MenuItem } = require('electron');
import { app, BrowserWindow, ipcMain, Menu, MenuItem } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import fs from 'fs';
import Store from 'electron-store';
import resolveHtmlPath from './util';

app.disableHardwareAcceleration();

const store = new Store();
let mainWindow;
let alwaysOnTopToggle = store.get('alwaysOnTopToggle');
if (alwaysOnTopToggle === undefined) alwaysOnTopToggle = true;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

// Disable Refresh
const menu = new Menu();
menu.append(
  new MenuItem({
    label: 'Electron',
    submenu: [
      {
        role: 'Disable refresh',
        accelerator: process.platform === 'darwin' ? 'Cmd+R' : 'Ctrl+R',
        click: () => {
          return;
        },
      },
    ],
  })
);

Menu.setApplicationMenu(menu);

function createWindow() {
  // get last saved window state
  let state = store.get('state');
  let x = 'center';
  let y = 'center';
  let width = 500;
  let height = 700;
  if (state) {
    x = state.x;
    y = state.y;
    width = state.width;
    height = state.height;
  }
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths) => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    width,
    height,
    x,
    y,
    minWidth: 400,
    minHeight: 300,
    icon: getAssetPath('icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      devTools: false,
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      nativeWindowOpen: true,
      webSecurity: isDebug ? false : true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    frame: false,
    show: false,
  });

  mainWindow.on('ready-to-show', mainWindow.show);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.setAlwaysOnTop(alwaysOnTopToggle);
  mainWindow.loadURL(resolveHtmlPath('index.html'));

  ipcMain.on('windowControls:maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on('windowControls:minimize', () => {
    mainWindow.minimize();
  });

  ipcMain.on('windowControls:close', () => {
    mainWindow.close();
  });

  ipcMain.on('show-context-menu', (ev) => {
    const template = [
      {
        label: 'Always On Top',
        type: 'checkbox',
        checked: alwaysOnTopToggle,
        click: () => {
          alwaysOnTopToggle = !alwaysOnTopToggle;
          store.set('alwaysOnTopToggle', alwaysOnTopToggle);
          mainWindow.setAlwaysOnTop(alwaysOnTopToggle);
        },
      },
    ];
    const menu = Menu.buildFromTemplate(template);
    menu.popup(BrowserWindow.fromWebContents(ev.sender));
  });
}

let files = [];
function ThroughDirectory(Directory) {
  fs.readdirSync(Directory).forEach((File) => {
    const Absolute = path.join(Directory, File);
    if (fs.statSync(Absolute).isDirectory()) return ThroughDirectory(Absolute);
    else return files.push(Absolute);
  });
}

ipcMain.on('getFolders', async (event) => {
  const foldersPaths = store.get('foldersPaths');
  if (foldersPaths === undefined) return;
  const folders = handleFiles(foldersPaths);
  event.returnValue = folders;
});

ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = store.get(val);
});
ipcMain.on('electron-store-set', async (event, key, val) => {
  store.set(key, val);
});

function handleFiles(paths) {
  const folders = [];
  for (const folder of paths) {
    const pathSplit = folder.split('/');
    const folderName = pathSplit[pathSplit.length - 1];
    ThroughDirectory(path.resolve(folder));
    folders.push({ name: folderName, files: files });
    files = [];
  }
  return folders;
}

app.whenReady().then(() => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  mainWindow.on('resize', saveBoundsSoon);
  mainWindow.on('move', saveBoundsSoon);
});

let saveBoundsCookie;
function saveBoundsSoon() {
  if (saveBoundsCookie) clearTimeout(saveBoundsCookie);

  saveBoundsCookie = setTimeout(() => {
    saveBoundsCookie = undefined;

    const state = mainWindow.getNormalBounds();

    store.set('state', state);
  }, 1000);
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
