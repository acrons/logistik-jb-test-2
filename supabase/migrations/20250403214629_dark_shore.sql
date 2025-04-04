/*
  # Add password field to users table

  1. Changes
    - Add password field to users table
    - Make password required for new users
    - Add password to existing users with a default value
*/

-- Add password column
ALTER TABLE users
ADD COLUMN password text NOT NULL DEFAULT 'changeme';

-- Remove the default constraint after adding the column
ALTER TABLE users
ALTER COLUMN password DROP DEFAULT;
