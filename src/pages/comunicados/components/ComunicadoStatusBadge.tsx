import { CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  fechaVencimiento?: string;
}

export const ComunicadoStatusBadge = ({ fechaVencimiento }: Props) => {
  const isVencido = fechaVencimiento ? new Date(fechaVencimiento) < new Date() : false;

  if (isVencido) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-red-50 text-red-700 border border-red-200 rounded-full">
        <AlertCircle className="w-3.5 h-3.5 mr-1" />
        VENCIDO
      </span>
    );
  }

  // Si no está vencido y está listado, es que ya fue enviado.
  return (
    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
      ENVIADO
    </span>
  );
};
