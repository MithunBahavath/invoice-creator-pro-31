
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  onMenuAction: (callback) => ipcRenderer.on('menu-action', callback),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  platform: process.platform,
  versions: process.versions,
  // File system operations
  saveData: (key, data) => ipcRenderer.invoke('save-data', { key, data }),
  loadData: (key) => ipcRenderer.invoke('load-data', key),
  getDataPath: () => ipcRenderer.invoke('get-data-path')
});

// Add application info
contextBridge.exposeInMainWorld('appInfo', {
  name: 'Invoice Creator Pro',
  version: '1.0.0',
  isElectron: true
});
