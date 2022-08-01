const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  send: (channel, data) => {
    // whitelist channels
    let validChannels = ['toMain','contextMenu:alwaysOnTop'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ['fromMain'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  close: () => ipcRenderer.send('windowControls:close'),
  maximize: () => ipcRenderer.send('windowControls:maximize'),
  minimize: () => ipcRenderer.send('windowControls:minimize'),
  menu: () => ipcRenderer.send('show-context-menu'),
  recieveFrom: {
    get() {
      return ipcRenderer.sendSync('getFolders');
    },
  },
  store: {
    get(val) {
      return ipcRenderer.sendSync('electron-store-get', val);
    },
    set(property, val) {
      ipcRenderer.send('electron-store-set', property, val);
    },
  },
  openDialog: async () => ipcRenderer.invoke('show-open-dialog'),
});
