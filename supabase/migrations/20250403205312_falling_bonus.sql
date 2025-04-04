/*
  # Create quotations table

  1. New Tables
    - `quotations`
      - `id` (uuid, primary key)
      - `tipo` (text, not null)
      - `cotizacion` (text, not null)
      - `ruc` (text, not null)
      - `facturar_a` (text, not null)
      - `cliente` (text, not null)
      - `moneda` (text, not null)
      - `importe` (text, not null)
      - `producto_starsoft` (text)
      - `servicio` (text, not null)
      - `mes_facturacion` (text)
      - `observaciones` (text)
      - `tipo_cobro` (text, not null)
      - `area` (text, not null)
      - `supervisor` (text)
      - `encargado` (text)
      - `inicio_facturacion` (text)
      - `ver_cotizacion` (text)
      - `funcionarios` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `quotations` table
    - Add policies for authenticated users to:
      - Read all quotations
      - Create new quotations
      - Update quotations
      - Delete quotations
*/

-- Create quotations table
CREATE TABLE IF NOT EXISTS quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text NOT NULL,
  cotizacion text NOT NULL,
  ruc text NOT NULL,
  facturar_a text NOT NULL,
  cliente text NOT NULL,
  moneda text NOT NULL,
  importe text NOT NULL,
  producto_starsoft text,
  servicio text NOT NULL,
  mes_facturacion text,
  observaciones text,
  tipo_cobro text NOT NULL,
  area text NOT NULL,
  supervisor text,
  encargado text,
  inicio_facturacion text,
  ver_cotizacion text,
  funcionarios text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read all quotations"
  ON quotations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to create quotations"
  ON quotations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update quotations"
  ON quotations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete quotations"
  ON quotations
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_quotations_updated_at'
  ) THEN
    CREATE TRIGGER update_quotations_updated_at
      BEFORE UPDATE ON quotations
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
