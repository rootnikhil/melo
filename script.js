// ---------------------------------
// Data
// ---------------------------------

const SONGS = [
  { id: 1, title: "Khat", artist: "Navjot Ahuja", cover: "images/cover1.jpg", src: "audio/song1.mp3" },
  { id: 2, title: "Sajde", artist: "Faheem Abdullah, Hazaif Nazar", cover: "images/cover2.jpg", src: "audio/song2.mp3" },
  { id: 3, title: "Piya Ghar Aavenge", artist: "Kailash Kher, Paresh Kamath, Naresh Kamath", cover: "images/cover3.jpg", src: "audio/song3.mp3" },
  { id: 4, title: "Maharani", artist: "Karun, Lambo Drive, Arpit Bala, GHILDIYAL", cover: "images/cover4.jpg", src: "audio/song4.mp3" },
  { id: 5, title: "Main Rahoon Ya Na Rahoon", artist: "Amaal Mallik, Armaan Mallik, Rashmi Virag", cover: "images/cover5.jpg", src: "audio/song5.mp3" },
  { id: 6, title: "Ishq Sufiyana", artist: "Vishal Shekhar, Kamal Khan", cover: "images/cover6.jpg", src: "audio/song6.mp3" },
  { id: 7, title: "Vaari Jaavan", artist: "Shashwat Sachdev, Jyoti Nooran, Jasmine Sandlas, Reble", cover: "images/cover7.jpg", src: "audio/song7.mp3" },
  { id: 8, title: "Bairan", artist: "Banjaare", cover: "images/cover8.jpg", src: "audio/song8.mp3" },
  { id: 9, title: "Do Pal", artist: "Madan Mohan, Lata Mangeshkar, Sonu Nigam, Javed Akhtar", cover: "images/cover9.jpg", src: "audio/song9.mp3" },
  { id: 10, title: "Maand", artist: "Bayaan, Hasan Raheem, Rovalio", cover: "images/cover10.jpg", src: "audio/song10.mp3" },
  { id: 11, title: "Babydoll", artist: "Dominic Fike", cover: "images/cover11.jpg", src: "audio/song11.mp3" },
];

const TABS = [
  { id: "player", label: "Now Playing" },
  { id: "songs", label: "Library" },
  { id: "liked", label: "Liked" },
  { id: "recent", label: "Recent" },
  { id: "playlist", label: "Playlist" },
];

const ALL_SONG_IDS = SONGS.map((song) => song.id);

const REPEAT_MODES = ["off", "all", "one"];
const REPEAT_ICONS = {
  off: '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  all: '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  one: '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/><text x="9.5" y="13.5" font-size="6.5" fill="currentColor" font-family="Outfit" font-weight="bold">1</text>',
};
const REPEAT_LABELS = {
  off: "Repeat Off",
  all: "Repeat All",
  one: "Repeat One",
};

// ---------------------------------
// State
// ---------------------------------

const state = {
  currentIndex: 0,
  isPlaying: false,
  shuffle: false,
  recentAddedForCurrent: false,
  hasLoadedSong: false,
  repeatMode: "off",
  volume: 0.8,
  playbackSpeed: 1,
  liked: new Set(),
  recentlyPlayed: [],
  playlists: [],
  activeTab: "player",
  ctxSongId: null,
  searchQuery: "",
  queueOpen: false,
  sleepTimer: null,
  sleepEndTime: null,
  sleepCountdownInterval: null,
  playNextQueue: [],
  selectedPlaylistId: null,
  currentQueueSongIds: [...ALL_SONG_IDS],
  currentQueueType: "all",
  currentQueueLabel: "All Songs",
  currentQueuePlaylistId: null,
};

// ---------------------------------
// DOM references
// ---------------------------------

const audio = document.getElementById("audioPlayer");
const disc = document.getElementById("disc");
const albumImg = document.getElementById("albumImg");
const albumCover = document.getElementById("albumCover");
const cdStage = document.getElementById("cdStage");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const songContextLabel = document.getElementById("songContextLabel");
const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const repeatIcon = document.getElementById("repeatIcon");
const progressTrack = document.getElementById("progressTrack");
const progressFill = document.getElementById("progressFill");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");
const volSlider = document.getElementById("volSlider");

const songList = document.getElementById("songList");
const likedList = document.getElementById("likedList");
const recentList = document.getElementById("recentList");
const searchResultsList = document.getElementById("searchResultsList");
const playlistList = document.getElementById("playlistList");
const playlistDetail = document.getElementById("playlistDetail");

const ctxMenu = document.getElementById("ctxMenu");
const ctxPlayNext = document.getElementById("ctxPlayNext");
const ctxAddToPlaylist = document.getElementById("ctxAddToPlaylist");
const ctxDownload = document.getElementById("ctxDownload");

const toast = document.getElementById("toast");
const searchInput = document.getElementById("searchInput");
const searchClearBtn = document.getElementById("searchClearBtn");
const playerLikeBtn = document.getElementById("playerLikeBtn");
const playerMoreBtn = document.getElementById("playerMoreBtn");

const miniPlayer = document.getElementById("miniPlayer");
const mpImg = document.getElementById("mpImg");
const mpTitle = document.getElementById("mpTitle");
const mpArtist = document.getElementById("mpArtist");
const mpPlayBtn = document.getElementById("mpPlayBtn");
const mpPrevBtn = document.getElementById("mpPrevBtn");
const mpNextBtn = document.getElementById("mpNextBtn");
const mpIcon = document.getElementById("mpIcon");
const miniProgressFill = document.getElementById("miniProgressFill");

const themeToggle = document.getElementById("themeToggle");
const meloLogo = document.getElementById("meloLogo");
const aboutPanel = document.getElementById("aboutPanel");
const aboutClose = document.getElementById("aboutClose");

const queueToggleBtn = document.getElementById("queueToggleBtn");
const queueDrawer = document.getElementById("queueDrawer");
const queueInner = document.getElementById("queueInner");

const sleepTimerBtn = document.getElementById("sleepTimerBtn");
const sleepPanel = document.getElementById("sleepPanel");
const sleepOverlay = document.getElementById("sleepOverlay");
const sleepCountdown = document.getElementById("sleepCountdown");
const sleepCancelBtn = document.getElementById("sleepCancelBtn");
const sleepNotice = document.getElementById("sleepNotice");
const sleepNoticeText = document.getElementById("sleepNoticeText");

const speedBtn = document.getElementById("speedBtn");
const speedPanel = document.getElementById("speedPanel");
const speedOverlay = document.getElementById("speedOverlay");

const playlistOverlay = document.getElementById("playlistOverlay");
const playlistPanel = document.getElementById("playlistPanel");
const playlistSheetHelper = document.getElementById("playlistSheetHelper");
const playlistSheetList = document.getElementById("playlistSheetList");
const playlistNameInput = document.getElementById("playlistNameInput");
const createPlaylistBtn = document.getElementById("createPlaylistBtn");

document.getElementById("aboutYear").textContent = new Date().getFullYear();

// ---------------------------------
// Helpers
// ---------------------------------

function getSongById(id) {
  return SONGS.find((song) => song.id === id) || null;
}

function getPlaylistById(id) {
  return state.playlists.find((playlist) => playlist.id === id) || null;
}

function currentSong() {
  return SONGS[state.currentIndex] || SONGS[0];
}

function formatTime(seconds) {
  if (Number.isNaN(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ---------------------------------
// Queue helpers
// ---------------------------------

function getNormalizedQueueIds() {
  const source = state.currentQueueSongIds.length ? state.currentQueueSongIds : ALL_SONG_IDS;
  const filtered = source.filter((id) => getSongById(id));

  if (filtered.length) return filtered;
  return state.currentQueueType === "playlist" ? [] : [...ALL_SONG_IDS];
}

function getCurrentQueueSongs() {
  return getNormalizedQueueIds().map((id) => getSongById(id)).filter(Boolean);
}

function getCurrentQueueIndex() {
  return getNormalizedQueueIds().indexOf(currentSong().id);
}

function setPlaybackQueue(songIds, type = "all", playlistId = null, label = "All Songs") {
  const normalized = [...new Set(songIds.filter((id) => getSongById(id)))];
  state.currentQueueSongIds = normalized;
  state.currentQueueType = type;
  state.currentQueuePlaylistId = playlistId;
  state.currentQueueLabel = label;
  updatePlaybackContextLabel();

  if (state.queueOpen) renderQueue();
}

function useLibraryQueue() {
  setPlaybackQueue(ALL_SONG_IDS, "all", null, "Playing from library");
}

function usePlaylistQueue(playlist) {
  setPlaybackQueue(playlist.songIds, "playlist", playlist.id, `Playing from playlist: ${playlist.name}`);
}

function updatePlaybackContextLabel() {
  songContextLabel.textContent = state.currentQueueLabel || "Playing from library";
}

function ensureSongInCurrentQueue(songId) {
  if (state.currentQueueType === "playlist") return;

  if (!getNormalizedQueueIds().includes(songId)) {
    state.currentQueueSongIds = [songId, ...getNormalizedQueueIds()];
  }
}

// ---------------------------------
// About panel
// ---------------------------------

function openAbout() {
  aboutPanel.classList.add("open");
  aboutPanel.scrollTop = 0;
}

function closeAbout() {
  aboutPanel.classList.remove("open");
}

meloLogo.addEventListener("click", openAbout);
aboutClose.addEventListener("click", closeAbout);
aboutPanel.addEventListener("click", (event) => {
  if (event.target === aboutPanel) closeAbout();
});

// ---------------------------------
// Sleep timer
// ---------------------------------

function openSleepSheet() {
  sleepPanel.classList.add("open");
  sleepOverlay.classList.add("show");
  updateSleepUI();
}

function closeSleepSheet() {
  sleepPanel.classList.remove("open");
  sleepOverlay.classList.remove("show");
}

function showCenterNotice(message) {
  sleepNoticeText.textContent = message;
  sleepNotice.classList.add("show");

  clearTimeout(showCenterNotice.timer);
  showCenterNotice.timer = setTimeout(() => {
    sleepNotice.classList.remove("show");
  }, 2800);
}

function updateSleepCountdown() {
  if (!state.sleepEndTime) return;

  const remaining = Math.max(0, state.sleepEndTime - Date.now());
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000).toString().padStart(2, "0");

  sleepCountdown.textContent = `${minutes}:${seconds}`;
  sleepCountdown.classList.add("visible");
  sleepCancelBtn.classList.add("visible");
}

function updateSleepUI() {
  if (state.sleepEndTime) {
    updateSleepCountdown();
    sleepCancelBtn.classList.add("visible");
  } else {
    sleepCountdown.classList.remove("visible");
    sleepCancelBtn.classList.remove("visible");
  }
}

function cancelSleepTimer() {
  if (state.sleepTimer) {
    clearTimeout(state.sleepTimer);
    state.sleepTimer = null;
  }

  if (state.sleepCountdownInterval) {
    clearInterval(state.sleepCountdownInterval);
    state.sleepCountdownInterval = null;
  }

  state.sleepEndTime = null;
  sleepTimerBtn.classList.remove("timer-on");
  updateSleepUI();
}

function setSleepTimer(minutes) {
  cancelSleepTimer();

  const duration = minutes * 60 * 1000;
  state.sleepEndTime = Date.now() + duration;
  state.sleepTimer = setTimeout(() => {
    pauseSong();
    cancelSleepTimer();
    showCenterNotice("Go to sleep, your time is completed.");
    showToast("Sleep timer completed");
  }, duration);

  state.sleepCountdownInterval = setInterval(updateSleepCountdown, 1000);
  sleepTimerBtn.classList.add("timer-on");
  updateSleepCountdown();
  showToast(`Sleep timer set for ${minutes} min`);
}

sleepTimerBtn.addEventListener("click", openSleepSheet);
sleepOverlay.addEventListener("click", closeSleepSheet);

document.querySelectorAll(".sheet-opt[data-min]").forEach((btn) => {
  btn.addEventListener("click", () => {
    setSleepTimer(parseInt(btn.dataset.min, 10));
    closeSleepSheet();
  });
});

sleepCancelBtn.addEventListener("click", () => {
  cancelSleepTimer();
  closeSleepSheet();
  showToast("Sleep timer cancelled");
});

// ---------------------------------
// Playback speed
// ---------------------------------

function openSpeedSheet() {
  speedPanel.classList.add("open");
  speedOverlay.classList.add("show");
}

function closeSpeedSheet() {
  speedPanel.classList.remove("open");
  speedOverlay.classList.remove("show");
}

function setPlaybackSpeed(speed, options = {}) {
  const { silent = false, persist = true } = options;

  state.playbackSpeed = speed;
  audio.playbackRate = speed;
  speedBtn.textContent = speed === 1 ? "1×" : `${speed}×`;
  speedBtn.classList.toggle("active", speed !== 1);

  if (persist) {
    localStorage.setItem("melo_speed", speed);
  }

  if (!silent) {
    showToast(`Speed: ${speedBtn.textContent}`);
  }
}

speedBtn.addEventListener("click", openSpeedSheet);
speedOverlay.addEventListener("click", closeSpeedSheet);

document.querySelectorAll(".sheet-opt[data-speed]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const speed = parseFloat(btn.dataset.speed);

    setPlaybackSpeed(speed);
    document
      .querySelectorAll(".sheet-opt[data-speed]")
      .forEach((node) => node.classList.remove("sheet-opt-active"));
    btn.classList.add("sheet-opt-active");
    closeSpeedSheet();
  });
});

// ---------------------------------
// Tabs and views
// ---------------------------------

function renderTabs() {
  const tabNav = document.getElementById("tabNav");
  tabNav.innerHTML = "";

  TABS.forEach((tab) => {
    const btn = document.createElement("button");
    btn.className = `tab-btn${tab.id === state.activeTab ? " active" : ""}`;
    btn.dataset.tab = tab.id;
    btn.textContent = tab.label;
    btn.addEventListener("click", () => switchTab(tab.id));
    tabNav.appendChild(btn);
  });
}

function setActiveView(viewId) {
  document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));

  const target = document.getElementById(viewId);
  if (target) target.classList.add("active");
}

function updateMiniPlayerVisibility() {
  const isSearchView = Boolean(state.searchQuery);
  const shouldShow = state.hasLoadedSong && (isSearchView || state.activeTab !== "player");
  miniPlayer.classList.toggle("visible", shouldShow);
}

function switchTab(tab) {
  state.activeTab = tab;
  localStorage.setItem("melo_tab", tab);

  if (state.searchQuery) {
    searchInput.value = "";
    searchClearBtn.classList.remove("visible");
    state.searchQuery = "";
  }

  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === tab));

  setActiveView(`view-${tab}`);

  if (tab === "playlist") renderPlaylists();
  if (tab !== "search" && tab !== "player") renderAll();

  updateMiniPlayerVisibility();
}

// ---------------------------------
// UI state updates
// ---------------------------------

function updateMarquee() {
  requestAnimationFrame(() => {
    const wrap = songTitle.parentElement;
    const titleWidth = songTitle.scrollWidth;
    const wrapWidth = wrap.clientWidth;

    if (titleWidth > wrapWidth + 4) {
      const offset = -(titleWidth - wrapWidth + 16);
      songTitle.style.setProperty("--marquee-offset", `${offset}px`);
      songTitle.classList.add("marquee");
    } else {
      songTitle.classList.remove("marquee");
      songTitle.style.removeProperty("--marquee-offset");
    }
  });
}

function updatePlayBtns(playing) {
  const playPath = '<path d="M8 5v14l11-7z"/>';
  const pausePath = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';

  playIcon.innerHTML = playing ? pausePath : playPath;
  mpIcon.innerHTML = playing ? pausePath : playPath;
}

function updateEqState(playing) {
  document.querySelectorAll(".song-item.active").forEach((item) => {
    item.classList.toggle("paused", !playing);
  });
}

function updateLikeBtn() {
  if (!state.hasLoadedSong) return;

  const liked = state.liked.has(currentSong().id);
  const svgFill = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
  const svgLine = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
  const burst = playerLikeBtn.querySelector(".burst");

  playerLikeBtn.classList.toggle("liked", liked);
  playerLikeBtn.innerHTML = "";
  playerLikeBtn.appendChild(burst);
  playerLikeBtn.insertAdjacentHTML("beforeend", liked ? svgFill : svgLine);
}

function updateActiveItems() {
  document.querySelectorAll(".song-item").forEach((item) => {
    const isActive = parseInt(item.dataset.idx, 10) === state.currentIndex;
    item.classList.toggle("active", isActive);
    item.classList.toggle("paused", isActive && !state.isPlaying);
    item.dataset.liked = state.liked.has(parseInt(item.dataset.id, 10)) ? "true" : "false";
  });
}

function triggerLikeAnimation() {
  playerLikeBtn.classList.remove("pop");
  void playerLikeBtn.offsetWidth;
  playerLikeBtn.classList.add("pop");
  setTimeout(() => playerLikeBtn.classList.remove("pop"), 500);
}

function refreshViews() {
  renderAll();
  renderPlaylists();
  if (state.searchQuery) renderSearchResults(state.searchQuery);
  updateLikeBtn();
  updateActiveItems();
  updateMiniPlayerVisibility();
  if (state.queueOpen) renderQueue();
}

function resetPlaybackProgress() {
  audio.currentTime = 0;
  progressFill.style.width = "0%";
  miniProgressFill.style.width = "0%";
  currentTimeEl.textContent = "0:00";
}

function stopPlaybackAtStart() {
  pauseSong();
  resetPlaybackProgress();
  _savePlayerState();
}

// ---------------------------------
// Persistence
// ---------------------------------

function _savePlayerState() {
  localStorage.setItem("melo_player", JSON.stringify({
    index: state.currentIndex,
    time: audio.currentTime,
    isPlaying: state.isPlaying,
    shuffle: state.shuffle,
    repeatMode: state.repeatMode,
    queueType: state.currentQueueType,
    queueSongIds: state.currentQueueSongIds,
    queuePlaylistId: state.currentQueuePlaylistId,
  }));
}

function _savePersist() {
  localStorage.setItem("melo_liked", JSON.stringify([...state.liked]));
  localStorage.setItem("melo_recent", JSON.stringify(state.recentlyPlayed));
  localStorage.setItem("melo_volume", state.volume);
  localStorage.setItem("melo_playlists", JSON.stringify(state.playlists));
  localStorage.setItem("melo_selected_playlist", state.selectedPlaylistId || "");
}

function sanitizePlaylists(raw) {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((playlist, index) => {
      const name = typeof playlist.name === "string" ? playlist.name.trim() : "";
      const songIds = Array.isArray(playlist.songIds)
        ? [...new Set(playlist.songIds.filter((id) => getSongById(id)))]
        : [];

      return {
        id: playlist.id || `playlist-${Date.now()}-${index}`,
        name: name || `Playlist ${index + 1}`,
        songIds,
      };
    })
    .filter((playlist) => playlist.name);
}

function _loadPersist() {
  try {
    state.liked = new Set(JSON.parse(localStorage.getItem("melo_liked") || "[]"));
    state.recentlyPlayed = JSON.parse(localStorage.getItem("melo_recent") || "[]").filter((id) => getSongById(id));
    state.volume = parseFloat(localStorage.getItem("melo_volume") || "0.8");
    state.playbackSpeed = parseFloat(localStorage.getItem("melo_speed") || "1");
    state.activeTab = localStorage.getItem("melo_tab") || "player";
    state.playlists = sanitizePlaylists(JSON.parse(localStorage.getItem("melo_playlists") || "[]"));
    state.selectedPlaylistId = localStorage.getItem("melo_selected_playlist") || null;

    if (!getPlaylistById(state.selectedPlaylistId)) {
      state.selectedPlaylistId = state.playlists[0]?.id || null;
    }

    volSlider.value = state.volume * 100;
    audio.volume = state.volume;
    audio.playbackRate = state.playbackSpeed;

    setPlaybackSpeed(state.playbackSpeed, { silent: true, persist: false });

    document.querySelectorAll(".sheet-opt[data-speed]").forEach((btn) => {
      btn.classList.toggle("sheet-opt-active", parseFloat(btn.dataset.speed) === state.playbackSpeed);
    });

    document.documentElement.dataset.theme = localStorage.getItem("melo_theme") || "dark";
    updateThemeIcon();
  } catch (error) {
    console.error("Failed to load persisted state", error);
  }
}

function _loadPlayerState() {
  try {
    const data = JSON.parse(localStorage.getItem("melo_player") || "null");

    if (!data) {
      useLibraryQueue();
      updatePlaybackContextLabel();
      return;
    }

    state.currentIndex = typeof data.index === "number" ? data.index : 0;
    state.shuffle = Boolean(data.shuffle);
    state.repeatMode = data.repeatMode || "off";

    shuffleBtn.classList.toggle("active", state.shuffle);
    repeatBtn.classList.toggle("active", state.repeatMode !== "off");
    repeatIcon.innerHTML = REPEAT_ICONS[state.repeatMode];

    if (data.queueType === "playlist" && data.queuePlaylistId && getPlaylistById(data.queuePlaylistId)) {
      const playlist = getPlaylistById(data.queuePlaylistId);
      usePlaylistQueue(playlist);
    } else if (Array.isArray(data.queueSongIds) && data.queueSongIds.length) {
      setPlaybackQueue(data.queueSongIds, "all", null, "Playing from library");
    } else {
      useLibraryQueue();
    }

    loadSong(state.currentIndex, false);

    if (typeof data.time === "number") {
      audio.addEventListener("loadedmetadata", function restoreSavedTime() {
        audio.currentTime = Math.min(data.time, audio.duration || data.time);
        audio.removeEventListener("loadedmetadata", restoreSavedTime);
      });
    }

    if (data.isPlaying) {
      playSong();
    } else {
      pauseSong();
    }
  } catch (error) {
    console.error("Failed to load player state", error);
    useLibraryQueue();
  }
}

// ---------------------------------
// Likes and recent
// ---------------------------------

function toggleLike(id) {
  if (state.liked.has(id)) {
    state.liked.delete(id);
  } else {
    state.liked.add(id);
  }
}

function addToRecent(id) {
  state.recentlyPlayed = state.recentlyPlayed.filter((item) => item !== id);
  state.recentlyPlayed.unshift(id);

  if (state.recentlyPlayed.length > 20) {
    state.recentlyPlayed.pop();
  }

  _savePersist();
}

// ---------------------------------
// Playback core
// ---------------------------------

function loadSong(index, autoplay = false) {
  const song = SONGS[index];
  if (!song) return;

  state.currentIndex = index;
  state.recentAddedForCurrent = false;
  state.hasLoadedSong = true;

  ensureSongInCurrentQueue(song.id);

  cdStage.classList.add("loading");
  albumCover.classList.remove("fading");
  void albumCover.offsetWidth;
  albumCover.classList.add("fading");

  audio.src = song.src;
  audio.volume = state.volume;
  audio.playbackRate = state.playbackSpeed;

  albumImg.src = song.cover;
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;

  mpImg.src = song.cover;
  mpTitle.textContent = song.title;
  mpArtist.textContent = song.artist;

  progressFill.style.width = "0%";
  miniProgressFill.style.width = "0%";
  currentTimeEl.textContent = "0:00";
  totalTimeEl.textContent = song._duration || "0:00";

  updateMarquee();
  updateLikeBtn();
  updatePlaybackContextLabel();

  if (autoplay) {
    playSong();
  } else {
    updatePlayBtns(false);
  }

  updateActiveItems();
  updateMiniPlayerVisibility();
  if (state.queueOpen) renderQueue();
}

async function playSong() {
  try {
    await audio.play();
    state.isPlaying = true;
    disc.classList.add("spinning");
    updatePlayBtns(true);
    updateEqState(true);
    updateMiniPlayerVisibility();
    _savePlayerState();
    return true;
  } catch {
    state.isPlaying = false;
    disc.classList.remove("spinning");
    updatePlayBtns(false);
    updateEqState(false);
    updateMiniPlayerVisibility();
    _savePlayerState();
    return false;
  }
}

function pauseSong() {
  audio.pause();
  state.isPlaying = false;
  disc.classList.remove("spinning");
  updatePlayBtns(false);
  updateEqState(false);
  updateMiniPlayerVisibility();
  _savePlayerState();
}

function togglePlay() {
  if (!state.hasLoadedSong) {
    loadSong(state.currentIndex || 0, true);
    return;
  }

  if (state.isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

function getRandomSongFromQueue() {
  const queueIds = getNormalizedQueueIds();
  if (queueIds.length === 1) return queueIds[0];

  let nextId = currentSong().id;
  while (nextId === currentSong().id) {
    nextId = queueIds[Math.floor(Math.random() * queueIds.length)];
  }

  return nextId;
}

function nextSong(fromEnded = false) {
  if (state.playNextQueue.length) {
    const nextId = state.playNextQueue.shift();
    const nextIndex = SONGS.findIndex((song) => song.id === nextId);

    if (nextIndex !== -1) {
      loadSong(nextIndex, true);
      return;
    }
  }

  const queueIds = getNormalizedQueueIds();
  const queueIndex = getCurrentQueueIndex();

  if (!queueIds.length) {
    if (fromEnded) stopPlaybackAtStart();
    return;
  }

  if (queueIndex === -1) {
    const fallbackIndex = SONGS.findIndex((song) => song.id === queueIds[0]);

    if (fallbackIndex !== -1) {
      loadSong(fallbackIndex, true);
    } else if (fromEnded) {
      stopPlaybackAtStart();
    }

    return;
  }

  if (state.shuffle) {
    const randomId = getRandomSongFromQueue();
    loadSong(SONGS.findIndex((song) => song.id === randomId), true);
    return;
  }

  const isLastSong = queueIndex >= queueIds.length - 1;

  if (isLastSong) {
    if (fromEnded && state.repeatMode !== "all") {
      stopPlaybackAtStart();
      return;
    }

    loadSong(SONGS.findIndex((song) => song.id === queueIds[0]), true);
    return;
  }

  const nextId = queueIds[queueIndex + 1];
  loadSong(SONGS.findIndex((song) => song.id === nextId), true);
}

function prevSong() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }

  const queueIds = getNormalizedQueueIds();
  const queueIndex = getCurrentQueueIndex();
  if (!queueIds.length) return;

  if (queueIndex === -1) {
    const fallbackIndex = SONGS.findIndex((song) => song.id === queueIds[queueIds.length - 1]);
    if (fallbackIndex !== -1) loadSong(fallbackIndex, true);
    return;
  }

  const prevId = queueIndex > 0 ? queueIds[queueIndex - 1] : queueIds[queueIds.length - 1];
  loadSong(SONGS.findIndex((song) => song.id === prevId), true);
}

function playSongFromLibrary(song) {
  useLibraryQueue();
  loadSong(SONGS.findIndex((item) => item.id === song.id), true);
  switchTab("player");
}

function playSongFromPlaylist(song, playlistId) {
  const playlist = getPlaylistById(playlistId);

  if (!playlist || !playlist.songIds.length) {
    showToast("This playlist is empty");
    return;
  }

  usePlaylistQueue(playlist);
  loadSong(SONGS.findIndex((item) => item.id === song.id), true);
  switchTab("player");
}

// ---------------------------------
// Rendering
// ---------------------------------

function renderSongItem(song, options = {}) {
  const { onSelect = () => playSongFromLibrary(song) } = options;
  const idx = SONGS.findIndex((item) => item.id === song.id);
  const isActive = idx === state.currentIndex;
  const isLiked = state.liked.has(song.id);
  const duration = song._duration || song.duration || "–:––";

  const item = document.createElement("div");
  item.className = `song-item${isActive ? " active" : ""}${isActive && !state.isPlaying ? " paused" : ""}`;
  item.dataset.id = song.id;
  item.dataset.idx = idx;
  item.dataset.liked = isLiked ? "true" : "false";

  item.innerHTML = `
    <div class="si-thumb">
      <img src="${song.cover}" alt="${song.title}" loading="lazy">
      <div class="si-playing-indicator">
        <div class="eq-bars"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>
      </div>
    </div>
    <div class="si-info">
      <div class="si-title">${song.title}</div>
      <div class="si-artist">${song.artist}</div>
    </div>
    <div class="si-right">
      <div class="si-liked-dot"></div>
      <div class="si-duration">${duration}</div>
      <button class="si-menu-btn" data-id="${song.id}" title="More">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="5" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="12" cy="19" r="1.2"/></svg>
      </button>
    </div>`;

  item.addEventListener("click", (event) => {
    if (event.target.closest(".si-menu-btn")) return;
    onSelect(song);
  });

  item.querySelector(".si-menu-btn").addEventListener("click", (event) => {
    event.stopPropagation();
    openCtxMenu(event, song.id);
  });

  attachLongPress(item, () => openCtxMenuAtCenter(song.id));
  return item;
}

function renderList(songs, container, emptyMessage, renderer) {
  container.innerHTML = "";

  if (!songs.length) {
    container.innerHTML = `<div class="empty-state"><span class="em-icon">♪</span>${emptyMessage}<p>It will appear here when available.</p></div>`;
    return;
  }

  songs.forEach((song) => container.appendChild(renderer(song)));
}

function renderAll() {
  renderList(SONGS, songList, "No songs found", (song) => renderSongItem(song));
  document.getElementById("songsCount").textContent = `${SONGS.length} songs`;

  const likedSongs = SONGS.filter((song) => state.liked.has(song.id));
  renderList(likedSongs, likedList, "No liked songs", (song) => renderSongItem(song));
  document.getElementById("likedCount").textContent = `${likedSongs.length} songs`;

  const recentSongs = state.recentlyPlayed.map((id) => getSongById(id)).filter(Boolean);
  renderList(recentSongs, recentList, "No recently played songs", (song) => renderSongItem(song));
  document.getElementById("recentCount").textContent = `${recentSongs.length} songs`;
}

function _appendSearchGroup(label, songs) {
  const title = document.createElement("div");
  title.className = "search-group-label";
  title.textContent = label;
  searchResultsList.appendChild(title);

  songs.forEach((song) => {
    searchResultsList.appendChild(renderSongItem(song));
  });
}

function renderSearchResults(query) {
  searchResultsList.innerHTML = "";
  if (!query) return;

  const normalized = query.toLowerCase();
  const byTitle = SONGS.filter((song) => song.title.toLowerCase().includes(normalized));
  const byArtist = SONGS.filter((song) => song.artist.toLowerCase().includes(normalized) && !byTitle.includes(song));
  const inLiked = SONGS.filter((song) => state.liked.has(song.id) && (song.title.toLowerCase().includes(normalized) || song.artist.toLowerCase().includes(normalized)));
  const inRecent = state.recentlyPlayed
    .map((id) => getSongById(id))
    .filter((song) => song && (song.title.toLowerCase().includes(normalized) || song.artist.toLowerCase().includes(normalized)));

  let hasResults = false;

  if (byTitle.length) {
    _appendSearchGroup("Songs", byTitle);
    hasResults = true;
  }

  if (byArtist.length) {
    _appendSearchGroup("Artists", byArtist);
    hasResults = true;
  }

  if (inLiked.length) {
    _appendSearchGroup("In Liked", inLiked);
    hasResults = true;
  }

  if (inRecent.length) {
    const unique = inRecent.filter((song, index, array) => array.findIndex((item) => item.id === song.id) === index);
    _appendSearchGroup("Recently Played", unique);
    hasResults = true;
  }

  if (!hasResults) {
    searchResultsList.innerHTML = `<div class="empty-state"><span class="em-icon">🔍</span>No results for "${query}"<p>Try a different song or artist name.</p></div>`;
  }
}

function makeQueueItem(song, position, isPlayNext) {
  const item = document.createElement("div");
  item.className = "queue-item";

  item.innerHTML = `
    <div class="q-num">${position}</div>
    <div class="q-thumb"><img src="${song.cover}" alt="" loading="lazy"></div>
    <div class="q-info">
      <div class="q-title">${song.title}</div>
      <div class="q-artist">${song.artist}</div>
    </div>`;

  item.addEventListener("click", () => {
    if (isPlayNext) {
      state.playNextQueue = state.playNextQueue.filter((id) => id !== song.id);
    }

    loadSong(SONGS.findIndex((entry) => entry.id === song.id), true);
    switchTab("player");
    state.queueOpen = false;
    queueDrawer.classList.remove("open");
    queueToggleBtn.classList.remove("open");
  });

  return item;
}

function renderQueue() {
  queueInner.innerHTML = "";

  const heading = document.createElement("div");
  heading.className = "queue-label";
  heading.textContent = state.currentQueueType === "playlist" ? "Playlist Queue" : "Up Next";
  queueInner.appendChild(heading);

  if (state.playNextQueue.length) {
    state.playNextQueue.forEach((id, index) => {
      const song = getSongById(id);
      if (!song) return;
      queueInner.appendChild(makeQueueItem(song, index + 1, true));
    });

    const divider = document.createElement("div");
    divider.className = "queue-label";
    divider.style.marginTop = "8px";
    divider.textContent = "Then Playing";
    queueInner.appendChild(divider);
  }

  const queueIds = getNormalizedQueueIds();
  const currentIndexInQueue = getCurrentQueueIndex();
  const upcoming = [];

  for (let offset = 1; offset < queueIds.length; offset += 1) {
    const nextIndex = (currentIndexInQueue + offset) % queueIds.length;
    upcoming.push(queueIds[nextIndex]);
  }

  upcoming.slice(0, 8).forEach((id, index) => {
    const song = getSongById(id);
    if (!song) return;
    queueInner.appendChild(makeQueueItem(song, index + 1 + state.playNextQueue.length, false));
  });
}

function renderPlaylists() {
  const countLabel = document.getElementById("playlistCount");
  countLabel.textContent = `${state.playlists.length} playlist${state.playlists.length === 1 ? "" : "s"}`;

  if (!state.selectedPlaylistId && state.playlists.length) {
    state.selectedPlaylistId = state.playlists[0].id;
  }

  playlistList.innerHTML = "";

  if (!state.playlists.length) {
    playlistList.innerHTML = '<div class="empty-card"><span class="em-icon">🎵</span>Create your first playlist<p>Then add songs to it from the three-dot menu.</p></div>';
  } else {
    state.playlists.forEach((playlist) => {
      const card = document.createElement("div");
      card.className = `playlist-card${playlist.id === state.selectedPlaylistId ? " active" : ""}`;

      card.innerHTML = `
        <div class="playlist-card-main">
          <div class="playlist-card-title">${playlist.name}</div>
          <div class="playlist-card-meta">${playlist.songIds.length} song${playlist.songIds.length === 1 ? "" : "s"}</div>
        </div>
        <div class="playlist-card-actions">
          <button class="playlist-icon-btn" data-action="play" title="Play Playlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <button class="playlist-icon-btn" data-action="delete" title="Delete Playlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>
          </button>
        </div>`;

      card.addEventListener("click", () => {
        state.selectedPlaylistId = playlist.id;
        _savePersist();
        renderPlaylists();
      });

      card.querySelector('[data-action="play"]').addEventListener("click", (event) => {
        event.stopPropagation();
        playPlaylist(playlist.id);
      });

      card.querySelector('[data-action="delete"]').addEventListener("click", (event) => {
        event.stopPropagation();
        deletePlaylist(playlist.id);
      });

      playlistList.appendChild(card);
    });
  }

  const selected = getPlaylistById(state.selectedPlaylistId);

  if (!selected) {
    playlistDetail.innerHTML = '<div class="empty-card"><span class="em-icon">🎧</span>Select a playlist<p>You can then play only that collection from here.</p></div>';
    return;
  }

  const playlistSongs = selected.songIds.map((id) => getSongById(id)).filter(Boolean);
  playlistDetail.innerHTML = "";

  const header = document.createElement("div");
  header.className = "playlist-detail-header";
  header.innerHTML = `
    <div>
      <div class="playlist-detail-title">${selected.name}</div>
      <div class="playlist-detail-subtitle">Only songs from this playlist will play when you start this collection.</div>
    </div>
    <div class="playlist-detail-actions">
      <button class="playlist-primary-btn" id="playSelectedPlaylistBtn">Play Playlist</button>
      <button class="playlist-secondary-btn" id="deleteSelectedPlaylistBtn">Delete</button>
    </div>`;

  playlistDetail.appendChild(header);
  header.querySelector("#playSelectedPlaylistBtn").addEventListener("click", () => playPlaylist(selected.id));
  header.querySelector("#deleteSelectedPlaylistBtn").addEventListener("click", () => deletePlaylist(selected.id));

  if (!playlistSongs.length) {
    const empty = document.createElement("div");
    empty.className = "empty-card";
    empty.innerHTML = '<span class="em-icon">➕</span>No songs in this playlist yet<p>Use the three-dot menu on any song and add it here.</p>';
    playlistDetail.appendChild(empty);
    return;
  }

  const list = document.createElement("div");
  list.className = "playlist-detail-list";

  playlistSongs.forEach((song) => {
    list.appendChild(renderSongItem(song, {
      onSelect: () => playSongFromPlaylist(song, selected.id),
    }));
  });

  playlistDetail.appendChild(list);
}

function renderPlaylistSheet() {
  const song = getSongById(state.ctxSongId);
  playlistSheetList.innerHTML = "";

  playlistSheetHelper.textContent = song
    ? `Choose where to add "${song.title}". Click again to remove it from a playlist.`
    : "Choose a playlist for this song.";

  if (!state.playlists.length) {
    playlistSheetList.innerHTML = '<div class="empty-card"><span class="em-icon">🎼</span>No playlists yet<p>Create one in the Playlist tab first.</p></div>';
    return;
  }

  state.playlists.forEach((playlist) => {
    const item = document.createElement("button");
    const active = playlist.songIds.includes(state.ctxSongId);

    item.className = `playlist-sheet-item${active ? " active" : ""}`;
    item.textContent = active ? `Remove from ${playlist.name}` : `Add to ${playlist.name}`;
    item.addEventListener("click", () => {
      toggleSongInPlaylist(state.ctxSongId, playlist.id);
    });

    playlistSheetList.appendChild(item);
  });
}

// ---------------------------------
// Playlist actions
// ---------------------------------

function createPlaylist() {
  const name = playlistNameInput.value.trim();

  if (!name) {
    showToast("Enter a playlist name");
    playlistNameInput.focus();
    return;
  }

  const duplicate = state.playlists.some((playlist) => playlist.name.toLowerCase() === name.toLowerCase());
  if (duplicate) {
    showToast("Playlist name already exists");
    return;
  }

  const playlist = {
    id: `playlist-${Date.now()}`,
    name,
    songIds: [],
  };

  state.playlists.unshift(playlist);
  state.selectedPlaylistId = playlist.id;
  playlistNameInput.value = "";

  _savePersist();
  renderPlaylists();
  renderPlaylistSheet();
  showToast(`Playlist created: ${name}`);
}

function deletePlaylist(playlistId) {
  const playlist = getPlaylistById(playlistId);
  if (!playlist) return;

  const confirmed = window.confirm(`Delete "${playlist.name}"?`);
  if (!confirmed) return;

  state.playlists = state.playlists.filter((item) => item.id !== playlistId);

  if (state.currentQueueType === "playlist" && state.currentQueuePlaylistId === playlistId) {
    useLibraryQueue();
    updatePlaybackContextLabel();
  }

  if (state.selectedPlaylistId === playlistId) {
    state.selectedPlaylistId = state.playlists[0]?.id || null;
  }

  _savePersist();
  renderPlaylists();
  renderPlaylistSheet();
  showToast("Playlist deleted");
}

function toggleSongInPlaylist(songId, playlistId) {
  const playlist = getPlaylistById(playlistId);
  const song = getSongById(songId);
  if (!playlist || !song) return;

  const exists = playlist.songIds.includes(songId);

  if (exists) {
    const removedCurrentSong = state.currentQueueType === "playlist"
      && state.currentQueuePlaylistId === playlistId
      && currentSong().id === songId;

    playlist.songIds = playlist.songIds.filter((id) => id !== songId);

    if (state.currentQueueType === "playlist" && state.currentQueuePlaylistId === playlistId) {
      usePlaylistQueue(playlist);

      if (removedCurrentSong) {
        if (playlist.songIds.length) {
          const replacementIndex = SONGS.findIndex((item) => item.id === playlist.songIds[0]);
          if (replacementIndex !== -1) {
            loadSong(replacementIndex, state.isPlaying);
          }
        } else {
          stopPlaybackAtStart();
        }
      } else {
        usePlaylistQueue(playlist);
      }
    }

    showToast(`Removed from ${playlist.name}`);
  } else {
    playlist.songIds.push(songId);
    showToast(`Added to ${playlist.name}`);
  }

  _savePersist();
  renderPlaylists();
  renderPlaylistSheet();
}

function playPlaylist(playlistId) {
  const playlist = getPlaylistById(playlistId);

  if (!playlist || !playlist.songIds.length) {
    showToast("This playlist is empty");
    return;
  }

  state.selectedPlaylistId = playlist.id;
  updatePlaybackContextLabel();
  loadSong(SONGS.findIndex((song) => song.id === playlist.songIds[0]), true);
  _savePersist();
  renderPlaylists();
  switchTab("player");
}

createPlaylistBtn.addEventListener("click", createPlaylist);
playlistNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") createPlaylist();
});

function openPlaylistSheet(songId) {
  state.ctxSongId = songId;
  renderPlaylistSheet();
  playlistOverlay.classList.add("show");
  playlistPanel.classList.add("open");
}

function closePlaylistSheet() {
  playlistOverlay.classList.remove("show");
  playlistPanel.classList.remove("open");
}

playlistOverlay.addEventListener("click", closePlaylistSheet);

// ---------------------------------
// Context menu
// ---------------------------------

function openCtxMenu(event, songId) {
  state.ctxSongId = songId;
  ctxMenu.classList.add("show");

  const x = event.clientX || 0;
  const y = event.clientY || 0;

  if (!x && !y) {
    openCtxMenuAtCenter(songId);
    return;
  }

  positionCtxMenu(x, y);
}

function openCtxMenuAtCenter(songId) {
  state.ctxSongId = songId;
  ctxMenu.classList.add("show");

  const frame = document.querySelector(".phone-frame").getBoundingClientRect();
  positionCtxMenu(frame.left + frame.width / 2 - 90, frame.top + frame.height / 2 - 65);
}

function positionCtxMenu(x, y) {
  const menuWidth = 190;
  const menuHeight = 180;
  const left = Math.max(8, Math.min(x, window.innerWidth - menuWidth - 8));
  const top = Math.max(8, Math.min(y, window.innerHeight - menuHeight - 8));

  ctxMenu.style.left = `${left}px`;
  ctxMenu.style.top = `${top}px`;
}

function closeCtxMenu() {
  ctxMenu.classList.remove("show");
}

ctxPlayNext.addEventListener("click", () => {
  const song = getSongById(state.ctxSongId);
  if (!song) return;

  state.playNextQueue = state.playNextQueue.filter((id) => id !== song.id);
  state.playNextQueue.unshift(song.id);

  if (state.queueOpen) renderQueue();
  showToast(`Playing next: ${song.title}`);
  closeCtxMenu();
});

ctxAddToPlaylist.addEventListener("click", () => {
  closeCtxMenu();
  openPlaylistSheet(state.ctxSongId);
});

ctxDownload.addEventListener("click", () => {
  const song = getSongById(state.ctxSongId);
  if (!song) return;

  const link = document.createElement("a");
  link.href = song.src;
  link.download = `${song.title}.mp3`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Download started");
  closeCtxMenu();
});

document.addEventListener("click", (event) => {
  if (!ctxMenu.contains(event.target) && !event.target.closest(".si-menu-btn") && !event.target.closest("#playerMoreBtn")) {
    closeCtxMenu();
  }
});

// ---------------------------------
// Search
// ---------------------------------

function attachLongPress(element, callback, delay = 500) {
  let timer = null;

  element.addEventListener("touchstart", () => {
    element.classList.add("pressing");
    timer = setTimeout(() => {
      element.classList.remove("pressing");
      callback();
    }, delay);
  }, { passive: true });

  ["touchend", "touchmove", "touchcancel"].forEach((eventName) => {
    element.addEventListener(eventName, () => {
      clearTimeout(timer);
      element.classList.remove("pressing");
    }, { passive: true });
  });
}

let searchTimer;

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  searchClearBtn.classList.toggle("visible", query.length > 0);

  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.searchQuery = query;

    if (query) {
      document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));
      setActiveView("view-search");
      renderSearchResults(query);
    } else {
      setActiveView(`view-${state.activeTab}`);
      document
        .querySelectorAll(".tab-btn")
        .forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === state.activeTab));
    }

    updateMiniPlayerVisibility();
  }, 150);
});

searchClearBtn.addEventListener("click", () => {
  searchInput.value = "";
  state.searchQuery = "";
  searchClearBtn.classList.remove("visible");
  setActiveView(`view-${state.activeTab}`);
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === state.activeTab));
  searchInput.focus();
  updateMiniPlayerVisibility();
});

// ---------------------------------
// Preload metadata
// ---------------------------------

function preloadDurations() {
  SONGS.forEach((song) => {
    if (song._duration) return;

    const probe = new Audio();
    probe.preload = "metadata";
    probe.src = song.src;

    probe.addEventListener("loadedmetadata", () => {
      song._duration = formatTime(probe.duration);

      document.querySelectorAll(`.song-item[data-id="${song.id}"] .si-duration`).forEach((node) => {
        node.textContent = song._duration;
      });

      if (song.id === currentSong().id) {
        totalTimeEl.textContent = song._duration;
      }
    }, { once: true });
  });
}

// ---------------------------------
// Button events
// ---------------------------------

playerLikeBtn.addEventListener("click", () => {
  if (!state.hasLoadedSong) {
    showToast("Select a song first");
    return;
  }

  toggleLike(currentSong().id);
  triggerLikeAnimation();
  updateLikeBtn();
  refreshViews();
  showToast(state.liked.has(currentSong().id) ? "Liked" : "Unliked");
  _savePersist();
});

playerMoreBtn.addEventListener("click", (event) => {
  if (!state.hasLoadedSong) {
    showToast("Select a song first");
    return;
  }

  openCtxMenu(event, currentSong().id);
});

playBtn.addEventListener("click", togglePlay);

mpPlayBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  togglePlay();
});

mpPrevBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  prevSong();
});

mpNextBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  nextSong();
});

prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

miniPlayer.addEventListener("click", (event) => {
  if (event.target.closest("#mpPlayBtn,#mpPrevBtn,#mpNextBtn")) return;
  switchTab("player");
});

shuffleBtn.addEventListener("click", () => {
  state.shuffle = !state.shuffle;
  shuffleBtn.classList.toggle("active", state.shuffle);
  showToast(state.shuffle ? "Shuffle On" : "Shuffle Off");
  _savePlayerState();
});

repeatBtn.addEventListener("click", () => {
  const currentModeIndex = REPEAT_MODES.indexOf(state.repeatMode);
  state.repeatMode = REPEAT_MODES[(currentModeIndex + 1) % REPEAT_MODES.length];
  repeatBtn.classList.toggle("active", state.repeatMode !== "off");
  repeatIcon.innerHTML = REPEAT_ICONS[state.repeatMode];
  showToast(REPEAT_LABELS[state.repeatMode]);
  _savePlayerState();
});

volSlider.addEventListener("input", () => {
  state.volume = volSlider.value / 100;
  audio.volume = state.volume;
  _savePersist();
});

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.dataset.theme === "dark";
  document.documentElement.dataset.theme = isDark ? "light" : "dark";
  updateThemeIcon();
  localStorage.setItem("melo_theme", document.documentElement.dataset.theme);
});

queueToggleBtn.addEventListener("click", () => {
  state.queueOpen = !state.queueOpen;
  queueDrawer.classList.toggle("open", state.queueOpen);
  queueToggleBtn.classList.toggle("open", state.queueOpen);
  if (state.queueOpen) renderQueue();
});

function updateThemeIcon() {
  const isDark = document.documentElement.dataset.theme === "dark";
  document.getElementById("themeIcon").innerHTML = isDark
    ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
    : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
}

// ---------------------------------
// Scrubbing
// ---------------------------------

let isDragging = false;

function scrubTo(event) {
  const rect = progressTrack.getBoundingClientRect();
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));

  if (audio.duration) {
    audio.currentTime = ratio * audio.duration;
  }

  progressFill.style.width = `${ratio * 100}%`;
  miniProgressFill.style.width = `${ratio * 100}%`;
}

progressTrack.addEventListener("mousedown", (event) => {
  isDragging = true;
  progressTrack.classList.add("dragging");
  scrubTo(event);
});

progressTrack.addEventListener("touchstart", (event) => {
  isDragging = true;
  progressTrack.classList.add("dragging");
  scrubTo(event);
}, { passive: true });

document.addEventListener("mousemove", (event) => {
  if (isDragging) scrubTo(event);
});

document.addEventListener("touchmove", (event) => {
  if (isDragging) scrubTo(event);
}, { passive: true });

document.addEventListener("mouseup", () => {
  isDragging = false;
  progressTrack.classList.remove("dragging");
});

document.addEventListener("touchend", () => {
  isDragging = false;
  progressTrack.classList.remove("dragging");
});

// ---------------------------------
// Swipe gestures
// ---------------------------------

let swipeStartX = null;
let swipeStartY = null;
let mouseSwipeX = null;

cdStage.addEventListener("touchstart", (event) => {
  swipeStartX = event.touches[0].clientX;
  swipeStartY = event.touches[0].clientY;
}, { passive: true });

cdStage.addEventListener("touchend", (event) => {
  if (swipeStartX === null) return;

  const dx = event.changedTouches[0].clientX - swipeStartX;
  const dy = event.changedTouches[0].clientY - swipeStartY;

  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    dx < 0 ? nextSong() : prevSong();
  }

  swipeStartX = null;
  swipeStartY = null;
}, { passive: true });

cdStage.addEventListener("mousedown", (event) => {
  mouseSwipeX = event.clientX;
});

cdStage.addEventListener("mouseup", (event) => {
  if (mouseSwipeX === null) return;

  const dx = event.clientX - mouseSwipeX;
  if (Math.abs(dx) > 50) {
    dx < 0 ? nextSong() : prevSong();
  }

  mouseSwipeX = null;
});

// ---------------------------------
// Audio events
// ---------------------------------

let lastSaveTime = 0;

audio.addEventListener("canplay", () => cdStage.classList.remove("loading"));
audio.addEventListener("waiting", () => cdStage.classList.add("loading"));
audio.addEventListener("playing", () => cdStage.classList.remove("loading"));

audio.addEventListener("loadedmetadata", () => {
  totalTimeEl.textContent = formatTime(audio.duration);
  currentSong()._duration = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  const percent = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = `${percent}%`;
  miniProgressFill.style.width = `${percent}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  totalTimeEl.textContent = formatTime(audio.duration);

  if (!state.recentAddedForCurrent && audio.currentTime / audio.duration >= 0.5) {
    addToRecent(currentSong().id);
    state.recentAddedForCurrent = true;
    renderAll();
  }

  const now = Date.now();
  if (now - lastSaveTime > 5000) {
    _savePlayerState();
    lastSaveTime = now;
  }
});

audio.addEventListener("ended", () => {
  if (state.repeatMode === "one") {
    audio.currentTime = 0;
    playSong();
    return;
  }

  nextSong(true);
});

// ---------------------------------
// Keyboard shortcuts
// ---------------------------------

document.addEventListener("keydown", (event) => {
  const tag = document.activeElement.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea") return;

  switch (event.key) {
    case " ":
    case "k":
      event.preventDefault();
      togglePlay();
      break;

    case "ArrowRight":
      event.preventDefault();
      event.shiftKey ? nextSong() : (audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5));
      break;

    case "ArrowLeft":
      event.preventDefault();
      event.shiftKey ? prevSong() : (audio.currentTime = Math.max(0, audio.currentTime - 5));
      break;

    case "ArrowUp":
      event.preventDefault();
      state.volume = Math.min(1, state.volume + 0.05);
      audio.volume = state.volume;
      volSlider.value = state.volume * 100;
      _savePersist();
      showToast(`Volume ${Math.round(state.volume * 100)}%`);
      break;

    case "ArrowDown":
      event.preventDefault();
      state.volume = Math.max(0, state.volume - 0.05);
      audio.volume = state.volume;
      volSlider.value = state.volume * 100;
      _savePersist();
      showToast(`Volume ${Math.round(state.volume * 100)}%`);
      break;

    case "m":
    case "M":
      audio.muted = !audio.muted;
      showToast(audio.muted ? "Muted" : "Unmuted");
      break;

    case "l":
    case "L":
      if (!state.hasLoadedSong) return;
      toggleLike(currentSong().id);
      triggerLikeAnimation();
      _savePersist();
      refreshViews();
      showToast(state.liked.has(currentSong().id) ? "Liked" : "Unliked");
      break;

    case "s":
    case "S":
      state.shuffle = !state.shuffle;
      shuffleBtn.classList.toggle("active", state.shuffle);
      _savePlayerState();
      showToast(state.shuffle ? "Shuffle On" : "Shuffle Off");
      break;

    case "f":
    case "F":
      event.preventDefault();
      searchInput.focus();
      break;

    case "Escape":
      closeAbout();
      closeSleepSheet();
      closeSpeedSheet();
      closePlaylistSheet();
      closeCtxMenu();
      break;
  }
});

// ---------------------------------
// Init
// ---------------------------------

function init() {
  _loadPersist();
  renderTabs();
  renderAll();
  renderPlaylists();
  _loadPlayerState();

  if (state.activeTab !== "player") {
    switchTab(state.activeTab);
  } else {
    updateMiniPlayerVisibility();
  }

  updatePlaybackContextLabel();
  repeatBtn.classList.toggle("active", state.repeatMode !== "off");
  repeatIcon.innerHTML = REPEAT_ICONS[state.repeatMode];
  setTimeout(preloadDurations, 1200);
}

init();
