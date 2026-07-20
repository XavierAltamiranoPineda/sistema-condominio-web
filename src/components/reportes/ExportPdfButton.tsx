import { Download } from 'lucide-react';

interface Props {
  onClick: () => void;
  text?: string;
  disabled?: boolean;
}

export const ExportPdfButton = ({ onClick, text = 'Descargar PDF', disabled = false }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="w-4 h-4 mr-2" />
      {text}
    </button>
  );
};
