const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    frame: true,
    backgroundColor: '#121212',
    titleBarStyle: 'default',
    title: 'Moxie Player',
    icon: path.join(__dirname, 'build', 'icon.ico')
  });

  mainWindow.loadFile('index.html');
  
  // Hide the default menu bar
  mainWindow.setMenuBarVisibility(false);
  Menu.setApplicationMenu(null);
  
  // Open DevTools in development
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Playlist directory
const playlistsDir = path.join(app.getPath('userData'), 'playlists');

// Ensure playlists directory exists
async function ensurePlaylistsDir() {
  try {
    await fs.mkdir(playlistsDir, { recursive: true });
  } catch (error) {
    console.error('Error creating playlists directory:', error);
  }
}

ensurePlaylistsDir();

// IPC handlers
ipcMain.handle('get-playlists', async () => {
  await ensurePlaylistsDir();
  const playlists = await fs.readdir(playlistsDir);
  const playlistDirs = [];
  
  for (const playlist of playlists) {
    const playlistPath = path.join(playlistsDir, playlist);
    const stats = await fs.stat(playlistPath);
    if (stats.isDirectory()) {
      playlistDirs.push(playlist);
    }
  }
  
  return playlistDirs;
});

ipcMain.handle('create-playlist', async (event, name) => {
  await ensurePlaylistsDir();
  const playlistPath = path.join(playlistsDir, name);
  await fs.mkdir(playlistPath, { recursive: true });
  return name;
});

ipcMain.handle('delete-playlist', async (event, name) => {
  const playlistPath = path.join(playlistsDir, name);
  await fs.rm(playlistPath, { recursive: true, force: true });
  return name;
});

ipcMain.handle('rename-playlist', async (event, oldName, newName) => {
  const oldPath = path.join(playlistsDir, oldName);
  const newPath = path.join(playlistsDir, newName);
  await fs.rename(oldPath, newPath);
  return newName;
});

ipcMain.handle('get-songs', async (event, playlistName) => {
  const playlistPath = path.join(playlistsDir, playlistName);
  const metadataPath = path.join(playlistPath, 'metadata.json');
  
  try {
    const metadata = await fs.readFile(metadataPath, 'utf-8');
    return JSON.parse(metadata);
  } catch (error) {
    // If no metadata, scan for MP3 files
    const files = await fs.readdir(playlistPath);
    const songs = [];
    
    for (const file of files) {
      if (file.endsWith('.mp3')) {
        const filePath = path.join(playlistPath, file);
        songs.push({
          name: path.parse(file).name,
          path: filePath,
          fileName: file
        });
      }
    }
    
    return songs;
  }
});

ipcMain.handle('add-song', async (event, playlistName, sourcePath) => {
  const playlistPath = path.join(playlistsDir, playlistName);
  const fileName = path.basename(sourcePath);
  const destPath = path.join(playlistPath, fileName);
  
  // Copy file to playlist folder
  await fs.copyFile(sourcePath, destPath);
  
  return {
    name: path.parse(fileName).name,
    path: destPath,
    fileName: fileName
  };
});

ipcMain.handle('remove-song', async (event, playlistName, songPath) => {
  try {
    await fs.unlink(songPath);
    return true;
  } catch (error) {
    console.error('Error removing song:', error);
    return false;
  }
});

ipcMain.handle('rename-song', async (event, playlistName, songPath, newName) => {
  const songDir = path.dirname(songPath);
  const newFileName = newName + '.mp3';
  const newPath = path.join(songDir, newFileName);
  
  await fs.rename(songPath, newPath);
  return newPath;
});

ipcMain.handle('save-metadata', async (event, playlistName, songs) => {
  const playlistPath = path.join(playlistsDir, playlistName);
  const metadataPath = path.join(playlistPath, 'metadata.json');
  
  await fs.writeFile(metadataPath, JSON.stringify(songs, null, 2));
  return true;
});

ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'MP3 Files', extensions: ['mp3'] }
    ]
  });
  
  if (result.canceled) {
    return null;
  }
  
  return result.filePaths[0];
});
