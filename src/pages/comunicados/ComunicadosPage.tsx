import { useState } from 'react';
import { Megaphone, Plus } from 'lucide-react';
import { useComunicados, useCrearComunicado } from '../../hooks/useComunicados';
import { ComunicadoTable } from './components/ComunicadoTable';
import { ComunicadoForm } from './components/ComunicadoForm';
import { Modal } from '../pagos/components/Modal'; // Reutilizamos el modal
import type { ComunicadoRequest } from '../../types/comunicado';

const extraerMensajeError = (error: unknown): string => {
  const axiosErr = error as { response?: { data?: { message?: string }; status?: number } };
  const status = axiosErr?.response?.status;
  const apiMsg = axiosErr?.response?.data?.message;

  if (apiMsg) return apiMsg;
  if (status === 400) return 'Datos inválidos. Verifique la información ingresada.';
  if (status === 404) return 'Recurso no encontrado.';
  if (status === 409) return 'Conflicto: ya existe un registro similar.';
  if (status === 500) return 'Error interno del servidor.';
  return 'No se pudo completar la operación.';
};

export const ComunicadosPage = () => {
  const { data: comunicados, isLoading, isError } = useComunicados();
  const { mutateAsync: crearComunicado, isPending: isCreando } = useCrearComunicado();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const mostrarExito = (msj: string) => {
    setMensajeExito(msj);
    setMensajeError(null);
    setTimeout(() => setMensajeExito(null), 5000);
  };

  const mostrarError = (msj: string) => {
    setMensajeError(msj);
    setMensajeExito(null);
    setTimeout(() => setMensajeError(null), 5000);
  };

  const handleCrearComunicado = async (data: ComunicadoRequest) => {
    try {
      await crearComunicado(data);
      setIsModalOpen(false);
      mostrarExito('Comunicado enviado correctamente');
    } catch (error) {
      mostrarError(extraerMensajeError(error));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Gestión de Comunicados</h1>
            <p className="text-slate-500 text-sm mt-1">
              Emisión de avisos y notificaciones a los residentes
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Comunicado
        </button>
      </div>

      {/* Alertas */}
      {mensajeExito && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center shadow-sm animate-in fade-in">
          <span className="font-medium text-sm">{mensajeExito}</span>
        </div>
      )}
      {mensajeError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center shadow-sm animate-in fade-in">
          <span className="font-medium text-sm">{mensajeError}</span>
        </div>
      )}

      {/* Tabla de Comunicados */}
      <ComunicadoTable 
        comunicados={comunicados} 
        isLoading={isLoading} 
        isError={isError} 
      />

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Redactar Comunicado"
      >
        <ComunicadoForm 
          onSubmit={handleCrearComunicado}
          isLoading={isCreando}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
