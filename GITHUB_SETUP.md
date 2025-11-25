# Push GitSymphony to GitHub

## Quick Setup

### 1. Create GitHub Repository

Go to https://github.com/new and create a new repository:
- **Repository name:** `gitsymphony`
- **Description:** Turn git commits into music - Kiroween 2024 Hackathon
- **Visibility:** Public
- **DO NOT** initialize with README, .gitignore, or license (we already have these)

### 2. Push Your Code

```bash
# Add GitHub as remote (replace YOUR_USERNAME with KHemanthRaju)
git remote add origin https://github.com/YOUR_USERNAME/gitsymphony.git

# Rename branch to main (optional, if you prefer main over master)
git branch -M main

# Push to GitHub
git push -u origin main
```

### 3. Verify

Visit your repository at:
```
https://github.com/KHemanthRaju/gitsymphony
```

## Important Notes

### ⚠️ Don't Forget .kiro Directory!

The `.kiro` directory is **required** for hackathon judging. Make sure it's NOT in `.gitignore`:

```bash
# Check .gitignore
cat .gitignore

# Should NOT contain .kiro
```

Our `.gitignore` correctly excludes only:
- `node_modules`
- `dist`
- `.DS_Store`

### 📝 Update README

Before pushing, update the GitHub URL in README.md:

```bash
# Find and replace KHemanthRaju with KHemanthRaju
sed -i '' 's/\[your-username\]/KHemanthRaju/g' README.md
sed -i '' 's/\[username\]/KHemanthRaju/g' *.md
```

Or manually edit these files:
- README.md
- QUICKSTART.md
- SUBMISSION_CHECKLIST.md
- NEXT_STEPS.md

## Testing GitHub Integration

Once pushed, you can test GitSymphony with your own repo:

1. Open http://localhost:5173/
2. Enter: `https://github.com/KHemanthRaju/gitsymphony`
3. Click "Analyze"
4. Listen to your own code as music! 🎵

## Deployment (Optional)

### Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts, select:
# - Framework: Vite
# - Build command: npm run build
# - Output directory: dist
```

### Deploy Backend to Railway

1. Go to https://railway.app/
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your gitsymphony repo
4. Set start command: `node server.js`
5. Add environment variable: `PORT=3001`

### Update Frontend API URL

If you deploy backend, update `main.js`:

```javascript
// Change this line:
const response = await fetch('http://localhost:3001/api/analyze', {

// To your Railway URL:
const response = await fetch('https://your-app.railway.app/api/analyze', {
```

## Troubleshooting

### Authentication Error

If you get authentication errors when pushing:

```bash
# Use personal access token
# Go to: https://github.com/settings/tokens
# Generate new token with 'repo' scope
# Use token as password when prompted
```

### Large Files

If you have large files:

```bash
# Check file sizes
du -sh * | sort -h

# Remove large files from git
git rm --cached large-file.zip
echo "large-file.zip" >> .gitignore
git commit -m "Remove large file"
```

### Force Push (if needed)

```bash
# Only if you need to overwrite remote
git push -f origin main
```

## Next Steps

After pushing to GitHub:

1. ✅ Verify .kiro directory is visible on GitHub
2. ✅ Test the GitHub URL in GitSymphony
3. ✅ Record demo video
4. ✅ Submit to Kiroween hackathon

---

Built with ❤️ for Kiroween 2024 🎃
