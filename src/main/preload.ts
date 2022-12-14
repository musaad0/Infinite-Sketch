import { contextBridge, ipcRenderer } from 'electron';

import { Folder } from '../renderer/types';

import { isMac } from './detectPlatform';

export type Channels =
  | 'getFolders'
  | 'openDialog'
  | 'showContextMenu'
  | 'contextMenuActions'
  | 'showTransparentToMouseModal'; // LATER

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  send: (channel: Channels, data: any) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel: Channels, func: any) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  close: () => ipcRenderer.send('windowControls:close'),
  maximize: () => ipcRenderer.send('windowControls:maximize'),
  minimize: () => ipcRenderer.send('windowControls:minimize'),
  getFolders: async (): Promise<void | Folder[]> =>
    ipcRenderer.sendSync('getFolders'),

  store: {
    get(val: string) {
      return ipcRenderer.sendSync('electron-store-get', val);
    },
    set(property: string, val: any) {
      ipcRenderer.send('electron-store-set', property, val);
    },
  },

  openDialog: async (): Promise<string | void | undefined> =>
    ipcRenderer.invoke('show-open-dialog'),
  isMac,
});
