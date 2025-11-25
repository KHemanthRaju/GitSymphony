# GitSymphony Quick Start Guide

## 🚀 Get Running in 2 Minutes

### Prerequisites
- Node.js 16+ installed
- Git installed
- A git repository to analyze (or use this one!)

### Installation

```bash
# Clone the repository
git clone https://github.com/KHemanthRaju/gitsymphony
cd gitsymphony

# Install dependencies
npm install

# Start both frontend and backend
npm run dev:all
```

### Usage

1. **Open your browser** to http://localhost:5173

2. **Analyze a repository:**
   - Leave path as "." to analyze GitSymphony itself
   - Or enter path to any local git repository
   - Click "🔍 Analyze Repository"

3. **Play the symphony:**
   - Click "▶️ Play Symphony"
   - Allow audio if browser asks
   - Watch and listen!

4. **Stop playback:**
   - Click "⏹️ Stop" anytime

### What You'll See

- **3D Commit Galaxy:** Rotating visualization of commits
- **Commit List:** Scrolling list with real-time highlighting
- **Musical Playback:** Each commit plays a note/chord

### Understanding the Music

- **Higher pitch** = More lines added
- **Longer notes** = More total changes
- **Chords** = Large commits (>100 changes)
- **Different instruments** = Different file types
  - JavaScript/TypeScript → Synth
  - Python/Java → Piano
  - Go/Rust → Bass
  - HTML/CSS → Pluck

### Understanding the Visualization

- **Red spheres** = Large commits (>100 changes)
- **Orange spheres** = Medium commits (>50 changes)
- **Cyan spheres** = Addition-heavy commits
- **Light cyan** = Small changes
- **Pulsing sphere** = Currently playing commit

---

## 🎯 Try These Examples

### Example 1: Analyze GitSymphony
```
Path: .
Result: Hear the sound of building this app!
```

### Example 2: Analyze a Large Project
```
Path: /path/to/your/project
Result: Longer symphony with more variety
```

### Example 3: Analyze a Small Project
```
Path: /path/to/small/repo
Result: Quick, focused melody
```

---

## 🐛 Troubleshooting

### "Not a valid git repository"
- Make sure the path points to a folder with a .git directory
- Try using absolute path instead of relative

### "No commits found"
- Repository might be empty
- Try a different repository

### No audio playing
- Check browser audio permissions
- Try clicking play again (browser audio policy)
- Check volume/mute settings

### Backend not connecting
- Make sure both servers are running (npm run dev:all)
- Check that port 3001 is not in use
- Try running separately:
  ```bash
  # Terminal 1
  npm run server
  
  # Terminal 2
  npm run dev
  ```

### 3D visualization not showing
- Check browser console for errors
- Try refreshing the page
- Make sure WebGL is supported in your browser

---

## 🎨 Kiro Features to Explore

### 1. Check the Steering Docs
```bash
cat .kiro/steering/music-theory.md
cat .kiro/steering/project-structure.md
cat .kiro/steering/git-analysis.md
```

### 2. Look at Agent Hooks
```bash
ls .kiro/hooks/
cat .kiro/hooks/test-on-save.json
```

### 3. Review the Spec
```bash
ls .kiro/specs/export-feature/
cat .kiro/specs/export-feature/requirements.md
```

### 4. Read Kiro Usage
```bash
cat KIRO_USAGE.md
```

---

## 📚 Learn More

- **Full Documentation:** See [README.md](./README.md)
- **Kiro Usage Details:** See [KIRO_USAGE.md](./KIRO_USAGE.md)
- **Demo Script:** See [DEMO_SCRIPT.md](./DEMO_SCRIPT.md)
- **Submission Info:** See [SUBMISSION_CHECKLIST.md](./SUBMISSION_CHECKLIST.md)

---

## 🎃 Kiroween Hackathon

This project was built for the Kiroween Hackathon in the **Frankenstein** category, combining:
- Git (version control)
- Web Audio API (music generation)
- Three.js (3D visualization)

Built entirely with Kiro using vibe coding, steering docs, agent hooks, and spec-driven development.

---

## 💡 Tips for Best Experience

1. **Use headphones** for better audio quality
2. **Analyze repos with 50-100 commits** for best results
3. **Watch the 3D visualization** while listening
4. **Try different repositories** to hear variety
5. **Check the commit list** to understand the mapping

---

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details

---

## 🎵 Enjoy Your Git Symphony!

Questions? Issues? Open a GitHub issue or contact the maintainers.

Happy listening! 🎧
