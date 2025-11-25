# 🎵 GitSymphony 👻

Turn your git commit history into generative music and visualizations!

## Frankenstein Category - Kiroween Hackathon

This project combines incompatible technologies:
- **Git** (version control) + **Web Audio API** (music generation) + **Visual effects**

## Features

### 🎵 Musical Mapping
- **Real git integration** - Analyzes actual repositories via backend API
- **Multiple instruments** - Different file types play different instruments:
  - JavaScript/TypeScript → Synth
  - Python/Java → Piano
  - Go/Rust → Bass
  - CSS/HTML/Markdown → Pluck
- **Intelligent note mapping**:
  - More additions → Higher pitch
  - Total changes → Note duration
  - Big commits (>100 changes) → Play chords
- **Pentatonic scale** - Always sounds musical

### 🌌 3D Visualization
- **Commit galaxy** - Each commit is a sphere in 3D space
- **Color coding**:
  - Red → Large commits (>100 changes)
  - Orange → Medium commits (>50 changes)
  - Cyan → Addition-heavy commits
  - Light cyan → Small changes
- **Spiral layout** - Commits arranged in a time-based spiral
- **Real-time highlighting** - Active commit pulses and scales up
- **Rotating camera** - Smooth orbital view

### 🎮 Controls
- 🔍 Analyze any local git repository
- ▶️ Play/pause symphony
- 📊 Scrolling commit list with sync highlighting
- 🎨 Dynamic background effects for big commits

## Quick Start

```bash
# Install dependencies
npm install

# Run both frontend and backend
npm run dev:all
```

Open http://localhost:5173 in your browser.

**Or run separately:**
```bash
# Terminal 1 - Backend API
npm run server

# Terminal 2 - Frontend
npm run dev
```

## How It Works

1. **Analyze**: Backend API uses `simple-git` to parse repository history
2. **Map**: Converts commit data (additions, deletions, file types) to musical parameters
3. **Visualize**: Creates 3D representation using Three.js
4. **Play**: Generates audio using Tone.js with multiple instruments and highlights commits in real-time

## Mapping Algorithm

- **Pitch**: Based on lines added (more additions = higher notes)
- **Duration**: Based on total changes (more changes = longer notes)
- **Scale**: Pentatonic scale for pleasant harmonies

## Completed ✅

- [x] Backend API to parse real git repos
- [x] 3D visualization with Three.js
- [x] Multiple instrument tracks based on file types
- [x] Real-time commit highlighting
- [x] Chord generation for large commits
- [x] Color-coded commit visualization

## Next Steps

- [ ] Export to MIDI/MP3
- [ ] Live mode with git hooks (Kiro integration)
- [ ] Branch visualization
- [ ] Tempo control
- [ ] Multiple repo comparison
- [ ] Spec-driven development documentation

## Tech Stack

**Frontend:**
- Vite
- Tone.js (Web Audio API wrapper)
- Three.js (3D visualization)
- Tailwind CSS + shadcn/ui (styling)
- Vanilla JavaScript

**Backend:**
- Node.js + Express
- simple-git (Git integration)
- CORS enabled

---

## 🎃 Kiroween Hackathon Submission

### Category: Frankenstein
**Incompatible Technologies Combined:**
- Git (version control system)
- Web Audio API (music generation)
- Three.js (3D graphics)

### Kiro Features Used
- ✅ **Vibe Coding:** Rapid prototyping and iterative development
- ✅ **Steering Docs:** Music theory, project structure, git analysis guidelines
- ✅ **Agent Hooks:** Automated testing and code quality checks
- ✅ **Spec-Driven Development:** Export feature planning and documentation

**See [KIRO_USAGE.md](./KIRO_USAGE.md) for detailed explanation of how Kiro was used.**

### Demo
- **Live App:** http://localhost:5173 (run locally)
- **Video:** [Coming soon - 3 minute demo]
- **Repository:** https://github.com/[your-username]/gitsymphony

### Try It Yourself
```bash
git clone https://github.com/[your-username]/gitsymphony
cd gitsymphony
npm install
npm run dev:all
```

Then open http://localhost:5173 and analyze any git repository!

---

Built with ❤️ and Kiro for Kiroween 2024 🎃

## License
MIT License - See [LICENSE](./LICENSE) for details
