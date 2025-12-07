# BloomboxAI - Complete Brand System Generator

An AI-powered platform that generates complete brand systems from any website URL. Extract colors, typography, logos, templates, and more in seconds.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)
- OpenAI API key (for AI features)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/bloomboxai.git
   cd bloomboxai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   OPENAI_API_KEY=your_openai_key
   ```

4. **Set up Supabase database**
   - Go to Supabase Dashboard > SQL Editor
   - Copy and run `supabase/schema.sql`
   - Create storage buckets: `brand-assets`, `screenshots`, `pdf-exports`

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Verify setup**
   ```bash
   npm run verify-env  # Check environment variables
   npm run test-db     # Test database connection
   ```

Visit http://localhost:3000

---

## 📦 Deployment to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Import to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect Next.js settings

### Step 3: Configure Environment Variables

In Vercel Dashboard > Settings > Environment Variables, add:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

**See [VERCEL_SETUP.md](./VERCEL_SETUP.md) for detailed instructions**

### Step 4: Deploy

Vercel will automatically deploy. After deployment:
- Run database schema in Supabase SQL Editor
- Create storage buckets
- Test the application

---

## 🗄️ Database Setup

BloomboxAI uses **Supabase (PostgreSQL)** for data storage.

### Database Tables

- `users` - User accounts and profiles
- `projects` - Brand system projects
- `assets` - Generated asset metadata

### Storage Buckets

- `brand-assets` - Logos, templates, moodboards
- `screenshots` - Website screenshots
- `pdf-exports` - PDF brand kits

**See [DATABASE_INFO.md](./DATABASE_INFO.md) for complete database documentation**

---

## 🔐 Authentication

- **Sign Up**: `/signup` - Create new account
- **Sign In**: `/signin` - User login
- **Dashboard**: `/dashboard` - User dashboard (protected)
- **Admin**: `/admin` - Admin dashboard (requires admin role)

### Creating Admin User

After first signup, run in Supabase SQL Editor:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

---

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup instructions
- **[VERCEL_SETUP.md](./VERCEL_SETUP.md)** - Vercel deployment guide
- **[DATABASE_INFO.md](./DATABASE_INFO.md)** - Database structure and schema

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: ShadCN UI
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth
- **AI**: OpenAI (GPT-4, DALL-E 3)
- **Web Scraping**: Playwright
- **PDF Generation**: pdf-lib

---

## 🎯 Features

- ✅ Website brand extraction
- ✅ Complete color system generation
- ✅ Typography pairings
- ✅ Logo generation (multiple variations)
- ✅ Social media templates
- ✅ Banner & ad templates
- ✅ Visual moodboards
- ✅ PDF brand kit export
- ✅ User authentication
- ✅ Project management dashboard
- ✅ Admin dashboard

---

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run verify-env   # Verify environment variables
npm run test-db      # Test database connection
```

---

## 🔧 Troubleshooting

### Database Connection Issues

- Verify environment variables are set
- Check Supabase project is active
- Ensure schema.sql has been run

### Build Errors

- Ensure all dependencies are installed
- Check Node.js version (18+)
- Clear `.next` folder and rebuild

### Authentication Issues

- Verify Supabase Auth is enabled
- Check RLS policies are correct
- Verify API keys are valid

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

---

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Check documentation in `/docs`
- Review troubleshooting guides
