-- Create customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    company TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    status TEXT NOT NULL,
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create customer_activities table
CREATE TABLE customer_activities (
    id UUID PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    feature_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create support_tickets table
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create feature_usage table
CREATE TABLE feature_usage (
    id UUID PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    feature_id TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create intervention_plans table
CREATE TABLE intervention_plans (
    id UUID PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    steps JSONB NOT NULL,
    metrics JSONB NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create intervention_actions table
CREATE TABLE intervention_actions (
    id UUID PRIMARY KEY,
    intervention_id UUID REFERENCES intervention_plans(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_customer_activities_customer_id ON customer_activities(customer_id);
CREATE INDEX idx_customer_activities_type ON customer_activities(type);
CREATE INDEX idx_customer_activities_timestamp ON customer_activities(timestamp);
CREATE INDEX idx_support_tickets_customer_id ON support_tickets(customer_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_feature_usage_customer_id ON feature_usage(customer_id);
CREATE INDEX idx_feature_usage_feature_id ON feature_usage(feature_id);
CREATE INDEX idx_feature_usage_timestamp ON feature_usage(timestamp);
CREATE INDEX idx_intervention_plans_customer_id ON intervention_plans(customer_id);
CREATE INDEX idx_intervention_plans_status ON intervention_plans(status);
CREATE INDEX idx_intervention_actions_intervention_id ON intervention_actions(intervention_id);
CREATE INDEX idx_intervention_actions_status ON intervention_actions(status);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
    BEFORE UPDATE ON support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_intervention_plans_updated_at
    BEFORE UPDATE ON intervention_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_intervention_actions_updated_at
    BEFORE UPDATE ON intervention_actions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE intervention_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE intervention_actions ENABLE ROW LEVEL SECURITY;

-- Create policies for customers
CREATE POLICY "Users can view their own customers"
    ON customers FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own customers"
    ON customers FOR UPDATE
    USING (auth.uid() = id);

-- Create policies for subscriptions
CREATE POLICY "Users can view their own subscriptions"
    ON subscriptions FOR SELECT
    USING (auth.uid() = customer_id);

CREATE POLICY "Users can update their own subscriptions"
    ON subscriptions FOR UPDATE
    USING (auth.uid() = customer_id);

-- Create policies for customer activities
CREATE POLICY "Users can view their own customer activities"
    ON customer_activities FOR SELECT
    USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert their own customer activities"
    ON customer_activities FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

-- Create policies for support tickets
CREATE POLICY "Users can view their own support tickets"
    ON support_tickets FOR SELECT
    USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert their own support tickets"
    ON support_tickets FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update their own support tickets"
    ON support_tickets FOR UPDATE
    USING (auth.uid() = customer_id);

-- Create policies for feature usage
CREATE POLICY "Users can view their own feature usage"
    ON feature_usage FOR SELECT
    USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert their own feature usage"
    ON feature_usage FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

-- Create policies for intervention plans
CREATE POLICY "Users can view their own intervention plans"
    ON intervention_plans FOR SELECT
    USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert their own intervention plans"
    ON intervention_plans FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update their own intervention plans"
    ON intervention_plans FOR UPDATE
    USING (auth.uid() = customer_id);

-- Create policies for intervention actions
CREATE POLICY "Users can view their own intervention actions"
    ON intervention_actions FOR SELECT
    USING (auth.uid() = intervention_id);

CREATE POLICY "Users can insert their own intervention actions"
    ON intervention_actions FOR INSERT
    WITH CHECK (auth.uid() = intervention_id);

CREATE POLICY "Users can update their own intervention actions"
    ON intervention_actions FOR UPDATE
    USING (auth.uid() = intervention_id); 