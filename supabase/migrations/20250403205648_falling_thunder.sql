/*
  # Add relationship between clients and quotations

  1. Changes
    - Add client_id foreign key to quotations table
    - Add cascade delete constraint
    - Update RLS policies to maintain relationship integrity

  2. Security
    - Policies updated to ensure users can only access related data
*/

-- Add client_id column to quotations
ALTER TABLE quotations
ADD COLUMN client_id uuid REFERENCES clients(id) ON DELETE CASCADE;

-- Update RLS policies to include client relationship
DROP POLICY IF EXISTS "Allow authenticated users to read all quotations" ON quotations;
DROP POLICY IF EXISTS "Allow authenticated users to create quotations" ON quotations;
DROP POLICY IF EXISTS "Allow authenticated users to update quotations" ON quotations;
DROP POLICY IF EXISTS "Allow authenticated users to delete quotations" ON quotations;

-- Create new policies that enforce the relationship
CREATE POLICY "Allow authenticated users to read all quotations"
  ON quotations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = quotations.client_id
    )
  );

CREATE POLICY "Allow authenticated users to create quotations"
  ON quotations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = client_id
    )
  );

CREATE POLICY "Allow authenticated users to update quotations"
  ON quotations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = client_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = client_id
    )
  );

CREATE POLICY "Allow authenticated users to delete quotations"
  ON quotations
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = client_id
    )
  );

-- Create index for better query performance
CREATE INDEX idx_quotations_client_id ON quotations(client_id);
