# BloomboxAI Setup Guide

## Database Setup (Supabase)

### Step 1: Get Your Supabase Credentials

1. Go to https://app.supabase.com
2. Select your project (or create a new one)
3. Go to **Project Settings** > **API**
4. Copy these values:
   - **Project URL**: `https://vzimetxbfjbupxrisskj.supabase.co`
   - **anon/public key**: Found under "Project API keys"
   - **service_role key**: Found under "Project API keys" (⚠️ Keep secret!)

### Step 2: Create Environment File

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://vzimetxbfjbupxrisskj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### Step 3: Run Database Schema

1. Go to Supabase Dashboard > **SQL Editor**
2. Copy the contents of `supabase/schema.sql`
3. Paste and run it in the SQL Editor
4. This will create all necessary tables and set up Row Level Security

### Step 4: Create Storage Buckets

1. Go to Supabase Dashboard > **Storage**
2. Create these buckets:
   - `brand-assets` (public)
   - `screenshots` (public)
   - `pdf-exports` (public)

### Step 5: Test Connection

Run the test script:
```bash
node scripts/test-db-connection.js
```

---

## Authentication Setup

The authentication system uses Supabase Auth:
- **Sign Up**: `/signup` - Creates new user accounts
- **Sign In**: `/signin` - User login
- **Dashboard**: `/dashboard` - Protected user dashboard
- **Admin**: `/admin` - Protected admin dashboard (requires admin role)

### Creating an Admin User

After setting up the database, run this SQL in Supabase SQL Editor:

```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

---

## Data Storage Structure

### PostgreSQL Tables:
- `users` - User accounts and profiles
- `projects` - Brand system projects
- `assets` - Generated asset metadata

### Supabase Storage:
- Brand logos, templates, moodboards
- Screenshots
- PDF exports

---

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | ✅ Yes |

---

## Troubleshooting

### Database Connection Issues
- Verify environment variables are set correctly
- Check Supabase project is active
- Ensure schema.sql has been run

### Authentication Issues
- Verify Supabase Auth is enabled in project settings
- Check email templates are configured
- Verify RLS policies are correct

### Storage Issues
- Ensure storage buckets are created
- Check bucket policies allow public access (if needed)
- Verify service role key has storage permissions

---

## Next Steps

1. ✅ Set up environment variables
2. ✅ Run database schema
3. ✅ Create storage buckets
4. ✅ Test connection
5. ✅ Create admin user
6. ✅ Deploy to production

