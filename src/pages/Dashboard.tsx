import React, { useState, useEffect } from 'react';
import { Users, FileText, UserCircle } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { useLocation } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

type ClientRow = Database['public']['Tables']['clients']['Row'];
type UserRow = Database['public']['Tables']['users']['Row'];

const Dashboard: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const viewType = searchParams.get('type');

  const [totalClients, setTotalClients] = useState(0);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [seniorUsers, setSeniorUsers] = useState<UserRow[]>([]);
  const [juniorUsers, setJuniorUsers] = useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      if (user?.role === 'Administrador') {
        // Fetch total clients count
        const { count: clientsCount, error: countError } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true });

        if (countError) throw countError;
        setTotalClients(clientsCount || 0);

        // Fetch all users and their client counts
        const { data: seniorData, error: seniorError } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'Contador Senior');

        const { data: juniorData, error: juniorError } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'Contador Junior');

        if (seniorError) throw seniorError;
        if (juniorError) throw juniorError;

        setSeniorUsers(seniorData || []);
        setJuniorUsers(juniorData || []);
      } else {
        // Fetch only assigned clients for non-admin users
        const { data: userClients, error: clientsError } = await supabase
          .from('user_clients')
          .select('clients(*)')
          .eq('user_id', user?.id);

        if (clientsError) throw clientsError;

        const clientsList = userClients
          .map(uc => uc.clients)
          .filter((client): client is ClientRow => client !== null);

        setClients(clientsList);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Error al cargar los datos del dashboard');
      setIsLoading(false);
    }
  };

  const stats = user?.role === 'Administrador' 
    ? viewType === 'senior'
      ? [
          { 
            title: 'Total Contadores Senior', 
            value: seniorUsers.length, 
            icon: UserCircle, 
            color: 'bg-purple-100 text-purple-600' 
          },
          { 
            title: 'Total Clientes Asignados', 
            value: seniorUsers.reduce((acc, user) => acc + (user.client_count || 0), 0),
            icon: Users, 
            color: 'bg-blue-100 text-blue-600' 
          },
          { 
            title: 'Promedio Clientes/Senior', 
            value: seniorUsers.length 
              ? Math.round(seniorUsers.reduce((acc, user) => acc + (user.client_count || 0), 0) / seniorUsers.length)
              : 0, 
            icon: FileText, 
            color: 'bg-green-100 text-green-600' 
          },
        ]
      : viewType === 'junior'
        ? [
            { 
              title: 'Total Contadores Junior', 
              value: juniorUsers.length, 
              icon: UserCircle, 
              color: 'bg-purple-100 text-purple-600' 
            },
            { 
              title: 'Total Clientes Asignados', 
              value: juniorUsers.reduce((acc, user) => acc + (user.client_count || 0), 0),
              icon: Users, 
              color: 'bg-blue-100 text-blue-600' 
            },
            { 
              title: 'Promedio Clientes/Junior', 
              value: juniorUsers.length 
                ? Math.round(juniorUsers.reduce((acc, user) => acc + (user.client_count || 0), 0) / juniorUsers.length)
                : 0, 
              icon: FileText, 
              color: 'bg-green-100 text-green-600' 
            },
          ]
        : [
            { 
              title: 'Total Clientes', 
              value: totalClients, 
              icon: Users, 
              color: 'bg-blue-100 text-blue-600' 
            },
            { 
              title: 'Contadores Senior', 
              value: seniorUsers.length, 
              icon: UserCircle, 
              color: 'bg-purple-100 text-purple-600' 
            },
            { 
              title: 'Contadores Junior', 
              value: juniorUsers.length, 
              icon: UserCircle, 
              color: 'bg-green-100 text-green-600' 
            },
          ]
    : [
        { 
          title: 'Mis Clientes', 
          value: clients.length, 
          icon: Users, 
          color: 'bg-blue-100 text-blue-600' 
        },
        { 
          title: 'Rol', 
          value: user?.role || '-', 
          icon: UserCircle, 
          color: 'bg-purple-100 text-purple-600' 
        },
      ];

  const pieChartData = {
    labels: ['Contadores Senior', 'Contadores Junior'],
    datasets: [
      {
        data: [seniorUsers.length, juniorUsers.length],
        backgroundColor: [
          'rgba(255, 159, 64, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Distribución de Contadores',
        font: {
          size: 16,
        },
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {user?.role === 'Administrador' && viewType === 'senior' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Listado de Contadores Senior</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clientes Asignados</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {seniorUsers.map((seniorUser) => (
                    <tr key={seniorUser.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {seniorUser.name} {seniorUser.lastname}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {seniorUser.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {seniorUser.telefono || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {seniorUser.client_count || 0} clientes
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'Administrador' && viewType === 'junior' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Listado de Contadores Junior</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clientes Asignados</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {juniorUsers.map((juniorUser) => (
                    <tr key={juniorUser.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {juniorUser.name} {juniorUser.lastname}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {juniorUser.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {juniorUser.telefono || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {juniorUser.client_count || 0} clientes
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'Administrador' && !viewType && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="h-96">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
      )}

      {user?.role !== 'Administrador' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Mis Clientes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Razón Social</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RUC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Situación</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.razon_social}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.ruc}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {client.situacion || 'Sin Movimiento'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
