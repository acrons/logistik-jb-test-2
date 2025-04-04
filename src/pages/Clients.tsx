import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Eye, Edit, FileText, Search, Filter, Download } from 'lucide-react';
import { Client } from '../types';
import { exportToCSV, prepareClientsForExport } from '../utils/csvExport';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { useAuthStore } from '../store/authStore';

type ClientRow = Database['public']['Tables']['clients']['Row'];

const Clients: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  const fetchClients = async () => {
    try {
      if (user?.role === 'Administrador') {
        // Fetch all clients for admin users
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('razon_social', { ascending: true });

        if (error) throw error;
        setClients(data || []);
      } else {
        // Fetch only assigned clients for non-admin users
        const { data, error } = await supabase
          .from('user_clients')
          .select('clients(*)')
          .eq('user_id', user?.id);

        if (error) throw error;

        const clientsList = data
          .map(uc => uc.clients)
          .filter((client): client is ClientRow => client !== null);

        setClients(clientsList);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Error al cargar los clientes');
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    const clientsToExport = selectedClients.length > 0 
      ? clients.filter(client => selectedClients.includes(client.id))
      : clients;
    const exportData = prepareClientsForExport(clientsToExport);
    exportToCSV(exportData, 'clientes.csv');
  };

  const handleRowSelect = (id: string) => {
    setSelectedClients(prev => 
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleEditClient = async (clientId: string) => {
    try {
      navigate(`/clients/${clientId}`);
    } catch (err) {
      console.error('Error navigating to client:', err);
      setError('Error al abrir el cliente');
    }
  };

  const filteredClients = clients.filter(client =>
    client.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.ruc.includes(searchTerm)
  );

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
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleExportCSV}
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <Download className="w-5 h-5 mr-2" />
            Exportar CSV {selectedClients.length > 0 && `(${selectedClients.length})`}
          </button>
          {user?.role === 'Administrador' && (
            <button 
              onClick={() => navigate('/clients/new')}
              className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Crear Cliente
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                  <span className="sr-only">Seleccionar</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Razón Social</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RUC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contador Senior</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Situación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr 
                  key={client.id} 
                  className={`hover:bg-gray-50 ${
                    selectedClients.includes(client.id) ? 'bg-yellow-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client.id)}
                      onChange={() => handleRowSelect(client.id)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.razon_social}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.ruc}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.contador_senior}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {client.situacion || 'Sin Movimiento'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => navigate(`/quotations/${client.id}`)}
                        className="text-gray-400 hover:text-blue-600"
                        title="Ver cotizaciones"
                      >
                        <FileText className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleEditClient(client.id)}
                        className="text-gray-400 hover:text-yellow-600"
                        title="Editar cliente"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Clients;
