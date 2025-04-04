/*
  # Migrate users to Auth system

  1. Changes
    - Remove password column from users table since it will be handled by Auth
    - Add auth_id column to link with Auth users
    - Update RLS policies to use auth.uid()

  2. Security
    - Enable RLS
    - Update policies to use auth.uid()
*/

-- Remove password column and add auth_id
ALTER TABLE users 
DROP COLUMN password,
ADD COLUMN auth_id UUID REFERENCES auth.users(id);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can read all users" ON users;
DROP POLICY IF EXISTS "Users can update own record" ON users;
DROP POLICY IF EXISTS "Administrators can update any user" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to create users" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to delete users" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to read all users" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to update users" ON users;

-- Create new policies using auth.uid()
CREATE POLICY "Users can read all users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own record"
  ON users FOR UPDATE
  TO authenticated
  USING (auth_id = auth.uid())
  WITH CHECK (auth_id = auth.uid());

CREATE POLICY "Administrators can update any user"
  ON users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()
      AND role = 'Administrador'
    )
  );

CREATE POLICY "Allow administrators to create users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()
      AND role = 'Administrador'
    )
  );

CREATE POLICY "Allow administrators to delete users"
  ON users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()
      AND role = 'Administrador'
    )
  );
