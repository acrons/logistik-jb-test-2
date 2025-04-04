export interface Client {
  razonSocial: string;
  ruc: string;
  fechaConstitucion: string;
  personeria: string;
  contadorSenior: string;
  contadorJunior: string;
  asistenteContabilidad: string;
  administrador: string;
  laboralista: string;
  vencimientoIVA: string;
  vencimientoIPS: string;
  domicilio: string;
  tienePatronalIPS: boolean;
  nroPatronal: string;
  rucMTESS: string;
  nroCI: string;
  contrasena: string;
  nroPatronalMTESS: string;
  contrasenaMTESS: string;
  situacion: string;
  obligacionesRUC: string;
  contactos: string;
  tienePatente: boolean;
  municipioPatente: string;
  nroPatente: string;
  presentaBalance: boolean;
  fechaPresentacionBalance: string;
  rubricaLibros: boolean;
  correosDNIT: string;
  representanteLegal: string;
  socios: string;
  actividadesSET: string;
  nroCuenta: string;
}

export interface Quote {
  tipo: string;
  cotizacion: string;
  ruc: string;
  facturarA: string;
  cliente: string;
  moneda: string;
  importe: string;
  productoStarSoft: string;
  servicio: string;
  mesFacturacion: string;
  observaciones: string;
  tipoCobro: string;
  area: string;
  supervisor: string;
  encargado: string;
  inicioFacturacion: string;
  verCotizacion: string;
  funcionarios: string;
}

export interface User {
  id: string;
  name: string;
  lastname?: string;
  email?: string;
  telefono?: string;
  password?: string;
  role: 'Contador Senior' | 'Contador Junior';
  clientCount: number;
  clients: string[];
}
