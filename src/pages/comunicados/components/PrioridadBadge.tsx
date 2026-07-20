import { ArrowUp, Minus, ArrowDown } from 'lucide-react';

interface Props {
  prioridad: string;
}

export const PrioridadBadge = ({ prioridad }: Props) => {
  switch (prioridad) {
    case 'ALTA':
      return (
        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-red-50 text-red-700 border border-red-200 rounded-full">
          <ArrowUp className="w-3.5 h-3.5 mr-1" />
          ALTA
        </span>
      );
    case 'BAJA':
      return (
        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
          <ArrowDown className="w-3.5 h-3.5 mr-1" />
          BAJA
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
          <Minus className="w-3.5 h-3.5 mr-1" />
          NORMAL
        </span>
      );
  }
};
