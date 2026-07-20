import { AlertCircle, Loader2 } from 'lucide-react';
import type { Comunicado } from '../../../types/comunicado';
import { ComunicadoStatusBadge } from './ComunicadoStatusBadge';
import { PrioridadBadge } from './PrioridadBadge';

interface Props {
  comunicados: Comunicado[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const ComunicadoTable = ({ comunicados, isLoading, isError }: Props) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Cargando comunicados...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-3 bg-red-50 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-600 font-medium">Error al cargar comunicados</p>
      </div>
    );
  }

  if (!comunicados || comunicados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <p className="text-slate-500 font-medium">No existen comunicados registrados</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Título</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mensaje</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Prioridad</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha Creación</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vencimiento</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {comunicados.map((comunicado) => (
              <tr key={comunicado.idComunicado} className="hover:bg-slate-50 transition-colors group">
                <td className="py-4 px-6 text-sm text-slate-500">#{comunicado.idComunicado}</td>
                <td className="py-4 px-6 text-sm text-slate-800 font-medium">{comunicado.titulo}</td>
                <td className="py-4 px-6 text-sm text-slate-600 truncate max-w-xs" title={comunicado.mensaje}>
                  {comunicado.mensaje.length > 50 ? `${comunicado.mensaje.substring(0, 50)}...` : comunicado.mensaje}
                </td>
                <td className="py-4 px-6">
                  <PrioridadBadge prioridad={comunicado.prioridad} />
                </td>
                <td className="py-4 px-6 text-sm text-slate-600">
                  {new Date(comunicado.createdAt).toLocaleDateString('es-EC')}
                </td>
                <td className="py-4 px-6 text-sm text-slate-600">
                  {comunicado.fechaVencimiento ? new Date(comunicado.fechaVencimiento).toLocaleDateString('es-EC') : 'Sin vencimiento'}
                </td>
                <td className="py-4 px-6">
                  <ComunicadoStatusBadge fechaVencimiento={comunicado.fechaVencimiento} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
