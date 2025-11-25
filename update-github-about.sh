#!/bin/bash
# Script to update GitHub repository About section using GitHub CLI

echo "🚀 Updating GitHub repository About section..."
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo ""
    echo "Install it with:"
    echo "  macOS: brew install gh"
    echo "  Or visit: https://cli.github.com/"
    echo ""
    echo "After installing, run: gh auth login"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI."
    echo "Run: gh auth login"
    exit 1
fi

REPO="KHemanthRaju/GitSymphony"
DESCRIPTION="🎵 Transform Git commit history into beautiful symphonies with 3D visualizations. Built for Kiroween 2025 Hackathon."
HOMEPAGE="https://gitsymphony.vercel.app"

# Topics to add
TOPICS=(
    "git"
    "music"
    "visualization"
    "three-js"
    "tone-js"
    "web-audio"
    "hackathon"
    "kiroween"
    "kiro-ai"
    "generative-art"
    "data-sonification"
    "javascript"
    "nodejs"
    "tailwindcss"
)

echo "📝 Updating repository description..."
gh repo edit "$REPO" \
    --description "$DESCRIPTION" \
    --homepage "$HOMEPAGE"

if [ $? -eq 0 ]; then
    echo "✅ Description and homepage updated!"
else
    echo "❌ Failed to update description"
    exit 1
fi

echo ""
echo "🏷️  Adding topics..."

# Add topics one by one
for topic in "${TOPICS[@]}"; do
    echo "  Adding: $topic"
    gh repo edit "$REPO" --add-topic "$topic" 2>/dev/null
done

echo ""
echo "✅ All done! Your repository About section has been updated."
echo ""
echo "🌐 View your repository: https://github.com/$REPO"
echo ""
echo "📸 Don't forget to upload the social preview image manually:"
echo "   1. Go to https://github.com/$REPO/settings"
echo "   2. Scroll to 'Social preview'"
echo "   3. Upload screenshots/hero.png"
