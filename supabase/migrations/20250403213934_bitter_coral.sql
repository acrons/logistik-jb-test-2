/*
  # Create users table and related schemas

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `lastname` (text)
      - `email` (text, unique)
      - `telefono` (text)
      - `role` (text, not null)
      - `client_count` (integer, default 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. New Junction Table
    - `user_clients`
      - `user_id` (uuid, references users)
      - `client_id` (uuid, references clients)
      - `created_at` (timestamptz)

  3. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  lastname text,
  email text UNIQUE,
  telefono text,
  role text NOT NULL CHECK (role IN ('Contador Senior', 'Contador Junior')),
  client_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_clients junction table
CREATE TABLE IF NOT EXISTS user_clients (
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, client_id)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_clients ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Allow authenticated users to read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to create users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete users"
  ON users
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for user_clients table
CREATE POLICY "Allow authenticated users to read user_clients"
  ON user_clients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to create user_clients"
  ON user_clients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete user_clients"
  ON user_clients
  FOR DELETE
  TO authenticated
  USING (true);

-- Create trigger for updating users.updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update client_count
CREATE OR REPLACE FUNCTION update_user_client_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE users
    SET client_count = client_count + 1
    WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE users
    SET client_count = client_count - 1
    WHERE id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_client_count_trigger
  AFTER INSERT OR DELETE ON user_clients
  FOR EACH ROW
  EXECUTE FUNCTION update_user_client_count();

-- Create indexes for better performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_user_clients_user_id ON user_clients(user_id);
CREATE INDEX idx_user_clients_client_id ON user_clients(client_id);
