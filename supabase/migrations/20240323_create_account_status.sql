-- Create account_status table
CREATE TABLE IF NOT EXISTS account_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    account_type TEXT NOT NULL DEFAULT 'demo',
    subscription_tier TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE account_status ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own account status"
    ON account_status FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own account status"
    ON account_status FOR UPDATE
    USING (auth.uid() = user_id);

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_account_status_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_account_status_updated_at
    BEFORE UPDATE ON account_status
    FOR EACH ROW
    EXECUTE FUNCTION update_account_status_updated_at();

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user_account_status()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO account_status (user_id, account_type)
    VALUES (NEW.id, 'demo');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created_account_status
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user_account_status(); 