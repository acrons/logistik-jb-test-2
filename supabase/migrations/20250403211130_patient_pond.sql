/*
  # Insert initial client data

  1. Changes
    - Insert three initial clients into the clients table
*/

INSERT INTO clients (razon_social, ruc, created_at, updated_at)
VALUES 
  ('ADM PARAGUAY SRL', '80022234-2', now(), now()),
  ('ADRIANA OCAMPOS VILLATE', '3207662-2', now(), now()),
  ('ADRIATIC SA', '80099585-6', now(), now())
ON CONFLICT (ruc) DO NOTHING;
