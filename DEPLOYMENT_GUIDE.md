# 🚀 BloomboxAI Deployment Guide

## Quick Deploy to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy on Vercel

1. **Go to [vercel.com](https://vercel.com)**
   - Sign up/Login with GitHub
   - Click "New Project"

2. **Import Repository**
   - Select your `bloomboxai` repository
   - Vercel will auto-detect Next.js

3. **Configure Project**
   - Framework: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

4. **Add Environment Variables**
   Go to **Settings → Environment Variables** and add:

   **Required (at least one for AI features):**
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

   **Optional (for Supabase storage):**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

   ⚠️ **Important:** Add to **Production**, **Preview**, and **Development** environments

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your site is live! 🎉

### Step 3: Verify Deployment

1. Visit your live URL (provided by Vercel)
2. Test the analyze feature: `/analyze`
3. Test brand system generation
4. Check that templates are generated

## 🔧 Vercel Configuration

The project includes:
- ✅ `vercel.json` - Optimized for Next.js with extended function timeout
- ✅ Playwright browser installation in postinstall script
- ✅ Proper Next.js image domains configured

## 📋 Environment Variables Checklist

Before deploying, ensure you have:

- [ ] At least one AI API key (OpenAI, Stability, or Replicate)
- [ ] Supabase credentials (optional, for database features)
- [ ] All variables added to Production, Preview, and Development

## 🐛 Troubleshooting

### Build Fails with Playwright Error

**Solution:** Playwright browsers are installed automatically via `postinstall` script. If it fails, the build continues (the `|| true` ensures this). The analyzer will work but may be slower.

### Function Timeout Errors

**Solution:** Vercel functions have a 60-second timeout (configured in `vercel.json`). For longer operations, consider:
- Using Vercel Edge Functions
- Breaking operations into smaller chunks
- Using background jobs

### Environment Variables Not Working

**Solution:**
1. Make sure variables are added to all environments (Production, Preview, Development)
2. Redeploy after adding variables
3. Check variable names are exact (case-sensitive)

### Playwright Not Working on Vercel

**Note:** Playwright requires system dependencies that may not be available on Vercel's serverless functions. For production, consider:
- Using a headless browser service (like Browserless.io)
- Using Puppeteer instead (lighter weight)
- Running Playwright in a Docker container on a different platform

**Workaround:** The analyzer will fall back to regex-based extraction if Playwright fails.

## 🚀 Alternative: Deploy with Docker

If you need full Playwright support, deploy using Docker:

```bash
docker build -t bloomboxai .
docker run -p 3000:3000 bloomboxai
```

Then deploy the Docker container to:
- Railway
- Render
- Fly.io
- AWS ECS
- Google Cloud Run

## 📊 Post-Deployment

After successful deployment:

1. ✅ Test all features
2. ✅ Monitor error logs in Vercel dashboard
3. ✅ Set up monitoring (optional)
4. ✅ Configure custom domain (optional)

## 🎯 Quick Deploy Commands

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

**Need Help?** Check the build logs in Vercel dashboard for specific errors.

