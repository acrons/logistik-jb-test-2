export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          razon_social: string
          ruc: string
          fecha_constitucion: string | null
          personeria: string | null
          contador_senior: string | null
          contador_junior: string | null
          asistente_contabilidad: string | null
          administrador: string | null
          laboralista: string | null
          vencimiento_iva: string | null
          vencimiento_ips: string | null
          domicilio: string | null
          tiene_patronal_ips: boolean
          nro_patronal: string | null
          ruc_mtess: string | null
          nro_ci: string | null
          contrasena: string | null
          nro_patronal_mtess: string | null
          contrasena_mtess: string | null
          situacion: string | null
          obligaciones_ruc: string | null
          contactos: string | null
          tiene_patente: boolean
          municipio_patente: string | null
          nro_patente: string | null
          presenta_balance: boolean
          fecha_presentacion_balance: string | null
          rubrica_libros: boolean
          correos_dnit: string | null
          representante_legal: string | null
          socios: string | null
          actividades_set: string | null
          nro_cuenta: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          razon_social: string
          ruc: string
          fecha_constitucion?: string | null
          personeria?: string | null
          contador_senior?: string | null
          contador_junior?: string | null
          asistente_contabilidad?: string | null
          administrador?: string | null
          laboralista?: string | null
          vencimiento_iva?: string | null
          vencimiento_ips?: string | null
          domicilio?: string | null
          tiene_patronal_ips?: boolean
          nro_patronal?: string | null
          ruc_mtess?: string | null
          nro_ci?: string | null
          contrasena?: string | null
          nro_patronal_mtess?: string | null
          contrasena_mtess?: string | null
          situacion?: string | null
          obligaciones_ruc?: string | null
          contactos?: string | null
          tiene_patente?: boolean
          municipio_patente?: string | null
          nro_patente?: string | null
          presenta_balance?: boolean
          fecha_presentacion_balance?: string | null
          rubrica_libros?: boolean
          correos_dnit?: string | null
          representante_legal?: string | null
          socios?: string | null
          actividades_set?: string | null
          nro_cuenta?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          razon_social?: string
          ruc?: string
          fecha_constitucion?: string | null
          personeria?: string | null
          contador_senior?: string | null
          contador_junior?: string | null
          asistente_contabilidad?: string | null
          administrador?: string | null
          laboralista?: string | null
          vencimiento_iva?: string | null
          vencimiento_ips?: string | null
          domicilio?: string | null
          tiene_patronal_ips?: boolean
          nro_patronal?: string | null
          ruc_mtess?: string | null
          nro_ci?: string | null
          contrasena?: string | null
          nro_patronal_mtess?: string | null
          contrasena_mtess?: string | null
          situacion?: string | null
          obligaciones_ruc?: string | null
          contactos?: string | null
          tiene_patente?: boolean
          municipio_patente?: string | null
          nro_patente?: string | null
          presenta_balance?: boolean
          fecha_presentacion_balance?: string | null
          rubrica_libros?: boolean
          correos_dnit?: string | null
          representante_legal?: string | null
          socios?: string | null
          actividades_set?: string | null
          nro_cuenta?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quotations: {
        Row: {
          id: string
          client_id: string
          tipo: string
          cotizacion: string
          ruc: string
          facturar_a: string
          cliente: string
          moneda: string
          importe: string
          producto_starsoft: string | null
          servicio: string
          mes_facturacion: string | null
          observaciones: string | null
          tipo_cobro: string
          area: string
          supervisor: string | null
          encargado: string | null
          inicio_facturacion: string | null
          ver_cotizacion: string | null
          funcionarios: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          tipo: string
          cotizacion: string
          ruc: string
          facturar_a: string
          cliente: string
          moneda: string
          importe: string
          producto_starsoft?: string | null
          servicio: string
          mes_facturacion?: string | null
          observaciones?: string | null
          tipo_cobro: string
          area: string
          supervisor?: string | null
          encargado?: string | null
          inicio_facturacion?: string | null
          ver_cotizacion?: string | null
          funcionarios?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          tipo?: string
          cotizacion?: string
          ruc?: string
          facturar_a?: string
          cliente?: string
          moneda?: string
          importe?: string
          producto_starsoft?: string | null
          servicio?: string
          mes_facturacion?: string | null
          observaciones?: string | null
          tipo_cobro?: string
          area?: string
          supervisor?: string | null
          encargado?: string | null
          inicio_facturacion?: string | null
          ver_cotizacion?: string | null
          funcionarios?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string
          lastname: string | null
          email: string | null
          telefono: string | null
          password: string
          role: 'Administrador' | 'Supervisor' | 'Contador Senior' | 'Contador Junior' | 'Encargado'
          client_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          lastname?: string | null
          email?: string | null
          telefono?: string | null
          password: string
          role: 'Administrador' | 'Supervisor' | 'Contador Senior' | 'Contador Junior' | 'Encargado'
          client_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          lastname?: string | null
          email?: string | null
          telefono?: string | null
          password?: string
          role?: 'Administrador' | 'Supervisor' | 'Contador Senior' | 'Contador Junior' | 'Encargado'
          client_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_clients: {
        Row: {
          user_id: string
          client_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          client_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          client_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
