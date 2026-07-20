import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import type { PagoRequest } from '../../../types/pago';
import type { Cuota } from '../../../types/cuota';

const pagoSchema = z.object({
  montoPagado: z.number().positive('El monto debe ser mayor a 0').max(500, 'Máximo $500 permitido'),
});

type PagoFormValues = z.infer<typeof pagoSchema>;

interface Props {
  cuota: Cuota;
  onSubmit: (data: PagoRequest) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export const PagoForm = ({ cuota, onSubmit, isLoading, onCancel }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PagoFormValues>({
    resolver: zodResolver(pagoSchema),
    defaultValues: {
      montoPagado: cuota.saldoPendiente,
    },
  });

  const handleFormSubmit = (values: PagoFormValues) => {
    onSubmit({
      idCuota: cuota.idCuota,
      montoPagado: values.montoPagado,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
        <h4 className="text-sm font-semibold text-slate-800 mb-2">Detalles de la Cuota</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-slate-500">Casa:</div>
          <div className="font-medium text-slate-700">{cuota.codigoCasa}</div>
          <div className="text-slate-500">Mes/Año:</div>
          <div className="font-medium text-slate-700">{cuota.mes}/{cuota.anio}</div>
          <div className="text-slate-500">Saldo Pendiente:</div>
          <div className="font-bold text-amber-600">${cuota.saldoPendiente.toFixed(2)}</div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Monto a Pagar ($)</label>
        <input
          type="number"
          step="0.01"
          {...register('montoPagado', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.montoPagado && <p className="mt-1 text-xs text-red-500">{errors.montoPagado.message}</p>}
        <p className="mt-1 text-xs text-slate-400">Puede realizar pagos parciales o totales.</p>
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
          {isLoading ? 'Registrando...' : 'Registrar Pago'}
        </button>
      </div>
    </form>
  );
};
