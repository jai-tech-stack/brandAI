-- Supabase schema for BloomboxAI

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'plus', 'pro', 'enterprise')),
  credits INTEGER DEFAULT 6, -- New accounts get 6 free credits (one-time)
  credits_reset_date TIMESTAMP WITH TIME ZONE, -- When monthly credits reset
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  analysis JSONB,
  brand_system JSONB,
  templates JSONB,
  pdf_url TEXT,
  view_count INTEGER DEFAULT 0, -- Track number of project views
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets table
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('logo', 'template', 'moodboard', 'screenshot', 'generated')),
  path TEXT NOT NULL,
  url TEXT,
  prompt TEXT, -- For generated assets
  is_starter BOOLEAN DEFAULT FALSE, -- True if auto-generated as starter asset
  credit_cost INTEGER DEFAULT 1, -- Credits used (usually 1)
  refunded BOOLEAN DEFAULT FALSE, -- True if credit was refunded due to failure
  download_count INTEGER DEFAULT 0, -- Track number of downloads
  view_count INTEGER DEFAULT 0, -- Track number of views
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit transactions table (for tracking credit usage)
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL, -- Positive for credits added, negative for credits used
  type TEXT NOT NULL CHECK (type IN ('signup_bonus', 'monthly_reset', 'purchase', 'generation', 'refund')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_url ON projects(url);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_assets_project_id ON assets(project_id);
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for projects
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own projects" ON projects;
CREATE POLICY "Users can create own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own projects" ON projects;
CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all projects" ON projects;
CREATE POLICY "Admins can view all projects" ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for assets
DROP POLICY IF EXISTS "Users can view assets from own projects" ON assets;
CREATE POLICY "Users can view assets from own projects" ON assets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = assets.project_id AND projects.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create assets for own projects" ON assets;
CREATE POLICY "Users can create assets for own projects" ON assets
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = assets.project_id AND projects.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can view all assets" ON assets;
CREATE POLICY "Admins can view all assets" ON assets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for credit_transactions
DROP POLICY IF EXISTS "Users can view own credit transactions" ON credit_transactions;
CREATE POLICY "Users can view own credit transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own credit transactions" ON credit_transactions;
CREATE POLICY "Users can create own credit transactions" ON credit_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all credit transactions" ON credit_transactions;
CREATE POLICY "Admins can view all credit transactions" ON credit_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to automatically create user record on signup with 6 free credits
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, credits)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'user',
    6 -- New accounts get 6 free credits (one-time)
  );
  
  -- Record the signup bonus transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (
    NEW.id,
    6,
    'signup_bonus',
    'Welcome bonus: 6 free credits'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user record on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
