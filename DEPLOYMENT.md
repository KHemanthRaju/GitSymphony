# GitSymphony Deployment Guide

## Quick Deploy (Recommended)

### Frontend: Vercel
```bash
npm run build
npx vercel --prod
```

### Backend: Railway
1. Visit https://railway.app/
2. New Project → Deploy from GitHub
3. Select GitSymphony repo
4. Set start command: `node server.js`
5. Copy the Railway URL

### Update API URL
In `main.js`, replace `http://localhost:3001` with your Railway URL.

## Alternative: Render (All-in-One)

### Backend Service
- Repository: https://github.com/KHemanthRaju/GitSymphony
- Build Command: `npm install`
- Start Command: `node server.js`
- Environment: Node

### Frontend Static Site
- Build Command: `npm run build`
- Publish Directory: `dist`

## Environment Variables

Backend needs:
- `PORT` (Railway sets automatically)

## Post-Deployment

1. Test with: `https://your-frontend.vercel.app`
2. Try analyzing: `https://github.com/octocat/Hello-World`
3. Verify .kiro directory is visible on GitHub

## Free Tier Limits

- **Vercel**: Unlimited bandwidth, 100GB/month
- **Railway**: 500 hours/month, $5 credit
- **Render**: 750 hours/month free
- **Netlify**: 100GB bandwidth/month

All sufficient for hackathon demo!
