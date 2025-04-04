import Papa from 'papaparse';
import { Database } from '../types/database';

type ClientRow = Database['public']['Tables']['clients']['Row'];
type QuotationRow = Database['public']['Tables']['quotations']['Row'];

export const exportToCSV = (data: any[], filename: string) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const prepareClientsForExport = (clients: ClientRow[]) => {
  return clients.map(client => ({
    'Razón Social': client.razon_social,
    'RUC': client.ruc,
    'Fecha de Constitución': client.fecha_constitucion,
    'Personería': client.personeria,
    'Contador Senior': client.contador_senior,
    'Contador Junior': client.contador_junior,
    'Situación': client.situacion,
    'Contactos': client.contactos
  }));
};

export const prepareQuotationsForExport = (quotes: QuotationRow[]) => {
  return quotes.map(quote => ({
    'Tipo': quote.tipo,
    'Cotización': quote.cotizacion,
    'RUC': quote.ruc,
    'Cliente': quote.cliente,
    'Servicio': quote.servicio,
    'Moneda': quote.moneda,
    'Importe': quote.importe,
    'Área': quote.area,
    'Supervisor': quote.supervisor
  }));
};
