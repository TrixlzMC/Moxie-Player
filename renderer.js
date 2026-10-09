const { ipcRenderer } = require('electron');

// State
let currentPlaylist = null;
let songs = [];
let currentSongIndex = 0;
let isPlaying = false;
let audio = new Audio();

// DOM Elements - will be initialized after DOM loads
let playlistList, createPlaylistBtn, playlistHeader, playlistTitle, editPlaylistBtn, backBtn;
let mainContent, songList, emptyState, songsContainer, songRows;
let homeView, playlistView, playlistGrid, noPlaylists;
let createPlaylistModal, playlistNameInput, cancelCreateBtn, confirmCreateBtn;
let nowPlayingTitle, nowPlayingArtist, playerSongTitle, playerArtist;
let playBtn, playIcon, pauseIcon, prevBtn, nextBtn;
let progressSlider, progressFill, progressThumb, currentTimeEl, totalTimeEl, volumeSlider;

// Initialize DOM elements
function initDOMElements() {
  playlistList = document.getElementById('playlist-list');
  createPlaylistBtn = document.getElementById('create-playlist-btn');
  playlistHeader = document.getElementById('playlist-header');
  playlistTitle = document.getElementById('playlist-title');
  editPlaylistBtn = document.getElementById('edit-playlist-btn');
  backBtn = document.getElementById('back-btn');
  mainContent = document.getElementById('main-content');
  songList = document.getElementById('song-list');
  emptyState = document.getElementById('empty-state');
  songsContainer = document.getElementById('songs-container');
  songRows = document.getElementById('song-rows');
  homeView = document.getElementById('home-view');
  playlistView = document.getElementById('playlist-view');
  playlistGrid = document.getElementById('playlist-grid');
  noPlaylists = document.getElementById('no-playlists');
  createPlaylistModal = document.getElementById('create-playlist-modal');
  playlistNameInput = document.getElementById('playlist-name-input');
  cancelCreateBtn = document.getElementById('cancel-create-btn');
  confirmCreateBtn = document.getElementById('confirm-create-btn');
  nowPlayingTitle = document.getElementById('now-playing-title');
  nowPlayingArtist = document.getElementById('now-playing-artist');
  playerSongTitle = document.getElementById('player-song-title');
  playerArtist = document.getElementById('player-artist');
  playBtn = document.getElementById('play-btn');
  playIcon = document.getElementById('play-icon');
  pauseIcon = document.getElementById('pause-icon');
  prevBtn = document.getElementById('prev-btn');
  nextBtn = document.getElementById('next-btn');
  progressSlider = document.getElementById('progress-slider');
  progressFill = document.getElementById('progress-fill');
  progressThumb = document.getElementById('progress-thumb');
  currentTimeEl = document.getElementById('current-time');
  totalTimeEl = document.getElementById('total-time');
  volumeSlider = document.getElementById('volume-slider');
}

// Load playlists on startup
async function loadPlaylists() {
  console.log('Loading playlists...');
  const playlists = await ipcRenderer.invoke('get-playlists');
  console.log('Playlists loaded:', playlists);
  
  // Update sidebar list
  playlistList.innerHTML = '';
  
  playlists.forEach(playlist => {
    const item = document.createElement('div');
    item.className = 'playlist-item flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors';
    item.innerHTML = `
      <span class="text-spotify-subtext mr-3">🎵</span>
      <span class="text-spotify-subtext text-sm">${playlist}</span>
    `;
    item.addEventListener('click', () => loadPlaylist(playlist));
    item.addEventListener('contextmenu', (e) => showPlaylistContextMenu(e, playlist));
    playlistList.appendChild(item);
  });
  
  // Update home view grid
  playlistGrid.innerHTML = '';
  
  if (playlists.length === 0) {
    noPlaylists.classList.remove('hidden');
  } else {
    noPlaylists.classList.add('hidden');
    playlists.forEach(playlist => {
      const card = document.createElement('div');
      card.className = 'bg-spotify-surfaceHover rounded-lg p-4 cursor-pointer hover:bg-[#282828] transition-colors';
      card.innerHTML = `
        <div class="w-full aspect-square bg-gradient-to-br from-spotify-green to-green-600 rounded-lg mb-4 flex items-center justify-center">
          <span class="text-4xl">🎵</span>
        </div>
        <h3 class="text-white font-bold text-sm truncate">${playlist}</h3>
        <p class="text-spotify-subtext text-xs mt-1">Playlist</p>
      `;
      card.addEventListener('click', () => loadPlaylist(playlist));
      playlistGrid.appendChild(card);
    });
  }
}

// Load specific playlist
async function loadPlaylist(playlistName) {
  currentPlaylist = playlistName;
  playlistTitle.textContent = playlistName;
  
  // Show playlist view, hide home view
  homeView.classList.add('hidden');
  playlistView.classList.remove('hidden');
  
  songs = await ipcRenderer.invoke('get-songs', playlistName);
  renderSongs();
}

// Go back to home view
function goHome() {
  currentPlaylist = null;
  homeView.classList.remove('hidden');
  playlistView.classList.add('hidden');
  loadPlaylists();
}

// Render songs
function renderSongs() {
  if (songs.length === 0) {
    emptyState.classList.remove('hidden');
    songsContainer.classList.add('hidden');
    return;
  }
  
  emptyState.classList.add('hidden');
  songsContainer.classList.remove('hidden');
  songRows.innerHTML = '';
  
  songs.forEach((song, index) => {
    const row = document.createElement('div');
    row.className = 'song-row grid grid-cols-[50px_1fr_80px] gap-4 px-4 py-2 rounded-lg cursor-pointer transition-colors items-center';
    row.innerHTML = `
      <div class="relative w-6 h-6 flex items-center justify-center">
        <span class="song-index text-spotify-subtext text-sm">${index + 1}</span>
        <svg class="play-icon-small absolute w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
      <div class="flex flex-col">
        <span class="text-white text-sm font-medium">${song.name}</span>
        <span class="text-spotify-subtext text-xs">Unknown Artist</span>
      </div>
      <span class="text-spotify-subtext text-sm text-right">0:00</span>
    `;
    row.addEventListener('dblclick', () => playSong(index));
    row.addEventListener('click', () => playSong(index));
    row.addEventListener('contextmenu', (e) => showSongContextMenu(e, index));
    songRows.appendChild(row);
  });
}

// Create playlist
function setupEventListeners() {
  createPlaylistBtn.addEventListener('click', async () => {
    console.log('Create playlist button clicked');
    const name = prompt('Enter playlist name:');
    if (name) {
      console.log('Creating playlist:', name);
      await ipcRenderer.invoke('create-playlist', name);
      loadPlaylists();
      loadPlaylist(name);
    }
  });
}

// Edit playlist name
function setupEventListeners() {
  if (createPlaylistBtn) {
    createPlaylistBtn.addEventListener('click', () => {
      console.log('Create playlist button clicked');
      createPlaylistModal.classList.remove('hidden');
      playlistNameInput.value = '';
      playlistNameInput.focus();
    });
  } else {
    console.error('createPlaylistBtn not found!');
  }

  cancelCreateBtn.addEventListener('click', () => {
    createPlaylistModal.classList.add('hidden');
  });

  confirmCreateBtn.addEventListener('click', async () => {
    const name = playlistNameInput.value.trim();
    if (name) {
      console.log('Creating playlist:', name);
      await ipcRenderer.invoke('create-playlist', name);
      createPlaylistModal.classList.add('hidden');
      loadPlaylists();
      loadPlaylist(name);
    }
  });

  playlistNameInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      const name = playlistNameInput.value.trim();
      if (name) {
        console.log('Creating playlist:', name);
        await ipcRenderer.invoke('create-playlist', name);
        createPlaylistModal.classList.add('hidden');
        loadPlaylists();
        loadPlaylist(name);
      }
    }
  });

  backBtn.addEventListener('click', goHome);

  editPlaylistBtn.addEventListener('click', async () => {
    if (!currentPlaylist) return;
    
    const newName = prompt('Enter new playlist name:', currentPlaylist);
    if (newName && newName !== currentPlaylist) {
      await ipcRenderer.invoke('rename-playlist', currentPlaylist, newName);
      currentPlaylist = newName;
      playlistTitle.textContent = newName;
      loadPlaylists();
    }
  });

  // Playback controls
  playBtn.addEventListener('click', togglePlay);
  nextBtn.addEventListener('click', nextSong);
  prevBtn.addEventListener('click', prevSong);

  // Audio events
  audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressSlider.value = progress || 0;
    progressFill.style.width = (progress || 0) + '%';
    progressThumb.style.left = (progress || 0) + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('ended', () => {
    nextSong();
  });

  progressSlider.addEventListener('input', () => {
    const time = (progressSlider.value / 100) * audio.duration;
    audio.currentTime = time;
    progressFill.style.width = progressSlider.value + '%';
    progressThumb.style.left = progressSlider.value + '%';
  });

  volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value / 100;
  });

  // Drag and drop - only in playlist view
  songList.addEventListener('dragover', (e) => {
    e.preventDefault();
    songList.classList.add('drop-zone-active');
  });

  songList.addEventListener('dragleave', (e) => {
    e.preventDefault();
    songList.classList.remove('drop-zone-active');
  });

  songList.addEventListener('drop', async (e) => {
    e.preventDefault();
    songList.classList.remove('drop-zone-active');
    
    if (!currentPlaylist) {
      alert('Please select a playlist first');
      return;
    }
    
    const files = e.dataTransfer.files;
    
    for (const file of files) {
      if (file.name.toLowerCase().endsWith('.mp3')) {
        const song = await ipcRenderer.invoke('add-song', currentPlaylist, file.path);
        songs.push(song);
        await ipcRenderer.invoke('save-metadata', currentPlaylist, songs);
        renderSongs();
      }
    }
  });
}

// Playlist context menu
function showPlaylistContextMenu(e, playlistName) {
  e.preventDefault();
  
  const menu = document.createElement('div');
  menu.className = 'fixed bg-spotify-surface rounded-lg shadow-xl py-2 z-50';
  menu.style.left = e.clientX + 'px';
  menu.style.top = e.clientY + 'px';
  menu.innerHTML = `
    <div class="px-4 py-2 text-white text-sm hover:bg-spotify-surfaceHover cursor-pointer" data-action="rename">Rename</div>
    <div class="px-4 py-2 text-white text-sm hover:bg-spotify-surfaceHover cursor-pointer" data-action="delete">Delete</div>
  `;
  
  document.body.appendChild(menu);
  
  menu.addEventListener('click', async (e) => {
    const action = e.target.dataset.action;
    
    if (action === 'rename') {
      const newName = prompt('Enter new name:', playlistName);
      if (newName && newName !== playlistName) {
        await ipcRenderer.invoke('rename-playlist', playlistName, newName);
        loadPlaylists();
        if (currentPlaylist === playlistName) {
          currentPlaylist = newName;
          playlistTitle.textContent = newName;
        }
      }
    } else if (action === 'delete') {
      if (confirm(`Delete "${playlistName}"?`)) {
        await ipcRenderer.invoke('delete-playlist', playlistName);
        loadPlaylists();
        if (currentPlaylist === playlistName) {
          currentPlaylist = null;
          playlistHeader.classList.add('hidden');
          emptyState.classList.remove('hidden');
          songsContainer.classList.add('hidden');
        }
      }
    }
    
    document.body.removeChild(menu);
  });
  
  document.addEventListener('click', function closeMenu(e) {
    if (!menu.contains(e.target)) {
      document.body.removeChild(menu);
      document.removeEventListener('click', closeMenu);
    }
  });
}

// Song context menu
function showSongContextMenu(e, index) {
  e.preventDefault();
  
  const menu = document.createElement('div');
  menu.className = 'fixed bg-spotify-surface rounded-lg shadow-xl py-2 z-50';
  menu.style.left = e.clientX + 'px';
  menu.style.top = e.clientY + 'px';
  menu.innerHTML = `
    <div class="px-4 py-2 text-white text-sm hover:bg-spotify-surfaceHover cursor-pointer" data-action="rename">Rename</div>
    <div class="px-4 py-2 text-white text-sm hover:bg-spotify-surfaceHover cursor-pointer" data-action="remove">Remove</div>
  `;
  
  document.body.appendChild(menu);
  
  menu.addEventListener('click', async (e) => {
    const action = e.target.dataset.action;
    const song = songs[index];
    
    if (action === 'rename') {
      const newName = prompt('Enter new name:', song.name);
      if (newName && newName !== song.name) {
        const newPath = await ipcRenderer.invoke('rename-song', currentPlaylist, song.path, newName);
        song.name = newName;
        song.path = newPath;
        await ipcRenderer.invoke('save-metadata', currentPlaylist, songs);
        renderSongs();
      }
    } else if (action === 'remove') {
      if (confirm(`Remove "${song.name}"?`)) {
        await ipcRenderer.invoke('remove-song', currentPlaylist, song.path);
        songs.splice(index, 1);
        await ipcRenderer.invoke('save-metadata', currentPlaylist, songs);
        renderSongs();
      }
    }
    
    document.body.removeChild(menu);
  });
  
  document.addEventListener('click', function closeMenu(e) {
    if (!menu.contains(e.target)) {
      document.body.removeChild(menu);
      document.removeEventListener('click', closeMenu);
    }
  });
}



// Audio playback
function playSong(index) {
  currentSongIndex = index;
  const song = songs[index];
  
  audio.src = `file://${song.path}`;
  audio.play();
  isPlaying = true;
  updatePlayButton();
  
  nowPlayingTitle.textContent = song.name;
  nowPlayingArtist.textContent = 'Unknown Artist';
  playerSongTitle.textContent = song.name;
  playerArtist.textContent = 'Unknown Artist';
}

function togglePlay() {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    if (audio.src) {
      audio.play();
      isPlaying = true;
    } else if (songs.length > 0) {
      playSong(0);
    }
  }
  updatePlayButton();
}

function updatePlayButton() {
  if (isPlaying) {
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    progressFill.classList.add('playing');
  } else {
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    progressFill.classList.remove('playing');
  }
}

function nextSong() {
  if (songs.length > 0) {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
  }
}

function prevSong() {
  if (songs.length > 0) {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(currentSongIndex);
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing...');
  initDOMElements();
  
  console.log('DOM Elements initialized:');
  console.log('createPlaylistBtn:', createPlaylistBtn);
  console.log('playlistList:', playlistList);
  
  setupEventListeners();
  loadPlaylists();
  console.log('Initialization complete');
});
