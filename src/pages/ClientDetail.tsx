import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Tab } from '@headlessui/react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { useAuthStore } from '../store/authStore';

type ClientRow = Database['public']['Tables']['clients']['Row'];

const emptyClient: Partial<ClientRow> = {
  razon_social: '',
  ruc: '',
  fecha_constitucion: null,
  personeria: null,
  contador_senior: null,
  contador_junior: null,
  asistente_contabilidad: null,
  administrador: null,
  laboralista: null,
  vencimiento_iva: null,
  vencimiento_ips: null,
  domicilio: null,
  tiene_patronal_ips: false,
  nro_patronal: null,
  ruc_mtess: null,
  nro_ci: null,
  contrasena: null,
  nro_patronal_mtess: null,
  contrasena_mtess: null,
  situacion: null,
  obligaciones_ruc: null,
  contactos: null,
  tiene_patente: false,
  municipio_patente: null,
  nro_patente: null,
  presenta_balance: false,
  fecha_presentacion_balance: null,
  rubrica_libros: false,
  correos_dnit: null,
  representante_legal: null,
  socios: null,
  actividades_set: null,
  nro_cuenta: null
};

const ClientDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNewClient = id === 'new';
  const user = useAuthStore(state => state.user);
  
  const [client, setClient] = useState<Partial<ClientRow>>(emptyClient);
  const [isLoading, setIsLoading] = useState(!isNewClient);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!isNewClient && id) {
      fetchClient(id);
    }
  }, [id]);

  const fetchClient = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (error) throw error;
      setClient(data || emptyClient);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching client:', err);
      setError('Error al cargar los datos del cliente');
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      if (!client.razon_social || !client.ruc) {
        setError('La Razón Social y el RUC son obligatorios');
        setIsSaving(false);
        return;
      }

      if (isNewClient) {
        const { data, error } = await supabase
          .from('clients')
          .insert([client])
          .select()
          .single();

        if (error) throw error;
        navigate('/clients');
      } else if (id) {
        const { error } = await supabase
          .from('clients')
          .update(client)
          .eq('id', id);

        if (error) throw error;
        navigate('/clients');
      }
    } catch (err) {
      console.error('Error saving client:', err);
      setError('Error al guardar los cambios');
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!id) return;

      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      navigate('/clients');
    } catch (err) {
      console.error('Error deleting client:', err);
      setError('Error al eliminar el cliente');
    }
  };

  const renderField = (
    label: string, 
    field: keyof ClientRow, 
    type: 'text' | 'checkbox' | 'date' = 'text'
  ) => (
    <div className="col-span-1">
      <label className="block text-sm font-medium text-gray-500">{label}</label>
      {type === 'checkbox' ? (
        <div className="mt-1">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={client[field] as boolean}
              onChange={e => setClient({ ...client, [field]: e.target.checked })}
              className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              {client[field] ? 'SI' : 'NO'}
            </span>
          </label>
        </div>
      ) : (
        <input
          type={type}
          value={client[field] || ''}
          onChange={e => setClient({ ...client, [field]: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 px-3 py-2"
        />
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  const tabs = [
    {
      name: 'Información General',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderField('Razón Social', 'razon_social')}
          {renderField('RUC', 'ruc')}
          {renderField('Fecha de Constitución', 'fecha_constitucion', 'date')}
          {renderField('Personería', 'personeria')}
          {renderField('Situación', 'situacion')}
          {renderField('Domicilio', 'domicilio')}
          {renderField('Contactos del Cliente', 'contactos')}
        </div>
      )
    },
    {
      name: 'Equipo',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderField('Contador Senior', 'contador_senior')}
          {renderField('Contador Junior', 'contador_junior')}
          {renderField('Asistente Contabilidad', 'asistente_contabilidad')}
          {renderField('Administrador a cargo', 'administrador')}
          {renderField('Laboralista a cargo', 'laboralista')}
        </div>
      )
    },
    {
      name: 'Vencimientos',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderField('Vencimiento de IVA', 'vencimiento_iva')}
          {renderField('Vencimiento de IPS', 'vencimiento_ips')}
          {renderField('Obligaciones ante el RUC', 'obligaciones_ruc')}
        </div>
      )
    },
    {
      name: 'IPS - MTESS',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderField('¿Cuenta con Nro. Patronal?', 'tiene_patronal_ips', 'checkbox')}
          {renderField('Nro. Patronal', 'nro_patronal')}
          {renderField('RUC', 'ruc_mtess')}
          {renderField('Nro. de CI', 'nro_ci')}
          {renderField('Contraseña', 'contrasena')}
          {renderField('Nro. Patronal MTESS', 'nro_patronal_mtess')}
          {renderField('Contraseña MTESS', 'contrasena_mtess')}
        </div>
      )
    },
    {
      name: 'Patente',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderField('¿Cuenta con Patente?', 'tiene_patente', 'checkbox')}
          {renderField('Municipio de la Patente', 'municipio_patente')}
          {renderField('N° de Patente', 'nro_patente')}
        </div>
      )
    },
    {
      name: 'Balance',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderField('Presentación de Balance', 'presenta_balance', 'checkbox')}
          {renderField('Fecha de Presentación', 'fecha_presentacion_balance', 'date')}
          {renderField('Rúbrica de Libros', 'rubrica_libros', 'checkbox')}
          {renderField('Correo DNIT', 'correos_dnit')}
        </div>
      )
    },
    {
      name: 'Legal y Bancaria',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderField('Representante Legal', 'representante_legal')}
          {renderField('Socios', 'socios')}
          {renderField('Actividades SET', 'actividades_set')}
          {renderField('Números de Cuenta', 'nro_cuenta')}
        </div>
      )
    }
  ];

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
          <h1 className="text-2xl font-bold">{isNewClient ? 'Crear Cliente' : 'Detalles del Cliente'}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/clients')}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancelar
          </button>
          {!isNewClient && user?.role === 'Administrador' && (
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
            {isSaving ? 'Guardando...' : (isNewClient ? 'Crear Cliente' : 'Guardar Cambios')}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <Tab.Group>
          <Tab.List className="flex space-x-1 border-b border-gray-200 px-6">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  `py-4 px-6 text-sm font-medium border-b-2 focus:outline-none ${
                    selected
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="p-6">
            {tabs.map((tab, idx) => (
              <Tab.Panel
                key={idx}
                className={`rounded-xl focus:outline-none`}
              >
                {tab.content}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar eliminación</h3>
              <p className="text-gray-500">
                ¿Está seguro que desea eliminar el cliente <span className="font-medium">{client.razon_social}</span>? Esta acción no se puede deshacer.
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

export default ClientDetail;
