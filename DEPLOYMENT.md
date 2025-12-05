# Deploy BloomboxAI Live

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is made by the creators of Next.js and offers the easiest deployment.

#### Steps:

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/bloomboxai.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add at least one AI service key:
     ```
     OPENAI_API_KEY=sk-your-key-here
     ```
     OR
     ```
     STABILITY_API_KEY=sk-your-key-here
     ```
     OR
     ```
     REPLICATE_API_TOKEN=r8_your-token-here
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site is live! 🎉

#### Vercel CLI (Alternative)

```bash
npm i -g vercel
vercel login
vercel
# Follow prompts
# Add environment variables when prompted
```

---

### Option 2: Netlify

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login with GitHub
   - Click "New site from Git"
   - Connect GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`

3. **Add Environment Variables**
   - Site settings → Environment variables
   - Add your AI API keys

4. **Deploy**
   - Click "Deploy site"

---

### Option 3: Railway

1. **Push to GitHub**

2. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure**
   - Railway auto-detects Next.js
   - Add environment variables in Variables tab

4. **Deploy**
   - Railway automatically deploys

---

### Option 4: Render

1. **Push to GitHub**

2. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub
   - Click "New +" → "Web Service"
   - Connect your repository
   - Settings:
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
     - Environment: Node

3. **Add Environment Variables**
   - In Environment tab, add your API keys

4. **Deploy**
   - Click "Create Web Service"

---

## 📋 Pre-Deployment Checklist

- [ ] Code pushed to GitHub/GitLab
- [ ] Environment variables ready (at least one AI API key)
- [ ] `.env` file is in `.gitignore` (should be already)
- [ ] Test locally: `npm run build` works
- [ ] All features tested locally

## 🔐 Environment Variables Needed

Add these in your hosting platform's environment variables:

**Required (at least one):**
- `OPENAI_API_KEY` - For DALL-E 3 image generation
- OR `STABILITY_API_KEY` - For Stability AI
- OR `REPLICATE_API_TOKEN` - For Replicate

**Optional:**
- `NODE_ENV=production` - Set automatically by most platforms

## 🐛 Troubleshooting

### Build Fails

1. Check build logs in your hosting platform
2. Ensure Node.js version is 18+ (most platforms auto-detect)
3. Run `npm run build` locally to test

### Environment Variables Not Working

1. Make sure variables are added in hosting platform (not just `.env` file)
2. Restart/redeploy after adding variables
3. Check variable names match exactly (case-sensitive)

### API Errors After Deploy

1. Verify API keys are correct
2. Check API key permissions/quota
3. Check API service status

### CORS Issues

- Next.js API routes handle CORS automatically
- If issues occur, check `next.config.js` settings

## 📊 Recommended: Vercel

**Why Vercel?**
- ✅ Made by Next.js creators
- ✅ Zero configuration needed
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Free tier available
- ✅ Automatic deployments on git push
- ✅ Easy environment variable management

## 🎯 Quick Start (Vercel)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Add environment variables
vercel env add OPENAI_API_KEY

# 5. Redeploy with env vars
vercel --prod
```

## 📝 Post-Deployment

1. Test all features:
   - Brand extraction
   - Asset generation
   - Brand kits

2. Update any hardcoded URLs if needed

3. Set up custom domain (optional):
   - Vercel: Project Settings → Domains
   - Netlify: Domain settings
   - Add your domain

4. Monitor:
   - Check error logs
   - Monitor API usage
   - Set up alerts if needed

---

**Your BloomboxAI is ready to go live! 🚀**

