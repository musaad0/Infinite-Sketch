/* eslint-disable global-require */
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import fs from 'fs';
import log from 'electron-log';
import Store, { Schema as ESchema } from 'electron-store';
import { EContextMenuActions } from '../enums/menuActions';
import resolveHtmlPath from './util';

app.disableHardwareAcceleration();

interface State {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IStore {
  session: {
    foldersPaths: string[];
    interval: number;
    index: number;
    shuffle: {
      isShuffle: boolean;
      seed: number;
    };
  };
  settings: {
    alwaysOnTop: boolean;
  };
  state: State;
}

const schema: ESchema<IStore> = {
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
  settings: {
    type: 'object',
    properties: {
      alwaysOnTop: {
        type: 'boolean',
        default: true,
      },
    },
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

const store = new Store<IStore>({ schema });

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

function handleAlwaysOnTop(checked: boolean) {
  mainWindow?.setAlwaysOnTop(checked);
  store.set('settings.alwaysOnTop', checked);
}

function handleTransparentToMouse(checked: boolean) {
  mainWindow?.setIgnoreMouseEvents(checked);
  if (!checked) {
    mainWindow?.webContents.send('showTransparentToMouseModal', 'placeholder'); // this will show confirmation modal
  }
}

function handleWindowOpacity(value: number) {
  if (value < 0 || value > 1) return;
  mainWindow?.setOpacity(value > 10 ? 20 : value);
}

const isDarwin = process.platform === 'darwin';
const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  // eslint-disable-next-line global-require
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  // get last saved window state
  if (isDebug) {
    await installExtensions();
  }

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
  mainWindow.loadURL(resolveHtmlPath('index.html'));
  ipcMain.on('windowControls:maximize', () => {
    if (isDarwin) mainWindow?.setFullScreen(!mainWindow.isFullScreen());
    else {
      if (mainWindow?.isMaximized()) mainWindow.unmaximize();
      else mainWindow?.maximize();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipcMain.on(
    'contextMenuActions',
    (
      _,
      data: {
        action: EContextMenuActions;
        data: any;
      }
    ) => {
      if (data.action === EContextMenuActions.TRANSPARENT_TO_MOUSE) {
        handleTransparentToMouse(data.data as boolean);
      }
      if (data.action === EContextMenuActions.ALWAYS_ON_TOP) {
        handleAlwaysOnTop(data.data as boolean);
      }
      if (data.action === EContextMenuActions.WINDOW_OPACITY) {
        handleWindowOpacity(data.data);
      }
    }
  );

  ipcMain.on('windowControls:minimize', () => {
    mainWindow?.minimize();
  });

  ipcMain.on('windowControls:close', () => {
    mainWindow?.close();
  });

  // eslint-disable-next-line no-new
  new AppUpdater();
};

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
