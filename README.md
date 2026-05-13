<div align="center">

```
███╗   ███╗███████╗██╗      ██████╗ 
████╗ ████║██╔════╝██║     ██╔═══██╗
██╔████╔██║█████╗  ██║     ██║   ██║
██║╚██╔╝██║██╔══╝  ██║     ██║   ██║
██║ ╚═╝ ██║███████╗███████╗╚██████╔╝
╚═╝     ╚═╝╚══════╝╚══════╝ ╚═════╝ 
```

**A retro music player that brings back the ritual of listening.**

[![Version](https://img.shields.io/badge/version-2.2.0-E8B84B?style=flat-square&labelColor=0C0F16&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNFOEI4NEIiLz48L3N2Zz4=)](https://github.com/rootnikhil/melo)
[![HTML5](https://img.shields.io/badge/HTML5-pure-4F8EF7?style=flat-square&labelColor=0C0F16)](https://github.com/rootnikhil/melo)
[![CSS3](https://img.shields.io/badge/CSS3-pure-4F8EF7?style=flat-square&labelColor=0C0F16)](https://github.com/rootnikhil/melo)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-vanilla-4F8EF7?style=flat-square&labelColor=0C0F16)](https://github.com/rootnikhil/melo)
[![No dependencies](https://img.shields.io/badge/dependencies-zero-E8B84B?style=flat-square&labelColor=0C0F16)](https://github.com/rootnikhil/melo)

---

*Drop the needle. Let it play. Stay with the song.*

</div>

---

## What is Melo?

Melo is a music player built around **presence over speed**. Most streaming apps are optimised for tapping, skipping, and scrolling. Melo does the opposite — it slows things down, removes the noise, and makes listening feel like an action rather than a button press.

Instead of hitting play, you **drag a tonearm onto a spinning vinyl record**. The needle drops. Music starts. It feels like something.

Built with zero frameworks, zero dependencies, and a commitment to doing one thing exceptionally well.

---

## Preview

```
┌─────────────────────────────────────────────┐
│  ●  M e l o                     🕐  ☀       │
│─────────────────────────────────────────────│
│  🔍  Search songs, artists…                  │
│─────────────────────────────────────────────│
│ [Now Playing] [Library] [Liked] [Recent] [Playlist] │
│─────────────────────────────────────────────│
│                                             │
│         ╔═══════════════════╗               │
│         ║  VINYL PLATTER    ║  ╱ tonearm    │
│         ║   ┌─────────┐    ║ ╱              │
│         ║   │ album   │    ║                │
│         ║   │  art    │    ║                │
│         ║   └─────────┘    ║                │
│         ║   33⅓ RPM        ║                │
│         ╚═══════════════════╝               │
│                                             │
│     Song Title                              │
│     Artist Name                             │
│     ● Play from library                     │
│                                             │
│  ♥        ⚡ 1×        ⋮                    │
│  ─────────────────────────────              │
│  0:00                          3:42         │
│                                             │
│  ⇄   ⏮   ▶   ⏭   ↺                        │
│  ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ vol                   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Features

### Core Playback
- **Drag-to-play tonearm** — the physical gesture that triggers music
- **Animated vinyl record** — spins in real time with a phosphor glow ring
- **Groove sweep animation** — tonearm tracks across the record as a song plays
- **Playback speed control** — 0.5× to 2×
- **Shuffle, Repeat (All / One / Off)**
- **Keyboard scrubbing** — seek 5 seconds per press
- **Sleep timer** — auto-stop after 5 / 10 / 15 / 30 / 45 / 60 minutes

### Library
- **30 curated songs** across multiple genres
- **Liked Songs** — heart any track, stored in localStorage
- **Recently Played** — logged after 50% playthrough
- **Full-text search** — matches title and artist in real time

### Playlists
- **Global playlists** — built-in, read-only curated sets
- **User playlists** — create, name, delete, and populate
- **Play Next queue** — inject any song to play immediately after current
- **Persistent queue** — survives page reloads

### UI / UX
- **Dark mode** — deep graphite with sapphire and warm gold palette
- **Light mode** — warm parchment studio, legible and refined
- **Mini player** — appears on non-player views, stays out of the way
- **Retro pixel aesthetic** — Press Start 2P · VT323 · Pixelify Sans fonts
- **CRT scanline overlay** — authentic phosphor terminal feel
- **Responsive** — mobile first, tablet, desktop, and ultrawide layouts
- **Touch gestures** — long-press context menu, swipe-aware
- **Keyboard shortcuts** — full playback control without a mouse

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` or `K` | Play / Pause |
| `→` | Seek forward 5 seconds |
| `←` | Seek back 5 seconds |
| `Shift + →` | Next track |
| `Shift + ←` | Previous track |
| `↑` | Volume up 5% |
| `↓` | Volume down 5% |
| `M` | Toggle mute |
| `L` | Like / Unlike current song |
| `S` | Toggle shuffle |
| `F` | Focus search input |
| `Esc` | Close any open panel / sheet |

---

## Project Structure

```
melo/
│
├── index.html          # App shell, all markup, panels, overlays
├── style.css           # All styles — token system, components, animations
├── script.js           # All behaviour — state, audio, UI, persistence
│
├── images/
│   ├── default.png     # Fallback album art
│   ├── cover1.jpg      # Album covers (cover1 – cover17)
│   └── …
│
└── audio/
    ├── song1.mp3       # Song files (song1 – song30)
    └── …
```

---

## Getting Started

Melo requires **no build step, no npm install, no bundler**. It runs directly in any modern browser.

### 1. Clone the repository

```bash
git clone https://github.com/rootnikhil/melo.git
cd melo
```

### 2. Add your audio and cover art

Drop your `.mp3` files into `/audio/` and cover images into `/images/`, then update the `SONGS` array in `script.js`:

```js
const SONGS = [
  {
    id:     1,
    title:  "Your Song Title",
    artist: "Artist Name",
    cover:  "images/cover1.jpg",
    src:    "audio/song1.mp3"
  },
  // ... more songs
];
```

### 3. Open in a browser

```bash
# Option A — just open the file
open index.html

# Option B — serve locally (avoids audio CORS on some browsers)
npx serve .
# or
python3 -m http.server 8080
```

Visit `http://localhost:8080` and drag the tonearm to start.

---

## Adding Global Playlists

Global playlists are built-in, read-only collections defined in `script.js`. They cannot be modified by users.

```js
const GLOBAL_PLAYLISTS = [
  {
    id:      "g-your-playlist-id",   // must start with "g-"
    name:    "Your Playlist Name",
    songIds: [1, 3, 7, 12, 25]       // song IDs from the SONGS array
  }
];
```

Rules:
- IDs **must** start with `"g-"` — this is how the app identifies them as global
- Global playlists are never saved to `localStorage`
- Users cannot delete or modify them
- They appear in a separate "Global" section in the Playlist view

---

## Colour System

The design uses a two-layer token system defined in `style.css`:

### Dark Theme
| Token | Value | Use |
|-------|-------|-----|
| `--gold` | `#E8B84B` | Primary brand accent, active states |
| `--gold-light` | `#F5CE7A` | Highlights, gradients |
| `--gold-glow` | `rgba(232,184,75,0.38)` | Box shadows, glows |
| `--accent` | `#4F8EF7` | Sapphire blue — secondary accent |
| `--bg` | `#080A0F` | Deepest background |
| `--surface` | `#131821` | Card surfaces |
| `--text` | `#E8F0FF` | Primary text |
| `--text2` | `#8A9AB8` | Secondary text |

### Light Theme
| Token | Value | Use |
|-------|-------|-----|
| `--gold` | `#9A6B10` | Deep brown-gold — fully legible on parchment |
| `--bg` | `#F2EDE4` | Warm parchment background |
| `--text` | `#1A130A` | Near-black, high contrast |
| `--text2` | `#5A4428` | Medium warm brown |

The light theme deliberately uses a **darker gold** (`#9A6B10` instead of `#E8B84B`) to ensure text legibility against the warm background — a common failure point in music player light modes.

---

## Rounding System

Melo uses a pixel-rounded aesthetic — hard-edged with CSS `border-radius` applied at specific scales:

| Token | Value | Used for |
|-------|-------|----------|
| `--r-sm` | `6px` | Buttons, menu items, thumbnails |
| `--r-md` | `10px` | Search bar, cards, controls |
| `--r-lg` | `16px` | Panels, sheets, detail cards |
| `--r-xl` | `22px` | App frame, bottom sheets |
| `--r-full` | `9999px` | Pills, badges, sliders |

All corners are rounded while preserving the grid-aligned, mechanical feel of the retro pixel aesthetic.

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Opera 76+ | ✅ Full |
| Mobile Chrome | ✅ Full |
| Mobile Safari | ✅ Full |

Requires Web Audio API support (all modern browsers).  
`dvh` units are used for mobile height — falls back gracefully.

---

## localStorage Keys

Melo persists state across reloads using the following keys:

| Key | Contents |
|-----|----------|
| `melo_liked` | JSON array of liked song IDs |
| `melo_recent` | JSON array of recently played song IDs (max 20) |
| `melo_volume` | Float 0–1 |
| `melo_speed` | Float (0.5, 0.75, 1, 1.25, 1.5, 2) |
| `melo_theme` | `"dark"` or `"light"` |
| `melo_tab` | Last active tab ID |
| `melo_playlists` | JSON array of user-created playlists |
| `melo_sel_pl` | ID of last selected playlist |
| `melo_player` | Current song index, seek time, queue, shuffle/repeat state |

Global playlists are **never** stored in localStorage.

---

## Design Principles

**1. Presence over convenience**  
The tonearm drag forces intentionality. You can't accidentally start a song. You have to commit to it.

**2. Pixel-rounded, not pixel-sharp**  
Every corner is rounded at a consistent scale. The aesthetic is retro — not brutal. The CRT glow, phosphor noise, and stepped fonts create depth without making the UI feel hostile.

**3. Light mode is not an afterthought**  
The light theme uses a completely different gold value (`#9A6B10`) specifically chosen to remain legible against the warm parchment surface. It feels like a different instrument, not just an inverted colour scheme.

**4. Animation serves behaviour**  
Every animation in Melo communicates state: the vinyl spins when playing, the arm sweeps as time passes, the glow pulses while audio plays. Nothing animates arbitrarily.

**5. No framework, no bundler**  
The entire app is three files. No React, no Vite, no Webpack. If you can open a browser, you can run Melo.

---

## Contributing

Melo is a personal project, but contributions are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Keep changes minimal and focused
4. Follow the existing code style — vanilla JS, BEM-inspired CSS naming
5. Open a pull request with a clear description

When adding songs or playlists, ensure you have the rights to distribute the audio files.

---

## Roadmap

- [ ] MediaSession API (lock screen / OS media controls)
- [ ] Web Audio API equaliser
- [ ] Waveform visualiser on the vinyl label
- [ ] Drag-to-reorder queue
- [ ] Export / import playlists (JSON)
- [ ] PWA support (offline, install to home screen)
- [ ] Crossfade between tracks

---

## Licence

MIT © rootnikhil

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.

---

<div align="center">

**Built for listening, not skipping.**

*Drop the needle.*

</div>
