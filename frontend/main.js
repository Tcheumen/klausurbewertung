const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

async function loadElectronStore() {
  const Store = (await import('electron-store')).default;
  return new Store();
}

let store;
loadElectronStore().then((s) => (store = s));

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  win.loadFile(path.join(__dirname, 'dist/frontend/browser/index.html'));
}

// ✅ Attendre que `store` soit chargé avant d'utiliser IPC
ipcMain.handle('loadData', async () => {
  await store;
  return {
    students: store.get('students', []),
    taskWeights: store.get('taskWeights', {}),
  };
});

ipcMain.handle('saveData', async (_, data) => {
  await store;
  store.set('students', data.students);
  store.set('taskWeights', data.taskWeights);
});

// ✅ Lancer Electron
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
