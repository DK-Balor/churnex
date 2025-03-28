-- Add onboarding status columns to users table
ALTER TABLE users
ADD COLUMN onboarding_completed BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN onboarding_dismissed BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN onboarding_steps JSONB NOT NULL DEFAULT '{
  "email_verified": false,
  "stripe_connected": false,
  "first_customer_added": false,
  "first_insight_viewed": false
}'::jsonb;

-- Create function to reset onboarding status on login if not completed
CREATE OR REPLACE FUNCTION reset_onboarding_status()
RETURNS trigger AS $$
BEGIN
    IF NOT OLD.onboarding_completed AND OLD.onboarding_dismissed THEN
        NEW.onboarding_dismissed = false;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for resetting onboarding status
CREATE TRIGGER reset_onboarding_status_trigger
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION reset_onboarding_status(); 