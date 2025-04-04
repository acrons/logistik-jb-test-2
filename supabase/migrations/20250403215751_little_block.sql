/*
  # Add new user roles

  1. Changes
    - Update users table role check constraint to include new roles:
      - Administrador
      - Supervisor
      - Encargado
*/

DO $$ 
BEGIN
  ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
  
  ALTER TABLE users ADD CONSTRAINT users_role_check 
    CHECK (role = ANY (ARRAY[
      'Contador Senior'::text, 
      'Contador Junior'::text,
      'Administrador'::text,
      'Supervisor'::text,
      'Encargado'::text
    ]));
END $$;
