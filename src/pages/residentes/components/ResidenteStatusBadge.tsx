import clsx from 'clsx';

interface Props {
  estado: string;
}

export const ResidenteStatusBadge = ({ estado }: Props) => {
  const isActivo = estado === 'ACTIVO';
  
  return (
    <span
      className={clsx(
        "px-2.5 py-1 text-xs font-semibold rounded-full border inline-flex items-center justify-center",
        isActivo
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-red-50 text-red-700 border-red-200"
      )}
    >
      {estado}
    </span>
  );
};
