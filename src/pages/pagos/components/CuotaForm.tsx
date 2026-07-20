import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import type { CuotaRequest } from '../../../types/cuota';
import { useResidencias } from '../../../hooks/useResidencias';

const cuotaSchema = z.object({
  idResidencia: z.number().int().positive('Seleccione una residencia'),
  mes: z.number().min(1).max(12, 'Mes inválido'),
  anio: z.number().min(2026, 'El año mínimo permitido es 2026'),
  valor: z.number().positive('El valor debe ser mayor a 0').max(500, 'Máximo $500'),
});

type CuotaFormValues = z.infer<typeof cuotaSchema>;

interface Props {
  onSubmit: (data: CuotaRequest) => void;
  isLoading: boolean;
  onCancel: () => void;
}

const MESES = [
  { valor: 1, etiqueta: 'Enero' },
  { valor: 2, etiqueta: 'Febrero' },
  { valor: 3, etiqueta: 'Marzo' },
  { valor: 4, etiqueta: 'Abril' },
  { valor: 5, etiqueta: 'Mayo' },
  { valor: 6, etiqueta: 'Junio' },
  { valor: 7, etiqueta: 'Julio' },
  { valor: 8, etiqueta: 'Agosto' },
  { valor: 9, etiqueta: 'Septiembre' },
  { valor: 10, etiqueta: 'Octubre' },
  { valor: 11, etiqueta: 'Noviembre' },
  { valor: 12, etiqueta: 'Diciembre' },
];

export const CuotaForm = ({ onSubmit, isLoading, onCancel }: Props) => {
  const { data: residencias } = useResidencias();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CuotaFormValues>({
    resolver: zodResolver(cuotaSchema),
    defaultValues: {
      idResidencia: undefined,
      mes: currentMonth,
      anio: currentYear,
      valor: undefined,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Residencia
          </label>
          <select
            {...register('idResidencia', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">— Seleccionar Residencia —</option>
            {residencias?.map((r) => (
              <option key={r.idResidencia} value={r.idResidencia}>
                {r.codigoCasa} - {r.nombrePropietario ? r.nombrePropietario : 'Sin Propietario'}
              </option>
            ))}
          </select>
          {errors.idResidencia && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.idResidencia.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mes</label>
            <select
              {...register('mes', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {MESES.map((m) => (
                <option key={m.valor} value={m.valor}>
                  {m.etiqueta}
                </option>
              ))}
            </select>
            {errors.mes && <p className="mt-1 text-xs text-red-500">{errors.mes.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Año</label>
            <input
              type="number"
              {...register('anio', { valueAsNumber: true })}
              min={2026}
              max={2100}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.anio && <p className="mt-1 text-xs text-red-500">{errors.anio.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Valor Cuota ($)</label>
          <input
            type="number"
            step="0.01"
            {...register('valor', { valueAsNumber: true })}
            placeholder="Ej: 50.00"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.valor && <p className="mt-1 text-xs text-red-500">{errors.valor.message}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100 mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {isLoading ? 'Generando...' : 'Generar Cuota'}
        </button>
      </div>
    </form>
  );
};
