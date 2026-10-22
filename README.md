# Music Player

A responsive music player with playlist management and playback controls, built with HTML, CSS, and the HTML5 Audio API.

## Features

- Play, pause, next, and previous controls
- Progress bar with seeking and track duration
- Volume and playback-speed controls
- Add and remove songs from a playlist
- Shuffle, repeat, and autoplay options
- Album artwork display with animated visualizer
- Light and dark themes
- Playlist and preferences saved in local storage
- Keyboard shortcuts
- Smooth animations and transitions

## How to Use

### Adding Songs

1. Click the **"Add Song"** button
2. A dialog box will appear with four fields:
   - **Song URL** – Paste a direct link to an MP3 file
   - **Song Title** – Enter the name of the song
   - **Artist Name** – Enter the artist or band name
   - **Album Cover** – (Optional) Paste an image URL for the album art
3. Click **"Add Song"** to add it to your playlist
4. The new song will appear in the playlist panel on the right

### Playing Music

1. **Play/Pause** – Click the large play button in the center, or press Space
2. **Next Song** – Click the next button or press N
3. **Previous Song** – Click the previous button or press P
4. **Seek** – Click or drag on the progress bar to jump to a specific point in the song
5. **View Duration** – The current time and total duration are displayed above the progress bar

### Managing Volume

1. Use the **volume slider** to adjust the volume from 0% to 100%
2. Use the **up arrow key** to increase volume
3. Use the **down arrow key** to decrease volume
4. Your volume preference is saved automatically

### Controlling Playback Speed

1. Open the **"Speed"** dropdown menu
2. Select a speed:
   - 0.5x (half speed)
   - 0.75x
   - 1x (normal speed)
   - 1.25x
   - 1.5x
   - 2x (double speed)
3. Your speed preference is saved automatically

### Using Shuffle Mode

1. Click the **shuffle button** (icon with arrows)
2. The button will highlight when shuffle is on
3. Songs will play in random order
4. Click again to turn shuffle off

### Using Repeat Modes

1. Click the **repeat button** repeatedly to cycle through modes:
   - **Off** – Play songs once
   - **All** – Loop the entire playlist
   - **One** – Repeat the current song only
2. The button highlights and shows the current mode
3. Use with autoplay for continuous music

### Using Autoplay

1. Check the **"Autoplay"** checkbox
2. When a song ends, the next song will start automatically
3. Works with all repeat modes
4. Your preference is saved automatically

### Managing Your Playlist

1. **View Playlist** – Click the playlist icon to see all added songs
2. **Play a Song** – Click any song in the list to play it
3. **Remove a Song** – Click the X button next to a song to delete it
4. **Clear All Songs** – Click the trash icon to remove all songs from the playlist
5. **Close Playlist** – Click the X button at the top-right to close the panel

### Switching Themes

1. Click the **moon icon** in the top-right corner
2. The theme will toggle between light and dark
3. Your theme preference is saved automatically

## Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `Space` | Play or pause the current song |
| `N` | Skip to the next song |
| `P` | Go to the previous song |
| `↑` | Increase volume |
| `↓` | Decrease volume |
| `Escape` | Close the add-song dialog |

**Note:** Keyboard shortcuts are disabled while typing in an input field (like when adding a song).

## Sample Audio URLs

Test the player with these free audio files:

https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3

https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3

https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3


## Getting Started

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. Click "Add Song" and paste an audio URL to start
4. An internet connection is needed for online audio files

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- HTML5 Audio API
- Local Storage API for playlists and preferences
- Font Awesome icons

## Browser Support

- Chrome
- Firefox
- Safari
- Edge

## Responsive Design

- Desktop: 1200px and up
- Tablet: 768px to 1200px
- Mobile: 360px to 768px

## Data Storage

- Playlists are saved locally in your browser
- Volume, speed, theme, and autoplay settings are saved
- No data is sent to any server
- Clear your browser data to reset everything

## Troubleshooting

**Audio won't play**
- Check that the song URL is valid and points to an MP3 file
- Ensure your internet connection is active
- Try a different audio file or URL

**Playlist won't save**
- Check if your browser allows Local Storage
- Clear your browser cache and try again
- Disable privacy/ad-blocking extensions

**Keyboard shortcuts not working**
- Make sure no text input field is focused
- Check if the add-song dialog is open

## License

This project is licensed under the MIT License.
