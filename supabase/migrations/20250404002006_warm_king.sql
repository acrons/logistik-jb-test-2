/*
  # Setup authentication and user management

  1. Changes
    - Enable email auth provider
    - Create trigger to sync auth.users with public.users
    - Add RLS policies for users table
*/

-- Enable the email auth provider
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create a trigger to automatically create a public.users record when auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, password)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'Contador Junior'),
    'managed_by_supabase_auth'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update RLS policies for the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all users
CREATE POLICY "Users can read all users"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to update their own record
CREATE POLICY "Users can update own record"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow administrators to update any user
CREATE POLICY "Administrators can update any user"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role = 'Administrador'
    )
  );
