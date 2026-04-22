const SONGS = [
  { id: 1,  title: "Khat",                    artist: "Navjot Ahuja",                                               duration: "4:56", cover: "images/cover1.jpg",  src: "audio/song1.mp3"  },
  { id: 2,  title: "Sajde",                   artist: "Faheem Abdullah, Hazaif Nazar",                              duration: "7:40", cover: "images/cover2.jpg",  src: "audio/song2.mp3"  },
  { id: 3,  title: "Piya Ghar Aavenge",       artist: "Kailash Kher, Paresh Kamath, Naresh Kamath",                duration: "5:44", cover: "images/cover3.jpg",  src: "audio/song3.mp3"  },
  { id: 4,  title: "Maharani",                artist: "Karun, Lambo Drive, Arpit Bala, GHILDIYAL",                  duration: "6:42", cover: "images/cover4.jpg",  src: "audio/song4.mp3"  },
  { id: 5,  title: "Main Rahoon Ya Na Rahoon", artist: "Amaal Mallik, Armaan Mallik, Rashmi Virag",                duration: "5:09", cover: "images/cover5.jpg",  src: "audio/song5.mp3"  },
  { id: 6,  title: "Ishq Sufiyana",           artist: "Vishal Shekhar, Kamal Khan",                                duration: "5:25", cover: "images/cover6.jpg",  src: "audio/song6.mp3"  },
  { id: 7,  title: "Vaari Jaavan",            artist: "Shashwat Sachdev, Jyoti Nooran, Jasmine Sandlas, Reble",    duration: "4:09", cover: "images/cover7.jpg",  src: "audio/song7.mp3"  },
  { id: 8,  title: "Bairan",                  artist: "Banjaare",                                                  duration: "2:30", cover: "images/cover8.jpg",  src: "audio/song8.mp3"  },
  { id: 9,  title: "Do Pal",                  artist: "Madan Mohan, Lata Mangeshkar, Sonu Nigam, Javed Akhtar",    duration: "4:25", cover: "images/cover9.jpg",  src: "audio/song9.mp3"  },
  { id: 10, title: "Maand",                   artist: "Bayaan, Hasan Raheem, Rovalio",                             duration: "3:05", cover: "images/cover10.jpg", src: "audio/song10.mp3" },
  { id: 11, title: "Babydoll",                artist: "Dominic Fike",                                              duration: "1:35", cover: "images/cover11.jpg", src: "audio/song11.mp3" },
];

const TABS = [
  { id: "player", label: "Now Playing" },
  { id: "songs", label: "Library" },
  { id: "liked", label: "Liked" },
  { id: "recent", label: "Recent" },
  { id: "playlist", label: "Playlist" }
];

const state = {
  currentIndex: 0,
  isPlaying: false,
  shuffle: false,
  recentAddedForCurrent: false,
  hasLoadedSong: false,
  repeat: false,
  repeatMode: "off",
  volume: 0.8,
  liked: new Set(),
  saved: new Set(),
  recentlyPlayed: [],
  activeTab: "player",
  ctxSongId: null,
  searchQuery: "",
  displayedSongs: [...SONGS]
};

const audio          = document.getElementById("audioPlayer");
const disc           = document.getElementById("disc");
const albumImg       = document.getElementById("albumImg");
const songTitle      = document.getElementById("songTitle");
const songArtist     = document.getElementById("songArtist");
const playBtn        = document.getElementById("playBtn");
const playIcon       = document.getElementById("playIcon");
const prevBtn        = document.getElementById("prevBtn");
const nextBtn        = document.getElementById("nextBtn");
const shuffleBtn     = document.getElementById("shuffleBtn");
const repeatBtn      = document.getElementById("repeatBtn");
const progressTrack  = document.getElementById("progressTrack");
const progressFill   = document.getElementById("progressFill");
const currentTimeEl  = document.getElementById("currentTime");
const totalTimeEl    = document.getElementById("totalTime");
const volSlider      = document.getElementById("volSlider");
const songList       = document.getElementById("songList");
const likedList      = document.getElementById("likedList");
const recentList     = document.getElementById("recentList");
const ctxMenu        = document.getElementById("ctxMenu");
const toast          = document.getElementById("toast");
const searchInput    = document.getElementById("searchInput");
const playerLikeBtn  = document.getElementById("playerLikeBtn");
const playerMoreBtn  = document.getElementById("playerMoreBtn");
const miniPlayer     = document.getElementById("miniPlayer");
const mpImg          = document.getElementById("mpImg");
const mpTitle        = document.getElementById("mpTitle");
const mpArtist       = document.getElementById("mpArtist");
const mpPlayBtn      = document.getElementById("mpPlayBtn");
const mpIcon         = document.getElementById("mpIcon");
const themeToggle    = document.getElementById("themeToggle");
const meloLogo       = document.getElementById("meloLogo");
const aboutPanel     = document.getElementById("aboutPanel");
const aboutClose     = document.getElementById("aboutClose");

/* ══════════════════════════════════════════
   ABOUT PANEL
══════════════════════════════════════════ */

document.getElementById("aboutYear").textContent = new Date().getFullYear();

function openAbout() {
  aboutPanel.classList.add("open");
  // prevent background scroll while about is open
  aboutPanel.scrollTop = 0;
}

function closeAbout() {
  aboutPanel.classList.remove("open");
}

meloLogo.addEventListener("click", openAbout);
aboutClose.addEventListener("click", closeAbout);

// Close on backdrop tap (if somehow user taps outside — safety net)
aboutPanel.addEventListener("click", (e) => {
  if (e.target === aboutPanel) closeAbout();
});

/* ══════════════════════════════════════════
   PLAYER CORE
══════════════════════════════════════════ */

function loadSong(index, autoplay = false) {
  const song = SONGS[index];
  state.currentIndex = index;
  state.recentAddedForCurrent = false;
  state.hasLoadedSong = true;
  audio.src = song.src;
  audio.volume = state.volume;

  albumImg.src     = song.cover;
  songTitle.textContent  = song.title;
  songArtist.textContent = song.artist;
  mpImg.src        = song.cover;
  mpTitle.textContent    = song.title;
  mpArtist.textContent   = song.artist;

  progressFill.style.width   = "0%";
  currentTimeEl.textContent  = "0:00";
  totalTimeEl.textContent    = song.duration;

  updateLikeBtn();

  if (autoplay) {
    playSong();
  } else {
    updatePlayBtns(false);
  }

  updateActiveItems();
}

function playSong() {
  audio.play().catch(() => {});
  state.isPlaying = true;
  disc.classList.add("spinning");
  updatePlayBtns(true);
  miniPlayer.classList.add("visible");
  savePlayerState();
}

function pauseSong() {
  audio.pause();
  state.isPlaying = false;
  disc.classList.remove("spinning");
  updatePlayBtns(false);
  savePlayerState();
}

function togglePlay() {
  if (!state.hasLoadedSong) {
    loadSong(0, true); // 👈 load first song and play
    return;
  }

  if (state.isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

function nextSong() {
  const next = state.shuffle
    ? Math.floor(Math.random() * SONGS.length)
    : (state.currentIndex + 1) % SONGS.length;
  loadSong(next, true);
  savePlayerState();
}

function prevSong() {
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  const prev = (state.currentIndex - 1 + SONGS.length) % SONGS.length;
  loadSong(prev, true);
  savePlayerState();
}

function updatePlayBtns(playing) {
  const playPath  = '<path d="M8 5v14l11-7z"/>';
  const pausePath = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
  playIcon.innerHTML = playing ? pausePath : playPath;
  mpIcon.innerHTML   = playing ? pausePath : playPath;
}

/* ══════════════════════════════════════════
   RENDER
══════════════════════════════════════════ */

function renderTabs() {
  const tabNav = document.getElementById("tabNav");
  tabNav.innerHTML = "";

  TABS.forEach(tab => {
    const btn = document.createElement("button");
    btn.className = "tab-btn" + (tab.id === state.activeTab ? " active" : "");
    btn.dataset.tab = tab.id;
    btn.textContent = tab.label;

    btn.addEventListener("click", () => switchTab(tab.id));

    tabNav.appendChild(btn);
  });
}

function renderSongItem(song) {
  const isActive = SONGS.indexOf(song) === state.currentIndex;
  const isLiked  = state.liked.has(song.id);
  const li = document.createElement("div");
  li.className   = "song-item" + (isActive ? " active" : "");
  li.dataset.id  = song.id;
  li.dataset.idx = SONGS.indexOf(song);
  li.dataset.liked = isLiked ? "true" : "false";

  li.innerHTML = `
    <div class="si-thumb">
      <img src="${song.cover}" alt="${song.title}" loading="lazy">
      <div class="si-playing-indicator">
        <div class="eq-bars">
          <div class="eq-bar"></div>
          <div class="eq-bar"></div>
          <div class="eq-bar"></div>
        </div>
      </div>
    </div>
    <div class="si-info">
      <div class="si-title">${song.title}</div>
      <div class="si-artist">${song.artist}</div>
    </div>
    <div class="si-right">
      <div class="si-liked-dot"></div>
      <div class="si-duration">${song.duration}</div>
      <button class="si-menu-btn" data-id="${song.id}" title="More">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="5" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="12" cy="19" r="1.2"/></svg>
      </button>
    </div>`;

  li.addEventListener("click", (e) => {
    if (e.target.closest(".si-menu-btn")) return;
    loadSong(parseInt(li.dataset.idx, 10), true);
    switchTab("player");
  });

  li.querySelector(".si-menu-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    openCtxMenu(e, song.id);
  });

  return li;
}

function renderList(songs, container, emptyMsg = "Nothing here yet") {
  container.innerHTML = "";
  if (!songs.length) {
    container.innerHTML = `<div class="empty-state"><span class="em-icon">♪</span>${emptyMsg}<p>Songs you ${emptyMsg.includes("like") ? "like" : "play"} will show up here.</p></div>`;
    return;
  }
  songs.forEach((song) => container.appendChild(renderSongItem(song)));
}

function renderAll() {
  const query    = state.searchQuery.toLowerCase();
  const filtered = query
    ? SONGS.filter((s) => s.title.toLowerCase().includes(query) || s.artist.toLowerCase().includes(query))
    : [...SONGS];

  renderList(filtered, songList);
  document.getElementById("songsCount").textContent = `${filtered.length} songs`;

  const likedSongs  = SONGS.filter((s) => state.liked.has(s.id));
  renderList(likedSongs, likedList, "No liked songs");
  document.getElementById("likedCount").textContent = `${likedSongs.length} songs`;

  const recentSongs = state.recentlyPlayed.map((id) => SONGS.find((s) => s.id === id)).filter(Boolean);
  renderList(recentSongs, recentList, "No recently played");
  document.getElementById("recentCount").textContent = `${recentSongs.length} songs`;
}

function updateActiveItems() {
  document.querySelectorAll(".song-item").forEach((el) => {
    el.classList.toggle("active", parseInt(el.dataset.idx, 10) === state.currentIndex);
  });
}

function updateLikeBtn() {
  const song  = SONGS[state.currentIndex];
  const liked = state.liked.has(song.id);
  playerLikeBtn.classList.toggle("liked", liked);
  playerLikeBtn.innerHTML = liked
    ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
    : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
}

function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/* ══════════════════════════════════════════
   AUDIO EVENTS
══════════════════════════════════════════ */

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width      = `${pct}%`;
  currentTimeEl.textContent     = formatTime(audio.currentTime);
  totalTimeEl.textContent       = formatTime(audio.duration);
  savePlayerState();
  
  if (
  !state.recentAddedForCurrent &&
  audio.duration &&
  audio.currentTime / audio.duration >= 0.5
) {
  addToRecent(SONGS[state.currentIndex].id);
  state.recentAddedForCurrent = true;
}
});

audio.addEventListener("ended", () => {
  if (state.repeatMode === "one") {
    audio.currentTime = 0; playSong();
  } else if (state.repeatMode === "all" || state.shuffle) {
    nextSong();
  } else if (state.currentIndex < SONGS.length - 1) {
    nextSong();
  } else {
    pauseSong(); audio.currentTime = 0; progressFill.style.width = "0%";
  }
});

audio.addEventListener("loadedmetadata", () => {
  const data = JSON.parse(localStorage.getItem("melo_player") || "{}");
  if (data.time) {
    audio.currentTime = data.time;
  }
  totalTimeEl.textContent = formatTime(audio.duration);
});

/* ══════════════════════════════════════════
   PROGRESS SCRUB
══════════════════════════════════════════ */

let isDragging = false;

function scrubTo(e) {
  const rect    = progressTrack.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const ratio   = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  if (audio.duration) audio.currentTime = ratio * audio.duration;
  progressFill.style.width = `${ratio * 100}%`;
}

progressTrack.addEventListener("mousedown",  (e) => { isDragging = true; scrubTo(e); });
progressTrack.addEventListener("touchstart", (e) => { isDragging = true; scrubTo(e); }, { passive: true });
document.addEventListener("mousemove",  (e) => { if (isDragging) scrubTo(e); });
document.addEventListener("touchmove",  (e) => { if (isDragging) scrubTo(e); }, { passive: true });
document.addEventListener("mouseup",  () => { isDragging = false; });
document.addEventListener("touchend", () => { isDragging = false; });

/* ══════════════════════════════════════════
   CONTROLS
══════════════════════════════════════════ */

playBtn.addEventListener("click", togglePlay);
mpPlayBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

shuffleBtn.addEventListener("click", () => {
  state.shuffle = !state.shuffle;
  shuffleBtn.classList.toggle("active", state.shuffle);
  showToast(state.shuffle ? "Shuffle On" : "Shuffle Off");
  savePlayerState();
});

repeatBtn.addEventListener("click", () => {
  const modes = ["off", "all", "one"];
  const i = modes.indexOf(state.repeatMode);
  state.repeatMode = modes[(i + 1) % 3];
  repeatBtn.classList.toggle("active", state.repeatMode !== "off");
  const labels = { off: "Repeat Off", all: "Repeat All", one: "Repeat One" };
  showToast(labels[state.repeatMode]);
  savePlayerState();
});

volSlider.addEventListener("input", () => {
  state.volume = volSlider.value / 100;
  audio.volume = state.volume;
  savePersist();
});

playerLikeBtn.addEventListener("click", () => {
  const song = SONGS[state.currentIndex];
  toggleLike(song.id);
  updateLikeBtn();
  renderAll();
  showToast(state.liked.has(song.id) ? "Liked!" : "Unliked");
  savePersist();
});

playerMoreBtn.addEventListener("click", (e) => {
  openCtxMenu(e, SONGS[state.currentIndex].id);
});

miniPlayer.addEventListener("click", (e) => {
  if (e.target.closest("#mpPlayBtn")) return;
  switchTab("player");
});

/* ══════════════════════════════════════════
   TABS
══════════════════════════════════════════ */

function switchTab(tab) {
  state.activeTab = tab;

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });

  document.querySelectorAll(".view").forEach((view) => {
    view.classList.remove("active");
  });

  const view = document.getElementById(`view-${tab}`);
  if (view) view.classList.add("active");

  if (tab !== "player" && (state.isPlaying || SONGS[state.currentIndex])) {
    miniPlayer.classList.add("visible");
  } else {
    miniPlayer.classList.remove("visible");
  }

  if (tab !== "player") renderAll();
}

searchInput.addEventListener("input", () => {
  state.searchQuery = searchInput.value;
  if (state.activeTab !== "songs") switchTab("songs");
  renderAll();
});

/* ══════════════════════════════════════════
   CONTEXT MENU
══════════════════════════════════════════ */

function openCtxMenu(e, songId) {
  state.ctxSongId = songId;
  ctxMenu.classList.add("show");

  const isLiked = state.liked.has(songId);
  document.getElementById("ctxLike").innerHTML = isLiked
    ? "<span>💔</span> Unlike"
    : "<span>❤️</span> Like";

  const frame = document.querySelector(".phone-frame").getBoundingClientRect();
  let x = e.clientX || (e.touches && e.touches[0].clientX) || frame.right - 10;
  let y = e.clientY || (e.touches && e.touches[0].clientY) || frame.top + 100;
  const mw = 180, mh = 130;
  x = Math.min(x, window.innerWidth  - mw - 8);
  y = Math.min(y, window.innerHeight - mh - 8);
  ctxMenu.style.left = `${x}px`;
  ctxMenu.style.top  = `${y}px`;
}

document.addEventListener("click", (e) => {
  if (!ctxMenu.contains(e.target) && !e.target.closest(".si-menu-btn") && !e.target.closest("#playerMoreBtn")) {
    ctxMenu.classList.remove("show");
  }
});

document.getElementById("ctxLike").addEventListener("click", () => {
  toggleLike(state.ctxSongId);
  if (state.ctxSongId === SONGS[state.currentIndex].id) updateLikeBtn();
  renderAll();
  showToast(state.liked.has(state.ctxSongId) ? "Liked!" : "Unliked");
  savePersist();
  ctxMenu.classList.remove("show");
});

document.getElementById("ctxSave").addEventListener("click", () => {
  state.saved.add(state.ctxSongId);
  showToast("Song saved!");
  savePersist();
  ctxMenu.classList.remove("show");
});

document.getElementById("ctxDownload").addEventListener("click", async () => {
  const song = SONGS.find((s) => s.id === state.ctxSongId);
  if (!song) return;
  try {
    const response = await fetch(song.src);
    const blob     = await response.blob();
    const blobUrl  = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl; a.download = song.title + ".mp3";
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(blobUrl);
    showToast("⬇️ Downloaded");
  } catch (err) {
    console.error(err);
    showToast("❌ Download failed");
  }
  ctxMenu.classList.remove("show");
});

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */

function savePlayerState() {
  const data = {
    index: state.currentIndex,
    time: audio.currentTime,
    isPlaying: state.isPlaying,
    shuffle: state.shuffle,
    repeatMode: state.repeatMode
  };

  localStorage.setItem("melo_player", JSON.stringify(data));
}

function loadPlayerState() {
  try {
    const data = JSON.parse(localStorage.getItem("melo_player"));
    if (!data) return;

    state.currentIndex = data.index ?? 0;
    state.shuffle = data.shuffle ?? false;
    state.repeatMode = data.repeatMode ?? "off";

    loadSong(state.currentIndex, false);

    if (data.time) {
      audio.currentTime = data.time;
    }

    if (data.isPlaying) {
      playSong();
    } else {
      pauseSong();
    }

  } catch (err) {
    console.error("Failed to load player state", err);
  }
}

function toggleLike(id) {
  state.liked.has(id) ? state.liked.delete(id) : state.liked.add(id);
}

let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

function addToRecent(id) {
  state.recentlyPlayed = state.recentlyPlayed.filter((item) => item !== id);
  state.recentlyPlayed.unshift(id);
  if (state.recentlyPlayed.length > 20) state.recentlyPlayed.pop();
  savePersist();
}

/* ══════════════════════════════════════════
   THEME
══════════════════════════════════════════ */

themeToggle.addEventListener("click", () => {
  const html  = document.documentElement;
  const isDark = html.dataset.theme === "dark";
  html.dataset.theme = isDark ? "light" : "dark";
  updateThemeIcon();
  localStorage.setItem("melo_theme", html.dataset.theme);
});

function updateThemeIcon() {
  const isDark = document.documentElement.dataset.theme === "dark";
  document.getElementById("themeIcon").innerHTML = isDark
    ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
    : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
}

/* ══════════════════════════════════════════
   PERSIST
══════════════════════════════════════════ */

function savePersist() {
  localStorage.setItem("melo_liked",  JSON.stringify([...state.liked]));
  localStorage.setItem("melo_saved",  JSON.stringify([...state.saved]));
  localStorage.setItem("melo_recent", JSON.stringify(state.recentlyPlayed));
  localStorage.setItem("melo_volume", state.volume);
}

function loadPersist() {
  try {
    const liked  = JSON.parse(localStorage.getItem("melo_liked")  || "[]");
    const saved  = JSON.parse(localStorage.getItem("melo_saved")  || "[]");
    const recent = JSON.parse(localStorage.getItem("melo_recent") || "[]");
    const vol    = parseFloat(localStorage.getItem("melo_volume") || "0.8");
    const theme  = localStorage.getItem("melo_theme") || "dark";

    state.liked          = new Set(liked);
    state.saved          = new Set(saved);
    state.recentlyPlayed = recent;
    state.volume         = vol;
    volSlider.value      = vol * 100;
    audio.volume         = vol;

    document.documentElement.dataset.theme = theme;
    updateThemeIcon();
  } catch (err) {
    console.error("Failed to load persisted state", err);
  }
}

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */

function init() {
  loadPersist();
  loadPlayerState();
  renderTabs();
  renderAll();
  updateLikeBtn();
}

init();
