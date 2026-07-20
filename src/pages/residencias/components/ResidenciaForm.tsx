import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, XCircle, CheckCircle2 } from 'lucide-react';
import type { Residencia, ResidenciaRequest } from '../../../types/residencia';
import { useResidente } from '../../../hooks/useResidentes';

const residenciaSchema = z.object({
  codigoCasa: z.string().min(1, 'El código de casa es obligatorio').max(20, 'Máximo 20 caracteres'),
  idPropietario: z
    .number({ message: 'El ID del propietario es obligatorio' })
    .int()
    .positive('Debe ser un ID válido de residente'),
  cuotaMensual: z
    .number({ message: 'La cuota mensual es obligatoria' })
    .positive('La cuota debe ser mayor a 0')
    .max(500, 'La cuota no puede superar $500'),
  estado: z.enum(['OCUPADA', 'DESOCUPADA']),
});

type ResidenciaFormValues = z.infer<typeof residenciaSchema>;

interface Props {
  initialData?: Residencia | null;
  onSubmit: (data: ResidenciaRequest) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export const ResidenciaForm = ({ initialData, onSubmit, isLoading, onCancel }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<ResidenciaFormValues>({
    resolver: zodResolver(residenciaSchema),
    mode: 'onChange',
    defaultValues: {
      codigoCasa: '',
      idPropietario: undefined,
      cuotaMensual: undefined,
      estado: 'DESOCUPADA',
    },
  });

  const idPropietario = watch('idPropietario');
  const { data: residenteInfo, isLoading: isLoadingResidente, isError: isResidenteError } = useResidente(idPropietario);

  // Validación de estado del residente en vivo
  useEffect(() => {
    if (residenteInfo) {
      if (residenteInfo.estado === 'INACTIVO') {
        setError('idPropietario', {
          type: 'manual',
          message: 'El residente seleccionado está inactivo y no puede ser asignado.',
        });
      } else {
        clearErrors('idPropietario');
      }
    } else if (isResidenteError && idPropietario) {
      setError('idPropietario', {
        type: 'manual',
        message: 'Residente no encontrado.',
      });
    }
  }, [residenteInfo, isResidenteError, setError, clearErrors, idPropietario]);

  useEffect(() => {
    if (initialData) {
      reset({
        codigoCasa: initialData.codigoCasa,
        idPropietario: initialData.idPropietario,
        cuotaMensual: initialData.cuotaMensual,
        estado: initialData.estado as 'OCUPADA' | 'DESOCUPADA',
      });
    } else {
      reset({ codigoCasa: '', idPropietario: undefined, cuotaMensual: undefined, estado: 'DESOCUPADA' });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (values: ResidenciaFormValues) => {
    // Doble check por si acaso
    if (residenteInfo?.estado === 'INACTIVO') return;

    const payload: ResidenciaRequest = {
      codigoCasa: values.codigoCasa,
      cuotaMensual: values.cuotaMensual,
      idPropietario: values.idPropietario,
      estado: values.estado,
    };
    onSubmit(payload);
  };

  // Saber si podemos guardar
  const canSubmit = !isLoading && isValid && !errors.idPropietario && (!residenteInfo || residenteInfo.estado !== 'INACTIVO');

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Código Casa */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Código de Casa
          </label>
          <input
            {...register('codigoCasa')}
            type="text"
            maxLength={20}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            placeholder="Ej. CASA-001"
          />
          {errors.codigoCasa && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.codigoCasa.message}</p>
          )}
        </div>

        {/* ID Propietario */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center justify-between">
            <span>ID del Propietario (Residente)</span>
            {isLoadingResidente && <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />}
          </label>
          <div className="relative">
            <input
              {...register('idPropietario', { valueAsNumber: true })}
              type="number"
              min={1}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.idPropietario ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
              }`}
              placeholder="Ej. 1"
            />
          </div>
          
          {/* Mensajes de feedback visual de estado */}
          {errors.idPropietario ? (
            <p className="mt-1 text-xs text-red-600 font-medium flex items-center">
              <XCircle className="w-3.5 h-3.5 mr-1" />
              {errors.idPropietario.message}
            </p>
          ) : (
            residenteInfo && residenteInfo.estado === 'ACTIVO' && (
              <p className="mt-1 text-xs text-emerald-600 font-medium flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Residente disponible: {residenteInfo.nombres}
              </p>
            )
          )}
          {!errors.idPropietario && !residenteInfo && (
            <p className="mt-1 text-xs text-slate-400">Ingrese el ID del residente registrado</p>
          )}
        </div>

        {/* Cuota Mensual */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Cuota Mensual ($)
          </label>
          <input
            {...register('cuotaMensual', { valueAsNumber: true })}
            type="number"
            min={0.01}
            max={500}
            step={0.01}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            placeholder="Ej. 80.00"
          />
          {errors.cuotaMensual && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.cuotaMensual.message}</p>
          )}
          <p className="mt-1 text-xs text-slate-400">Entre $0.01 y $500.00</p>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Estado
          </label>
          <select
            {...register('estado')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white"
          >
            <option value="DESOCUPADA">DESOCUPADA</option>
            <option value="OCUPADA">OCUPADA</option>
          </select>
          {errors.estado && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.estado.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100 mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar Casa'
          )}
        </button>
      </div>
    </form>
  );
};
