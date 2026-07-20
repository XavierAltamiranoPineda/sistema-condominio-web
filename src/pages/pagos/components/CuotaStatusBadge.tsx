import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface Props {
  montoPagado: number;
  saldoPendiente: number;
}

export const CuotaStatusBadge = ({ montoPagado, saldoPendiente }: Props) => {
  if (saldoPendiente === 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
        PAGADO
      </span>
    );
  }

  if (montoPagado > 0 && saldoPendiente > 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
        <Clock className="w-3.5 h-3.5 mr-1" />
        PARCIAL
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
      <AlertCircle className="w-3.5 h-3.5 mr-1" />
      PENDIENTE
    </span>
  );
};
