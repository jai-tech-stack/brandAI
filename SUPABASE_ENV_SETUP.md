# Supabase Environment Variables Setup Guide

## 🔑 Required Environment Variables

BloomboxAI needs these Supabase environment variables:

1. **NEXT_PUBLIC_SUPABASE_URL** - Your Supabase project URL
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY** - Your Supabase anonymous/public key
3. **SUPABASE_SERVICE_ROLE_KEY** - Your Supabase service role key (server-side only)

---

## 📋 Step-by-Step Setup

### **Step 1: Get Your Supabase Keys**

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com
   - Sign in or create account

2. **Create a New Project** (if you don't have one)
   - Click "New Project"
   - Enter project name (e.g., "bloomboxai")
   - Enter database password (save this!)
   - Select region closest to you
   - Click "Create new project"
   - Wait 2-3 minutes for project to initialize

3. **Get Your Project URL**
   - Go to **Settings** → **API**
   - Find **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - Copy this URL

4. **Get Your Anon/Public Key**
   - In **Settings** → **API**
   - Find **Project API keys**
   - Copy the **anon** `public` key (starts with `eyJ...`)
   - This is safe to expose in client-side code

5. **Get Your Service Role Key**
   - In **Settings** → **API**
   - Find **Project API keys**
   - Copy the **service_role** `secret` key (starts with `eyJ...`)
   - ⚠️ **KEEP THIS SECRET** - Never expose in client-side code!

---

### **Step 2: Add to Local Environment (.env.local)**

1. **Create `.env.local` file** in project root (if it doesn't exist)

2. **Add your Supabase keys:**

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Example:**
```env
# Supabase Configuration
 
```

3. **Save the file**

4. **Restart your development server:**
   ```bash
   npm run dev
   ```

---

### **Step 3: Add to Vercel (Production)**

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com
   - Sign in and select your project

2. **Go to Project Settings**
   - Click on your project
   - Go to **Settings** → **Environment Variables**

3. **Add Each Variable:**

   **Variable 1:**
   - **Name:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** Your Supabase project URL
   - **Environment:** Production, Preview, Development (select all)
   - Click **Save**

   **Variable 2:**
   - **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** Your Supabase anon key
   - **Environment:** Production, Preview, Development (select all)
   - Click **Save**

   **Variable 3:**
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** Your Supabase service role key
   - **Environment:** Production, Preview, Development (select all)
   - Click **Save**

4. **Redeploy**
   - Go to **Deployments**
   - Click **Redeploy** on latest deployment
   - Or push new commit to trigger deployment

---

## 🔍 How to Verify Setup

### **Local Development:**

1. **Check if variables are loaded:**
   ```bash
   # In your terminal, run:
   node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
   ```

2. **Test database connection:**
   ```bash
   npm run test-db
   ```

3. **Check browser console:**
   - Open your app in browser
   - Open DevTools → Console
   - Should NOT see "Supabase not configured" warnings

### **Production (Vercel):**

1. **Check Vercel Environment Variables:**
   - Go to Settings → Environment Variables
   - Verify all 3 variables are set

2. **Check deployment logs:**
   - Go to Deployments → Latest deployment
   - Check logs for any Supabase errors

3. **Test authentication:**
   - Try signing up/signing in
   - Should work without errors

---

## 📁 File Structure

Your project should have:

```
bloomboxai/
├── .env.local          # Local environment variables (gitignored)
├── .env.example       # Example file (optional)
├── lib/
│   └── auth/
│       └── supabaseAuth.ts  # Uses env variables
└── ...
```

---

## ⚠️ Important Security Notes

### **✅ Safe to Expose (Client-Side):**
- `NEXT_PUBLIC_SUPABASE_URL` - Public project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anonymous key

### **🔒 Keep Secret (Server-Side Only):**
- `SUPABASE_SERVICE_ROLE_KEY` - Full database access
  - Never commit to Git
  - Never expose in client-side code
  - Only use in API routes

---

## 🛠️ Troubleshooting

### **Issue: "Supabase not configured"**

**Solution:**
1. Check `.env.local` file exists
2. Verify variable names are correct (case-sensitive!)
3. Restart dev server: `npm run dev`
4. Check for typos in values

### **Issue: "Invalid API key"**

**Solution:**
1. Verify keys are copied correctly (no extra spaces)
2. Check if keys are from correct project
3. Regenerate keys in Supabase dashboard if needed

### **Issue: "Database connection failed"**

**Solution:**
1. Check Supabase project is active
2. Verify database password is correct
3. Check network/firewall settings
4. Verify project URL is correct

### **Issue: Environment variables not working in Vercel**

**Solution:**
1. Verify variables are set in Vercel dashboard
2. Check variable names match exactly (case-sensitive)
3. Redeploy after adding variables
4. Check deployment logs for errors

---

## 📝 Quick Reference

### **Where to Find Keys:**

| Key | Location in Supabase |
|-----|---------------------|
| Project URL | Settings → API → Project URL |
| Anon Key | Settings → API → Project API keys → anon public |
| Service Role Key | Settings → API → Project API keys → service_role secret |

### **Environment Files:**

| File | Purpose | Git Tracked? |
|------|---------|--------------|
| `.env.local` | Local development | ❌ No (gitignored) |
| `.env.example` | Example template | ✅ Yes |
| Vercel Env Vars | Production | ❌ No (Vercel only) |

---

## 🚀 Next Steps After Setup

1. **Run Database Schema:**
   ```bash
   # Connect to Supabase SQL Editor
   # Copy contents of supabase/schema.sql
   # Run in Supabase SQL Editor
   ```

2. **Test Authentication:**
   - Try signing up
   - Try signing in
   - Check dashboard access

3. **Verify Features:**
   - Brand generation works
   - Projects save to database
   - User authentication works

---

## 📚 Additional Resources

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Environment Variables:** https://nextjs.org/docs/basic-features/environment-variables
- **Vercel Environment Variables:** https://vercel.com/docs/concepts/projects/environment-variables

---

## ✅ Checklist

- [ ] Created Supabase project
- [ ] Got Project URL
- [ ] Got Anon Key
- [ ] Got Service Role Key
- [ ] Created `.env.local` file
- [ ] Added all 3 variables to `.env.local`
- [ ] Added all 3 variables to Vercel
- [ ] Restarted dev server
- [ ] Tested database connection
- [ ] Tested authentication
- [ ] Verified production deployment

---

**Need Help?** Check the troubleshooting section or refer to Supabase documentation! 🚀

