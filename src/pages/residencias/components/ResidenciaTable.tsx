import { Edit2, Trash2, Loader2, AlertCircle } from 'lucide-react';
import type { Residencia } from '../../../types/residencia';
import { ResidenciaStatusBadge } from './ResidenciaStatusBadge';

interface Props {
  residencias: Residencia[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onEdit: (residencia: Residencia) => void;
  onDelete: (id: number) => void;
}

export const ResidenciaTable = ({ residencias, isLoading, isError, onEdit, onDelete }: Props) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Cargando residencias...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-4 bg-red-50 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-600 font-medium">Error al cargar residencias</p>
      </div>
    );
  }

  if (!residencias || residencias.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-4 bg-slate-50 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium">No existen casas registradas</p>
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
              <th className="py-4 px-6">Código Casa</th>
              <th className="py-4 px-6">ID Propietario</th>
              <th className="py-4 px-6">Cuota Mensual</th>
              <th className="py-4 px-6">Estado</th>
              <th className="py-4 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {residencias.map((residencia) => (
              <tr
                key={residencia.idResidencia}
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="py-4 px-6 text-sm text-slate-500 font-medium">
                  #{residencia.idResidencia}
                </td>
                <td className="py-4 px-6 text-sm text-slate-800 font-semibold">
                  {residencia.codigoCasa}
                </td>
                <td className="py-4 px-6 text-sm text-slate-600">
                  #{residencia.idPropietario}
                </td>
                <td className="py-4 px-6 text-sm text-slate-800 font-medium">
                  ${residencia.cuotaMensual.toFixed(2)}
                </td>
                <td className="py-4 px-6">
                  <ResidenciaStatusBadge estado={residencia.estado} />
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(residencia)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(residencia.idResidencia)}
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
