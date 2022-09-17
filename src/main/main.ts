import { app, BrowserWindow, ipcMain, Menu, MenuItem, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import fs from 'fs';
import log from 'electron-log';
import Store, { Schema as ESchema } from 'electron-store';
import resolveHtmlPath from './util';

app.disableHardwareAcceleration();

interface State {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Schema {
  session: {
    foldersPaths: string[];
    interval: number;
    index: number;
    shuffle: {
      isShuffle: boolean;
      seed: number;
    };
  };
  alwaysOnTopToggle: boolean;
  state: State;
}

const schema: ESchema<Schema> = {
  session: {
    type: 'object',
    properties: {
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
          isShuffle: {
            type: 'boolean',
          },
          seed: {
            type: 'number',
          },
        },
      },
    },
    default: {},
  },
  alwaysOnTopToggle: {
    type: 'boolean',
    default: true,
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
    },
  },
};

const store = new Store<Schema>({ schema });
let mainWindow: BrowserWindow;

if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDarwin = process.platform === 'darwin';
const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  // eslint-disable-next-line global-require
  require('electron-debug')();
}

// Disable Refresh
const menu = new Menu();
menu.append(
  new MenuItem({
    label: 'Electron',
    submenu: [
      {
        role: 'reload',
        accelerator: process.platform === 'darwin' ? 'Cmd+R' : 'Ctrl+R',
        click: () => {},
      },
    ],
  })
);

Menu.setApplicationMenu(menu);

function createWindow() {
  // get last saved window state
  const state: State = store.get('state');
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]) => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    width: state?.width ?? 500,
    height: state?.height ?? 700,
    x: state?.x ?? 'center',
    y: state?.y ?? 'center',
    minWidth: 400,
    minHeight: 300,
    icon: getAssetPath('icon.png'),
    autoHideMenuBar: true,
    fullscreenable: isDarwin,
    webPreferences: {
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
    if (isDarwin) mainWindow.setFullScreen(!mainWindow.isFullScreen());
    else {
      if (mainWindow.isMaximized()) mainWindow.unmaximize();
      else mainWindow.maximize();
    }
  });

  ipcMain.on('windowControls:minimize', () => {
    mainWindow.minimize();
  });

  ipcMain.on('windowControls:close', () => {
    mainWindow.close();
  });
}

let files: string[] = [];
const imagesTypes = ['jpg', 'jpeg', 'png', 'gif', 'avif', 'apng', 'webp'];

function ThroughDirectory(Directory: string) {
  // eslint-disable-next-line consistent-return
  fs.readdirSync(Directory).forEach((File) => {
    const Absolute = path.join(Directory, File);
    if (fs.statSync(Absolute).isDirectory()) return ThroughDirectory(Absolute);

    // only add images
    if (imagesTypes.includes(path.extname(File).substring(1))) {
      return files.push(Absolute);
    }
  });
}

function handleFiles(paths: string[]) {
  const folders = [];
  let id = 0;
  for (const folder of paths) {
    const folderName = path.basename(folder);
    ThroughDirectory(path.resolve(folder));
    folders.push({ path: folder, name: folderName, files, id: id++ });
    files = [];
  }
  return folders;
}

function handleAlwaysOnTop(alwaysOnTopToggle: boolean) {
  store.set('alwaysOnTopToggle', alwaysOnTopToggle);
  mainWindow.setAlwaysOnTop(alwaysOnTopToggle);
}

ipcMain.on('getFolders', async (event) => {
  const foldersPaths: string[] | undefined = store.get('session.foldersPaths');
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
      // eslint-disable-next-line consistent-return
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

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

let saveBoundsCookie: NodeJS.Timeout | undefined;

function saveBoundsSoon() {
  if (saveBoundsCookie) clearTimeout(saveBoundsCookie);

  saveBoundsCookie = setTimeout(() => {
    saveBoundsCookie = undefined;

    const state = mainWindow.getNormalBounds();

    store.set('state', state);
  }, 1000);
}

app
  .whenReady()
  // eslint-disable-next-line promise/always-return
  .then(() => {
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
  })
  .catch((err) => log.error(err));
