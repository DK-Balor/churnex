-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types if they don't exist
DO $$ 
BEGIN
    -- Create account_type enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_type') THEN
        CREATE TYPE account_type AS ENUM ('demo', 'trial', 'starter', 'professional', 'enterprise');
    END IF;

    -- Create account_status enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_status') THEN
        CREATE TYPE account_status AS ENUM ('active', 'suspended', 'deleted');
    END IF;

    -- Create subscription_status enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE subscription_status AS ENUM ('none', 'trial', 'active', 'cancelled', 'expired');
    END IF;

    -- Create customer_status enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'customer_status') THEN
        CREATE TYPE customer_status AS ENUM ('active', 'at_risk', 'churned');
    END IF;

    -- Create activity_type enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_type') THEN
        CREATE TYPE activity_type AS ENUM ('login', 'feature_use', 'support_ticket', 'payment', 'other');
    END IF;

    -- Create subscription_plan enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_plan') THEN
        CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'enterprise');
    END IF;
END $$;

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS deleted_accounts CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS churn_predictions CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table with updated fields
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    company TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    account_type account_type NOT NULL DEFAULT 'demo',
    account_status account_status NOT NULL DEFAULT 'active',
    demo_expiry_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    subscription_status subscription_status NOT NULL DEFAULT 'none',
    subscription_end_date TIMESTAMPTZ,
    gdpr_consent BOOLEAN NOT NULL DEFAULT false,
    gdpr_consent_date TIMESTAMPTZ,
    marketing_consent BOOLEAN NOT NULL DEFAULT false,
    marketing_consent_date TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Create deleted_accounts table for GDPR compliance
CREATE TABLE deleted_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_user_id UUID NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    company TEXT,
    created_at TIMESTAMPTZ NOT NULL,
    deleted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    account_type account_type NOT NULL,
    deletion_reason TEXT,
    subscription_history JSONB,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Create customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status customer_status NOT NULL DEFAULT 'active',
    churn_probability FLOAT NOT NULL DEFAULT 0,
    lifetime_value DECIMAL(10,2) NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Create activities table
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    type activity_type NOT NULL,
    description TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Create churn_predictions table
CREATE TABLE churn_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    probability FLOAT NOT NULL,
    factors TEXT[] NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    confidence_score FLOAT NOT NULL
);

-- Create analytics_events table
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    properties JSONB NOT NULL DEFAULT '{}'::jsonb,
    session_id UUID NOT NULL
);

-- Create subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan subscription_plan NOT NULL,
    status subscription_status NOT NULL,
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    stripe_customer_id TEXT NOT NULL,
    stripe_subscription_id TEXT NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_activities_customer_id ON activities(customer_id);
CREATE INDEX idx_churn_predictions_customer_id ON churn_predictions(customer_id);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE deleted_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE churn_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only read and update their own data if account is not deleted
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id AND account_status != 'deleted');

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id AND account_status != 'deleted');

-- Only admins can access deleted_accounts
CREATE POLICY "Admins can view deleted accounts" ON deleted_accounts
    FOR SELECT USING (auth.role() = 'admin');

-- Customers policies
CREATE POLICY "Users can view own customers" ON customers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own customers" ON customers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customers" ON customers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own customers" ON customers
    FOR DELETE USING (auth.uid() = user_id);

-- Activities policies
CREATE POLICY "Users can view own customer activities" ON activities
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM customers
            WHERE customers.id = activities.customer_id
            AND customers.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own customer activities" ON activities
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM customers
            WHERE customers.id = activities.customer_id
            AND customers.user_id = auth.uid()
        )
    );

-- Churn predictions policies
CREATE POLICY "Users can view own customer predictions" ON churn_predictions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM customers
            WHERE customers.id = churn_predictions.customer_id
            AND customers.user_id = auth.uid()
        )
    );

-- Analytics events policies
CREATE POLICY "Users can view own analytics events" ON analytics_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics events" ON analytics_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Create functions for common operations
CREATE OR REPLACE FUNCTION update_customer_last_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE customers
    SET last_activity = NEW.timestamp
    WHERE id = NEW.customer_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating customer last activity
CREATE TRIGGER update_customer_last_activity_trigger
    AFTER INSERT ON activities
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_last_activity();

-- Create or replace function to handle demo account expiry
CREATE OR REPLACE FUNCTION check_demo_account_expiry()
RETURNS trigger AS $$
BEGIN
    -- Archive the account if it's expired
    IF NEW.account_type = 'demo' AND 
       NEW.demo_expiry_date < NOW() AND 
       NEW.account_status = 'active' THEN
        
        -- Insert into deleted_accounts
        INSERT INTO deleted_accounts (
            original_user_id,
            email,
            name,
            company,
            created_at,
            account_type,
            deletion_reason,
            subscription_history,
            metadata
        ) VALUES (
            OLD.id,
            OLD.email,
            OLD.name,
            OLD.company,
            OLD.created_at,
            OLD.account_type,
            'Demo account expired',
            jsonb_build_object(
                'subscription_status', OLD.subscription_status,
                'subscription_end_date', OLD.subscription_end_date
            ),
            OLD.metadata
        );
        
        -- Update user status to deleted
        NEW.account_status = 'deleted';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for demo account expiry
CREATE TRIGGER check_demo_account_expiry_trigger
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION check_demo_account_expiry();

-- Create function to handle trial to demo conversion
CREATE OR REPLACE FUNCTION handle_trial_expiry()
RETURNS trigger AS $$
BEGIN
    IF NEW.subscription_status = 'expired' AND 
       OLD.subscription_status = 'trial' AND 
       NEW.account_type = 'trial' THEN
        
        -- Convert to demo account
        NEW.account_type = 'demo';
        NEW.demo_expiry_date = NOW() + INTERVAL '30 days';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for trial expiry
CREATE TRIGGER handle_trial_expiry_trigger
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION handle_trial_expiry();

-- Create function to reset demo expiry on trial start
CREATE OR REPLACE FUNCTION reset_demo_expiry_on_trial()
RETURNS trigger AS $$
BEGIN
    IF NEW.account_type = 'trial' AND OLD.account_type = 'demo' THEN
        NEW.demo_expiry_date = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for resetting demo expiry
CREATE TRIGGER reset_demo_expiry_on_trial_trigger
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION reset_demo_expiry_on_trial(); 