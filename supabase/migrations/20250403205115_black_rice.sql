/*
  # Create clients table

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `razon_social` (text, not null)
      - `ruc` (text, not null, unique)
      - `fecha_constitucion` (date)
      - `personeria` (text)
      - `contador_senior` (text)
      - `contador_junior` (text)
      - `asistente_contabilidad` (text)
      - `administrador` (text)
      - `laboralista` (text)
      - `vencimiento_iva` (text)
      - `vencimiento_ips` (text)
      - `domicilio` (text)
      - `tiene_patronal_ips` (boolean)
      - `nro_patronal` (text)
      - `ruc_mtess` (text)
      - `nro_ci` (text)
      - `contrasena` (text)
      - `nro_patronal_mtess` (text)
      - `contrasena_mtess` (text)
      - `situacion` (text)
      - `obligaciones_ruc` (text)
      - `contactos` (text)
      - `tiene_patente` (boolean)
      - `municipio_patente` (text)
      - `nro_patente` (text)
      - `presenta_balance` (boolean)
      - `fecha_presentacion_balance` (date)
      - `rubrica_libros` (boolean)
      - `correos_dnit` (text)
      - `representante_legal` (text)
      - `socios` (text)
      - `actividades_set` (text)
      - `nro_cuenta` (text)
      - `created_at` (timestamptz, default: now())
      - `updated_at` (timestamptz, default: now())

  2. Security
    - Enable RLS on `clients` table
    - Add policies for authenticated users to:
      - Read all clients
      - Create new clients
      - Update clients
      - Delete clients
*/

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  razon_social text NOT NULL,
  ruc text NOT NULL UNIQUE,
  fecha_constitucion date,
  personeria text,
  contador_senior text,
  contador_junior text,
  asistente_contabilidad text,
  administrador text,
  laboralista text,
  vencimiento_iva text,
  vencimiento_ips text,
  domicilio text,
  tiene_patronal_ips boolean DEFAULT false,
  nro_patronal text,
  ruc_mtess text,
  nro_ci text,
  contrasena text,
  nro_patronal_mtess text,
  contrasena_mtess text,
  situacion text,
  obligaciones_ruc text,
  contactos text,
  tiene_patente boolean DEFAULT false,
  municipio_patente text,
  nro_patente text,
  presenta_balance boolean DEFAULT false,
  fecha_presentacion_balance date,
  rubrica_libros boolean DEFAULT false,
  correos_dnit text,
  representante_legal text,
  socios text,
  actividades_set text,
  nro_cuenta text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read all clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to create clients"
  ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update clients"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete clients"
  ON clients
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
