import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface Props {
  estado: string;
}

export const PagoStatusBadge = ({ estado }: Props) => {
  switch (estado) {
    case 'COMPLETO':
      return (
        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
          COMPLETO
        </span>
      );
    case 'PARCIAL':
      return (
        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
          <Clock className="w-3.5 h-3.5 mr-1" />
          PARCIAL
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 rounded-full">
          <AlertCircle className="w-3.5 h-3.5 mr-1" />
          {estado}
        </span>
      );
  }
};
