let songs = [
  {
    name: "AARI AARI",
    file: "songs/song1.mp3",
    cover: "images/cover1.jpg"
  },
  {
    name: "MAIN AUR TU",
    file: "songs/song2.mp3",
    cover: "images/cover1.jpg"
  },
  {
    name: "JAAN SE GUZARTE HAIN",
    file: "songs/song3.mp3",
    cover: "images/cover1.jpg"
  },
  {
    name: "AAKHRI ISHQ",
    file: "songs/song4.mp3",
    cover: "images/cover1.jpg"
  },
  {
    name: "WILD RIDE",
    file: "songs/song5.mp3",
    cover: "images/cover1.jpg"
  },
  {
    name: "VAARI JAAVAN",
    file: "songs/song6.mp3",
    cover: "images/cover1.jpg"
  },
  {
    name: "PHIR SE",
    file: "songs/song7.mp3",
    cover: "images/cover1.jpg"
  },
  {
    name: "DIDI (SHER-E-BALOCH)",
    file: "songs/song8.mp3",
    cover: "images/cover1.jpg"
  },
  {
    name: "DESTINY - MANN ATKEYA",
    file: "songs/song9.mp3",
    cover: "images/cover1.jpg"
  },
  {
    name: "RANG DE LAL (OYE OYE)",
    file: "songs/song10.mp3",
    cover: "images/cover1.jpg"
  },
  {
    name: "JAIYE SAJANA",
    file: "songs/song11.mp3",
    cover: "images/cover1.jpg"
  },
  {
    name: "TERE ISHQ NE",
    file: "songs/song12.mp3",
    cover: "images/cover1.jpg"
  },
  {
    name: "HUM PYAAR KARNE WALE",
    file: "songs/song13.mp3",
    cover: "images/cover1.jpg"
  },
  {
    name: "KANHAIYYA",
    file: "songs/song14.mp3",
    cover: "images/cover1.jpg"
  },
];

function togglePlay() {
  if (audio.paused) {
    audio.play();
    playBtn.innerText = "⏸";
  } else {
    audio.pause();
    playBtn.innerText = "▶";
  }
}

let audio = document.getElementById("audio");
let playBtn = document.getElementById("playBtn");
let title = document.getElementById("title");
let cover = document.getElementById("cover");
let progress = document.getElementById("progress");
let volume = document.getElementById("volume");
let songList = document.getElementById("songList");

let currentSong = 0;

// CREATE CARDS
songs.forEach((song, index) => {
  let div = document.createElement("div");
  div.classList.add("card");
  div.innerHTML = `
    <img src="${song.cover}">
    <p>${song.name}</p>
  `;
  div.onclick = () => loadSong(index);
  songList.appendChild(div);
});

function loadSong(index) {
  currentSong = index;
  audio.src = songs[index].file;
  title.innerText = songs[index].name;
  cover.src = songs[index].cover;

  audio.play();
  playBtn.innerText = "⏸";
}

function playSong(){ audio.play(); }
function pauseSong(){ audio.pause(); }

function nextSong(){
  currentSong = (currentSong+1)%songs.length;
  loadSong(currentSong);
}

function prevSong(){
  currentSong = (currentSong-1+songs.length)%songs.length;
  loadSong(currentSong);
}

audio.addEventListener("timeupdate",()=>{
  progress.value = (audio.currentTime/audio.duration)*100;

  localStorage.setItem("melo-currentTime", audio.currentTime);
  localStorage.setItem("melo-songIndex", currentSong);
  localStorage.setItem("melo-volume", audio.volume);
});

progress.addEventListener("input",()=>{
  audio.currentTime = (progress.value/100)*audio.duration;
});

volume.addEventListener("input",()=>{
  audio.volume = volume.value;
});

audio.addEventListener("ended", () => {
  playBtn.innerText = "▶";
});

window.addEventListener("load", () => {

  let savedIndex = localStorage.getItem("melo-songIndex");
  let savedTime = localStorage.getItem("melo-currentTime");
  let savedVolume = localStorage.getItem("melo-volume");

  if (savedIndex !== null) {
    loadSong(savedIndex);
  }

  if (savedTime !== null) {
    audio.currentTime = savedTime;
  }

  if (savedVolume !== null) {
    audio.volume = savedVolume;
    volume.value = savedVolume;
  }
});