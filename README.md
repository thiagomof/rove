<img src="./docs/img/icon.png" alt="Rove logo" align="left" height="100"/>

# Rove <br> [![Release](https://img.shields.io/github/v/release/thiagomof/rove?label=latest-release)](https://github.com/thiagomof/rove/releases) [![License](https://img.shields.io/github/license/thiagomof/rove)](./LICENSE)

[https://thiagomof.github.io/rove](https://thiagomof.github.io/rove)

**Rove** is a modern, fast, and cross-platform desktop application that lets you download videos, audio, subtitles, and metadata from hundreds of supported websites. It provides an intuitive and elegant interface built on top of [yt-dlp](https://github.com/yt-dlp/yt-dlp) so you don't have to touch the command line.

---

## Features

- **Cross-platform:** Native support for Windows, macOS (Intel & Apple Silicon), and Linux.
- **Video & Audio Downloads:** Download full high-resolution videos (up to 4K/8K) or extract pure audio tracks (MP3, M4A, FLAC, etc.).
- **Subtitles & Metadata:** Automatically embeds or saves available captions, thumbnails, and tags.
- **Quality & Format Control:** Choose your preferred resolution, frame rate, and output format (MP4, MKV, WebM, etc.).
- **Playlists & Bulk Queue:** Download entire playlists or multiple links simultaneously with smart queueing.
- **Custom Output:** Configure download directories and customize filenames using presets and templates.
- **Integrated Media Player:** Quick preview and playback of media directly inside the app.
- **Authentication & Cookies:** Supports browser cookies, credentials, and password-protected videos.
- **Automatic Updates:** Built-in auto-updater for both the app and internal yt-dlp/ffmpeg binaries.
- **Light & Dark Mode:** Sleek, adaptive user interface matching your operating system theme.

---

## Download

The latest versions for **Windows**, **macOS**, and **Linux** are available on the  
👉 **[GitHub Releases](https://github.com/thiagomof/rove/releases)** page.

Download the installer or package for your operating system:

| Platform | Recommended Download |
|---|---|
| **Windows (x64)** | `Rove_x.x.x_x64-setup.exe` (or `Rove_x.x.x_x64-portable.zip`) |
| **macOS (Apple Silicon - M1, M2, M3, M4)** | `Rove_x.x.x_aarch64.dmg` |
| **macOS (Intel)** | `Rove_x.x.x_x64.dmg` |
| **Linux (AppImage)** | `Rove_x.x.x_amd64.AppImage` |
| **Linux (Debian / Ubuntu)** | `Rove_x.x.x_amd64.deb` |
| **Linux (Fedora / RHEL)** | `Rove_x.x.x_amd64.rpm` |

---

## How It Works

Rove combines a modern frontend with high-performance native system integrations:
* **Frontend:** Built with [Vue 3](https://vuejs.org/), TypeScript, TailwindCSS, and Pinia.
* **Backend:** Native desktop capabilities powered by [Tauri 2](https://tauri.app/) and [Rust](https://www.rust-lang.org/).
* **Core Engine:** Managed [yt-dlp](https://github.com/yt-dlp/yt-dlp) and [ffmpeg](https://ffmpeg.org/) binaries for downloading and format remuxing.

---

## Development & Building

### Requirements
* [Node.js](https://nodejs.org/) (v20+)
* [Rust](https://www.rust-lang.org/) and Cargo
* Tauri CLI dependencies for your OS (see [Tauri Prerequisites](https://tauri.app/start/prerequisites/))

### Running Locally

```bash
# Install frontend dependencies
npm install

# Run application in development mode
npm run dev

# Or launch with Tauri native window
npm run tauri dev
```

### Running Tests & Linting

```bash
# Run Vue lint
npm run lint

# Run Unit tests
npm run test:unit

# Build production bundle
npm run build
```

---

## License & Disclaimer

Rove is distributed under the [AGPL-3.0 License](./LICENSE).

#### Fair Use & Responsibility
The maintainers of Rove cannot be held liable for misuse of this application, as stated in the AGPL-3.0 license (section 16). Users are personally responsible for ensuring they use this software in compliance with local laws and platform terms of service.
