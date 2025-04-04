/*
  # Insert new clients and modify RUC constraint

  1. Changes
    - Removes unique constraint from RUC column
    - Inserts new clients into the clients table
    - Handles multiple companies with the same RUC
    - Sets default values for boolean fields

  2. Notes
    - Some companies share the same RUC number
    - All boolean fields default to false
    - Each company is checked by both RUC and name to avoid duplicates
*/

-- First, drop the unique constraint on RUC
ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_ruc_key;

-- Then proceed with client insertions
DO $$ 
BEGIN
  -- Insert single RUC companies
  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80022234-2' AND razon_social = 'ADM PARAGUAY SRL') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('ADM PARAGUAY SRL', '80022234-2', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '3207662-2' AND razon_social = 'ADRIANA OCAMPOS VILLATE') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('ADRIANA OCAMPOS VILLATE', '3207662-2', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80099585-6' AND razon_social = 'ADRIATIC SA') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('ADRIATIC SA', '80099585-6', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80005364-8' AND razon_social = 'AGRO INDUSTRIAL Y GANADERA DON LUIS SRL') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('AGRO INDUSTRIAL Y GANADERA DON LUIS SRL', '80005364-8', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '4276588-9' AND razon_social = 'AGUSTIN MARIANO GOMEZ MANSILLA') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('AGUSTIN MARIANO GOMEZ MANSILLA', '4276588-9', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '9210233-6' AND razon_social = 'AGUSTIN NASS') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('AGUSTIN NASS', '9210233-6', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '5148908-2' AND razon_social = 'AGUSTINA DE LOS ANGELES ROJAS VIA LLANES') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('AGUSTINA DE LOS ANGELES ROJAS VIA LLANES', '5148908-2', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '2484393-8' AND razon_social = 'ALEJANDRO SOLEY MELGAREJO') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('ALEJANDRO SOLEY MELGAREJO', '2484393-8', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80130147-5' AND razon_social = 'ALFA PARF PARAGUAY SA') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('ALFA PARF PARAGUAY SA', '80130147-5', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '2491034-1' AND razon_social = 'ALFONSO DANIEL VILLA BERKEMEYER') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('ALFONSO DANIEL VILLA BERKEMEYER', '2491034-1', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '3672263-4' AND razon_social = 'ALICIA TERESITA MANSILLA') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('ALICIA TERESITA MANSILLA', '3672263-4', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80125389-6' AND razon_social = 'ALLIANCE PARAGUAY SA') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('ALLIANCE PARAGUAY SA', '80125389-6', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80096827-1' AND razon_social = 'ALVES RIBEIRO SUCURSAL PARAGUAY SA') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('ALVES RIBEIRO SUCURSAL PARAGUAY SA', '80096827-1', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80119410-5' AND razon_social = 'ALO RENTAL PARAGUAY SA') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('ALO RENTAL PARAGUAY SA', '80119410-5', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80115087-6' AND razon_social = 'AMTERRA SA') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('AMTERRA SA', '80115087-6', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '3528413-7' AND razon_social = 'ANA JAZMIN ZAPUTOVICH VALIENTE') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('ANA JAZMIN ZAPUTOVICH VALIENTE', '3528413-7', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80095386-0' AND razon_social = 'ANJOR PY SA') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('ANJOR PY SA', '80095386-0', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80113889-2' AND razon_social = 'ANMIC SA') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('ANMIC SA', '80113889-2', false, false, false, false);
  END IF;

  -- Companies with RUC 2034678-6
  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '2034678-6' AND razon_social = 'ANTONIO IGNACIO VILLA BERKEMEYER') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('ANTONIO IGNACIO VILLA BERKEMEYER', '2034678-6', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '2034678-6' AND razon_social = 'AIVB EAS UNIPERSONAL') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('AIVB EAS UNIPERSONAL', '2034678-6', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '8866362-0' AND razon_social = 'ARTEM SEGALIN') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('ARTEM SEGALIN', '8866362-0', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80025866-5' AND razon_social = 'ASOC. ASUNCION CONVENTION & VISITORS BUREAU') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('ASOC. ASUNCION CONVENTION & VISITORS BUREAU', '80025866-5', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80048086-4' AND razon_social = 'AUMARK GROUP') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('AUMARK GROUP', '80048086-4', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '1138596-0' AND razon_social = 'BARBARA DOLLSTADT ZAVALA') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('BARBARA DOLLSTADT ZAVALA', '1138596-0', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80103515-6' AND razon_social = 'BESLERIA SA') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('BESLERIA SA', '80103515-6', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '08.992.424/0001-91' AND razon_social = 'TAKARA SA') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('TAKARA SA', '08.992.424/0001-91', false, false, false, false);
  END IF;

  -- Companies with RUC 80098135-9
  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80098135-9' AND razon_social = 'BAXTER PARAGUAY S.A.') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('BAXTER PARAGUAY S.A.', '80098135-9', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80098135-9' AND razon_social = 'BKM INTERNACIONAL SS') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('BKM INTERNACIONAL SS', '80098135-9', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80098135-9' AND razon_social = 'KESAI SA') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('KESAI SA', '80098135-9', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80098135-9' AND razon_social = 'KS EAS UNIPERSONAL') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('KS EAS UNIPERSONAL', '80098135-9', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80098135-9' AND razon_social = 'NATIVIA GUARANÍ SA') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('NATIVIA GUARANÍ SA', '80098135-9', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80098135-9' AND razon_social = 'OMEGA GREEN SA') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('OMEGA GREEN SA', '80098135-9', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80098135-9' AND razon_social = 'SILVATEAM PARAGUAY S.A.') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('SILVATEAM PARAGUAY S.A.', '80098135-9', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80098135-9' AND razon_social = 'STRATO PARAGUAY SA') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('STRATO PARAGUAY SA', '80098135-9', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80126603-3' AND razon_social = 'BROOKLYN SA') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('BROOKLYN SA', '80126603-3', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80096442-0' AND razon_social = 'BVS TECHNOLOGY SA') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('BVS TECHNOLOGY SA', '80096442-0', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80030687-2' AND razon_social = 'CAMARA FITOSANITARIOS Y FERTILIZANTES (CAF Y F)') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('CAMARA FITOSANITARIOS Y FERTILIZANTES (CAF Y F)', '80030687-2', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80140349-9' AND razon_social = 'CAPAMEX') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('CAPAMEX', '80140349-9', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80087280-0' AND razon_social = 'CARITES SA') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('CARITES SA', '80087280-0', false, false, false, false);
  END IF;

  -- Companies with RUC 1518017-4
  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '1518017-4' AND razon_social = 'MARTIN ROMERO') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('MARTIN ROMERO', '1518017-4', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '1518017-4' AND razon_social = 'LA ELENA E.A.S. UNIPERSONAL') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('LA ELENA E.A.S. UNIPERSONAL', '1518017-4', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '1518017-4' AND razon_social = 'CARLA ELENA SOSA MARTINEZ') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('CARLA ELENA SOSA MARTINEZ', '1518017-4', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '1518017-4' AND razon_social = 'ASOCIACION PARAGUAYA DE ESTUDIO SOBRE DEFENSA DE LA COMPETENCIA (APEDEC)') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('ASOCIACION PARAGUAYA DE ESTUDIO SOBRE DEFENSA DE LA COMPETENCIA (APEDEC)', '1518017-4', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80115845-1' AND razon_social = 'CARPE SA') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('CARPE SA', '80115845-1', false, false, false, false);
  END IF;

  -- Companies with RUC 80126407-3
  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80126407-3' AND razon_social = 'CASSAVA EAS') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('CASSAVA EAS', '80126407-3', false, false, false, false);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE ruc = '80126407-3' AND razon_social = 'ACTIVOS INMOBILIARIOS l SA') THEN
    INSERT INTO clients (razon_social, ruc, tiene_patronal_ips, tiene_patente, presenta_balance, rubrica_libros)
    VALUES ('ACTIVOS INMOBILIARIOS l SA', '80126407-3', false, false, false, false);
  END IF;

END $$;
