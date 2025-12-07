# Database Information - BloomboxAI

## Database System: **Supabase (PostgreSQL)**

BloomboxAI uses **Supabase** as its database system, which is built on **PostgreSQL**. Supabase provides:
- PostgreSQL database for structured data
- Supabase Storage for files (images, PDFs, assets)
- Supabase Auth for user authentication

---

## Database Tables

### 1. **users** Table
Stores user account information (extends Supabase auth.users)

```sql
- id (UUID) - Primary key, references auth.users
- email (TEXT) - User email
- name (TEXT) - User display name
- role (TEXT) - 'user' or 'admin'
- subscription_tier (TEXT) - 'free', 'pro', or 'enterprise'
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 2. **projects** Table
Stores brand system projects

```sql
- id (UUID) - Primary key
- user_id (UUID) - Foreign key to users table
- url (TEXT) - Website URL analyzed
- analysis (JSONB) - Website analysis data
- brand_system (JSONB) - Complete brand system data
- templates (JSONB) - Generated templates
- pdf_url (TEXT) - Link to exported PDF
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 3. **assets** Table
Stores generated brand assets (logos, templates, etc.)

```sql
- id (UUID) - Primary key
- project_id (UUID) - Foreign key to projects table
- type (TEXT) - 'logo', 'template', 'moodboard', or 'screenshot'
- path (TEXT) - Storage path
- url (TEXT) - Public URL
- created_at (TIMESTAMP)
```

---

## Data Storage Locations

### Structured Data (PostgreSQL)
- User accounts and profiles
- Brand system projects
- Asset metadata
- Authentication data

### Files & Media (Supabase Storage)
- Generated logos (PNG/SVG)
- Social media templates (PNG)
- Banner templates (PNG)
- Moodboard images
- Screenshots
- PDF brand kits

---

## Environment Variables Required

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

---

## How Data Flows

1. **User Signs Up** → Stored in `auth.users` + `users` table
2. **User Generates Brand System** → Stored in `projects` table
3. **Assets Generated** → Uploaded to Supabase Storage, metadata in `assets` table
4. **PDF Export** → Generated and stored in Supabase Storage, URL saved in `projects.pdf_url`

---

## Row Level Security (RLS)

All tables have RLS enabled:
- Users can only access their own data
- Admins can access all data
- Policies enforce data isolation

---

## Setup Instructions

1. Create a Supabase project at https://supabase.com
2. Run the SQL schema from `supabase/schema.sql` in Supabase SQL Editor
3. Add environment variables to `.env.local`
4. Configure Supabase Storage buckets for assets

---

## Database Access

- **Supabase Dashboard**: https://app.supabase.com
- **Direct PostgreSQL**: Available via Supabase connection string
- **API**: Via Supabase JavaScript client (`@supabase/supabase-js`)

