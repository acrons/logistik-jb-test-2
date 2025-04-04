import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { useAuthStore } from '../store/authStore';

type QuotationRow = Database['public']['Tables']['quotations']['Row'];
type ClientRow = Database['public']['Tables']['clients']['Row'];

const emptyQuotation: Partial<QuotationRow> = {
  tipo: "Fiscal",
  cotizacion: "Vigente",
  ruc: "",
  facturar_a: "",
  cliente: "",
  moneda: "PYG",
  importe: "",
  producto_starsoft: "",
  servicio: "",
  mes_facturacion: "",
  observaciones: "",
  tipo_cobro: "Mensual Fijo",
  area: "Contabilidad",
  supervisor: "",
  encargado: "",
  inicio_facturacion: "",
  ver_cotizacion: "",
  funcionarios: ""
};

const QuotationDetail: React.FC = () => {
  const navigate = useNavigate();
  const { clientId, id } = useParams();
  const isNewQuote = !id;
  const user = useAuthStore(state => state.user);
  
  const [quotation, setQuotation] = useState<Partial<QuotationRow>>(emptyQuotation);
  const [client, setClient] = useState<ClientRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (clientId) {
      fetchData();
    }
  }, [clientId, id]);

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

      if (!isNewQuote && id) {
        // Fetch quotation details
        const { data: quotationData, error: quotationError } = await supabase
          .from('quotations')
          .select('*')
          .eq('id', id)
          .single();

        if (quotationError) throw quotationError;
        setQuotation(quotationData);
      } else {
        // For new quotations, pre-fill client information
        setQuotation({
          ...emptyQuotation,
          client_id: clientId,
          ruc: clientData.ruc,
          cliente: clientData.razon_social,
          facturar_a: clientData.razon_social
        });
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error al cargar los datos');
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      if (!quotation.cliente || !quotation.ruc || !quotation.servicio || !quotation.importe) {
        setError('Por favor complete los campos requeridos');
        setIsSaving(false);
        return;
      }

      if (isNewQuote) {
        const { error: createError } = await supabase
          .from('quotations')
          .insert([{ ...quotation, client_id: clientId }]);

        if (createError) throw createError;
      } else if (id) {
        const { error: updateError } = await supabase
          .from('quotations')
          .update(quotation)
          .eq('id', id);

        if (updateError) throw updateError;
      }

      navigate(`/quotations/${clientId}`);
    } catch (err) {
      console.error('Error saving quotation:', err);
      setError('Error al guardar los cambios');
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!id) return;

      const { error } = await supabase
        .from('quotations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      navigate(`/quotations/${clientId}`);
    } catch (err) {
      console.error('Error deleting quotation:', err);
      setError('Error al eliminar la cotización');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/quotations/${clientId}`)}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{isNewQuote ? 'Nueva Cotización' : 'Detalle de Cotización'}</h1>
            {client && (
              <div className="mt-1 text-gray-600">
                <span className="font-medium">{client.razon_social}</span>
                <span className="mx-2">•</span>
                <span>RUC: {client.ruc}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/quotations/${clientId}`)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancelar
          </button>
          {!isNewQuote && user?.role === 'Administrador' && (
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
            {isSaving ? 'Guardando...' : (isNewQuote ? 'Crear Cotización' : 'Guardar Cambios')}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500">Tipo</label>
            <select
              value={quotation.tipo}
              onChange={(e) => setQuotation({ ...quotation, tipo: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
            >
              <option value="Fiscal">Fiscal</option>
              <option value="No Fiscal">No Fiscal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Cotización</label>
            <select
              value={quotation.cotizacion}
              onChange={(e) => setQuotation({ ...quotation, cotizacion: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
            >
              <option value="Vigente">Vigente</option>
              <option value="No Vigente">No Vigente</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">RUC</label>
            <input
              type="text"
              value={quotation.ruc}
              onChange={(e) => setQuotation({ ...quotation, ruc: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Facturar a</label>
            <input
              type="text"
              value={quotation.facturar_a}
              onChange={(e) => setQuotation({ ...quotation, facturar_a: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Cliente</label>
            <input
              type="text"
              value={quotation.cliente}
              onChange={(e) => setQuotation({ ...quotation, cliente: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Moneda</label>
            <select
              value={quotation.moneda}
              onChange={(e) => setQuotation({ ...quotation, moneda: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
            >
              <option value="PYG">PYG</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Importe</label>
            <input
              type="text"
              value={quotation.importe}
              onChange={(e) => setQuotation({ ...quotation, importe: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Producto StarSoft</label>
            <input
              type="text"
              value={quotation.producto_starsoft || ''}
              onChange={(e) => setQuotation({ ...quotation, producto_starsoft: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Servicio</label>
            <input
              type="text"
              value={quotation.servicio}
              onChange={(e) => setQuotation({ ...quotation, servicio: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Mes a facturar</label>
            <input
              type="text"
              value={quotation.mes_facturacion || ''}
              onChange={(e) => setQuotation({ ...quotation, mes_facturacion: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Observaciones</label>
            <input
              type="text"
              value={quotation.observaciones || ''}
              onChange={(e) => setQuotation({ ...quotation, observaciones: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Tipo de Cobro</label>
            <select
              value={quotation.tipo_cobro}
              onChange={(e) => setQuotation({ ...quotation, tipo_cobro: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
            >
              <option value="Mensual Fijo">Mensual Fijo</option>
              <option value="Por Hora">Por Hora</option>
              <option value="Por Proyecto">Por Proyecto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Área</label>
            <select
              value={quotation.area}
              onChange={(e) => setQuotation({ ...quotation, area: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
            >
              <option value="Contabilidad">Contabilidad</option>
              <option value="Laboral">Laboral</option>
              <option value="Impuestos">Impuestos</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Supervisor</label>
            <input
              type="text"
              value={quotation.supervisor || ''}
              onChange={(e) => setQuotation({ ...quotation, supervisor: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Encargado</label>
            <input
              type="text"
              value={quotation.encargado || ''}
              onChange={(e) => setQuotation({ ...quotation, encargado: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Inicio Facturación</label>
            <input
              type="text"
              value={quotation.inicio_facturacion || ''}
              onChange={(e) => setQuotation({ ...quotation, inicio_facturacion: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Ver Cotización</label>
            <input
              type="text"
              value={quotation.ver_cotizacion || ''}
              onChange={(e) => setQuotation({ ...quotation, ver_cotizacion: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Funcionarios</label>
            <input
              type="text"
              value={quotation.funcionarios || ''}
              onChange={(e) => setQuotation({ ...quotation, funcionarios: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar eliminación</h3>
              <p className="text-gray-500">
                ¿Está seguro que desea eliminar esta cotización? Esta acción no se puede deshacer.
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

export default QuotationDetail;
