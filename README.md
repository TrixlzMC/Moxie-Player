# Moxie Player

A Spotify-inspired local music player built with Electron, featuring a pixel-perfect dark UI and standalone Windows executable.

## Features

- **Pixel-Perfect Spotify Layout**: Three-column design matching Spotify's desktop UI
- **Dark Mode UI**: Authentic Spotify color scheme (#121212 background, #1DB954 green accent)
- **Playlist Management**: Create, rename, and delete playlists from sidebar
- **Drag & Drop**: Add MP3 files by dragging them into playlists
- **Song Management**: Rename and remove songs with context menus
- **Playback Controls**: Full player bar with play/pause, next, previous, seek, and volume
- **Now Playing View**: Right sidebar shows current track info
- **Standalone Executable**: Compiles to .exe - no Python or Node.js required on user's machine

## Quick Start

### Prerequisites
- Node.js 16+ (for building only - not needed for the final executable)

### Installation
```bash
# Install dependencies
npm install

# Run in development mode
npm start

# Build standalone executable
npm run build
```

The built executable will be in the `dist/` folder.

## Adding Your Icon

Before building, you need to add your app icon:

1. **Convert your PNG to ICO format**:
   - Use an online converter like https://convertico.com/ or https://www.icoconverter.com/
   - Upload your "Musicplayericon.png"
   - Ensure the output is named `icon.ico`
   - Recommended sizes: 256x256, 128x128, 64x64, 48x48, 32x32, 16x16

2. **Place the icon file**:
   - Put the converted `icon.ico` file in the `build/` folder
   - The path should be: `MusicPlayerApp/build/icon.ico`

3. **Build the app**:
   ```bash
   npm run build
   ```

The icon will now appear in:
- The application window title bar
- Taskbar
- Desktop shortcut
- Start menu

## File Structure

```
MusicPlayerApp/
├── main.js              # Electron main process
├── index.html           # UI structure (Tailwind CSS)
├── renderer.js          # Frontend logic
├── package.json         # Project configuration
├── build/               # Icon file goes here
│   └── icon.ico        # Your converted icon
├── setup.bat            # Windows setup script
└── dist/                # Built executables (after running build)
```

## System Requirements

### For Building
- Windows 10/11
- Node.js 16+
- npm

### For Running the Executable
- Windows 10/11 only
- No additional software required

## Distribution

The built executable in `dist/` can be distributed to any Windows 10/11 machine. Users simply double-click to run - no installation of Node.js, Python, or any runtime environment required.
