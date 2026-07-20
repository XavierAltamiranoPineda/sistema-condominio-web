import { AlertCircle, Loader2 } from 'lucide-react';
import type { Pago } from '../../../types/pago';
import { PagoStatusBadge } from './PagoStatusBadge';

interface Props {
  pagos: Pago[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const PagoTable = ({ pagos, isLoading, isError }: Props) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Cargando pagos...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-3 bg-red-50 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-600 font-medium">Error al cargar pagos</p>
      </div>
    );
  }

  if (!pagos || pagos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <p className="text-slate-500 font-medium">No existen pagos registrados</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID Pago</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Casa</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mes Cuota</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha Pago</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Monto</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pagos.map((pago) => (
              <tr key={pago.idPago} className="hover:bg-slate-50 transition-colors group">
                <td className="py-4 px-6 text-sm text-slate-500">#{pago.idPago}</td>
                <td className="py-4 px-6 text-sm text-slate-800 font-medium">{pago.codigoCasa}</td>
                <td className="py-4 px-6 text-sm text-slate-600">
                  {MESES[pago.mes - 1]} {pago.anio} (Cuota #{pago.idCuota})
                </td>
                <td className="py-4 px-6 text-sm text-slate-600">
                  {new Date(pago.fechaPago).toLocaleDateString('es-EC')}
                </td>
                <td className="py-4 px-6 text-sm text-emerald-600 font-medium">
                  ${pago.montoPagado.toFixed(2)}
                </td>
                <td className="py-4 px-6">
                  <PagoStatusBadge estado={pago.estado} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
