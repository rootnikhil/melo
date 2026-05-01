/* ═══════════════════════════════════════════════════════
   MELO — RETRO PLAYER  |  script.js
   ─────────────────────────────────────────────────────
   Section map:
   1.  Song data & constants
   2.  App state
   3.  DOM references
   4.  Helper functions
   5.  Tonearm (drag system + groove sweep)
   6.  Playback core
   7.  Queue logic
   8.  UI update functions
   9.  Persistence (localStorage)
   10. Rendering functions
   11. Playlist actions
   12. Tabs & views
   13. Context menu
   14. Sleep timer
   15. Playback speed
   16. Likes & recently played
   17. Audio events
   18. Progress bar scrubbing
   19. Controls & button events
   20. Search
   21. Keyboard shortcuts
   22. Initialisation
═══════════════════════════════════════════════════════ */


/* ─────────────────────────────────────────────────────
   1. SONG DATA & CONSTANTS
───────────────────────────────────────────────────── */
const SONGS = [
  { id:1,  title:"Khat",                    artist:"Navjot Ahuja",                                              cover:"images/cover1.jpg",  src:"audio/song1.mp3"  },
  { id:2,  title:"Sajde",                   artist:"Faheem Abdullah, Hazaif Nazar",                             cover:"images/cover2.jpg",  src:"audio/song2.mp3"  },
  { id:3,  title:"Piya Ghar Aavenge",       artist:"Kailash Kher, Paresh Kamath, Naresh Kamath",               cover:"images/cover3.jpg",  src:"audio/song3.mp3"  },
  { id:4,  title:"Maharani",                artist:"Karun, Lambo Drive, Arpit Bala, GHILDIYAL",                cover:"images/cover4.jpg",  src:"audio/song4.mp3"  },
  { id:5,  title:"Main Rahoon Ya Na Rahoon",artist:"Amaal Mallik, Armaan Mallik, Rashmi Virag",                cover:"images/cover5.jpg",  src:"audio/song5.mp3"  },
  { id:6,  title:"Ishq Sufiyana",           artist:"Vishal Shekhar, Kamal Khan",                               cover:"images/cover6.jpg",  src:"audio/song6.mp3"  },
  { id:7,  title:"Vaari Jaavan",            artist:"Shashwat Sachdev, Jyoti Nooran, Jasmine Sandlas, Reble",  cover:"images/cover7.jpg",  src:"audio/song7.mp3"  },
  { id:8,  title:"Bairan",                  artist:"Banjaare",                                                 cover:"images/cover8.jpg",  src:"audio/song8.mp3"  },
  { id:9,  title:"Do Pal",                  artist:"Madan Mohan, Lata Mangeshkar, Sonu Nigam, Javed Akhtar",  cover:"images/cover9.jpg",  src:"audio/song9.mp3"  },
  { id:10, title:"Maand",                   artist:"Bayaan, Hasan Raheem, Rovalio",                            cover:"images/cover10.jpg", src:"audio/song10.mp3" },
  { id:11, title:"Babydoll",                artist:"Dominic Fike",                                             cover:"images/cover11.jpg", src:"audio/song11.mp3" },
  { id:12, title:"Dhurandhar the Revenge - Aari Aari",                artist:"Bombay Rockers,Shashwat Sachdev,Khan Saab,Jasmine Sandlas,Sudhir Yaduvanshi",                                             cover:"images/cover7.jpg", src:"audio/song12.mp3" },
  { id:13, title:"Main Aur Tu",                artist:"Jasmine Sandlas, Reble, Shashwat Sachdev",                                             cover:"images/cover7.jpg", src:"audio/song13.mp3" },
  { id:14, title:"Jaan Se Guzarte Hain",                artist:"Khan Saab, Shashwat Sachdev",                                             cover:"images/cover7.jpg", src:"audio/song14.mp3" },
  { id:15, title:"Aakhri Ishq ",                artist:"Jubin Nautiyal",                                             cover:"images/cover7.jpg", src:"audio/song15.mp3" },
  { id:16, title:"Wild Ride",                artist:"Ellisar, Shashwat Sachdev",                                             cover:"images/cover7.jpg", src:"audio/song16.mp3" },
  { id:17, title:"Phir Se",                artist:"Arijit Singh",                                             cover:"images/cover7.jpg", src:"audio/song17.mp3" },
  { id:18, title:"Didi (Sher-E-Baloch)",                artist:"Nabil El Houri, Shashwat Sachdev, Sons of Yusuf",                                             cover:"images/cover7.jpg", src:"audio/song18.mp3" },
  { id:19, title:"Destiny - Mann Atkeya",                artist:"Vaibhav Gupta, Shahzad Ali, Token, Shashwat Sachdev",                                             cover:"images/cover7.jpg", src:"audio/song19.mp3" },
  { id:20, title:"Rang De Lal (Oye Oye)",                artist:"Jasmine Sandlas, Afsana Khan, Amit Kumar, Reble, Sapna Mukherjee",                                             cover:"images/cover7.jpg", src:"audio/song20.mp3" },
  { id:21, title:"Jaiye Sajana",                artist:"Jasmine Sandlas, Satinder Sartaaj",                                             cover:"images/cover7.jpg", src:"audio/song21.mp3" },
  { id:22, title:"Tere Ishq Ne",                artist:"Jyoti Nooran",                                             cover:"images/cover7.jpg", src:"audio/song22.mp3" },
  { id:23, title:"Hum Pyaar Karne Wale",                artist:"Anuradha Paudwal, Udit Narayan, Qveen Herby",                                             cover:"images/cover7.jpg", src:"audio/song23.mp3" },
  { id:24, title:"Kanhaiyya",                artist:"Jubin Nautiyal",                                             cover:"images/cover7.jpg", src:"audio/song24.mp3" },
  
];

const TABS = [
  { id:"player",   label:"Now Playing" },
  { id:"songs",    label:"Library"     },
  { id:"liked",    label:"Liked"       },
  { id:"recent",   label:"Recent"      },
  { id:"playlist", label:"Playlist"    },
];

const ALL_SONG_IDS = SONGS.map(s => s.id);

const REPEAT_MODES  = ["off", "all", "one"];
const REPEAT_LABELS = { off: "Repeat Off", all: "Repeat All", one: "Repeat One" };

/* ─────────────────────────────────────────────────────
   GLOBAL PLAYLISTS — read-only, not stored in localStorage
───────────────────────────────────────────────────── */
const GLOBAL_PLAYLISTS = [
  { id: "g-dhurandhar-1",   name: "Dhurandhar the Revenge",   songIds: [12 ,13 ,14 ,15 ,16 ,7 ,17 ,18 ,19 ,20 ,21 ,22 ,23 ,24 ]  },
  
];

function isGlobalPlaylist(id) {
  return typeof id === "string" && id.startsWith("g-");
}

function getAllPlaylists() {
  return [...GLOBAL_PLAYLISTS, ...state.playlists];
}

/* ─────────────────────────────────────────────────────
   TONEARM ANGLE CONSTANTS
───────────────────────────────────────────────────── */
const ARM_REST   =  60;
const ARM_PLAY   =  95;
const ARM_MAX    = 128;
const ARM_THRESH =  80;
const ARM_DELAY  = 150;


/* ─────────────────────────────────────────────────────
   2. APP STATE
───────────────────────────────────────────────────── */
const state = {
  currentIndex:           0,
  isPlaying:              false,
  hasLoadedSong:          false,
  recentAddedForCurrent:  false,
  shuffle:                false,
  repeatMode:             "off",
  volume:                 0.8,
  playbackSpeed:          1,

  currentQueueSongIds:    [...ALL_SONG_IDS],
  currentQueueType:       "all",
  currentQueueLabel:      "All Songs",
  currentQueuePlaylistId: null,
  playNextQueue:          [],

  liked:                  new Set(),
  recentlyPlayed:         [],
  playlists:              [],          // user playlists only — globals never go here
  selectedPlaylistId:     null,

  activeTab:              "player",
  ctxSongId:              null,
  searchQuery:            "",
  queueOpen:              false,

  sleepTimer:             null,
  sleepEndTime:           null,
  sleepCountdownInterval: null,

  // Tonearm
  armAngle:               ARM_REST,
  armDragging:            false,
  armOnRecord:            false,
  armDropTimeout:         null,
  grooveSweepRaf:         null,
};


/* ─────────────────────────────────────────────────────
   3. DOM REFERENCES
───────────────────────────────────────────────────── */
const audio = document.getElementById("audioPlayer");

const vinylDisk  = document.getElementById("vinylDisk");
const vinylGlow  = document.getElementById("vinylGlow");
const vinylArt   = document.getElementById("vinylArt");
const tonearm    = document.getElementById("tonearm");
const armPivot   = document.getElementById("armPivot");
const needleLine = document.getElementById("needleLine");
const bufRing    = document.getElementById("bufRing");
const armHint    = document.getElementById("armHint");

const songTitle        = document.getElementById("songTitle");
const songArtist       = document.getElementById("songArtist");
const songContextLabel = document.getElementById("songContextLabel");
const progressTrack    = document.getElementById("progressTrack");
const progressFill     = document.getElementById("progressFill");
const currentTimeEl    = document.getElementById("currentTime");
const totalTimeEl      = document.getElementById("totalTime");
const playBtn          = document.getElementById("playBtn");
const playIcon         = document.getElementById("playIcon");
const prevBtn          = document.getElementById("prevBtn");
const nextBtn          = document.getElementById("nextBtn");
const shuffleBtn       = document.getElementById("shuffleBtn");
const repeatBtn        = document.getElementById("repeatBtn");
const repeatIcon       = document.getElementById("repeatIcon");
const volSlider        = document.getElementById("volSlider");
const playerLikeBtn    = document.getElementById("playerLikeBtn");
const playerMoreBtn    = document.getElementById("playerMoreBtn");
const speedBtn         = document.getElementById("speedBtn");

const songList          = document.getElementById("songList");
const likedList         = document.getElementById("likedList");
const recentList        = document.getElementById("recentList");
const searchResultsList = document.getElementById("searchResultsList");
const playlistList      = document.getElementById("playlistList");
const playlistDetail    = document.getElementById("playlistDetail");

const miniPlayer       = document.getElementById("miniPlayer");
const mpImg            = document.getElementById("mpImg");
const mpTitle          = document.getElementById("mpTitle");
const mpArtist         = document.getElementById("mpArtist");
const mpPlayBtn        = document.getElementById("mpPlayBtn");
const mpPrevBtn        = document.getElementById("mpPrevBtn");
const mpNextBtn        = document.getElementById("mpNextBtn");
const mpIcon           = document.getElementById("mpIcon");
const miniProgressFill = document.getElementById("miniProgressFill");

const ctxMenu          = document.getElementById("ctxMenu");
const ctxPlayNext      = document.getElementById("ctxPlayNext");
const ctxAddToPlaylist = document.getElementById("ctxAddToPlaylist");
const ctxDownload      = document.getElementById("ctxDownload");

const toast            = document.getElementById("toast");
const searchInput      = document.getElementById("searchInput");
const searchClearBtn   = document.getElementById("searchClearBtn");
const themeToggle      = document.getElementById("themeToggle");
const meloLogo         = document.getElementById("meloLogo");
const aboutPanel       = document.getElementById("aboutPanel");
const aboutClose       = document.getElementById("aboutClose");

const queueToggleBtn   = document.getElementById("queueToggleBtn");
const queueDrawer      = document.getElementById("queueDrawer");
const queueInner       = document.getElementById("queueInner");

const sleepTimerBtn    = document.getElementById("sleepTimerBtn");
const sleepPanel       = document.getElementById("sleepPanel");
const sleepOverlay     = document.getElementById("sleepOverlay");
const sleepCountdown   = document.getElementById("sleepCountdown");
const sleepCancelBtn   = document.getElementById("sleepCancelBtn");
const sleepNotice      = document.getElementById("sleepNotice");
const sleepNoticeText  = document.getElementById("sleepNoticeText");

const speedPanel       = document.getElementById("speedPanel");
const speedOverlay     = document.getElementById("speedOverlay");

const playlistOverlay     = document.getElementById("playlistOverlay");
const playlistPanel       = document.getElementById("playlistPanel");
const playlistSheetHelper = document.getElementById("playlistSheetHelper");
const playlistSheetList   = document.getElementById("playlistSheetList");
const playlistNameInput   = document.getElementById("playlistNameInput");
const createPlaylistBtn   = document.getElementById("createPlaylistBtn");

document.getElementById("aboutYear").textContent = new Date().getFullYear();


/* ─────────────────────────────────────────────────────
   4. HELPER FUNCTIONS
───────────────────────────────────────────────────── */
const getSongById     = id  => SONGS.find(s => s.id === id) || null;
const getPlaylistById = id  => getAllPlaylists().find(p => p.id === id) || null;
const currentSong     = ()  => SONGS[state.currentIndex] || SONGS[0];

function formatTime(sec) {
  if (isNaN(sec) || sec < 0) return "0:00";
  return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;
}

let _toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function showCenterNotice(msg) {
  sleepNoticeText.textContent = msg;
  sleepNotice.classList.add("show");
  clearTimeout(showCenterNotice._t);
  showCenterNotice._t = setTimeout(() => sleepNotice.classList.remove("show"), 2800);
}

function showArmHint(show) {
  armHint.classList.toggle("show", show);
}


/* ─────────────────────────────────────────────────────
   5. TONEARM — DRAG SYSTEM + GROOVE SWEEP
───────────────────────────────────────────────────── */
function getPivotCenter() {
  const r = armPivot.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

function angleFromPointer(cx, cy) {
  const p = getPivotCenter();
  return Math.atan2(cy - p.y, cx - p.x) * (180 / Math.PI);
}

function clampArm(a) {
  return Math.max(Math.min(ARM_REST, ARM_MAX), Math.min(Math.max(ARM_REST, ARM_MAX), a));
}

function isArmOnRecord(angle) {
  return angle >= ARM_THRESH;
}

function renderArm(angle, animated) {
  tonearm.style.transition = animated
    ? "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)"
    : "none";
  tonearm.style.transform = `rotate(${angle - 90}deg)`;
  state.armAngle = angle;
}

function snapArm(angle) {
  renderArm(angle, true);
}

function tickGrooveSweep() {
  if (!state.isPlaying || state.armDragging) {
    state.grooveSweepRaf = null;
    return;
  }
  if (audio.duration && audio.duration > 0) {
    const progress = Math.max(0, Math.min(1, audio.currentTime / audio.duration));
    const targetAngle = ARM_PLAY + (ARM_MAX - ARM_PLAY) * progress;
    tonearm.style.transition = "none";
    tonearm.style.transform = `rotate(${targetAngle - 90}deg)`;
    state.armAngle = targetAngle;
  }
  state.grooveSweepRaf = requestAnimationFrame(tickGrooveSweep);
}

function startGrooveSweep() {
  if (state.grooveSweepRaf) cancelAnimationFrame(state.grooveSweepRaf);
  state.grooveSweepRaf = requestAnimationFrame(tickGrooveSweep);
}

function stopGrooveSweep() {
  if (state.grooveSweepRaf) {
    cancelAnimationFrame(state.grooveSweepRaf);
    state.grooveSweepRaf = null;
  }
}

function setArmOnRecord(isOn) {
  if (isOn === state.armOnRecord) return;
  state.armOnRecord = isOn;

  clearTimeout(state.armDropTimeout);
  state.armDropTimeout = null;

  if (isOn) {
    state.armDropTimeout = setTimeout(() => {
      state.armDropTimeout = null;
      if (state.armOnRecord && !state.isPlaying) startPlayback();
    }, ARM_DELAY);
  } else {
    stopPlayback();
  }
}

function startArmDrag(e) {
  stopGrooveSweep();
  state.armDragging = true;
  tonearm.style.transition = "none";
  window.addEventListener("mousemove", onArmMove);
  window.addEventListener("mouseup",   endArmDrag);
  window.addEventListener("touchmove", onArmTouch, { passive: false });
  window.addEventListener("touchend",  endArmDrag);
  e.preventDefault && e.preventDefault();
}

function onArmMove(e) {
  if (!state.armDragging) return;
  const a = clampArm(angleFromPointer(e.clientX, e.clientY));
  renderArm(a, false);
  setArmOnRecord(isArmOnRecord(a));
}

function onArmTouch(e) {
  if (!state.armDragging) return;
  e.preventDefault();
  const t = e.touches[0];
  const a = clampArm(angleFromPointer(t.clientX, t.clientY));
  renderArm(a, false);
  setArmOnRecord(isArmOnRecord(a));
}

function endArmDrag() {
  state.armDragging = false;
  window.removeEventListener("mousemove", onArmMove);
  window.removeEventListener("mouseup",   endArmDrag);
  window.removeEventListener("touchmove", onArmTouch);
  window.removeEventListener("touchend",  endArmDrag);

  if (state.armOnRecord) {
    if (audio.duration > 0) {
      const progress = Math.max(0, Math.min(1, audio.currentTime / audio.duration));
      snapArm(ARM_PLAY + (ARM_MAX - ARM_PLAY) * progress);
    } else {
      snapArm(ARM_PLAY);
    }
    if (state.isPlaying) startGrooveSweep();
  } else {
    snapArm(ARM_REST);
  }
}

tonearm.addEventListener("mousedown",  startArmDrag);
tonearm.addEventListener("touchstart", e => startArmDrag(e.touches[0]), { passive: false });

function armGoPlay() {
  state.armOnRecord = true;
  if (audio.duration > 0) {
    const progress = Math.max(0, Math.min(1, audio.currentTime / audio.duration));
    snapArm(ARM_PLAY + (ARM_MAX - ARM_PLAY) * progress);
  } else {
    snapArm(ARM_PLAY);
  }
  tonearm.classList.add("needle-on");
}

function armGoRest() {
  state.armOnRecord = false;
  stopGrooveSweep();
  snapArm(ARM_REST);
  tonearm.classList.remove("needle-on");
}


/* ─────────────────────────────────────────────────────
   6. PLAYBACK CORE
───────────────────────────────────────────────────── */
function startPlayback() {
  if (state.isPlaying || !state.hasLoadedSong) return;

  audio.play().then(() => {
    state.isPlaying = true;
    vinylDisk.classList.add("spinning");
    vinylGlow.classList.add("active");
    tonearm.classList.add("needle-on");
    updatePlayBtns(true);
    updateEqState(true);
    startGrooveSweep();
    _savePlayerState();
  }).catch(() => {});
}

function stopPlayback() {
  clearTimeout(state.armDropTimeout);
  if (!state.isPlaying) return;

  audio.pause();
  state.isPlaying = false;
  vinylDisk.classList.remove("spinning");
  vinylGlow.classList.remove("active");
  tonearm.classList.remove("needle-on");
  stopGrooveSweep();
  updatePlayBtns(false);
  updateEqState(false);
  _savePlayerState();
}

function stopPlaybackAtStart() {
  stopPlayback();
  audio.currentTime = 0;
  progressFill.style.width = "0%";
  miniProgressFill.style.width = "0%";
  currentTimeEl.textContent = "0:00";
  armGoRest();
  _savePlayerState();
}

function togglePlay() {
  if (!state.hasLoadedSong) {
    loadSong(state.currentIndex || 0, true);
    return;
  }
  if (state.isPlaying) {
    armGoRest();
    stopPlayback();
  } else {
    armGoPlay();
    startPlayback();
  }
}

function loadSong(index, autoplay = false) {
  const song = SONGS[index];
  if (!song) return;

  state.currentIndex = index;
  state.recentAddedForCurrent = false;
  state.hasLoadedSong = true;

  ensureSongInCurrentQueue(song.id);

  audio.pause();
  state.isPlaying = false;
  vinylDisk.classList.remove("spinning");
  vinylGlow.classList.remove("active");
  stopGrooveSweep();

  audio.src = song.src;
  audio.volume = state.volume;
  audio.playbackRate = state.playbackSpeed;
  audio.load();

  vinylArt.src = song.cover;
  mpImg.src    = song.cover;
  songTitle.textContent  = song.title;
  songArtist.textContent = song.artist;
  mpTitle.textContent    = song.title;
  mpArtist.textContent   = song.artist;

  progressFill.style.width = "0%";
  miniProgressFill.style.width = "0%";
  currentTimeEl.textContent = "0:00";
  totalTimeEl.textContent   = song._duration || "0:00";

  updateMarquee();
  updateLikeBtn();
  updatePlaybackContextLabel();
  updateActiveItems();
  updateMiniPlayer();

  if (state.queueOpen) renderQueue();

  if (autoplay) {
    audio.addEventListener("canplay", function cb() {
      audio.removeEventListener("canplay", cb);
      armGoPlay();
      startPlayback();
    });
  } else {
    updatePlayBtns(false);
    armGoRest();
  }

  _savePlayerState();
}

function nextSong(fromEnded = false) {
  if (state.playNextQueue.length) {
    const id  = state.playNextQueue.shift();
    const idx = SONGS.findIndex(s => s.id === id);
    if (idx !== -1) { loadSong(idx, true); return; }
  }

  const qIds = getNormQueueIds();
  const qi   = getCurrentQueueIndex();

  if (!qIds.length) {
    if (fromEnded) stopPlaybackAtStart();
    return;
  }

  if (qi === -1) {
    const fi = SONGS.findIndex(s => s.id === qIds[0]);
    fi !== -1 ? loadSong(fi, true) : stopPlaybackAtStart();
    return;
  }

  if (state.shuffle) {
    const randId  = getRandQueueId();
    const randIdx = SONGS.findIndex(s => s.id === randId);
    loadSong(randIdx, true);
    return;
  }

  const isLast = qi >= qIds.length - 1;
  if (isLast) {
    if (fromEnded && state.repeatMode !== "all") {
      stopPlaybackAtStart();
      return;
    }
    loadSong(SONGS.findIndex(s => s.id === qIds[0]), true);
    return;
  }
  loadSong(SONGS.findIndex(s => s.id === qIds[qi + 1]), true);
}

function prevSong() {
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }

  const qIds = getNormQueueIds();
  const qi   = getCurrentQueueIndex();
  if (!qIds.length) return;

  if (qi === -1) {
    loadSong(SONGS.findIndex(s => s.id === qIds[qIds.length - 1]), true);
    return;
  }
  const prevId = qi > 0 ? qIds[qi - 1] : qIds[qIds.length - 1];
  loadSong(SONGS.findIndex(s => s.id === prevId), true);
}

function playSongFromLibrary(song) {
  useLibraryQueue();
  loadSong(SONGS.findIndex(s => s.id === song.id), true);
  switchTab("player");
}

function playSongFromPlaylist(song, playlistId) {
  const pl = getPlaylistById(playlistId);
  if (!pl || !pl.songIds.length) { showToast("Playlist is empty"); return; }
  usePlaylistQueue(pl);
  loadSong(SONGS.findIndex(s => s.id === song.id), true);
  switchTab("player");
}


/* ─────────────────────────────────────────────────────
   7. QUEUE LOGIC
───────────────────────────────────────────────────── */
function getNormQueueIds() {
  const src = state.currentQueueSongIds.length
    ? state.currentQueueSongIds
    : ALL_SONG_IDS;
  const filtered = src.filter(id => getSongById(id));
  if (filtered.length) return filtered;
  return state.currentQueueType === "playlist" ? [] : [...ALL_SONG_IDS];
}

function getCurrentQueueIndex() {
  return getNormQueueIds().indexOf(currentSong().id);
}

function setPlaybackQueue(ids, type = "all", plId = null, label = "All Songs") {
  state.currentQueueSongIds    = [...new Set(ids.filter(id => getSongById(id)))];
  state.currentQueueType       = type;
  state.currentQueuePlaylistId = plId;
  state.currentQueueLabel      = label;
  updatePlaybackContextLabel();
  if (state.queueOpen) renderQueue();
}

function useLibraryQueue() {
  setPlaybackQueue(ALL_SONG_IDS, "all", null, "Playing from library");
}

function usePlaylistQueue(pl) {
  setPlaybackQueue(pl.songIds, "playlist", pl.id, `Playing from: ${pl.name}`);
}

function updatePlaybackContextLabel() {
  songContextLabel.innerHTML = `<span class="ctx-dot"></span>${state.currentQueueLabel || "Playing from library"}`;
}

function ensureSongInCurrentQueue(id) {
  if (state.currentQueueType === "playlist") return;
  if (!getNormQueueIds().includes(id)) {
    state.currentQueueSongIds = [id, ...getNormQueueIds()];
  }
}

function getRandQueueId() {
  const ids = getNormQueueIds();
  if (ids.length === 1) return ids[0];
  let id;
  do { id = ids[Math.floor(Math.random() * ids.length)]; }
  while (id === currentSong().id);
  return id;
}


/* ─────────────────────────────────────────────────────
   8. UI UPDATE FUNCTIONS
───────────────────────────────────────────────────── */
function updatePlayBtns(playing) {
  const PLAY_PATH  = '<path d="M8 5v14l11-7z"/>';
  const PAUSE_PATH = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
  playIcon.innerHTML = playing ? PAUSE_PATH : PLAY_PATH;
  mpIcon.innerHTML   = playing ? PAUSE_PATH : PLAY_PATH;
}

function updateEqState(playing) {
  document.querySelectorAll(".song-item.active").forEach(el => {
    el.classList.toggle("paused", !playing);
  });
}

function updateLikeBtn() {
  if (!state.hasLoadedSong) return;
  const isLiked = state.liked.has(currentSong().id);

  const burst = playerLikeBtn.querySelector(".burst") || (() => {
    const d = document.createElement("div");
    d.className = "burst";
    return d;
  })();

  const FILLED_HEART = `<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
  const EMPTY_HEART  = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

  playerLikeBtn.classList.toggle("liked", isLiked);
  playerLikeBtn.innerHTML = "";
  playerLikeBtn.appendChild(burst);
  playerLikeBtn.insertAdjacentHTML("beforeend", isLiked ? FILLED_HEART : EMPTY_HEART);
}

function updateActiveItems() {
  document.querySelectorAll(".song-item").forEach(el => {
    const isActive = parseInt(el.dataset.idx, 10) === state.currentIndex;
    el.classList.toggle("active",  isActive);
    el.classList.toggle("paused",  isActive && !state.isPlaying);
    el.dataset.liked = state.liked.has(parseInt(el.dataset.id, 10)) ? "true" : "false";
  });
}

function updateMarquee() {
  requestAnimationFrame(() => {
    const wrap = songTitle.parentElement;
    const titleW = songTitle.scrollWidth;
    const wrapW  = wrap.clientWidth;
    if (titleW > wrapW + 4) {
      songTitle.style.setProperty("--marquee-offset", `${-(titleW - wrapW + 16)}px`);
      songTitle.classList.add("marquee");
    } else {
      songTitle.classList.remove("marquee");
      songTitle.style.removeProperty("--marquee-offset");
    }
  });
}

function updateMiniPlayer() {
  const isSearch = Boolean(state.searchQuery);
  miniPlayer.classList.toggle("visible", state.hasLoadedSong && (isSearch || state.activeTab !== "player"));
}

function triggerLikeAnim() {
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
  updateMiniPlayer();
  if (state.queueOpen) renderQueue();
}

function updateRepeatBtn() {
  const mode = state.repeatMode;
  repeatBtn.classList.toggle("active", mode !== "off");
  const BASE = '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>';
  const ONE_BADGE = '<text x="9.5" y="13.5" font-size="6.5" fill="currentColor" font-family="Outfit" font-weight="bold">1</text>';
  repeatIcon.innerHTML = BASE + (mode === "one" ? ONE_BADGE : "");
}


/* ─────────────────────────────────────────────────────
   9. PERSISTENCE
   — global playlists are NEVER written to localStorage
───────────────────────────────────────────────────── */
function _savePlayerState() {
  localStorage.setItem("melo_player", JSON.stringify({
    index:           state.currentIndex,
    time:            audio.currentTime,
    shuffle:         state.shuffle,
    repeatMode:      state.repeatMode,
    queueType:       state.currentQueueType,
    queueSongIds:    state.currentQueueSongIds,
    queuePlaylistId: state.currentQueuePlaylistId,
  }));
}

function _savePersist() {
  localStorage.setItem("melo_liked",     JSON.stringify([...state.liked]));
  localStorage.setItem("melo_recent",    JSON.stringify(state.recentlyPlayed));
  localStorage.setItem("melo_volume",    state.volume);
  // Only save USER playlists — never global ones
  localStorage.setItem("melo_playlists", JSON.stringify(state.playlists));
  localStorage.setItem("melo_sel_pl",    state.selectedPlaylistId || "");
}

function sanitizePlaylists(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map((p, i) => ({
    id:      p.id || `pl-${Date.now()}-${i}`,
    name:    (typeof p.name === "string" ? p.name.trim() : "") || `Playlist ${i + 1}`,
    songIds: Array.isArray(p.songIds)
      ? [...new Set(p.songIds.filter(id => getSongById(id)))]
      : [],
  })).filter(p => p.name && !isGlobalPlaylist(p.id)); // extra guard: strip any accidentally stored globals
}

function _loadPersist() {
  try {
    state.liked    = new Set(JSON.parse(localStorage.getItem("melo_liked")  || "[]"));
    state.recentlyPlayed = JSON.parse(localStorage.getItem("melo_recent") || "[]")
      .filter(id => getSongById(id));
    state.volume        = parseFloat(localStorage.getItem("melo_volume") || "0.8");
    state.playbackSpeed = parseFloat(localStorage.getItem("melo_speed")  || "1");
    state.activeTab     = localStorage.getItem("melo_tab") || "player";
    state.playlists     = sanitizePlaylists(JSON.parse(localStorage.getItem("melo_playlists") || "[]"));

    state.selectedPlaylistId = localStorage.getItem("melo_sel_pl") || null;
    if (!getPlaylistById(state.selectedPlaylistId)) {
      state.selectedPlaylistId = getAllPlaylists()[0]?.id || null;
    }

    volSlider.value  = state.volume * 100;
    audio.volume     = state.volume;
    setPlaybackSpeed(state.playbackSpeed, { silent: true, persist: false });

    document.querySelectorAll(".sheet-opt[data-speed]").forEach(b => {
      b.classList.toggle("sheet-opt-active", parseFloat(b.dataset.speed) === state.playbackSpeed);
    });

    document.documentElement.dataset.theme = localStorage.getItem("melo_theme") || "dark";
    updateThemeIcon();
  } catch (e) {
    console.error("_loadPersist:", e);
  }
}

function _loadPlayerState() {
  try {
    const d = JSON.parse(localStorage.getItem("melo_player") || "null");
    if (!d) { useLibraryQueue(); updatePlaybackContextLabel(); return; }

    state.currentIndex = typeof d.index === "number" ? d.index : 0;
    state.shuffle      = Boolean(d.shuffle);
    state.repeatMode   = d.repeatMode || "off";

    shuffleBtn.classList.toggle("active", state.shuffle);
    updateRepeatBtn();

    if (d.queueType === "playlist" && d.queuePlaylistId && getPlaylistById(d.queuePlaylistId)) {
      usePlaylistQueue(getPlaylistById(d.queuePlaylistId));
    } else if (Array.isArray(d.queueSongIds) && d.queueSongIds.length) {
      setPlaybackQueue(d.queueSongIds, "all", null, "Playing from library");
    } else {
      useLibraryQueue();
    }

    loadSong(state.currentIndex, false);

    if (typeof d.time === "number" && d.time > 0) {
      audio.addEventListener("loadedmetadata", function rt() {
        audio.removeEventListener("loadedmetadata", rt);
        audio.currentTime = Math.min(d.time, audio.duration || d.time);
      });
    }
  } catch (e) {
    console.error("_loadPlayerState:", e);
    useLibraryQueue();
  }
}


/* ─────────────────────────────────────────────────────
   10. RENDERING FUNCTIONS
───────────────────────────────────────────────────── */
function renderSongItem(song, { onSelect = () => playSongFromLibrary(song) } = {}) {
  const idx    = SONGS.findIndex(s => s.id === song.id);
  const active = idx === state.currentIndex;
  const liked  = state.liked.has(song.id);
  const dur    = song._duration || "–:––";

  const el = document.createElement("div");
  el.className = [
    "song-item",
    active ? "active" : "",
    active && !state.isPlaying ? "paused" : "",
  ].filter(Boolean).join(" ");

  el.dataset.id   = song.id;
  el.dataset.idx  = idx;
  el.dataset.liked = liked ? "true" : "false";

  el.innerHTML = `
    <div class="si-thumb">
      <img src="${song.cover}" alt="${song.title}" loading="lazy">
      <div class="si-playing">
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
      <div class="si-dur">${dur}</div>
      <button class="si-menu-btn" data-id="${song.id}" title="More" aria-label="More options">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <circle cx="12" cy="5" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="12" cy="19" r="1.2"/>
        </svg>
      </button>
    </div>`;

  el.addEventListener("click", e => {
    if (e.target.closest(".si-menu-btn")) return;
    onSelect(song);
  });

  el.querySelector(".si-menu-btn").addEventListener("click", e => {
    e.stopPropagation();
    openCtxMenu(e, song.id);
  });

  attachLongPress(el, () => openCtxMenuCenter(song.id));
  return el;
}

function renderList(songs, container, emptyMsg) {
  container.innerHTML = "";
  if (!songs.length) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="em-ico">♪</span>
        ${emptyMsg}
        <p>It will appear here when available.</p>
      </div>`;
    return;
  }
  const frag = document.createDocumentFragment();
  songs.forEach(s => frag.appendChild(renderSongItem(s)));
  container.appendChild(frag);
}

function renderAll() {
  renderList(SONGS, songList, "No songs found");
  document.getElementById("songsCount").textContent = `${SONGS.length} songs`;

  const liked = SONGS.filter(s => state.liked.has(s.id));
  renderList(liked, likedList, "No liked songs yet");
  document.getElementById("likedCount").textContent = `${liked.length} songs`;

  const recent = state.recentlyPlayed.map(id => getSongById(id)).filter(Boolean);
  renderList(recent, recentList, "No recently played songs");
  document.getElementById("recentCount").textContent = `${recent.length} songs`;
}

function renderSearchResults(q) {
  searchResultsList.innerHTML = "";
  if (!q) return;

  const n       = q.toLowerCase();
  const byTitle  = SONGS.filter(s => s.title.toLowerCase().includes(n));
  const byArtist = SONGS.filter(s => s.artist.toLowerCase().includes(n) && !byTitle.includes(s));
  const inLiked  = SONGS.filter(s =>
    state.liked.has(s.id) &&
    (s.title.toLowerCase().includes(n) || s.artist.toLowerCase().includes(n))
  );
  const inRecent = [
    ...new Set(
      state.recentlyPlayed
        .map(id => getSongById(id))
        .filter(s => s && (s.title.toLowerCase().includes(n) || s.artist.toLowerCase().includes(n)))
    )
  ];

  let any = false;
  const frag = document.createDocumentFragment();

  function addGroup(label, arr) {
    if (!arr.length) return;
    const h = document.createElement("div");
    h.className = "search-group-lbl";
    h.textContent = label;
    frag.appendChild(h);
    arr.forEach(s => frag.appendChild(renderSongItem(s)));
    any = true;
  }

  addGroup("Songs",           byTitle);
  addGroup("Artists",         byArtist);
  addGroup("In Liked",        inLiked);
  addGroup("Recently Played", inRecent);

  if (!any) {
    frag.appendChild(Object.assign(document.createElement("div"), {
      className: "empty-state",
      innerHTML: `<span class="em-ico">🔍</span>No results for "${q}"<p>Try a different song or artist name.</p>`,
    }));
  }
  searchResultsList.appendChild(frag);
}

function renderQueue() {
  queueInner.innerHTML = "";

  const lbl = document.createElement("div");
  lbl.className = "queue-label";
  lbl.textContent = state.currentQueueType === "playlist" ? "Playlist Queue" : "Up Next";
  queueInner.appendChild(lbl);

  if (state.playNextQueue.length) {
    state.playNextQueue.forEach((id, i) => {
      const s = getSongById(id);
      if (s) queueInner.appendChild(makeQueueItem(s, i + 1, true));
    });
    const sep = document.createElement("div");
    sep.className = "queue-label";
    sep.style.marginTop = "6px";
    sep.textContent = "Then Playing";
    queueInner.appendChild(sep);
  }

  const qIds    = getNormQueueIds();
  const qi      = getCurrentQueueIndex();
  const upcoming = [];
  for (let o = 1; o < qIds.length; o++) {
    upcoming.push(qIds[(qi + o) % qIds.length]);
  }
  upcoming.slice(0, 8).forEach((id, i) => {
    const s = getSongById(id);
    if (s) queueInner.appendChild(makeQueueItem(s, i + 1 + state.playNextQueue.length, false));
  });
}

function makeQueueItem(song, pos, isPlayNext) {
  const el = document.createElement("div");
  el.className = "queue-item";
  el.innerHTML = `
    <div class="q-num">${pos}</div>
    <div class="q-thumb"><img src="${song.cover}" alt="" loading="lazy"></div>
    <div class="q-info">
      <div class="q-title">${song.title}</div>
      <div class="q-artist">${song.artist}</div>
    </div>`;

  el.addEventListener("click", () => {
    if (isPlayNext) {
      state.playNextQueue = state.playNextQueue.filter(id => id !== song.id);
    }
    loadSong(SONGS.findIndex(s => s.id === song.id), true);
    switchTab("player");
    state.queueOpen = false;
    queueDrawer.classList.remove("open");
    queueToggleBtn.classList.remove("open");
    queueToggleBtn.setAttribute("aria-expanded", "false");
  });
  return el;
}

function renderPlaylists() {
  const all = getAllPlaylists();
  const cnt = document.getElementById("playlistCount");
  cnt.textContent = `${all.length} playlist${all.length === 1 ? "" : "s"}`;

  if (!state.selectedPlaylistId && all.length) {
    state.selectedPlaylistId = all[0].id;
  }

  playlistList.innerHTML = "";
  if (!all.length) {
    playlistList.innerHTML = `
      <div class="empty-card">
        <span class="em-ico">🎵</span>
        Create your first playlist
        <p>Then add songs via the three-dot menu.</p>
      </div>`;
  } else {
    // Section header: Global
    if (GLOBAL_PLAYLISTS.length) {
      const ghdr = document.createElement("div");
      ghdr.className = "playlist-section-hdr";
      ghdr.textContent = "Global";
      playlistList.appendChild(ghdr);
    }

    const frag = document.createDocumentFragment();

    // Render global playlists first
    GLOBAL_PLAYLISTS.forEach(pl => {
      frag.appendChild(makePlaylistCard(pl, true));
    });

    // Section header: Your Playlists (only if user has any)
    if (state.playlists.length) {
      const uhdr = document.createElement("div");
      uhdr.className = "playlist-section-hdr";
      uhdr.textContent = "Your Playlists";
      frag.appendChild(uhdr);
      state.playlists.forEach(pl => {
        frag.appendChild(makePlaylistCard(pl, false));
      });
    }

    playlistList.appendChild(frag);
  }

  renderPlaylistDetail();
}

function makePlaylistCard(pl, isGlobal) {
  const card = document.createElement("div");
  card.className = `playlist-card${pl.id === state.selectedPlaylistId ? " active" : ""}${isGlobal ? " global" : ""}`;

  card.innerHTML = `
    <div class="playlist-card-main">
      <div class="playlist-card-title-row">
        <div class="playlist-card-title">${pl.name}</div>
        ${isGlobal ? '<span class="global-badge">Global</span>' : ''}
      </div>
      <div class="playlist-card-meta">${pl.songIds.length} song${pl.songIds.length === 1 ? "" : "s"}</div>
    </div>
    <div class="playlist-card-actions">
      <button class="playlist-icon-btn" data-action="play" title="Play playlist" aria-label="Play playlist">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      </button>
      ${!isGlobal ? `
      <button class="playlist-icon-btn" data-action="del" title="Delete playlist" aria-label="Delete playlist">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>
      </button>` : ''}
    </div>`;

  card.addEventListener("click", () => {
    state.selectedPlaylistId = pl.id;
    _savePersist();
    renderPlaylists();
  });
  card.querySelector('[data-action="play"]').addEventListener("click", e => {
    e.stopPropagation();
    playPlaylist(pl.id);
  });
  if (!isGlobal) {
    card.querySelector('[data-action="del"]').addEventListener("click", e => {
      e.stopPropagation();
      deletePlaylist(pl.id);
    });
  }
  return card;
}

function renderPlaylistDetail() {
  playlistDetail.innerHTML = "";
  const sel = getPlaylistById(state.selectedPlaylistId);

  if (!sel) {
    playlistDetail.innerHTML = `
      <div class="empty-card">
        <span class="em-ico">🎧</span>
        Select a playlist
        <p>View and play its songs here.</p>
      </div>`;
    return;
  }

  const isGlobal = isGlobalPlaylist(sel.id);
  const songs = sel.songIds.map(id => getSongById(id)).filter(Boolean);

  const hdr = document.createElement("div");
  hdr.className = "playlist-detail-header";
  hdr.innerHTML = `
    <div>
      <div class="playlist-detail-title-row">
        <div class="playlist-detail-title">${sel.name}</div>
        ${isGlobal ? '<span class="global-badge">Global</span>' : ''}
      </div>
      <div class="playlist-detail-subtitle">${songs.length} song${songs.length === 1 ? "" : "s"}${isGlobal ? " · Read-only" : " — only these will play."}</div>
    </div>
    <div class="playlist-detail-actions">
      <button class="pl-primary-btn" id="playSelPl">Play</button>
      ${!isGlobal ? '<button class="pl-secondary-btn" id="delSelPl">Delete</button>' : ''}
    </div>`;
  playlistDetail.appendChild(hdr);

  hdr.querySelector("#playSelPl").addEventListener("click", () => playPlaylist(sel.id));
  if (!isGlobal) {
    hdr.querySelector("#delSelPl").addEventListener("click",  () => deletePlaylist(sel.id));
  }

  if (!songs.length) {
    const empty = document.createElement("div");
    empty.className = "empty-card";
    empty.innerHTML = isGlobal
      ? '<span class="em-ico">🌐</span>No songs in this global playlist yet.'
      : '<span class="em-ico">➕</span>No songs yet<p>Use the ⋮ menu on any song to add here.</p>';
    playlistDetail.appendChild(empty);
    return;
  }

  const list = document.createElement("div");
  list.className = "playlist-detail-list";
  songs.forEach(s => {
    list.appendChild(renderSongItem(s, { onSelect: () => playSongFromPlaylist(s, sel.id) }));
  });
  playlistDetail.appendChild(list);
}

function renderPlaylistSheet() {
  const song = getSongById(state.ctxSongId);
  playlistSheetList.innerHTML = "";
  playlistSheetHelper.textContent = song
    ? `Add or remove "${song.title}" from a playlist.`
    : "Choose a playlist.";

  const all = getAllPlaylists();
  if (!all.length) {
    playlistSheetList.innerHTML = `
      <div class="empty-card">
        <span class="em-ico">🎼</span>
        No playlists yet
        <p>Create one in the Playlist tab.</p>
      </div>`;
    return;
  }

  const frag = document.createDocumentFragment();

  // Global playlists shown as read-only in sheet
  GLOBAL_PLAYLISTS.forEach(pl => {
    const isIn = pl.songIds.includes(state.ctxSongId);
    const btn  = document.createElement("button");
    btn.className = `pl-sheet-item pl-sheet-global${isIn ? " active" : ""}`;
    btn.disabled  = true;
    btn.innerHTML = `<span class="global-badge">Global</span> ${pl.name}${isIn ? " ✓" : ""}`;
    frag.appendChild(btn);
  });

  // User playlists — interactive
  state.playlists.forEach(pl => {
    const isIn = pl.songIds.includes(state.ctxSongId);
    const btn  = document.createElement("button");
    btn.className = `pl-sheet-item${isIn ? " active" : ""}`;
    btn.textContent = isIn ? `Remove from ${pl.name}` : `Add to ${pl.name}`;
    btn.addEventListener("click", () => toggleSongInPlaylist(state.ctxSongId, pl.id));
    frag.appendChild(btn);
  });

  playlistSheetList.appendChild(frag);
}


/* ─────────────────────────────────────────────────────
   11. PLAYLIST ACTIONS
───────────────────────────────────────────────────── */
function createPlaylist() {
  const name = playlistNameInput.value.trim();
  if (!name) { showToast("Enter a name"); playlistNameInput.focus(); return; }
  if (getAllPlaylists().some(p => p.name.toLowerCase() === name.toLowerCase())) {
    showToast("Name already exists");
    return;
  }
  const pl = { id: `pl-${Date.now()}`, name, songIds: [] };
  state.playlists.unshift(pl);
  state.selectedPlaylistId = pl.id;
  playlistNameInput.value = "";
  _savePersist();
  renderPlaylists();
  renderPlaylistSheet();
  showToast(`Created: ${name}`);
}

function deletePlaylist(id) {
  // Block deletion of global playlists
  if (isGlobalPlaylist(id)) {
    showToast("Global playlists can't be deleted");
    return;
  }

  const pl = getPlaylistById(id);
  if (!pl || !confirm(`Delete "${pl.name}"?`)) return;

  state.playlists = state.playlists.filter(p => p.id !== id);

  if (state.currentQueueType === "playlist" && state.currentQueuePlaylistId === id) {
    useLibraryQueue();
  }
  if (state.selectedPlaylistId === id) {
    state.selectedPlaylistId = getAllPlaylists()[0]?.id || null;
  }
  _savePersist();
  renderPlaylists();
  renderPlaylistSheet();
  showToast("Playlist deleted");
}

function toggleSongInPlaylist(songId, plId) {
  // Block modification of global playlists
  if (isGlobalPlaylist(plId)) {
    showToast("Global playlists are read-only");
    return;
  }

  const pl   = getPlaylistById(plId);
  const song = getSongById(songId);
  if (!pl || !song) return;

  const exists = pl.songIds.includes(songId);
  if (exists) {
    pl.songIds = pl.songIds.filter(id => id !== songId);

    if (state.currentQueueType === "playlist" && state.currentQueuePlaylistId === plId) {
      usePlaylistQueue(pl);
      if (currentSong().id === songId) {
        pl.songIds.length
          ? loadSong(SONGS.findIndex(s => s.id === pl.songIds[0]), state.isPlaying)
          : stopPlaybackAtStart();
      }
    }
    showToast(`Removed from ${pl.name}`);
  } else {
    pl.songIds.push(songId);
    showToast(`Added to ${pl.name}`);
  }
  _savePersist();
  renderPlaylists();
  renderPlaylistSheet();
}

function playPlaylist(id) {
  const pl = getPlaylistById(id);
  if (!pl || !pl.songIds.length) { showToast("Playlist is empty"); return; }
  state.selectedPlaylistId = pl.id;
  usePlaylistQueue(pl);
  loadSong(SONGS.findIndex(s => s.id === pl.songIds[0]), true);
  // Only persist selectedPlaylistId for user playlists
  if (!isGlobalPlaylist(id)) _savePersist();
  renderPlaylists();
  switchTab("player");
}

createPlaylistBtn.addEventListener("click", createPlaylist);
playlistNameInput.addEventListener("keydown", e => { if (e.key === "Enter") createPlaylist(); });


/* ─────────────────────────────────────────────────────
   12. TABS & VIEWS
───────────────────────────────────────────────────── */
function renderTabs() {
  const nav = document.getElementById("tabNav");
  nav.innerHTML = "";
  TABS.forEach(t => {
    const b = document.createElement("button");
    b.className   = `tab-btn${t.id === state.activeTab ? " active" : ""}`;
    b.dataset.tab = t.id;
    b.textContent = t.label;
    b.setAttribute("role", "tab");
    b.addEventListener("click", () => switchTab(t.id));
    nav.appendChild(b);
  });
}

function setActiveView(id) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) target.classList.add("active");
}

function switchTab(tab) {
  state.activeTab = tab;
  localStorage.setItem("melo_tab", tab);

  if (state.searchQuery) {
    searchInput.value = "";
    searchClearBtn.classList.remove("visible");
    state.searchQuery = "";
  }

  document.querySelectorAll(".tab-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.tab === tab);
  });

  setActiveView(`view-${tab}`);

  if (tab === "playlist") renderPlaylists();
  if (tab !== "search" && tab !== "player") renderAll();

  updateMiniPlayer();
}


/* ─────────────────────────────────────────────────────
   13. CONTEXT MENU
───────────────────────────────────────────────────── */
function openCtxMenu(e, songId) {
  state.ctxSongId = songId;
  ctxMenu.classList.add("show");
  const x = e.clientX || 0;
  const y = e.clientY || 0;
  if (!x && !y) { openCtxMenuCenter(songId); return; }
  positionCtxMenu(x, y);
}

function openCtxMenuCenter(songId) {
  state.ctxSongId = songId;
  ctxMenu.classList.add("show");
  const r = document.querySelector(".frame").getBoundingClientRect();
  positionCtxMenu(r.left + r.width / 2 - 90, r.top + r.height / 2 - 65);
}

function positionCtxMenu(x, y) {
  const W = 185, H = 165;
  ctxMenu.style.left = `${Math.max(8, Math.min(x, window.innerWidth  - W - 8))}px`;
  ctxMenu.style.top  = `${Math.max(8, Math.min(y, window.innerHeight - H - 8))}px`;
}

function closeCtxMenu() { ctxMenu.classList.remove("show"); }

ctxPlayNext.addEventListener("click", () => {
  const s = getSongById(state.ctxSongId);
  if (!s) return;
  state.playNextQueue = state.playNextQueue.filter(id => id !== s.id);
  state.playNextQueue.unshift(s.id);
  if (state.queueOpen) renderQueue();
  showToast(`Playing next: ${s.title}`);
  closeCtxMenu();
});

ctxAddToPlaylist.addEventListener("click", () => {
  closeCtxMenu();
  openPlaylistSheet(state.ctxSongId);
});

ctxDownload.addEventListener("click", () => {
  const s = getSongById(state.ctxSongId);
  if (!s) return;
  const a = document.createElement("a");
  a.href = s.src;
  a.download = `${s.title}.mp3`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast("Download started");
  closeCtxMenu();
});

document.addEventListener("click", e => {
  if (
    !ctxMenu.contains(e.target) &&
    !e.target.closest(".si-menu-btn") &&
    !e.target.closest("#playerMoreBtn")
  ) closeCtxMenu();
});

function openPlaylistSheet(id) {
  state.ctxSongId = id;
  renderPlaylistSheet();
  playlistOverlay.classList.add("show");
  playlistPanel.classList.add("open");
}
function closePlaylistSheet() {
  playlistOverlay.classList.remove("show");
  playlistPanel.classList.remove("open");
}
playlistOverlay.addEventListener("click", closePlaylistSheet);


/* ─────────────────────────────────────────────────────
   14. SLEEP TIMER
───────────────────────────────────────────────────── */
function openSleepSheet()  { sleepPanel.classList.add("open"); sleepOverlay.classList.add("show"); updateSleepUI(); }
function closeSleepSheet() { sleepPanel.classList.remove("open"); sleepOverlay.classList.remove("show"); }

function updateSleepCountdown() {
  if (!state.sleepEndTime) return;
  const rem = Math.max(0, state.sleepEndTime - Date.now());
  const m   = Math.floor(rem / 60000);
  const s   = String(Math.floor((rem % 60000) / 1000)).padStart(2, "0");
  sleepCountdown.textContent = `${m}:${s}`;
  sleepCountdown.classList.add("visible");
  sleepCancelBtn.classList.add("visible");
}

function updateSleepUI() {
  if (state.sleepEndTime) {
    updateSleepCountdown();
  } else {
    sleepCountdown.classList.remove("visible");
    sleepCancelBtn.classList.remove("visible");
  }
}

function cancelSleepTimer() {
  clearTimeout(state.sleepTimer);
  clearInterval(state.sleepCountdownInterval);
  state.sleepTimer             = null;
  state.sleepCountdownInterval = null;
  state.sleepEndTime           = null;
  sleepTimerBtn.classList.remove("timer-on");
  updateSleepUI();
}

function setSleepTimer(mins) {
  cancelSleepTimer();
  state.sleepEndTime = Date.now() + mins * 60000;
  state.sleepTimer = setTimeout(() => {
    stopPlayback();
    armGoRest();
    cancelSleepTimer();
    showCenterNotice("Time's up! Sleep well.");
    showToast("Sleep timer done");
  }, mins * 60000);
  state.sleepCountdownInterval = setInterval(updateSleepCountdown, 1000);
  sleepTimerBtn.classList.add("timer-on");
  updateSleepCountdown();
  showToast(`Sleep timer: ${mins} min`);
}

sleepTimerBtn.addEventListener("click", openSleepSheet);
sleepOverlay.addEventListener("click", closeSleepSheet);
document.querySelectorAll(".sheet-opt[data-min]").forEach(b => {
  b.addEventListener("click", () => {
    setSleepTimer(parseInt(b.dataset.min, 10));
    closeSleepSheet();
  });
});
sleepCancelBtn.addEventListener("click", () => { cancelSleepTimer(); closeSleepSheet(); showToast("Timer cancelled"); });


/* ─────────────────────────────────────────────────────
   15. PLAYBACK SPEED
───────────────────────────────────────────────────── */
function openSpeedSheet()  { speedPanel.classList.add("open"); speedOverlay.classList.add("show"); }
function closeSpeedSheet() { speedPanel.classList.remove("open"); speedOverlay.classList.remove("show"); }

function setPlaybackSpeed(spd, { silent = false, persist = true } = {}) {
  state.playbackSpeed  = spd;
  audio.playbackRate   = spd;
  speedBtn.innerHTML = `
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
    ${spd === 1 ? "1×" : `${spd}×`}`;
  speedBtn.classList.toggle("active", spd !== 1);
  if (persist) localStorage.setItem("melo_speed", spd);
  if (!silent) showToast(`Speed: ${spd === 1 ? "1×" : `${spd}×`}`);
}

speedBtn.addEventListener("click", openSpeedSheet);
speedOverlay.addEventListener("click", closeSpeedSheet);

document.querySelectorAll(".sheet-opt[data-speed]").forEach(b => {
  b.addEventListener("click", () => {
    setPlaybackSpeed(parseFloat(b.dataset.speed));
    document.querySelectorAll(".sheet-opt[data-speed]").forEach(n => n.classList.remove("sheet-opt-active"));
    b.classList.add("sheet-opt-active");
    closeSpeedSheet();
  });
});


/* ─────────────────────────────────────────────────────
   16. LIKES & RECENTLY PLAYED
───────────────────────────────────────────────────── */
function toggleLike(id) {
  state.liked.has(id) ? state.liked.delete(id) : state.liked.add(id);
}

function addToRecent(id) {
  state.recentlyPlayed = state.recentlyPlayed.filter(i => i !== id);
  state.recentlyPlayed.unshift(id);
  if (state.recentlyPlayed.length > 20) state.recentlyPlayed.pop();
  _savePersist();
}


/* ─────────────────────────────────────────────────────
   17. AUDIO EVENTS
───────────────────────────────────────────────────── */
audio.addEventListener("canplay",  () => bufRing.classList.remove("spinning"));
audio.addEventListener("waiting",  () => { if (state.isPlaying) bufRing.classList.add("spinning"); });
audio.addEventListener("playing",  () => bufRing.classList.remove("spinning"));

audio.addEventListener("loadedmetadata", () => {
  const formatted = formatTime(audio.duration);
  totalTimeEl.textContent = formatted;
  currentSong()._duration = formatted;
});

let _lastStateSave = 0;
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  const pct = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width     = `${pct}%`;
  miniProgressFill.style.width = `${pct}%`;
  currentTimeEl.textContent    = formatTime(audio.currentTime);
  totalTimeEl.textContent      = formatTime(audio.duration);

  if (!state.recentAddedForCurrent && audio.currentTime / audio.duration >= 0.5) {
    addToRecent(currentSong().id);
    state.recentAddedForCurrent = true;
    renderAll();
  }

  const now = Date.now();
  if (now - _lastStateSave > 5000) {
    _savePlayerState();
    _lastStateSave = now;
  }
});

audio.addEventListener("ended", () => {
  if (state.repeatMode === "one") {
    audio.currentTime = 0;
    startPlayback();
    return;
  }
  nextSong(true);
});


/* ─────────────────────────────────────────────────────
   18. PROGRESS BAR SCRUBBING
───────────────────────────────────────────────────── */
let _scrubbing = false;

function scrubTo(e) {
  const r  = progressTrack.getBoundingClientRect();
  const cx = e.touches ? e.touches[0].clientX : e.clientX;
  const rt = Math.max(0, Math.min(1, (cx - r.left) / r.width));
  if (audio.duration) audio.currentTime = rt * audio.duration;
  progressFill.style.width     = `${rt * 100}%`;
  miniProgressFill.style.width = `${rt * 100}%`;
}

function startScrub(e) {
  _scrubbing = true;
  audio.muted = true;
  progressTrack.classList.add("dragging");
  scrubTo(e);
}

function endScrub() {
  if (!_scrubbing) return;
  _scrubbing = false;
  audio.muted = false;
  progressTrack.classList.remove("dragging");
}

progressTrack.addEventListener("mousedown",  e => startScrub(e));
progressTrack.addEventListener("touchstart", e => startScrub(e), { passive: true });
document.addEventListener("mousemove",  e => { if (_scrubbing) scrubTo(e); });
document.addEventListener("touchmove",  e => { if (_scrubbing) scrubTo(e); }, { passive: true });
document.addEventListener("mouseup",    endScrub);
document.addEventListener("touchend",   endScrub);

/* ─────────────────────────────────────────────────────
   19. CONTROLS & BUTTON EVENTS
───────────────────────────────────────────────────── */
playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

mpPlayBtn.addEventListener("click", e => { e.stopPropagation(); togglePlay(); });
mpPrevBtn.addEventListener("click", e => { e.stopPropagation(); prevSong(); });
mpNextBtn.addEventListener("click", e => { e.stopPropagation(); nextSong(); });

miniPlayer.addEventListener("click", e => {
  if (e.target.closest("#mpPlayBtn, #mpPrevBtn, #mpNextBtn")) return;
  switchTab("player");
});

shuffleBtn.addEventListener("click", () => {
  state.shuffle = !state.shuffle;
  shuffleBtn.classList.toggle("active", state.shuffle);
  showToast(state.shuffle ? "Shuffle On" : "Shuffle Off");
  _savePlayerState();
});

repeatBtn.addEventListener("click", () => {
  const idx = REPEAT_MODES.indexOf(state.repeatMode);
  state.repeatMode = REPEAT_MODES[(idx + 1) % REPEAT_MODES.length];
  updateRepeatBtn();
  showToast(REPEAT_LABELS[state.repeatMode]);
  _savePlayerState();
});

volSlider.addEventListener("input", () => {
  state.volume = volSlider.value / 100;
  audio.volume = state.volume;
  _savePersist();
});

document.getElementById("volMuteBtn").addEventListener("click", () => {
  audio.muted = !audio.muted;
  showToast(audio.muted ? "Muted" : "Unmuted");
});

playerLikeBtn.addEventListener("click", () => {
  if (!state.hasLoadedSong) { showToast("Select a song first"); return; }
  toggleLike(currentSong().id);
  triggerLikeAnim();
  updateLikeBtn();
  refreshViews();
  showToast(state.liked.has(currentSong().id) ? "Liked" : "Unliked");
  _savePersist();
});

playerMoreBtn.addEventListener("click", e => {
  if (!state.hasLoadedSong) { showToast("Select a song first"); return; }
  openCtxMenu(e, currentSong().id);
});

queueToggleBtn.addEventListener("click", () => {
  state.queueOpen = !state.queueOpen;
  queueDrawer.classList.toggle("open", state.queueOpen);
  queueToggleBtn.classList.toggle("open", state.queueOpen);
  queueToggleBtn.setAttribute("aria-expanded", state.queueOpen ? "true" : "false");
  if (state.queueOpen) renderQueue();
});

meloLogo.addEventListener("click", () => {
  aboutPanel.classList.add("active");
  aboutPanel.scrollTop = 0;

  requestAnimationFrame(() => {
    aboutPanel.classList.add("open");
  });
});

function closeAboutPanel() {
  aboutPanel.classList.remove("open");

  setTimeout(() => {
    aboutPanel.classList.remove("active");
  }, 450);
}

aboutClose.addEventListener("click", closeAboutPanel);
aboutPanel.addEventListener("click", e => {
  if (e.target === aboutPanel) closeAboutPanel();
});

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.dataset.theme === "dark";
  document.documentElement.dataset.theme = isDark ? "light" : "dark";
  updateThemeIcon();
  localStorage.setItem("melo_theme", document.documentElement.dataset.theme);
});

function updateThemeIcon() {
  const isDark = document.documentElement.dataset.theme === "dark";
  document.getElementById("themeIcon").innerHTML = isDark
    ? `<circle cx="12" cy="12" r="5"/>
       <line x1="12" y1="1" x2="12" y2="3"/>
       <line x1="12" y1="21" x2="12" y2="23"/>
       <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
       <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
       <line x1="1" y1="12" x2="3" y2="12"/>
       <line x1="21" y1="12" x2="23" y2="12"/>
       <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
       <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`
    : `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
}

function attachLongPress(el, cb, delay = 500) {
  let timer = null;
  el.addEventListener("touchstart", () => {
    el.classList.add("pressing");
    timer = setTimeout(() => { el.classList.remove("pressing"); cb(); }, delay);
  }, { passive: true });
  ["touchend", "touchmove", "touchcancel"].forEach(ev => {
    el.addEventListener(ev, () => { clearTimeout(timer); el.classList.remove("pressing"); }, { passive: true });
  });
}


/* ─────────────────────────────────────────────────────
   20. SEARCH
───────────────────────────────────────────────────── */
let _searchDebounce;
searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim();
  searchClearBtn.classList.toggle("visible", q.length > 0);

  clearTimeout(_searchDebounce);
  _searchDebounce = setTimeout(() => {
    state.searchQuery = q;
    if (q) {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      setActiveView("view-search");
      renderSearchResults(q);
    } else {
      setActiveView(`view-${state.activeTab}`);
      document.querySelectorAll(".tab-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.tab === state.activeTab);
      });
    }
    updateMiniPlayer();
  }, 150);
});

searchClearBtn.addEventListener("click", () => {
  searchInput.value = "";
  state.searchQuery = "";
  searchClearBtn.classList.remove("visible");
  setActiveView(`view-${state.activeTab}`);
  document.querySelectorAll(".tab-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.tab === state.activeTab);
  });
  searchInput.focus();
  updateMiniPlayer();
});


/* ─────────────────────────────────────────────────────
   21. KEYBOARD SHORTCUTS
───────────────────────────────────────────────────── */
document.addEventListener("keydown", e => {
  const tag = document.activeElement.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea") return;

  switch (e.key) {
    case " ":
    case "k":
      e.preventDefault();
      togglePlay();
      break;

    case "ArrowRight":
      e.preventDefault();
      if (e.shiftKey) nextSong();
      else audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
      break;

    case "ArrowLeft":
      e.preventDefault();
      if (e.shiftKey) prevSong();
      else audio.currentTime = Math.max(0, audio.currentTime - 5);
      break;

    case "ArrowUp":
      e.preventDefault();
      state.volume = Math.min(1, state.volume + 0.05);
      audio.volume = state.volume;
      volSlider.value = state.volume * 100;
      _savePersist();
      showToast(`Vol ${Math.round(state.volume * 100)}%`);
      break;

    case "ArrowDown":
      e.preventDefault();
      state.volume = Math.max(0, state.volume - 0.05);
      audio.volume = state.volume;
      volSlider.value = state.volume * 100;
      _savePersist();
      showToast(`Vol ${Math.round(state.volume * 100)}%`);
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
      triggerLikeAnim();
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
      e.preventDefault();
      searchInput.focus();
      break;

    case "Escape":
      aboutPanel.classList.remove("open");
      closeSleepSheet();
      closeSpeedSheet();
      closePlaylistSheet();
      closeCtxMenu();
      break;
  }
});


/* ─────────────────────────────────────────────────────
   22. INITIALISATION
───────────────────────────────────────────────────── */
function preloadDurations() {
  SONGS.forEach(song => {
    if (song._duration) return;
    const probe = new Audio();
    probe.preload = "metadata";
    probe.src = song.src;
    probe.addEventListener("loadedmetadata", () => {
      song._duration = formatTime(probe.duration);
      document.querySelectorAll(`.song-item[data-id="${song.id}"] .si-dur`).forEach(el => {
        el.textContent = song._duration;
      });
      if (song.id === currentSong().id) {
        totalTimeEl.textContent = song._duration;
      }
    }, { once: true });
  });
}

function init() {
  _loadPersist();
  renderTabs();
  renderAll();
  renderPlaylists();

  renderArm(ARM_REST, false);

  _loadPlayerState();

  if (state.activeTab !== "player") {
    switchTab(state.activeTab);
  } else {
    updateMiniPlayer();
  }

  updatePlaybackContextLabel();
  updateRepeatBtn();

  setTimeout(() => {
    if (!state.isPlaying) {
      showArmHint(true);
      setTimeout(() => showArmHint(false), 3200);
    }
  }, 1000);

  setTimeout(preloadDurations, 900);
}

init();
