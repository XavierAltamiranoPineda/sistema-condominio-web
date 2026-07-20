import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import type { ComunicadoRequest } from '../../../types/comunicado';
import { useResidentes } from '../../../hooks/useResidentes';

const comunicadoSchema = z.object({
  titulo: z.string().min(1, 'El título es obligatorio').max(200, 'Máximo 200 caracteres'),
  mensaje: z.string().min(1, 'El mensaje es obligatorio'),
  prioridad: z.enum(['ALTA', 'NORMAL', 'BAJA']),
  fechaVencimiento: z.string().optional(),
  tipo: z.enum(['GENERAL', 'INDIVIDUAL']),
});

type ComunicadoFormValues = z.infer<typeof comunicadoSchema>;

interface Props {
  onSubmit: (data: ComunicadoRequest) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export const ComunicadoForm = ({ onSubmit, isLoading, onCancel }: Props) => {
  const { data: residentes } = useResidentes();
  const [selectedDestinatarios, setSelectedDestinatarios] = useState<number[]>([]);

  // Filtrar solo los residentes activos para poder enviarles mensaje
  const residentesActivos = residentes?.filter((r) => r.estado === 'ACTIVO') || [];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ComunicadoFormValues>({
    resolver: zodResolver(comunicadoSchema),
    defaultValues: {
      titulo: '',
      mensaje: '',
      prioridad: 'NORMAL',
      tipo: 'GENERAL',
    },
  });

  const tipo = watch('tipo');

  const handleToggleDestinatario = (id: number) => {
    setSelectedDestinatarios((prev) =>
      prev.includes(id) ? prev.filter((prevId) => prevId !== id) : [...prev, id]
    );
  };

  const handleFormSubmit = (values: ComunicadoFormValues) => {
    const payload: ComunicadoRequest = {
      titulo: values.titulo,
      mensaje: values.mensaje,
      prioridad: values.prioridad,
      fechaVencimiento: values.fechaVencimiento || undefined,
    };

    if (values.tipo === 'INDIVIDUAL') {
      payload.destinatarios = selectedDestinatarios;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
        <input
          {...register('titulo')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Ej: Mantenimiento de áreas verdes"
        />
        {errors.titulo && <p className="mt-1 text-xs text-red-500">{errors.titulo.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Mensaje</label>
        <textarea
          {...register('mensaje')}
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Escriba el detalle del comunicado..."
        />
        {errors.mensaje && <p className="mt-1 text-xs text-red-500">{errors.mensaje.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Prioridad</label>
          <select
            {...register('prioridad')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="BAJA">Baja</option>
            <option value="NORMAL">Normal</option>
            <option value="ALTA">Alta</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Fecha de Vencimiento (Opcional)
          </label>
          <input
            type="date"
            {...register('fechaVencimiento')}
            min={new Date().toISOString().split('T')[0]} // Solo fechas futuras
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.fechaVencimiento && (
            <p className="mt-1 text-xs text-red-500">{errors.fechaVencimiento.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Comunicado</label>
        <div className="flex gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="GENERAL"
              {...register('tipo')}
              className="text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-700">General (Todos)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="INDIVIDUAL"
              {...register('tipo')}
              className="text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-700">Individual (Selección)</span>
          </label>
        </div>
      </div>

      {tipo === 'INDIVIDUAL' && (
        <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Seleccionar Destinatarios ({selectedDestinatarios.length} seleccionados)
          </label>
          {residentesActivos.length === 0 ? (
            <p className="text-sm text-slate-500">No hay residentes activos disponibles.</p>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-1">
              {residentesActivos.map((r) => (
                <label
                  key={r.idResidente}
                  className="flex items-center space-x-3 p-2 hover:bg-slate-100 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedDestinatarios.includes(r.idResidente)}
                    onChange={() => handleToggleDestinatario(r.idResidente)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">
                    {r.nombres} {r.apellidos} <span className="text-slate-400">({r.cedula})</span>
                  </span>
                </label>
              ))}
            </div>
          )}
          {selectedDestinatarios.length === 0 && (
            <p className="mt-2 text-xs text-amber-600 font-medium">
              Debe seleccionar al menos un destinatario para el comunicado individual.
            </p>
          )}
        </div>
      )}

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
          disabled={isLoading || (tipo === 'INDIVIDUAL' && selectedDestinatarios.length === 0)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {isLoading ? 'Enviando...' : 'Enviar Comunicado'}
        </button>
      </div>
    </form>
  );
};
