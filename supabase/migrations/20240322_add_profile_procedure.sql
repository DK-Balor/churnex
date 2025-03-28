-- Create a stored procedure to create the profiles table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_profile_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Create the profiles table if it doesn't exist
    CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        full_name TEXT,
        avatar_url TEXT,
        email TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
    );

    -- Enable RLS
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    -- Create policies if they don't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Users can view own profile'
    ) THEN
        CREATE POLICY "Users can view own profile"
            ON public.profiles
            FOR SELECT
            TO authenticated
            USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
    ) THEN
        CREATE POLICY "Users can update own profile"
            ON public.profiles
            FOR UPDATE
            TO authenticated
            USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile'
    ) THEN
        CREATE POLICY "Users can insert own profile"
            ON public.profiles
            FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = id);
    END IF;

    -- Create updated_at trigger if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'handle_updated_at'
    ) THEN
        CREATE TRIGGER handle_updated_at
            BEFORE UPDATE ON public.profiles
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_updated_at();
    END IF;
END;
$$; 