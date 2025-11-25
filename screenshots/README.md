# GitSymphony Screenshots & Demo Video

This folder contains screenshots and demo video for the GitSymphony project.

## Screenshots

### 01-landing-page.png
The initial landing page showing the hero section, input field, and feature highlights.

### 02-with-commits.png
The app after analyzing a repository, showing:
- 3D solar system visualization with commit planets
- Commit history list on the right
- 20 commits loaded and ready to play

### 03-playing.png
The app actively playing the symphony:
- "Symphony complete!" message
- Highlighted commit in the list
- Animated 3D visualization

### 04-light-mode.png
The app in light mode, demonstrating the theme toggle feature.

### hero.png
Hero image for documentation and promotional materials.

## Demo Video

### gitsymphony-demo.mp4
A 20-second demo video showing:
1. Landing page (5 seconds)
2. Repository analysis with commits loaded (5 seconds)
3. Playing the symphony (5 seconds)
4. Light mode theme (5 seconds)

## Creating New Screenshots

To capture new screenshots, make sure the dev server is running:

```bash
npm run dev:all
```

Then use the browser automation tools or manually capture screenshots.

## Recreating the Video

To recreate the demo video from screenshots:

```bash
./create-video.sh
```

Requirements:
- ffmpeg installed (`brew install ffmpeg`)
- Screenshots in this directory

The script will create a new `gitsymphony-demo.mp4` with fade transitions between screenshots.
