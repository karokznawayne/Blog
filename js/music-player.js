class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audio-player');
        this.playBtn = document.getElementById('play-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.progressBar = document.getElementById('progress-bar');
        this.progress = document.querySelector('.progress');
        this.volumeSlider = document.getElementById('volume-slider');
        this.trackArt = document.getElementById('track-art');
        this.trackName = document.getElementById('track-name');
        this.trackArtist = document.getElementById('track-artist');
        this.currentTime = document.getElementById('current-time');
        this.totalTime = document.getElementById('total-time');
        this.playlist = document.getElementById('playlist');

        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.tracks = this.loadTracks();

        this.init();
    }

    init() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.prevBtn.addEventListener('click', () => this.prevTrack());
        this.audio.addEventListener('ended', () => this.nextTrack());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.progress.addEventListener('click', (e) => this.seek(e));
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));

        this.loadTrack(this.currentTrackIndex);
        this.renderPlaylist();
    }

    loadTracks() {
        // Get tracks from localStorage or use default
        let tracks = localStorage.getItem('musicTracks');
        if (!tracks) {
            tracks = [
                {
                    id: 1,
                    name: 'Sample Track 1',
                    artist: 'Your Name',
                    src: 'assets/music/track1.mp3',
                    image: 'assets/images/album1.jpg'
                },
                {
                    id: 2,
                    name: 'Sample Track 2',
                    artist: 'Your Name',
                    src: 'assets/music/track2.mp3',
                    image: 'assets/images/album2.jpg'
                }
            ];
            localStorage.setItem('musicTracks', JSON.stringify(tracks));
        }
        return JSON.parse(tracks);
    }

    loadTrack(index) {
        const track = this.tracks[index];
        this.audio.src = track.src;
        this.trackName.textContent = track.name;
        this.trackArtist.textContent = track.artist;
        this.trackArt.src = track.image;
    }

    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
            this.playBtn.textContent = '▶ Play';
        } else {
            this.audio.play();
            this.playBtn.textContent = '⏸ Pause';
        }
        this.isPlaying = !this.isPlaying;
    }

    nextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        this.loadTrack(this.currentTrackIndex);
        if (this.isPlaying) this.audio.play();
    }

    prevTrack() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
        this.loadTrack(this.currentTrackIndex);
        if (this.isPlaying) this.audio.play();
    }

    updateProgress() {
        const { currentTime, duration } = this.audio;
        const percent = (currentTime / duration) * 100;
        this.progressBar.style.width = percent + '%';

        this.currentTime.textContent = this.formatTime(currentTime);
        this.totalTime.textContent = this.formatTime(duration);
    }

    seek(e) {
        const width = this.progress.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        this.audio.currentTime = (clickX / width) * duration;
    }

    setVolume(value) {
        this.audio.volume = value / 100;
    }

    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    renderPlaylist() {
        this.playlist.innerHTML = '';
        this.tracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = `${track.name} - ${track.artist}`;
            li.style.cursor = 'pointer';
            li.style.padding = '0.5rem';
            li.style.borderBottom = '1px solid #333';
            li.addEventListener('click', () => {
                this.currentTrackIndex = index;
                this.loadTrack(index);
                this.isPlaying = false;
                this.togglePlay();
            });
            this.playlist.appendChild(li);
        });
    }
}

// Initialize player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});
