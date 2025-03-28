-- Create enum for account types
CREATE TYPE account_type AS ENUM ('demo', 'trial', 'paid');

-- Create table for account status
CREATE TABLE account_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    account_type account_type NOT NULL DEFAULT 'demo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    subscription_id TEXT,
    subscription_tier TEXT,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Create function to update last_updated_at
CREATE OR REPLACE FUNCTION update_last_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for last_updated_at
CREATE TRIGGER update_account_status_last_updated_at
    BEFORE UPDATE ON account_status
    FOR EACH ROW
    EXECUTE FUNCTION update_last_updated_at();

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO account_status (user_id, expires_at)
    VALUES (NEW.id, TIMEZONE('utc'::text, NOW()) + INTERVAL '30 days');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Create function to check and delete expired demo accounts
CREATE OR REPLACE FUNCTION check_expired_demo_accounts()
RETURNS void AS $$
BEGIN
    -- Archive expired demo accounts
    INSERT INTO archived_accounts (
        user_id,
        email,
        account_type,
        created_at,
        expires_at,
        archived_at
    )
    SELECT 
        as.user_id,
        au.email,
        as.account_type,
        as.created_at,
        as.expires_at,
        TIMEZONE('utc'::text, NOW())
    FROM account_status as
    JOIN auth.users au ON au.id = as.user_id
    WHERE as.account_type = 'demo'
    AND as.expires_at < TIMEZONE('utc'::text, NOW());

    -- Delete expired demo accounts
    DELETE FROM account_status
    WHERE account_type = 'demo'
    AND expires_at < TIMEZONE('utc'::text, NOW());
END;
$$ LANGUAGE plpgsql;

-- Create table for archived accounts
CREATE TABLE archived_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    email TEXT NOT NULL,
    account_type account_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create index for faster queries
CREATE INDEX idx_account_status_user_id ON account_status(user_id);
CREATE INDEX idx_account_status_expires_at ON account_status(expires_at);
CREATE INDEX idx_archived_accounts_user_id ON archived_accounts(user_id); 