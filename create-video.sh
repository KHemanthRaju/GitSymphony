#!/bin/bash
# Create a demo video from screenshots using ffmpeg

echo "🎬 Creating demo video from screenshots..."

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg is not installed. Install it with:"
    echo "   brew install ffmpeg"
    exit 1
fi

# Create a video from screenshots (each shown for 5 seconds)
# Scale all images to 1920x1080 and add fade transitions
ffmpeg -y \
  -loop 1 -t 5 -i screenshots/01-landing-page.png \
  -loop 1 -t 5 -i screenshots/02-with-commits.png \
  -loop 1 -t 5 -i screenshots/03-playing.png \
  -loop 1 -t 5 -i screenshots/04-light-mode.png \
  -filter_complex \
  "[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=out:st=4.5:d=0.5[v0]; \
   [1:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=in:st=0:d=0.5,fade=t=out:st=4.5:d=0.5[v1]; \
   [2:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=in:st=0:d=0.5,fade=t=out:st=4.5:d=0.5[v2]; \
   [3:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fade=t=in:st=0:d=0.5[v3]; \
   [v0][v1][v2][v3]concat=n=4:v=1:a=0,format=yuv420p[v]" \
  -map "[v]" \
  -c:v libx264 \
  -r 30 \
  -pix_fmt yuv420p \
  screenshots/gitsymphony-demo.mp4

echo "✅ Video created: screenshots/gitsymphony-demo.mp4"
echo "📊 Video info:"
ffmpeg -i screenshots/gitsymphony-demo.mp4 2>&1 | grep Duration
