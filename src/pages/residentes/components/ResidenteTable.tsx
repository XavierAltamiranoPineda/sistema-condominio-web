import { Edit2, Trash2, Loader2, AlertCircle } from 'lucide-react';
import type { Residente } from '../../../types/residente';
import { ResidenteStatusBadge } from './ResidenteStatusBadge';

interface Props {
  residentes: Residente[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onEdit: (residente: Residente) => void;
  onDelete: (id: number) => void;
}

export const ResidenteTable = ({ residentes, isLoading, isError, onEdit, onDelete }: Props) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Cargando residentes...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-4 bg-red-50 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-600 font-medium">Error al cargar residentes</p>
      </div>
    );
  }

  if (!residentes || residentes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-4 bg-slate-50 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium">No existen residentes registrados</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-semibold">
              <th className="py-4 px-6">ID</th>
              <th className="py-4 px-6">Nombres</th>
              <th className="py-4 px-6">Apellidos</th>
              <th className="py-4 px-6">Cédula</th>
              <th className="py-4 px-6">Teléfono</th>
              <th className="py-4 px-6">Estado</th>
              <th className="py-4 px-6">Registro</th>
              <th className="py-4 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {residentes.map((residente) => (
              <tr 
                key={residente.idResidente} 
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="py-4 px-6 text-sm text-slate-500 font-medium">#{residente.idResidente}</td>
                <td className="py-4 px-6 text-sm text-slate-800 font-medium">{residente.nombres}</td>
                <td className="py-4 px-6 text-sm text-slate-800 font-medium">{residente.apellidos}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{residente.cedula}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{residente.telefono}</td>
                <td className="py-4 px-6">
                  <ResidenteStatusBadge estado={residente.estado} />
                </td>
                <td className="py-4 px-6 text-sm text-slate-500">
                  {residente.createdAt ? new Date(residente.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(residente)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(residente.idResidente)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
