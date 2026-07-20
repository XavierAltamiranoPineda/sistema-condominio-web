import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useResidencias, useCrearResidencia, useActualizarResidencia, useEliminarResidencia } from '../../hooks/useResidencias';
import type { Residencia, ResidenciaRequest } from '../../types/residencia';
import { ResidenciaTable } from './components/ResidenciaTable';
import { ResidenciaModal } from './components/ResidenciaModal';
import { ResidenciaForm } from './components/ResidenciaForm';

export const ResidenciasPage = () => {
  const { data: residencias, isLoading, isError } = useResidencias();
  const { mutateAsync: crearResidencia, isPending: isCreating } = useCrearResidencia();
  const { mutateAsync: actualizarResidencia, isPending: isUpdating } = useActualizarResidencia();
  const { mutateAsync: eliminarResidencia } = useEliminarResidencia();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [residenciaEditando, setResidenciaEditando] = useState<Residencia | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const mostrarMensaje = (mensaje: string) => {
    setMensajeExito(mensaje);
    setTimeout(() => setMensajeExito(null), 4000);
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
        mostrarMensaje('Casa actualizada correctamente');
      } else {
        await crearResidencia(data);
        mostrarMensaje('Casa registrada correctamente');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar residencia:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta residencia?')) {
      try {
        await eliminarResidencia(id);
        mostrarMensaje('Casa eliminada correctamente');
      } catch (error) {
        console.error('Error al eliminar residencia:', error);
      }
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
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center shadow-sm">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-3 flex-shrink-0" />
          <span className="font-medium text-sm">{mensajeExito}</span>
        </div>
      )}

      {/* Tabla */}
      <ResidenciaTable
        residencias={residencias}
        isLoading={isLoading}
        isError={isError}
        onEdit={handleOpenEditar}
        onDelete={handleDelete}
      />

      {/* Modal */}
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
