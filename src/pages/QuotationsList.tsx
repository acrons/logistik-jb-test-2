import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, Download, FileText, Search, PlusCircle } from 'lucide-react';
import { exportToCSV, prepareQuotationsForExport } from '../utils/csvExport';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { useAuthStore } from '../store/authStore';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

type QuotationRow = Database['public']['Tables']['quotations']['Row'];
type ClientRow = Database['public']['Tables']['clients']['Row'];

const QuotationsList: React.FC = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const user = useAuthStore(state => state.user);
  
  const [quotations, setQuotations] = useState<QuotationRow[]>([]);
  const [client, setClient] = useState<ClientRow | null>(null);
  const [selectedQuotations, setSelectedQuotations] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clientId) {
      fetchData();
    }
  }, [clientId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch client details
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (clientError) throw clientError;
      setClient(clientData);

      // Fetch quotations for this client
      const { data: quotationsData, error: quotationsError } = await supabase
        .from('quotations')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (quotationsError) throw quotationsError;
      setQuotations(quotationsData || []);

      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error al cargar los datos');
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    const quotationsToExport = selectedQuotations.length > 0
      ? quotations.filter(quote => selectedQuotations.includes(quote.id))
      : quotations;
    const exportData = prepareQuotationsForExport(quotationsToExport);
    exportToCSV(exportData, 'cotizaciones.csv');
  };

  const handleRowSelect = (id: string) => {
    setSelectedQuotations(prev => 
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleInvoice = () => {
    // Handle invoice generation for selected quotations
    console.log('Generating invoices for:', selectedQuotations);
  };

  const filteredQuotations = quotations.filter(quote =>
    quote.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.ruc.includes(searchTerm) ||
    quote.servicio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Prepare data for area distribution chart
  const areaData = quotations.reduce((acc, quote) => {
    acc[quote.area] = (acc[quote.area] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = {
    labels: Object.keys(areaData),
    datasets: [
      {
        data: Object.values(areaData),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for amounts by area chart
  const amountsByArea = quotations.reduce((acc, quote) => {
    const amount = parseFloat(quote.importe.replace(/,/g, ''));
    acc[quote.area] = (acc[quote.area] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const barChartData = {
    labels: Object.keys(amountsByArea),
    datasets: [
      {
        label: 'Importe por Área',
        data: Object.values(amountsByArea),
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Calculate total amount
  const totalAmount = quotations.reduce((total, quote) => {
    return total + parseFloat(quote.importe.replace(/,/g, ''));
  }, 0);

  const totalBarChartData = {
    labels: ['Importe Total'],
    datasets: [
      {
        label: 'Total',
        data: [totalAmount],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/clients')}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Cotizaciones</h1>
            {client && (
              <div className="mt-1 text-gray-600">
                <span className="font-medium">{client.razon_social}</span>
                <span className="mx-2">•</span>
                <span>RUC: {client.ruc}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar cotización..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <button 
            onClick={handleExportCSV}
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <Download className="w-5 h-5 mr-2" />
            Exportar CSV {selectedQuotations.length > 0 && `(${selectedQuotations.length})`}
          </button>
          <button 
            onClick={() => navigate(`/quotations/${clientId}/new`)}
            className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Nueva Cotización
          </button>
          <button 
            onClick={handleInvoice}
            disabled={selectedQuotations.length === 0}
            className={`flex items-center px-4 py-2 rounded-lg ${
              selectedQuotations.length > 0
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FileText className="w-5 h-5 mr-2" />
            Facturar
          </button>
        </div>
      </div>

      {quotations.length > 0 ? (
        <>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Distribución por Área</h3>
              <div className="h-64">
                <Pie data={pieChartData} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Importes por Área</h3>
              <div className="h-64">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Importe Total</h3>
              <div className="h-64">
                <Bar data={totalBarChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                      <span className="sr-only">Seleccionar</span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cotización</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Importe</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredQuotations.map((quote) => (
                    <tr 
                      key={quote.id} 
                      className={`hover:bg-gray-50 ${
                        selectedQuotations.includes(quote.id) ? 'bg-yellow-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedQuotations.includes(quote.id)}
                          onChange={() => handleRowSelect(quote.id)}
                          className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{quote.tipo}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{quote.cotizacion}</td>
                      <td className="px-6 py-4">{quote.servicio}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{quote.moneda} {quote.importe}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{quote.area}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => navigate(`/quotations/${clientId}/${quote.id}`)}
                          className="text-gray-400 hover:text-yellow-600"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No hay cotizaciones para mostrar</p>
          <button 
            onClick={() => navigate(`/quotations/${clientId}/new`)}
            className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Crear Primera Cotización
          </button>
        </div>
      )}
    </div>
  );
};

export default QuotationsList;
