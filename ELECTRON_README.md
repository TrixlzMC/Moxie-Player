# Moxie Player - Electron Version

A Spotify-inspired local music player built with Electron, HTML, CSS (Tailwind), and JavaScript.

## Features

- **Pixel-perfect Spotify layout** with three-column design
- **Left Sidebar**: Your Library with playlists, search bar, and create playlist button
- **Main Content**: Gradient background with song list display
- **Right Sidebar**: Now Playing view with album art placeholder
- **Bottom Player Bar**: Full playback controls with progress bar and volume
- **Drag & Drop**: Add MP3 files by dragging them into the playlist
- **Playlist Management**: Create, rename, delete playlists
- **Song Management**: Rename and remove songs
- **Standalone Executable**: Compiles to a single .exe file

## System Requirements

- Windows 10/11
- Node.js (for building only - not required for the final executable)
- npm or yarn

## Installation & Setup

### 1. Install Node.js (if not already installed)
Download from: https://nodejs.org/

### 2. Install Dependencies
Open PowerShell or Command Prompt in the MusicPlayerApp directory and run:

```powershell
npm install
```

This will install:
- Electron (the app framework)
- electron-builder (for packaging)
- tailwindcss (for styling)

### 3. Add Your Icon (Before Building)

**Step 1: Convert PNG to ICO**
- Go to https://convertico.com/ or https://www.icoconverter.com/
- Upload your "Musicplayericon.png"
- Ensure the output is named `icon.ico`
- Recommended sizes: 256x256, 128x128, 64x64, 48x48, 32x32, 16x16

**Step 2: Place the Icon**
- Put the converted `icon.ico` file in the `build/` folder
- The path should be: `MusicPlayerApp/build/icon.ico`

### 4. Run in Development Mode
```powershell
npm start
```

This will launch the app in development mode with DevTools available.

## Building the Standalone Executable

### Build Installer (.exe with installer)
```powershell
npm run build
```

This creates:
- `dist/Moxie Player Setup 1.0.0.exe` - Full installer
- `dist/Moxie Player-win32-x64` - Portable version

### Build Portable Version Only
```powershell
npm run build-portable
```

This creates just the portable executable without an installer.

The built executables will be in the `dist/` folder.

## Design Specifications

### Color Scheme (Spotify Authentic)
- Background: #121212 (deep charcoal)
- Sidebar/Player Bar: #000000 (pure black)
- Primary Text: #FFFFFF (white)
- Secondary Text: #B3B3B3 (muted gray)
- Accent Green: #1DB954 (Spotify green)
- Hover Green: #1ED760
- Surface: #181818
- Surface Hover: #282828

### Layout
- **Left Sidebar**: 240px fixed width
- **Main Content**: Flexible width with gradient background
- **Right Sidebar**: 320px fixed width
- **Bottom Player Bar**: 90px fixed height

### Typography
- Font stack: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- Rounded corners: 8-12px for all UI elements

## Usage

1. **Create a Playlist**: Click "+ Create Playlist" in the left sidebar
2. **Add Music**: Drag and drop MP3 files into the main content area
3. **Play Music**: Double-click on any song to play it
4. **Edit Playlist**: Click the pencil icon next to the playlist name
5. **Manage Songs**: Right-click songs to rename or remove them
6. **Playback Controls**: Use the bottom player bar for play/pause, next, previous, volume

## File Structure

```
MusicPlayerApp/
├── main.js              # Electron main process
├── index.html           # UI structure
├── renderer.js          # Frontend logic
├── package.json         # Project configuration
├── build/               # Icon file goes here
│   └── icon.ico        # Your converted icon
├── ELECTRON_README.md   # This file
├── dist/                # Built executables (after running build)
└── playlists/           # Created automatically in AppData
```

## Troubleshooting

### PowerShell Execution Policy Error
If you see an error about execution policies when running npm commands:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Build Fails
Make sure you have:
- Node.js installed (version 16 or higher)
- npm installed
- Sufficient disk space (~500MB for dependencies and build)
- Icon file in `build/icon.ico` (optional but recommended)

### App Won't Launch
- Check that Windows Defender isn't blocking the executable
- Run as administrator if needed
- Check the AppData folder for playlist directory creation

## Notes

- The app stores playlists in `%APPDATA%/Moxie Player/playlists/`
- All MP3 files are copied into playlist folders
- The standalone executable includes all dependencies - no installation required on target machines
- The app uses the system's default audio player for playback

## Building for Distribution

To distribute the app:
1. Place your `icon.ico` in the `build/` folder
2. Run `npm run build`
3. The executable in `dist/` can be shared
4. Users can run it directly without installing Node.js or any dependencies

## Important Note

**I cannot upload files or provide download links.** You must:
1. Convert your PNG to ICO using an online converter
2. Place it in the `build/` folder
3. Run the build command on your machine
4. The executable will be created in the `dist/` folder for you to distribute

## Future Enhancements

Potential improvements:
- Real album art extraction from MP3 metadata
- Artist/album metadata display
- Search functionality
- Shuffle and repeat modes
- Keyboard shortcuts
- Mini player mode
- Lyrics display
