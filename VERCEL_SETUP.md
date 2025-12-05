# Vercel Deployment Setup Guide

## ⚠️ Configuration Settings Warning

If you see: "Configuration Settings in the current Production deployment differ from your current Project Settings"

This means you need to **redeploy** to apply the new settings.

## ✅ Solution: Redeploy

### Option 1: Redeploy from Dashboard
1. Go to your Vercel project dashboard
2. Click on the **"Deployments"** tab
3. Find the latest deployment
4. Click the **"..."** menu (three dots)
5. Select **"Redeploy"**
6. Confirm the redeploy

### Option 2: Push a New Commit
```bash
# Make a small change (like updating README)
echo "# BloomboxAI" > README.md
git add README.md
git commit -m "Trigger redeploy"
git push origin main
```

### Option 3: Manual Redeploy via CLI
```bash
vercel --prod
```

## 🔧 Project Settings to Check

### 1. Framework Preset
- Should be: **Next.js**
- Auto-detected, no action needed

### 2. Build Command
- Should be: `npm run build`
- Auto-detected from package.json

### 3. Output Directory
- Should be: `.next`
- Auto-detected for Next.js

### 4. Install Command
- Should be: `npm install`
- Auto-detected

### 5. Root Directory
- Should be: `./` (root)
- Only change if your project is in a subfolder

### 6. Node.js Version
- Should be: **18.x** or **20.x**
- Can be set in Project Settings → General → Node.js Version

## 🔐 Environment Variables

Make sure these are set in **Project Settings → Environment Variables**:

**Required (at least one):**
- `OPENAI_API_KEY` = `sk-your-key-here`
- OR `STABILITY_API_KEY` = `sk-your-key-here`
- OR `REPLICATE_API_TOKEN` = `r8_your-token-here`

**Important:** 
- Add to **Production**, **Preview**, and **Development** environments
- After adding, **redeploy** for changes to take effect

## 📋 Step-by-Step Fix

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project

2. **Check Project Settings**
   - Click **Settings** tab
   - Verify Framework is "Next.js"
   - Check Build & Development Settings

3. **Add Environment Variables** (if not done)
   - Go to **Settings → Environment Variables**
   - Add `OPENAI_API_KEY` with your value
   - Select all environments (Production, Preview, Development)
   - Click **Save**

4. **Redeploy**
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment
   - Click **"Redeploy"**
   - Or push a new commit to trigger auto-deploy

5. **Verify**
   - Wait for deployment to complete
   - Visit your live URL
   - Test brand extraction and asset generation

## 🐛 Common Issues

### Issue: Settings still differ after redeploy
**Solution:** Clear browser cache and check again, or wait a few minutes

### Issue: Environment variables not working
**Solution:** 
- Make sure variables are added to all environments
- Redeploy after adding variables
- Check variable names are exact (case-sensitive)

### Issue: Build fails
**Solution:**
- Check build logs in Vercel dashboard
- Ensure Node.js version is 18+ in settings
- Verify package.json is correct

## ✅ After Fixing

Once you redeploy with correct settings:
- ✅ Configuration warning will disappear
- ✅ Environment variables will be available
- ✅ App will work correctly
- ✅ Future deployments will use correct settings

---

**Quick Fix:** Just click "Redeploy" in Vercel dashboard - that's usually all you need!

