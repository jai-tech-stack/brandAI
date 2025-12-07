# Vercel Deployment Setup Guide for BloomboxAI

## Setting Up Supabase Connection on Vercel

### Step 1: Get Your Supabase Credentials

1. Go to https://app.supabase.com
2. Select your project
3. Navigate to **Project Settings** > **API**
4. Copy these values:
   - **Project URL**: `https://vzimetxbfjbupxrisskj.supabase.co`
   - **anon/public key**: Under "Project API keys" → "anon" or "public"
   - **service_role key**: Under "Project API keys" → "service_role" (⚠️ Keep secret!)

### Step 2: Configure Environment Variables in Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your **BloomboxAI** project
3. Go to **Settings** > **Environment Variables**
4. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://vzimetxbfjbupxrisskj.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your_anon_key_here` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `your_service_role_key_here` | Production, Preview, Development |
| `OPENAI_API_KEY` | `your_openai_api_key_here` | Production, Preview, Development |

5. Click **Save** for each variable
6. **Important**: After adding variables, redeploy your application

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (if not already linked)
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add OPENAI_API_KEY

# Pull environment variables locally (optional)
vercel env pull .env.local
```

### Step 3: Set Up Supabase Database

1. Go to Supabase Dashboard > **SQL Editor**
2. Copy the entire contents of `supabase/schema.sql`
3. Paste and **Run** the SQL script
4. Verify tables are created:
   - `users`
   - `projects`
   - `assets`

### Step 4: Create Storage Buckets

1. Go to Supabase Dashboard > **Storage**
2. Create these buckets (make them **public**):
   - `brand-assets` - For logos, templates, moodboards
   - `screenshots` - For website screenshots
   - `pdf-exports` - For PDF brand kits

3. For each bucket, set policies:
   - **Public Access**: Enable "Public bucket"
   - **Upload Policy**: Allow authenticated users to upload
   - **Download Policy**: Allow public read access

### Step 5: Configure Supabase RLS Policies

The schema.sql already includes Row Level Security (RLS) policies, but verify:

1. Go to Supabase Dashboard > **Authentication** > **Policies**
2. Ensure RLS is enabled for:
   - `users` table
   - `projects` table
   - `assets` table

### Step 6: Redeploy on Vercel

After setting up environment variables:

1. Go to Vercel Dashboard > Your Project > **Deployments**
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger automatic deployment:
   ```bash
   git commit --allow-empty -m "Trigger redeploy with env vars"
   git push origin main
   ```

### Step 7: Verify Connection

After deployment, test the connection:

1. Visit your deployed site: `https://your-project.vercel.app`
2. Try signing up a new user
3. Check Supabase Dashboard > **Authentication** > **Users** to see if user was created
4. Check Supabase Dashboard > **Table Editor** > **users** to verify user record

---

## Environment Variables Reference

### Required Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://vzimetxbfjbupxrisskj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI (for AI features)
OPENAI_API_KEY=sk-...
```

### Optional Variables

```env
# Other AI Providers (optional)
STABILITY_API_KEY=sk-...
REPLICATE_API_TOKEN=r8_...
```

---

## Troubleshooting

### Issue: "Supabase not configured" error

**Solution**: 
- Verify environment variables are set in Vercel
- Ensure variables are added to **Production**, **Preview**, and **Development** environments
- Redeploy after adding variables

### Issue: Database connection fails

**Solution**:
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct (not the anon key)
- Check Supabase project is active and not paused
- Verify schema.sql has been run in Supabase SQL Editor

### Issue: Authentication not working

**Solution**:
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set correctly
- Check Supabase Auth is enabled in project settings
- Verify RLS policies are correctly set up

### Issue: Storage upload fails

**Solution**:
- Verify storage buckets are created in Supabase
- Check bucket policies allow uploads
- Ensure `SUPABASE_SERVICE_ROLE_KEY` has storage permissions

### Issue: Environment variables not updating

**Solution**:
- Environment variables require a **redeploy** to take effect
- Go to Vercel Dashboard > Deployments > Redeploy
- Or push a new commit to trigger deployment

---

## Security Best Practices

1. **Never commit** `.env.local` or `.env` files to Git
2. **Use different keys** for development and production
3. **Rotate keys** periodically
4. **Limit service_role key** usage to server-side only
5. **Enable RLS** on all tables
6. **Review policies** regularly

---

## Quick Checklist

- [ ] Supabase project created
- [ ] Environment variables added to Vercel
- [ ] Database schema executed in Supabase SQL Editor
- [ ] Storage buckets created
- [ ] RLS policies verified
- [ ] Application redeployed
- [ ] Connection tested (sign up/login works)
- [ ] Storage tested (file uploads work)

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase logs in dashboard
3. Verify all environment variables are set
4. Ensure database schema is up to date
