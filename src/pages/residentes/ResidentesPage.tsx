import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useResidentes, useCrearResidente, useActualizarResidente, useEliminarResidente } from '../../hooks/useResidentes';
import type { Residente, ResidenteRequest } from '../../types/residente';
import { ResidenteTable } from './components/ResidenteTable';
import { ResidenteModal } from './components/ResidenteModal';
import { ResidenteForm } from './components/ResidenteForm';

export const ResidentesPage = () => {
  const { data: residentes, isLoading, isError } = useResidentes();
  const { mutateAsync: crearResidente, isPending: isCreating } = useCrearResidente();
  const { mutateAsync: actualizarResidente, isPending: isUpdating } = useActualizarResidente();
  const { mutateAsync: eliminarResidente } = useEliminarResidente();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [residenteEditando, setResidenteEditando] = useState<Residente | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const mostrarMensaje = (mensaje: string) => {
    setMensajeExito(mensaje);
    setTimeout(() => setMensajeExito(null), 4000);
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
        mostrarMensaje('Residente actualizado correctamente');
      } else {
        await crearResidente(data);
        mostrarMensaje('Residente registrado correctamente');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar residente', error);
      // Aquí se podría mostrar un mensaje de error detallado proveniente de la API
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este residente?')) {
      try {
        await eliminarResidente(id);
        mostrarMensaje('Residente eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar residente', error);
      }
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

      {mensajeExito && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-3 shadow-sm"></div>
          <span className="font-medium text-sm">{mensajeExito}</span>
        </div>
      )}

      <ResidenteTable 
        residentes={residentes} 
        isLoading={isLoading} 
        isError={isError} 
        onEdit={handleOpenEditar}
        onDelete={handleDelete}
      />

      <ResidenteModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={residenteEditando ? "Editar Residente" : "Nuevo Residente"}
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
