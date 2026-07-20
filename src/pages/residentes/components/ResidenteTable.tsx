import { Edit2, UserX, UserCheck, Loader2, AlertCircle } from 'lucide-react';
import type { Residente } from '../../../types/residente';
import { ResidenteStatusBadge } from './ResidenteStatusBadge';

interface Props {
  residentes: Residente[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onEdit: (residente: Residente) => void;
  /** Cambia estado a INACTIVO vía DELETE /api/residentes/{id} (soft-delete) */
  onDesactivar: (residente: Residente) => void;
  /** Cambia estado a ACTIVO vía PUT /api/residentes/{id} con estado=ACTIVO */
  onActivar: (residente: Residente) => void;
}

export const ResidenteTable = ({
  residentes,
  isLoading,
  isError,
  onEdit,
  onDesactivar,
  onActivar,
}: Props) => {
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
        <p className="text-slate-400 text-sm mt-1">Verifique su conexión e intente nuevamente.</p>
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
            {residentes.map((residente) => {
              const isActivo = residente.estado === 'ACTIVO';
              return (
                <tr
                  key={residente.idResidente}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="py-4 px-6 text-sm text-slate-500 font-medium">
                    #{residente.idResidente}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-800 font-medium">
                    {residente.nombres}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-800 font-medium">
                    {residente.apellidos}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{residente.cedula}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">{residente.telefono}</td>
                  <td className="py-4 px-6">
                    <ResidenteStatusBadge estado={residente.estado} />
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-500">
                    {residente.createdAt
                      ? new Date(residente.createdAt).toLocaleDateString('es-EC')
                      : 'N/A'}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Editar información — siempre disponible */}
                      <button
                        onClick={() => onEdit(residente)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar residente"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Desactivar — solo si está ACTIVO */}
                      {isActivo && (
                        <button
                          onClick={() => onDesactivar(residente)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Desactivar residente"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      )}

                      {/* Activar — solo si está INACTIVO */}
                      {!isActivo && (
                        <button
                          onClick={() => onActivar(residente)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Activar residente"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
        Los residentes no se eliminan físicamente. Use Desactivar (
        <UserX className="w-3 h-3 inline" />) para marcar como INACTIVO o Activar (
        <UserCheck className="w-3 h-3 inline" />) para reactivar.
      </div>
    </div>
  );
};
