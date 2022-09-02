import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItem,
  dialog,
  shell,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import fs from 'fs';
import log from 'electron-log';
import Store from 'electron-store';
import resolveHtmlPath from './util';

app.disableHardwareAcceleration();

const schema = {
  session : {
    type: 'object',
    properties : {
      foldersPaths: {
        type: 'array',
      },
      interval: {
        type: 'string',
      },
      index: {
        type: 'number',
        minimum: 0,
      },
      shuffle: {
        type: 'object',
        properties: {
          isShuffle:{
            type:'boolean'
          },
          seed:{
            type:'number'
          },
        }
      },
    }
  },
  alwaysOnTopToggle: {
    type:'boolean',
    default: true
  },
  state: {
    type: 'object',
    properties: {
      x: {
        type: 'number',
      },
      y: {
        type: 'number',
      },
      width: {
        type: 'number',
      },
      height: {
        type: 'number',
      },
    }
  }
};

const store = new Store({schema});
let mainWindow;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDarwin = process.platform === 'darwin';
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
        click: () => {},
      },
    ],
  })
);

Menu.setApplicationMenu(menu);

function createWindow() {
  // get last saved window state
  const state = store.get('state');
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
    fullscreenable: isDarwin,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      nativeWindowOpen: true,
      webSecurity: !isDebug,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    frame: false,
    show: false,
  });

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.setAlwaysOnTop(true);
  mainWindow.loadURL(resolveHtmlPath('index.html'));
  ipcMain.on('windowControls:maximize', () => {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
  });

  ipcMain.on('windowControls:minimize', () => {
    mainWindow.minimize();
  });

  ipcMain.on('windowControls:close', () => {
    mainWindow.close();
  });
}

let files = [];
const imagesTypes = ['jpg', 'jpeg', 'png', 'gif', 'avif', 'apng', 'webp'];

function ThroughDirectory(Directory) {
  fs.readdirSync(Directory).forEach((File) => {
    const Absolute = path.join(Directory, File);
    if (fs.statSync(Absolute).isDirectory()) return ThroughDirectory(Absolute);

    // only add images
    if (imagesTypes.includes(path.extname(File).substring(1))) {
      return files.push(Absolute);
    }
  });
}

ipcMain.on('getFolders', async (event) => {
  const foldersPaths = store.get('session.foldersPaths');
  if (foldersPaths === undefined) {
    event.returnValue = foldersPaths;
    return;
  }
  const folders = handleFiles(foldersPaths);
  event.returnValue = folders;
});

ipcMain.handle('show-open-dialog', async () => {
  return dialog
    .showOpenDialog(mainWindow, {
      properties: ['openDirectory', 'multiSelections'],
      title: 'Add Folders',
    })
    .then((result) => {
      if (result.canceled) return;
      const folders = handleFiles(result.filePaths);
      return folders;
    })
    .catch((err) => log.error(err));
});

ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = store.get(val);
});
ipcMain.on('electron-store-set', async (event, key, val) => {
  store.set(key, val);
});

ipcMain.on('contextMenu:alwaysOnTop', (e, data) => {
  handleAlwaysOnTop(data);
});

function handleFiles(paths) {
  const folders = [];
  for (const folder of paths) {
    const folderName = path.basename(folder);
    ThroughDirectory(path.resolve(folder));
    folders.push({ path: folder, name: folderName, files });
    files = [];
  }
  return folders;
}

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(() => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
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

function handleAlwaysOnTop(alwaysOnTopToggle) {
  store.set('alwaysOnTopToggle', alwaysOnTopToggle);
  mainWindow.setAlwaysOnTop(alwaysOnTopToggle);
}
