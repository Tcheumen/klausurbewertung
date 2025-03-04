const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  loadData: () => ipcRenderer.invoke('loadData'),
  saveData: (data) => ipcRenderer.invoke('saveData', data),
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args))
});
