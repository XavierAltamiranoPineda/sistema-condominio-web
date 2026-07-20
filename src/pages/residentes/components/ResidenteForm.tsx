import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Residente, ResidenteRequest } from '../../../types/residente';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const residenteSchema = z.object({
  nombres: z.string().min(1, 'El nombre es obligatorio'),
  apellidos: z.string().min(1, 'El apellido es obligatorio'),
  cedula: z.string()
    .length(10, 'La cédula debe tener exactamente 10 dígitos')
    .regex(/^[0-9]+$/, 'La cédula solo debe contener números'),
  telefono: z.string().min(1, 'El teléfono es obligatorio'),
});

type ResidenteFormValues = z.infer<typeof residenteSchema>;

interface Props {
  initialData?: Residente | null;
  onSubmit: (data: ResidenteRequest) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export const ResidenteForm = ({ initialData, onSubmit, isLoading, onCancel }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResidenteFormValues>({
    resolver: zodResolver(residenteSchema),
    defaultValues: {
      nombres: '',
      apellidos: '',
      cedula: '',
      telefono: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nombres: initialData.nombres,
        apellidos: initialData.apellidos,
        cedula: initialData.cedula,
        telefono: initialData.telefono,
      });
    } else {
      reset({
        nombres: '',
        apellidos: '',
        cedula: '',
        telefono: '',
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombres</label>
          <input
            {...register('nombres')}
            type="text"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            placeholder="Ej. Juan Pablo"
          />
          {errors.nombres && <p className="mt-1 text-xs text-red-500 font-medium">{errors.nombres.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Apellidos</label>
          <input
            {...register('apellidos')}
            type="text"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            placeholder="Ej. García López"
          />
          {errors.apellidos && <p className="mt-1 text-xs text-red-500 font-medium">{errors.apellidos.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Cédula</label>
          <input
            {...register('cedula')}
            type="text"
            maxLength={10}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            placeholder="10 dígitos numéricos"
          />
          {errors.cedula && <p className="mt-1 text-xs text-red-500 font-medium">{errors.cedula.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
          <input
            {...register('telefono')}
            type="text"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            placeholder="Ej. 0999999999"
          />
          {errors.telefono && <p className="mt-1 text-xs text-red-500 font-medium">{errors.telefono.message}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100 mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar Residente'
          )}
        </button>
      </div>
    </form>
  );
};
