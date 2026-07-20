import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  useResidencias,
  useCrearResidencia,
  useActualizarResidencia,
  useCambiarEstadoResidencia,
} from '../../hooks/useResidencias';
import type { Residencia, ResidenciaRequest } from '../../types/residencia';
import { ResidenciaTable } from './components/ResidenciaTable';
import { ResidenciaModal } from './components/ResidenciaModal';
import { ResidenciaForm } from './components/ResidenciaForm';

/** Extrae el mensaje de error de la respuesta Axios / Error genérico */
const extraerMensajeError = (error: unknown): string => {
  const axiosErr = error as { response?: { data?: { message?: string }; status?: number } };
  const status = axiosErr?.response?.status;
  const apiMsg = axiosErr?.response?.data?.message;

  if (apiMsg) return apiMsg;
  if (status === 400) return 'Datos inválidos. Verifique la información ingresada.';
  if (status === 404) return 'Residencia no encontrada.';
  if (status === 405) return 'Operación no permitida.';
  if (status === 500) return 'Error interno del servidor. Intente nuevamente.';
  return 'No se pudo completar la operación. Intente nuevamente.';
};

export const ResidenciasPage = () => {
  const { data: residencias, isLoading, isError } = useResidencias();
  const { mutateAsync: crearResidencia, isPending: isCreating } = useCrearResidencia();
  const { mutateAsync: actualizarResidencia, isPending: isUpdating } = useActualizarResidencia();
  const { mutateAsync: cambiarEstado } = useCambiarEstadoResidencia();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [residenciaEditando, setResidenciaEditando] = useState<Residencia | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const mostrarMensaje = (mensaje: string) => {
    setMensajeExito(mensaje);
    setMensajeError(null);
    setTimeout(() => setMensajeExito(null), 4000);
  };

  const mostrarError = (mensaje: string) => {
    setMensajeError(mensaje);
    setMensajeExito(null);
    setTimeout(() => setMensajeError(null), 6000);
  };

  const handleOpenCrear = () => {
    setResidenciaEditando(null);
    setIsModalOpen(true);
  };

  const handleOpenEditar = (residencia: Residencia) => {
    setResidenciaEditando(residencia);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setResidenciaEditando(null);
  };

  const handleSubmit = async (data: ResidenciaRequest) => {
    try {
      if (residenciaEditando) {
        await actualizarResidencia({ id: residenciaEditando.idResidencia, data });
        mostrarMensaje('Residencia actualizada correctamente.');
      } else {
        await crearResidencia(data);
        mostrarMensaje('Residencia registrada correctamente.');
      }
      handleCloseModal();
    } catch (error) {
      mostrarError(extraerMensajeError(error));
    }
  };

  /**
   * Alterna el estado de una residencia: OCUPADA ↔ DESOCUPADA.
   * Utiliza PUT /api/residencias/{id} con el nuevo estado.
   */
  const handleToggleEstado = async (residencia: Residencia) => {
    const nuevoEstado = residencia.estado === 'OCUPADA' ? 'DESOCUPADA' : 'OCUPADA';
    const etiqueta = nuevoEstado === 'OCUPADA' ? 'activar (OCUPADA)' : 'desactivar (DESOCUPADA)';

    const confirma = window.confirm(
      `¿Está seguro de cambiar el estado de la casa "${residencia.codigoCasa}" a ${nuevoEstado}?`
    );
    if (!confirma) return;

    try {
      await cambiarEstado({
        id: residencia.idResidencia,
        data: {
          codigoCasa: residencia.codigoCasa,
          idPropietario: residencia.idPropietario,
          cuotaMensual: residencia.cuotaMensual,
          estado: nuevoEstado,
        },
      });

      if (nuevoEstado === 'OCUPADA') {
        mostrarMensaje(`Residencia ${residencia.codigoCasa} activada correctamente.`);
      } else {
        mostrarMensaje(`Residencia ${residencia.codigoCasa} desactivada correctamente.`);
      }
    } catch (error) {
      // Suppress the linter warning — etiqueta is used for the error context
      void etiqueta;
      mostrarError(extraerMensajeError(error));
    }
  };

  const isSaving = isCreating || isUpdating;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Administración de Residencias</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Gestione las casas y unidades del condominio.
          </p>
        </div>
        <button
          onClick={handleOpenCrear}
          className="flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Casa
        </button>
      </div>

      {/* Mensaje de éxito */}
      {mensajeExito && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-3 flex-shrink-0" />
          <span className="font-medium text-sm">{mensajeExito}</span>
        </div>
      )}

      {/* Mensaje de error */}
      {mensajeError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start shadow-sm">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full mr-3 flex-shrink-0 mt-0.5" />
          <span className="font-medium text-sm">{mensajeError}</span>
        </div>
      )}

      {/* Tabla */}
      <ResidenciaTable
        residencias={residencias}
        isLoading={isLoading}
        isError={isError}
        onEdit={handleOpenEditar}
        onToggleEstado={handleToggleEstado}
      />

      {/* Modal crear / editar */}
      <ResidenciaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={residenciaEditando ? 'Editar Casa' : 'Nueva Casa'}
      >
        <ResidenciaForm
          initialData={residenciaEditando}
          onSubmit={handleSubmit}
          isLoading={isSaving}
          onCancel={handleCloseModal}
        />
      </ResidenciaModal>
    </div>
  );
};
