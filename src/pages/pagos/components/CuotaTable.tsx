import { AlertCircle, Loader2 } from 'lucide-react';
import type { Cuota } from '../../../types/cuota';
import { CuotaStatusBadge } from './CuotaStatusBadge';

interface Props {
  cuotas: Cuota[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onPagar?: (cuota: Cuota) => void;
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const CuotaTable = ({ cuotas, isLoading, isError, onPagar }: Props) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Cargando cuotas...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-3 bg-red-50 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-600 font-medium">Error al cargar cuotas</p>
      </div>
    );
  }

  if (!cuotas || cuotas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <p className="text-slate-500 font-medium">No existen cuotas registradas</p>
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
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Casa</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mes/Año</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Valor</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pagado</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pendiente</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
              {onPagar && (
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cuotas.map((cuota) => (
              <tr key={cuota.idCuota} className="hover:bg-slate-50 transition-colors group">
                <td className="py-4 px-6 text-sm text-slate-500">#{cuota.idCuota}</td>
                <td className="py-4 px-6 text-sm text-slate-800 font-medium">{cuota.codigoCasa}</td>
                <td className="py-4 px-6 text-sm text-slate-600">
                  {MESES[cuota.mes - 1]} {cuota.anio}
                </td>
                <td className="py-4 px-6 text-sm text-slate-800 font-medium">
                  ${cuota.valor.toFixed(2)}
                </td>
                <td className="py-4 px-6 text-sm text-emerald-600 font-medium">
                  ${cuota.montoPagado.toFixed(2)}
                </td>
                <td className="py-4 px-6 text-sm text-amber-600 font-medium">
                  ${cuota.saldoPendiente.toFixed(2)}
                </td>
                <td className="py-4 px-6">
                  <CuotaStatusBadge montoPagado={cuota.montoPagado} saldoPendiente={cuota.saldoPendiente} />
                </td>
                {onPagar && (
                  <td className="py-4 px-6 text-right">
                    {cuota.saldoPendiente > 0 && (
                      <button
                        onClick={() => onPagar(cuota)}
                        className="opacity-0 group-hover:opacity-100 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all"
                      >
                        Registrar Pago
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
