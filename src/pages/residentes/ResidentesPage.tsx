import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  useResidentes,
  useCrearResidente,
  useActualizarResidente,
  useDesactivarResidente,
} from '../../hooks/useResidentes';
import type { Residente, ResidenteRequest } from '../../types/residente';
import { ResidenteTable } from './components/ResidenteTable';
import { ResidenteModal } from './components/ResidenteModal';
import { ResidenteForm } from './components/ResidenteForm';

/** Extrae el mensaje de error de la respuesta Axios / Error genérico */
const extraerMensajeError = (error: unknown): string => {
  const axiosErr = error as { response?: { data?: { message?: string }; status?: number } };
  const status = axiosErr?.response?.status;
  const apiMsg = axiosErr?.response?.data?.message;

  if (apiMsg) return apiMsg;
  if (status === 400) return 'Datos inválidos. Verifique la información ingresada.';
  if (status === 404) return 'Residente no encontrado.';
  if (status === 405) return 'Operación no permitida.';
  if (status === 500) return 'Error interno del servidor. Intente nuevamente.';
  return 'No se pudo completar la operación. Intente nuevamente.';
};

export const ResidentesPage = () => {
  const { data: residentes, isLoading, isError } = useResidentes();
  const { mutateAsync: crearResidente, isPending: isCreating } = useCrearResidente();
  const { mutateAsync: actualizarResidente, isPending: isUpdating } = useActualizarResidente();
  const { mutateAsync: desactivarResidente } = useDesactivarResidente();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [residenteEditando, setResidenteEditando] = useState<Residente | null>(null);
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
    setResidenteEditando(null);
    setIsModalOpen(true);
  };

  const handleOpenEditar = (residente: Residente) => {
    setResidenteEditando(residente);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setResidenteEditando(null);
  };

  const handleSubmit = async (data: ResidenteRequest) => {
    try {
      if (residenteEditando) {
        await actualizarResidente({ id: residenteEditando.idResidente, data });
        mostrarMensaje('Residente actualizado correctamente.');
      } else {
        await crearResidente(data);
        mostrarMensaje('Residente registrado correctamente.');
      }
      handleCloseModal();
    } catch (error) {
      mostrarError(extraerMensajeError(error));
    }
  };

  /**
   * Desactiva un residente (soft-delete → estado INACTIVO).
   * Usa DELETE /api/residentes/{id} que internamente cambia el estado.
   */
  const handleDesactivar = async (residente: Residente) => {
    const confirma = window.confirm(
      `¿Está seguro de desactivar al residente "${residente.nombres} ${residente.apellidos}"?\n\nEl residente quedará en estado INACTIVO y no podrá acceder al sistema.`
    );
    if (!confirma) return;

    try {
      await desactivarResidente(residente.idResidente);
      mostrarMensaje('Residente desactivado correctamente.');
    } catch (error) {
      mostrarError(extraerMensajeError(error));
    }
  };

  /**
   * Activa un residente enviando PUT con estado=ACTIVO.
   */
  const handleActivar = async (residente: Residente) => {
    const confirma = window.confirm(
      `¿Está seguro de activar al residente "${residente.nombres} ${residente.apellidos}"?`
    );
    if (!confirma) return;

    try {
      await actualizarResidente({
        id: residente.idResidente,
        data: {
          nombres: residente.nombres,
          apellidos: residente.apellidos,
          cedula: residente.cedula,
          telefono: residente.telefono,
          estado: 'ACTIVO',
        },
      });
      mostrarMensaje('Residente activado correctamente.');
    } catch (error) {
      mostrarError(extraerMensajeError(error));
    }
  };

  const isSaving = isCreating || isUpdating;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Administración de Residentes</h1>
          <p className="text-slate-500 mt-1 text-sm">Gestione la información de los residentes del condominio.</p>
        </div>
        <button
          onClick={handleOpenCrear}
          className="flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Residente
        </button>
      </div>

      {/* Mensaje de éxito */}
      {mensajeExito && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-3 shadow-sm flex-shrink-0"></div>
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

      <ResidenteTable
        residentes={residentes}
        isLoading={isLoading}
        isError={isError}
        onEdit={handleOpenEditar}
        onDesactivar={handleDesactivar}
        onActivar={handleActivar}
      />

      <ResidenteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={residenteEditando ? 'Editar Residente' : 'Nuevo Residente'}
      >
        <ResidenteForm
          initialData={residenteEditando}
          onSubmit={handleSubmit}
          isLoading={isSaving}
          onCancel={handleCloseModal}
        />
      </ResidenteModal>
    </div>
  );
};
