-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
DROP POLICY IF EXISTS "Users can delete their own data" ON public.users;

-- Create policies for users table
CREATE POLICY "Users can view their own data"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own data"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own data"
ON public.users
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Allow service role to manage all users
CREATE POLICY "Service role can manage all users"
ON public.users
TO service_role
USING (true)
WITH CHECK (true);

-- Allow anon to insert new users during signup
CREATE POLICY "Allow anon to insert new users"
ON public.users
FOR INSERT
TO anon
WITH CHECK (true); 