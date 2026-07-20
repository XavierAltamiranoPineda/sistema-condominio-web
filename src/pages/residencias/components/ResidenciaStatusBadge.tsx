import clsx from 'clsx';

interface Props {
  estado: string;
}

export const ResidenciaStatusBadge = ({ estado }: Props) => {
  const isOcupada = estado === 'OCUPADA';

  return (
    <span
      className={clsx(
        'px-2.5 py-1 text-xs font-semibold rounded-full border inline-flex items-center gap-1.5',
        isOcupada
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-slate-50 text-slate-500 border-slate-200'
      )}
    >
      <span
        className={clsx(
          'w-1.5 h-1.5 rounded-full',
          isOcupada ? 'bg-emerald-500' : 'bg-slate-400'
        )}
      />
      {estado}
    </span>
  );
};
