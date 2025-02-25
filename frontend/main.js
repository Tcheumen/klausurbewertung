const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Fichier sécurisé pour la communication
      nodeIntegration: false, // Désactiver pour la sécurité
      contextIsolation: true, // Protection contre les injections de code
      enableRemoteModule: false,
    },
  });

  win.loadFile(path.join(__dirname, 'dist/frontend/browser/index.html'));
}

// Exécuter la création de fenêtre une fois qu'Electron est prêt
app.whenReady().then(createWindow);

// ✅ Gérer la fermeture de l'application sur Windows et Linux
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { // macOS garde l'application ouverte
    app.quit();
  }
});

// ✅ Gérer la réouverture de l'application sur macOS
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
