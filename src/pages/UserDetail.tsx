import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, Plus, X, Eye, EyeOff, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { useAuthStore } from '../store/authStore';

type UserRow = Database['public']['Tables']['users']['Row'];
type ClientRow = Database['public']['Tables']['clients']['Row'];

const emptyUser: Partial<UserRow> = {
  name: '',
  lastname: '',
  email: '',
  telefono: '',
  password: '',
  role: 'Contador Junior',
  client_count: 0
};

const UserDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNewUser = id === 'new';
  const currentUser = useAuthStore(state => state.user);
  
  const [user, setUser] = useState<Partial<UserRow>>(emptyUser);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [assignedClients, setAssignedClients] = useState<ClientRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const roles = [
    'Administrador',
    'Supervisor',
    'Contador Senior',
    'Contador Junior',
    'Encargado'
  ];

  useEffect(() => {
    if (!isNewUser && id) {
      fetchUserData(id);
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user details
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;
      setUser(userData);

      // Fetch assigned clients
      const { data: userClients, error: clientsError } = await supabase
        .from('user_clients')
        .select('clients(*)')
        .eq('user_id', userId);

      if (clientsError) throw clientsError;
      
      const assignedClientsList = userClients
        .map(uc => uc.clients)
        .filter((client): client is ClientRow => client !== null);
      
      setAssignedClients(assignedClientsList);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Error al cargar los datos del usuario');
      setIsLoading(false);
    }
  };

  const fetchAvailableClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('razon_social', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Error al cargar los clientes disponibles');
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      if (!user.name || !user.role || (!id && !user.password)) {
        setError('Por favor complete los campos requeridos');
        setIsSaving(false);
        return;
      }

      if (isNewUser) {
        // Create new user
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([user])
          .select()
          .single();

        if (createError) throw createError;

        // Assign clients if any
        if (assignedClients.length > 0 && newUser) {
          const clientAssignments = assignedClients.map(client => ({
            user_id: newUser.id,
            client_id: client.id
          }));

          const { error: assignError } = await supabase
            .from('user_clients')
            .insert(clientAssignments);

          if (assignError) throw assignError;
        }
      } else if (id) {
        // Update existing user
        const updateData = { ...user };
        if (!updateData.password) {
          delete updateData.password; // Don't update password if not changed
        }

        const { error: updateError } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', id);

        if (updateError) throw updateError;

        // Update client assignments
        const { error: deleteError } = await supabase
          .from('user_clients')
          .delete()
          .eq('user_id', id);

        if (deleteError) throw deleteError;

        if (assignedClients.length > 0) {
          const clientAssignments = assignedClients.map(client => ({
            user_id: id,
            client_id: client.id
          }));

          const { error: assignError } = await supabase
            .from('user_clients')
            .insert(clientAssignments);

          if (assignError) throw assignError;
        }
      }

      navigate('/settings');
    } catch (err) {
      console.error('Error saving user:', err);
      setError('Error al guardar los cambios');
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!id) return;

      const { error: deleteUserError } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (deleteUserError) throw deleteUserError;

      navigate('/settings');
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Error al eliminar el usuario');
    }
  };

  const handleAddClient = (client: ClientRow) => {
    if (!assignedClients.some(c => c.id === client.id)) {
      setAssignedClients(prev => [...prev, client]);
    }
    setShowClientSearch(false);
    setSearchTerm('');
  };

  const handleRemoveClient = (clientId: string) => {
    setAssignedClients(prev => prev.filter(c => c.id !== clientId));
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/settings')}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">{isNewUser ? 'Crear Usuario' : 'Detalles del Usuario'}</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={user.name || ''}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Apellido</label>
            <input
              type="text"
              value={user.lastname || ''}
              onChange={(e) => setUser({ ...user, lastname: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={user.email || ''}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Teléfono</label>
            <input
              type="text"
              value={user.telefono || ''}
              onChange={(e) => setUser({ ...user, telefono: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Contraseña {isNewUser && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={user.password || ''}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder={isNewUser ? '' : 'Dejar en blanco para mantener la actual'}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required={isNewUser}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Rol <span className="text-red-500">*</span>
            </label>
            <select
              value={user.role || 'Contador Junior'}
              onChange={(e) => setUser({ ...user, role: e.target.value as UserRow['role'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Clientes Asignados</h2>
            <button
              onClick={() => {
                fetchAvailableClients();
                setShowClientSearch(true);
              }}
              className="flex items-center px-4 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Asignar Cliente
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            {assignedClients.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay clientes asignados</p>
            ) : (
              <ul className="space-y-2">
                {assignedClients.map((client) => (
                  <li key={client.id} className="flex items-center justify-between text-sm text-gray-700 bg-white p-3 rounded-md">
                    <div>
                      <span className="font-medium">{client.razon_social}</span>
                      <span className="mx-2">•</span>
                      <span className="text-gray-500">{client.ruc}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveClient(client.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => navigate('/settings')}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancelar
          </button>
          {!isNewUser && currentUser?.role === 'Administrador' && id !== currentUser?.id && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 flex items-center"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Eliminar
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? 'Guardando...' : (isNewUser ? 'Crear Usuario' : 'Guardar Cambios')}
          </button>
        </div>
      </div>

      {/* Client Search Modal */}
      {showClientSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Buscar Cliente</h2>
              <button
                onClick={() => {
                  setShowClientSearch(false);
                  setSearchTerm('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o RUC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="overflow-y-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Razón Social</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RUC</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClients.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                          No se encontraron clientes
                        </td>
                      </tr>
                    ) : (
                      filteredClients.map((client) => (
                        <tr key={client.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.razon_social}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.ruc}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleAddClient(client)}
                              disabled={assignedClients.some(c => c.id === client.id)}
                              className={`text-sm font-medium ${
                                assignedClients.some(c => c.id === client.id)
                                  ? 'text-gray-400 cursor-not-allowed'
                                  : 'text-yellow-600 hover:text-yellow-700'
                              }`}
                            >
                              {assignedClients.some(c => c.id === client.id) ? 'Asignado' : 'Asignar'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar eliminación</h3>
              <p className="text-gray-500">
                ¿Está seguro que desea eliminar el usuario <span className="font-medium">{user.name} {user.lastname}</span>? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;
