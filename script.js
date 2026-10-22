// ========================
// MUSIC PLAYER CLASS
// ========================

class MusicPlayer {
    constructor() {
        // Audio element
        this.audioElement = document.getElementById('audioPlayer');

        // Display elements
        this.display = {
            title: document.getElementById('songTitle'),
            artist: document.getElementById('artistName'),
            currentTime: document.getElementById('currentTime'),
            duration: document.getElementById('duration'),
            albumArt: document.getElementById('albumArt'),
            historyDisplay: document.getElementById('history')
        };

        // Controls
        this.controls = {
            playPause: document.getElementById('btnPlayPause'),
            next: document.getElementById('btnNext'),
            previous: document.getElementById('btnPrevious'),
            progressBar: document.getElementById('progressBar'),
            volumeSlider: document.getElementById('volumeSlider'),
            speedControl: document.getElementById('speedControl'),
            shuffle: document.getElementById('btnShuffle'),
            repeat: document.getElementById('btnRepeat'),
            playlist: document.getElementById('btnPlaylist'),
            theme: document.getElementById('btnTheme')
        };

        // Playlist elements
        this.playlistPanel = document.getElementById('playlistPanel');
        this.playlistList = document.getElementById('playlistList');
        this.btnClosePlaylist = document.getElementById('btnClosePlaylist');
        this.btnAddSong = document.getElementById('btnAddSong');
        this.btnClearPlaylist = document.getElementById('btnClearPlaylist');

        // Modal elements
        this.modal = document.getElementById('addSongModal');
        this.btnCloseModal = document.getElementById('btnCloseModal');
        this.btnCancelAdd = document.getElementById('btnCancelAdd');
        this.btnConfirmAdd = document.getElementById('btnConfirmAdd');

        // Input fields
        this.inputFields = [
            document.getElementById('songUrl'),
            document.getElementById('songName'),
            document.getElementById('artistNameInput'),
            document.getElementById('albumCover')
        ];

        // State
        this.playlist = this.loadPlaylist();
        this.currentIndex = 0;
        this.isPlaying = false;
        this.isShuffle = false;
        this.repeatMode = 'off'; // off, one, all
        this.autoplay = localStorage.getItem('autoplay') === 'true';
        this.isProgressDragging = false;
        this.isModalOpen = false;

        // Initialize
        this.init();
    }

    // ========================
    // INITIALIZATION
    // ========================

    init() {
        this.setupEventListeners();
        this.loadTheme();
        this.renderPlaylist();
        this.loadSong(this.currentIndex);
        this.updateAutoplayToggle();
    }

    setupEventListeners() {
        // Playback controls
        this.controls.playPause.addEventListener('click', () => this.togglePlay());
        this.controls.next.addEventListener('click', () => this.nextSong());
        this.controls.previous.addEventListener('click', () => this.previousSong());

        // Progress bar
        this.controls.progressBar.addEventListener('mousedown', () => this.isProgressDragging = true);
        this.controls.progressBar.addEventListener('mouseup', () => this.isProgressDragging = false);
        this.controls.progressBar.addEventListener('change', (e) => {
            this.audioElement.currentTime = (e.target.value / 100) * this.audioElement.duration;
        });

        // Volume control
        this.controls.volumeSlider.addEventListener('input', (e) => {
            this.audioElement.volume = e.target.value / 100;
            localStorage.setItem('volume', e.target.value);
        });

        // Speed control
        this.controls.speedControl.addEventListener('change', (e) => {
            this.audioElement.playbackRate = parseFloat(e.target.value);
            localStorage.setItem('speed', e.target.value);
        });

        // Shuffle
        this.controls.shuffle.addEventListener('click', () => this.toggleShuffle());

        // Repeat
        this.controls.repeat.addEventListener('click', () => this.toggleRepeat());

        // Playlist
        this.controls.playlist.addEventListener('click', () => this.togglePlaylistPanel());
        this.btnClosePlaylist.addEventListener('click', () => this.togglePlaylistPanel());

        // Add song
        this.btnAddSong.addEventListener('click', () => this.openAddSongModal());
        this.btnCloseModal.addEventListener('click', () => this.closeAddSongModal());
        this.btnCancelAdd.addEventListener('click', () => this.closeAddSongModal());
        this.btnConfirmAdd.addEventListener('click', () => this.confirmAddSong());

        // Modal open/close tracking
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeAddSongModal();
            }
        });

        // Clear playlist
        this.btnClearPlaylist.addEventListener('click', () => this.clearPlaylist());

        // Theme toggle
        this.controls.theme.addEventListener('click', () => this.toggleTheme());

        // Audio events
        this.audioElement.addEventListener('timeupdate', () => this.updateProgress());
        this.audioElement.addEventListener('ended', () => this.handleSongEnd());
        this.audioElement.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audioElement.addEventListener('play', () => this.onPlay());
        this.audioElement.addEventListener('pause', () => this.onPause());

        // Track modal open/close
        this.modal.addEventListener('show', () => {
            this.isModalOpen = true;
        });

        // Keyboard shortcuts (global)
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Input field focus tracking for keyboard shortcuts
        this.inputFields.forEach(input => {
            input.addEventListener('focus', () => {
                this.isModalOpen = true;
            });
            input.addEventListener('blur', () => {
                this.isModalOpen = false;
            });
        });

        // Autoplay toggle
        const autoplayToggle = document.getElementById('autoplayToggle');
        if (autoplayToggle) {
            autoplayToggle.addEventListener('change', (e) => {
                this.autoplay = e.target.checked;
                localStorage.setItem('autoplay', this.autoplay);
            });
        }
    }

    // ========================
    // PLAYBACK CONTROLS
    // ========================

    togglePlay() {
        if (this.audioElement.paused || this.audioElement.currentTime === 0) {
            this.audioElement.play();
        } else {
            this.audioElement.pause();
        }
    }

    play() {
        this.audioElement.play();
    }

    pause() {
        this.audioElement.pause();
    }

    nextSong() {
        if (this.playlist.length === 0) {
            this.showToast('Playlist is empty');
            return;
        }

        if (this.isShuffle) {
            this.currentIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        }
        this.loadSong(this.currentIndex);
        if (this.isPlaying) this.play();
    }

    previousSong() {
        if (this.audioElement.currentTime > 3) {
            this.audioElement.currentTime = 0;
        } else {
            this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
            this.loadSong(this.currentIndex);
            if (this.isPlaying) this.play();
        }
    }

    handleSongEnd() {
        if (this.repeatMode === 'one') {
            this.audioElement.currentTime = 0;
            this.play();
        } else if (this.repeatMode === 'all' || this.autoplay) {
            this.nextSong();
            this.play();
        }
    }

    // ========================
    // SHUFFLE & REPEAT
    // ========================

    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.controls.shuffle.classList.toggle('active', this.isShuffle);
        this.showToast(this.isShuffle ? 'Shuffle ON' : 'Shuffle OFF');
    }

    toggleRepeat() {
        const modes = ['off', 'all', 'one'];
        this.repeatMode = modes[(modes.indexOf(this.repeatMode) + 1) % modes.length];
        
        this.controls.repeat.classList.toggle('active', this.repeatMode !== 'off');
        
        let icon = this.controls.repeat.querySelector('i');
        if (this.repeatMode === 'one') {
            icon.classList.add('repeat-one');
        } else {
            icon.classList.remove('repeat-one');
        }

        const message = this.repeatMode === 'off' ? 'Repeat OFF' : 
                       this.repeatMode === 'all' ? 'Repeat ALL' : 'Repeat ONE';
        this.showToast(message);
    }

    // ========================
    // SONG MANAGEMENT
    // ========================

    loadSong(index) {
        if (this.playlist.length === 0) {
            this.showToast('Playlist is empty');
            return;
        }

        this.currentIndex = index;
        const song = this.playlist[index];

        this.audioElement.src = song.url;
        this.display.title.textContent = song.title;
        this.display.artist.textContent = song.artist;
        
        // Set album art
        if (song.cover) {
            this.display.albumArt.innerHTML = `<img src="${song.cover}" alt="${song.title}" onerror="this.parentElement.innerHTML = '<i class=\"fas fa-music\"></i>'">`;
        } else {
            this.display.albumArt.innerHTML = '<i class="fas fa-music"></i>';
        }

        this.updatePlaylistUI();
        this.controls.progressBar.value = 0;
    }

    updateProgress() {
        if (!this.isProgressDragging) {
            const progress = (this.audioElement.currentTime / this.audioElement.duration) * 100;
            this.controls.progressBar.value = progress;
        }

        this.display.currentTime.textContent = this.formatTime(this.audioElement.currentTime);
    }

    updateDuration() {
        this.display.duration.textContent = this.formatTime(this.audioElement.duration);
    }

    // ========================
    // PLAYLIST MANAGEMENT
    // ========================

    openAddSongModal() {
        this.modal.classList.add('active');
        this.isModalOpen = true;
        // Focus on first input for better UX
        setTimeout(() => {
            document.getElementById('songUrl').focus();
        }, 100);
    }

    closeAddSongModal() {
        this.modal.classList.remove('active');
        this.isModalOpen = false;
        document.getElementById('songUrl').value = '';
        document.getElementById('songName').value = '';
        document.getElementById('artistNameInput').value = '';
        document.getElementById('albumCover').value = '';
    }

    confirmAddSong() {
        const url = document.getElementById('songUrl').value.trim();
        const title = document.getElementById('songName').value.trim();
        const artist = document.getElementById('artistNameInput').value.trim();
        const cover = document.getElementById('albumCover').value.trim();

        // Validation
        if (!url || !title) {
            this.showToast('Please fill in URL and Title fields');
            return;
        }

        // Validate URL format
        try {
            new URL(url);
        } catch (e) {
            this.showToast('Please enter a valid URL');
            return;
        }

        const song = {
            id: Date.now(),
            title: title || 'Unknown Title',
            artist: artist || 'Unknown Artist',
            url: url,
            cover: cover || null
        };

        this.playlist.push(song);
        this.savePlaylist();
        this.renderPlaylist();
        this.closeAddSongModal();
        this.showToast(`Added "${title}" to playlist`);

        // Load the new song if it's the first one
        if (this.playlist.length === 1) {
            this.loadSong(0);
        }
    }

    deleteSong(id) {
        this.playlist = this.playlist.filter(song => song.id !== id);
        this.savePlaylist();
        this.renderPlaylist();

        if (this.playlist.length === 0) {
            this.audioElement.pause();
            this.currentIndex = 0;
            this.display.title.textContent = 'Select a song';
            this.display.artist.textContent = 'Unknown Artist';
        } else if (this.currentIndex >= this.playlist.length) {
            this.loadSong(this.playlist.length - 1);
        }

        this.showToast('Song removed from playlist');
    }

    clearPlaylist() {
        if (confirm('Are you sure you want to clear the entire playlist?')) {
            this.playlist = [];
            this.currentIndex = 0;
            this.savePlaylist();
            this.renderPlaylist();
            this.audioElement.pause();
            this.display.title.textContent = 'Select a song';
            this.display.artist.textContent = 'Unknown Artist';
            this.display.albumArt.innerHTML = '<i class="fas fa-music"></i>';
            this.showToast('Playlist cleared');
        }
    }

    renderPlaylist() {
        if (this.playlist.length === 0) {
            this.playlistList.innerHTML = '<div class="empty-playlist">Playlist is empty</div>';
            return;
        }

        this.playlistList.innerHTML = this.playlist.map((song, index) => `
            <div class="playlist-item ${index === this.currentIndex ? 'active' : ''}" data-id="${song.id}">
                <div class="playlist-item-info">
                    <div class="playlist-item-title">${this.escapeHtml(song.title)}</div>
                    <div class="playlist-item-artist">${this.escapeHtml(song.artist)}</div>
                </div>
                <button class="playlist-item-delete" data-id="${song.id}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        // Add click listeners to playlist items
        document.querySelectorAll('.playlist-item').forEach((item, index) => {
            const deleteBtn = item.querySelector('.playlist-item-delete');
            
            item.addEventListener('click', (e) => {
                if (e.target.closest('.playlist-item-delete')) return;
                this.currentIndex = index;
                this.loadSong(index);
                this.play();
            });

            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(deleteBtn.dataset.id);
                this.deleteSong(id);
            });
        });
    }

    updatePlaylistUI() {
        document.querySelectorAll('.playlist-item').forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
        });
    }

    togglePlaylistPanel() {
        this.playlistPanel.classList.toggle('active');
    }

    // ========================
    // THEME MANAGEMENT
    // ========================

    toggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.body.className = `${newTheme}-theme`;
        localStorage.setItem('theme', newTheme);

        const icon = this.controls.theme.querySelector('i');
        if (newTheme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    loadTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        document.body.className = `${theme}-theme`;

        const icon = this.controls.theme.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    // ========================
    // STORAGE MANAGEMENT
    // ========================

    savePlaylist() {
        localStorage.setItem('playlist', JSON.stringify(this.playlist));
    }

    loadPlaylist() {
        const saved = localStorage.getItem('playlist');
        return saved ? JSON.parse(saved) : this.getDefaultPlaylist();
    }

    getDefaultPlaylist() {
        return [
            {
                id: 1,
                title: 'Sample Song 1',
                artist: 'Artist Name',
                url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                cover: null
            },
            {
                id: 2,
                title: 'Sample Song 2',
                artist: 'Artist Name',
                url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
                cover: null
            }
        ];
    }

    // ========================
    // UI UPDATES
    // ========================

    onPlay() {
        this.isPlaying = true;
        const icon = this.controls.playPause.querySelector('i');
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');

        this.display.albumArt.classList.add('playing');
        this.display.albumArt.classList.remove('paused');
    }

    onPause() {
        this.isPlaying = false;
        const icon = this.controls.playPause.querySelector('i');
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');

        this.display.albumArt.classList.remove('playing');
        this.display.albumArt.classList.add('paused');
    }

    updateAutoplayToggle() {
        const autoplayToggle = document.getElementById('autoplayToggle');
        if (autoplayToggle) {
            autoplayToggle.checked = this.autoplay;
        }
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ========================
    // KEYBOARD SHORTCUTS
    // ========================

    handleKeyboard(e) {
        // Check if user is typing in an input field
        const activeElement = document.activeElement;
        const isInputFocused = activeElement.tagName === 'INPUT' || 
                              activeElement.tagName === 'TEXTAREA' ||
                              activeElement.tagName === 'SELECT';

        // If an input field is focused, only allow Escape to close modal
        if (isInputFocused) {
            if (e.code === 'Escape') {
                this.closeAddSongModal();
            }
            // Allow normal input for all other keys
            return;
        }

        // Keyboard shortcuts when input is not focused
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'KeyN':
                if (!e.ctrlKey && !e.metaKey && !e.altKey) {
                    this.nextSong();
                }
                break;
            case 'KeyP':
                if (!e.ctrlKey && !e.metaKey && !e.altKey) {
                    this.previousSong();
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                const newVolUp = Math.min(100, parseInt(this.controls.volumeSlider.value) + 5);
                this.controls.volumeSlider.value = newVolUp;
                this.audioElement.volume = newVolUp / 100;
                break;
            case 'ArrowDown':
                e.preventDefault();
                const newVolDown = Math.max(0, parseInt(this.controls.volumeSlider.value) - 5);
                this.controls.volumeSlider.value = newVolDown;
                this.audioElement.volume = newVolDown / 100;
                break;
            case 'Escape':
                this.closeAddSongModal();
                break;
        }
    }
}

// ========================
// INITIALIZATION
// ========================

let player;

document.addEventListener('DOMContentLoaded', () => {
    player = new MusicPlayer();

    // Load saved settings
    const savedVolume = localStorage.getItem('volume') || 70;
    const savedSpeed = localStorage.getItem('speed') || 1;
    
    player.controls.volumeSlider.value = savedVolume;
    player.audioElement.volume = savedVolume / 100;
    player.controls.speedControl.value = savedSpeed;
    player.audioElement.playbackRate = parseFloat(savedSpeed);
});