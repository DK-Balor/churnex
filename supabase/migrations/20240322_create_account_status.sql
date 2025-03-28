-- Drop existing objects if they exist
DROP TABLE IF EXISTS account_status CASCADE;
DROP TYPE IF EXISTS account_status CASCADE;

-- Create account_status table
CREATE TABLE IF NOT EXISTS account_status (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  account_type TEXT NOT NULL CHECK (account_type IN ('demo', 'trial', 'paid')) DEFAULT 'demo',
  subscription_tier TEXT CHECK (subscription_tier IN ('starter', 'pro', 'enterprise')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE account_status ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "account_status_select_policy" ON account_status;
DROP POLICY IF EXISTS "account_status_insert_policy" ON account_status;
DROP POLICY IF EXISTS "account_status_update_policy" ON account_status;

-- Create policies with simpler names and more permissive rules
CREATE POLICY "account_status_select_policy" ON account_status
    FOR SELECT
    TO authenticated
    USING (true);  -- Allow authenticated users to view all records, filtering happens in queries

CREATE POLICY "account_status_insert_policy" ON account_status
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);  -- Only allow users to insert their own records

CREATE POLICY "account_status_update_policy" ON account_status
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);  -- Only allow users to update their own records

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_account_status_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_account_status_updated_at
  BEFORE UPDATE ON account_status
  FOR EACH ROW
  EXECUTE FUNCTION update_account_status_updated_at();

-- Create function to handle new user account status
CREATE OR REPLACE FUNCTION handle_new_user_account_status()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO account_status (id, account_type, created_at, expires_at)
  VALUES (
    NEW.id,
    'demo',
    NOW(),
    NOW() + INTERVAL '7 days'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_account_status();

-- Insert account status for existing users
INSERT INTO account_status (id, account_type, created_at, expires_at)
SELECT 
  id,
  'demo',
  COALESCE(created_at, NOW()),
  COALESCE(created_at, NOW()) + INTERVAL '7 days'
FROM auth.users
WHERE id NOT IN (SELECT id FROM account_status)
ON CONFLICT (id) DO NOTHING; 