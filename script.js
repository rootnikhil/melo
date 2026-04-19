let isShuffle = false;
let isRepeat = false;
let isMuted = false;
let currentSong = 0;
let activeFilter = "all";
let toastTimer;

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const heroPlayBtn = document.getElementById("heroPlayBtn");
const muteBtn = document.getElementById("muteBtn");
const title = document.getElementById("title");
const cover = document.getElementById("cover");
const sideCover = document.getElementById("sideCover");
const sideTitle = document.getElementById("sideTitle");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const songList = document.getElementById("songList");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const favoritesList = document.getElementById("favoritesList");
const recentList = document.getElementById("recentList");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const heroTitle = document.getElementById("heroTitle");
const heroCover = document.getElementById("heroCover");
const heroSubtitle = document.getElementById("heroSubtitle");
const search = document.getElementById("search");
const playbackMode = document.getElementById("playbackMode");
const playbackStatus = document.getElementById("playbackStatus");
const favoriteCurrentBtn = document.getElementById("favoriteCurrentBtn");
const favoritesCount = document.getElementById("favoriteCount");
const recentCount = document.getElementById("recentCount");
const trackCount = document.getElementById("trackCount");
const resultCount = document.getElementById("resultCount");
const queueList = document.getElementById("queueList");
const artistLabel = document.getElementById("artistLabel");
const sideArtist = document.getElementById("sideArtist");
const themeToggle = document.getElementById("themeToggle");
const playlistGrid = document.getElementById("playlistGrid");
const albumList = document.getElementById("albumList");
const toast = document.getElementById("toast");
const discoverHeadline = document.getElementById("discoverHeadline");
const discoverCopy = document.getElementById("discoverCopy");

let favorites = JSON.parse(localStorage.getItem("melo-favorites")) || [];
let recent = JSON.parse(localStorage.getItem("melo-recent")) || [];
let savedTheme = localStorage.getItem("melo-theme") || "dark";

const songs = [
  { name: "AARI AARI", file: "songs/song1.mp3", cover: "images/cover1.jpg", artist: "Melo Originals", mood: "energy", album: "Night Motion" },
  { name: "MAIN AUR TU", file: "songs/song2.mp3", cover: "images/cover1.jpg", artist: "Melo Originals", mood: "romance", album: "Dil Stories" },
  { name: "JAAN SE GUZARTE HAIN", file: "songs/song3.mp3", cover: "images/cover1.jpg", artist: "Melo Originals", mood: "soul", album: "Dil Stories" },
  { name: "AAKHRI ISHQ", file: "songs/song4.mp3", cover: "images/cover1.jpg", artist: "Melo Originals", mood: "romance", album: "Ishq Seasons" },
  { name: "WILD RIDE", file: "songs/song5.mp3", cover: "images/cover1.jpg", artist: "Melo Originals", mood: "energy", album: "Night Motion" },
  { name: "VAARI JAAVAN", file: "songs/song6.mp3", cover: "images/cover1.jpg", artist: "Melo Originals", mood: "romance", album: "Ishq Seasons" },
  { name: "PHIR SE", file: "songs/song7.mp3", cover: "images/cover1.jpg", artist: "Melo Originals", mood: "soft", album: "Soft Hours" },
  { name: "DIDI (SHER-E-BALOCH)", file: "songs/song8.mp3", cover: "images/cover1.jpg", artist: "Melo Originals", mood: "energy", album: "Wild Pulse" },
  { name: "DESTINY - MANN ATKEYA", file: "songs/song9.mp3", cover: "images/cover1.jpg", artist: "Melo Originals", mood: "soul", album: "Soul Current" },
  { name: "RANG DE LAL (OYE OYE)", file: "songs/song10.mp3", cover: "images/cover1.jpg", artist: "Melo Originals", mood: "energy", album: "Wild Pulse" },
  { name: "JAIYE SAJANA", file: "songs/song11.mp3", cover: "images/cover1.jpg", artist: "Melo Originals", mood: "soft", album: "Soft Hours" },
  { name: "TERE ISHQ NE", file: "songs/song12.mp3", cover: "images/cover1.jpg", artist: "Melo Originals", mood: "romance", album: "Ishq Seasons" },
  { name: "HUM PYAAR KARNE WALE", file: "songs/song13.mp3", cover: "images/cover1.jpg", artist: "Melo Originals", mood: "soul", album: "Soul Current" },
  { name: "KANHAIYYA", file: "songs/song14.mp3", cover: "images/cover1.jpg", artist: "Melo Originals", mood: "soft", album: "Soft Hours" }
];

const playlistData = [
  { title: "Heart Loop", description: "Romance-heavy tracks that stay warm and cinematic from start to finish.", tag: "Mood Mix", meta: "6 tracks", action: 1 },
  { title: "Late Night Drive", description: "Energy picks with sharper pulse for louder speakers and darker rooms.", tag: "Energy", meta: "5 tracks", action: 4 },
  { title: "Soft Replay", description: "Comforting tracks to keep repeat mode on without getting tired.", tag: "Soft", meta: "4 tracks", action: 6 }
];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function formatTime(sec) {
  const minutes = Math.floor(sec / 60) || 0;
  const seconds = Math.floor(sec % 60) || 0;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function updateStats() {
  trackCount.textContent = songs.length;
  favoritesCount.textContent = favorites.length;
  recentCount.textContent = recent.length;
}

function updateModeText() {
  if (isShuffle) {
    playbackMode.textContent = "Shuffle";
    return;
  }
  if (isRepeat) {
    playbackMode.textContent = "Repeat";
    return;
  }
  playbackMode.textContent = "Normal";
}

function updatePlayButtons() {
  const isPaused = audio.paused;
  playBtn.textContent = isPaused ? "Play" : "Pause";
  heroPlayBtn.textContent = isPaused ? "Play" : "Pause";
  playbackStatus.textContent = isPaused ? "Paused" : "Playing";
  muteBtn.textContent = isMuted ? "Unmute" : "Mute";
  themeToggle.textContent = document.body.classList.contains("light") ? "Dark Mode" : "Light Mode";
}

function updateFavoriteButton() {
  favoriteCurrentBtn.textContent = favorites.includes(currentSong) ? "Favorited" : "Favorite";
}

function updateNowPlaying() {
  const song = songs[currentSong];
  title.textContent = song.name;
  cover.src = song.cover;
  sideCover.src = song.cover;
  heroTitle.textContent = song.name;
  heroCover.src = song.cover;
  sideTitle.textContent = song.name;
  artistLabel.textContent = song.artist;
  sideArtist.textContent = `${song.artist} • ${song.album}`;
  heroSubtitle.textContent = `Now playing "${song.name}" from ${song.album}. Enjoy premium playback, favorites, playlists, and your full music library in one place.`;
  discoverHeadline.textContent = `${song.mood.charAt(0).toUpperCase()}${song.mood.slice(1)} music for every moment.`;
  discoverCopy.textContent = `Now featuring ${song.name} from ${song.album}. Explore your library, favorites, playlists, and nonstop playback in one place.`;
  updateFavoriteButton();
}

function setActiveCard() {
  document.querySelectorAll("#songList .card").forEach((card) => {
    card.classList.toggle("active", Number(card.dataset.index) === currentSong);
  });
}

function buildSongCard(index, compact = false) {
  const song = songs[index];
  const isFav = favorites.includes(index);
  return `
    <div class="card ${compact ? "compact-card" : ""}" data-index="${index}">
      <div class="card-img">
        <img src="${song.cover}" alt="${song.name}">
        <div class="play-overlay">Play</div>
      </div>
      <div class="card-content">
        <div class="card-top">
          <div>
            <h3 class="song-name">${song.name}</h3>
            <p class="song-meta">${song.artist} • ${song.album}</p>
          </div>
          <button class="heart" data-heart="${index}" type="button">${isFav ? "Fav" : "Like"}</button>
        </div>
        ${compact ? "" : `<div class="card-actions"><button class="pill-btn" data-play="${index}" type="button">Play Now</button></div>`}
      </div>
    </div>
  `;
}

function getFilteredSongs() {
  const query = search.value.trim().toLowerCase();
  return songs.filter((song) => {
    const matchesSearch = `${song.name} ${song.artist} ${song.album} ${song.mood}`.toLowerCase().includes(query);
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "repeat" ? favorites.includes(songs.indexOf(song)) || recent.includes(songs.indexOf(song)) : song.mood === activeFilter);
    return matchesSearch && matchesFilter;
  });
}

function renderSongs(list = getFilteredSongs()) {
  resultCount.textContent = `${list.length} song${list.length === 1 ? "" : "s"}`;
  songList.innerHTML = list.length
    ? list.map((song) => buildSongCard(songs.indexOf(song))).join("")
    : `<div class="empty">No songs found. Try another search.</div>`;
  setActiveCard();
}

function renderFavorites() {
  favoritesList.innerHTML = favorites.length
    ? favorites.map((index) => buildSongCard(index, true)).join("")
    : `<div class="empty">Favorite songs will appear here.</div>`;
}

function renderRecent() {
  recentList.innerHTML = recent.length
    ? recent.map((index) => buildSongCard(index, true)).join("")
    : `<div class="empty">Your recently played songs will appear here.</div>`;
}

function renderQueue() {
  const queueIndexes = [];
  for (let i = 1; i <= 4; i += 1) {
    queueIndexes.push((currentSong + i) % songs.length);
  }

  queueList.innerHTML = queueIndexes
    .map((index, order) => {
      const song = songs[index];
      return `
        <div class="queue-item">
          <div>
            <strong>${order === 0 ? "Next" : `Later ${order}`}</strong>
            <span>${song.name} • ${song.album}</span>
          </div>
          <button class="pill-btn" data-play="${index}" type="button">Play</button>
        </div>
      `;
    })
    .join("");
}

function renderPlaylists() {
  playlistGrid.innerHTML = playlistData
    .map(
      (playlist) => `
        <article class="playlist-card">
          <span class="playlist-badge">${playlist.tag}</span>
          <h3>${playlist.title}</h3>
          <p>${playlist.description}</p>
          <div class="playlist-meta">
            <span>${playlist.meta}</span>
            <button class="pill-btn" data-play="${playlist.action}" type="button">Open</button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderAlbums() {
  const albums = [...new Set(songs.map((song) => song.album))];
  albumList.innerHTML = albums
    .map((album) => {
      const albumSongs = songs.filter((song) => song.album === album);
      const moods = [...new Set(albumSongs.map((song) => song.mood))].join(", ");
      return `
        <article class="album-card">
          <span class="album-badge">${albumSongs.length} tracks</span>
          <h3>${album}</h3>
          <p>${moods.charAt(0).toUpperCase()}${moods.slice(1)} vibes from your library, ready for replay.</p>
          <div class="album-meta">
            <span>${albumSongs[0].artist}</span>
            <button class="pill-btn" data-play="${songs.indexOf(albumSongs[0])}" type="button">Play Album</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function saveRecent(index) {
  recent = recent.filter((item) => item !== index);
  recent.unshift(index);
  recent = recent.slice(0, 8);
  localStorage.setItem("melo-recent", JSON.stringify(recent));
}

function loadSong(index, shouldAutoPlay = true) {
  currentSong = index;
  audio.src = songs[index].file;
  updateNowPlaying();
  setActiveCard();
  renderQueue();

  if (shouldAutoPlay) {
    audio.play().catch(() => {
      showToast("Playback was blocked. Press Play to start.");
    });
  }

  saveRecent(index);
  renderRecent();
  updateStats();
  renderSongs();
}

function togglePlay() {
  if (!audio.src) {
    loadSong(currentSong, true);
    return;
  }

  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function nextSong() {
  const nextIndex = isShuffle
    ? Math.floor(Math.random() * songs.length)
    : (currentSong + 1) % songs.length;
  loadSong(nextIndex, true);
}

function prevSong() {
  const prevIndex = (currentSong - 1 + songs.length) % songs.length;
  loadSong(prevIndex, true);
}

function toggleFavorite(index = currentSong) {
  if (favorites.includes(index)) {
    favorites = favorites.filter((item) => item !== index);
    showToast(`Removed ${songs[index].name} from favorites`);
  } else {
    favorites.unshift(index);
    showToast(`Added ${songs[index].name} to favorites`);
  }

  localStorage.setItem("melo-favorites", JSON.stringify(favorites));
  renderSongs();
  renderFavorites();
  updateFavoriteButton();
  updateStats();
}

function clearRecent() {
  recent = [];
  localStorage.removeItem("melo-recent");
  renderRecent();
  updateStats();
  showToast("Recently played cleared");
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
  if (isShuffle) {
    isRepeat = false;
    repeatBtn.classList.remove("active");
    showToast("Shuffle mode enabled");
  }
  updateModeText();
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
  if (isRepeat) {
    isShuffle = false;
    shuffleBtn.classList.remove("active");
    showToast("Repeat mode enabled");
  }
  updateModeText();
}

function toggleMute() {
  isMuted = !isMuted;
  audio.muted = isMuted;
  if (!isMuted && Number(volume.value) === 0) {
    volume.value = 0.5;
    audio.volume = 0.5;
  }
  updatePlayButtons();
}

function applyTheme(theme) {
  document.body.classList.toggle("light", theme === "light");
  localStorage.setItem("melo-theme", theme);
  updatePlayButtons();
}

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  if (!isNaN(audio.duration)) {
    progress.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});

audio.addEventListener("play", updatePlayButtons);
audio.addEventListener("pause", updatePlayButtons);

audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.currentTime = 0;
    audio.play();
    return;
  }
  nextSong();
});

progress.addEventListener("input", () => {
  if (!isNaN(audio.duration)) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});

volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
  isMuted = Number(volume.value) === 0;
  audio.muted = isMuted;
  updatePlayButtons();
});

search.addEventListener("input", () => {
  renderSongs();
});

document.addEventListener("click", (event) => {
  const songCard = event.target.closest("#songList .card, #favoritesList .card, #recentList .card");
  const playTarget = event.target.closest("[data-play]");
  const heartTarget = event.target.closest("[data-heart]");
  const navTarget = event.target.closest(".nav-item");
  const filterTarget = event.target.closest(".filter-chip");

  if (playTarget) {
    loadSong(Number(playTarget.dataset.play), true);
    return;
  }

  if (heartTarget) {
    event.stopPropagation();
    toggleFavorite(Number(heartTarget.dataset.heart));
    return;
  }

  if (songCard) {
    loadSong(Number(songCard.dataset.index), true);
    return;
  }

  if (navTarget) {
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    navTarget.classList.add("active");
    const sectionMap = {
      home: document.getElementById("homeSection"),
      library: document.getElementById("librarySection"),
      favorites: document.getElementById("favoritesSection"),
      recent: document.getElementById("recentSection")
    };
    const target = sectionMap[navTarget.dataset.section];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  if (filterTarget) {
    document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.remove("active"));
    filterTarget.classList.add("active");
    activeFilter = filterTarget.dataset.filter;
    renderSongs();
  }
});

playBtn.addEventListener("click", togglePlay);
heroPlayBtn.addEventListener("click", togglePlay);
favoriteCurrentBtn.addEventListener("click", () => toggleFavorite(currentSong));
muteBtn.addEventListener("click", toggleMute);
document.getElementById("nextBtn").addEventListener("click", nextSong);
document.getElementById("prevBtn").addEventListener("click", prevSong);
shuffleBtn.addEventListener("click", toggleShuffle);
repeatBtn.addEventListener("click", toggleRepeat);
document.getElementById("clearRecentBtn").addEventListener("click", clearRecent);
themeToggle.addEventListener("click", () => {
  savedTheme = document.body.classList.contains("light") ? "dark" : "light";
  applyTheme(savedTheme);
  showToast(savedTheme === "light" ? "Light mode enabled" : "Dark mode enabled");
});

document.addEventListener("keydown", (event) => {
  if (event.target.matches("input")) {
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();
    togglePlay();
  }

  if (event.key === "ArrowRight" && !isNaN(audio.duration)) {
    audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
  }

  if (event.key === "ArrowLeft" && !isNaN(audio.duration)) {
    audio.currentTime = Math.max(audio.currentTime - 5, 0);
  }

  if (event.key === "ArrowUp") {
    volume.value = Math.min(Number(volume.value) + 0.05, 1).toFixed(2);
    audio.volume = Number(volume.value);
    isMuted = audio.volume === 0;
    audio.muted = isMuted;
    updatePlayButtons();
  }

  if (event.key === "ArrowDown") {
    volume.value = Math.max(Number(volume.value) - 0.05, 0).toFixed(2);
    audio.volume = Number(volume.value);
    isMuted = audio.volume === 0;
    audio.muted = isMuted;
    updatePlayButtons();
  }

  if (event.key.toLowerCase() === "f") {
    toggleFavorite(currentSong);
  }
});

const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");
let animationId;

function startVisualizer() {
  cancelAnimationFrame(animationId);

  function draw() {
    animationId = requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bars = 36;
    const barWidth = canvas.width / bars;

    for (let i = 0; i < bars; i += 1) {
      const base = audio.paused ? 8 : 18;
      const wave = Math.abs(Math.sin(audio.currentTime * 4 + i * 0.7));
      const barHeight = base + wave * 40 + Math.random() * 8;
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#00c6ff");
      gradient.addColorStop(0.5, "#6a5cff");
      gradient.addColorStop(1, "#ff4c60");
      ctx.fillStyle = gradient;
      ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 3, barHeight);
    }
  }

  draw();
}

audio.addEventListener("play", startVisualizer);
audio.addEventListener("pause", () => cancelAnimationFrame(animationId));
audio.addEventListener("error", () => {
  showToast("Song file could not be loaded. Check your songs folder.");
});

window.addEventListener("load", () => {
  applyTheme(savedTheme);
  audio.volume = Number(volume.value);
  renderSongs();
  renderFavorites();
  renderRecent();
  renderQueue();
  renderPlaylists();
  renderAlbums();
  updateStats();
  updateModeText();
  updatePlayButtons();
  loadSong(0, false);
});
