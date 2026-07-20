import { useState } from 'react';
import { Link2, Loader2, UserCheck } from 'lucide-react';
import { useResidentes } from '../../../hooks/useResidentes';
import { useResidencias, useActualizarResidencia } from '../../../hooks/useResidencias';

interface Props {
  onSuccess: (mensaje: string) => void;
}

export const AsignarResidenciaSection = ({ onSuccess }: Props) => {
  const { data: residentes } = useResidentes();
  const { data: residencias } = useResidencias();
  const { mutateAsync: actualizarResidencia, isPending } = useActualizarResidencia();

  const [selectedResidenteId, setSelectedResidenteId] = useState<string>('');
  const [selectedResidenciaId, setSelectedResidenciaId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Solo mostrar residencias DESOCUPADAS para asignar
  const residenciasDisponibles = residencias?.filter(r => r.estado === 'DESOCUPADA') ?? [];

  const handleAsignar = async () => {
    setError(null);
    if (!selectedResidenteId || !selectedResidenciaId) {
      setError('Debe seleccionar un residente y una residencia.');
      return;
    }

    const residencia = residencias?.find(r => r.idResidencia === Number(selectedResidenciaId));
    if (!residencia) return;

    try {
      await actualizarResidencia({
        id: residencia.idResidencia,
        data: {
          codigoCasa: residencia.codigoCasa,
          cuotaMensual: residencia.cuotaMensual,
          idPropietario: Number(selectedResidenteId),
        },
      });
      onSuccess(`Casa "${residencia.codigoCasa}" asignada correctamente`);
      setSelectedResidenteId('');
      setSelectedResidenciaId('');
    } catch (err) {
      setError('Error al asignar la residencia. Intente nuevamente.');
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      {/* Header sección */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 bg-indigo-50 rounded-xl">
          <Link2 className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800">Asignar Casa a Residente</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Solo se listan casas disponibles (DESOCUPADA).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Select Residente */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Residente
          </label>
          <select
            value={selectedResidenteId}
            onChange={e => setSelectedResidenteId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors bg-white"
          >
            <option value="">— Seleccionar residente —</option>
            {residentes?.map(r => (
              <option key={r.idResidente} value={r.idResidente}>
                #{r.idResidente} · {r.nombres} {r.apellidos}
              </option>
            ))}
          </select>
        </div>

        {/* Select Residencia */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Casa disponible
          </label>
          <select
            value={selectedResidenciaId}
            onChange={e => setSelectedResidenciaId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors bg-white"
          >
            <option value="">— Seleccionar casa —</option>
            {residenciasDisponibles.map(r => (
              <option key={r.idResidencia} value={r.idResidencia}>
                {r.codigoCasa} · ${r.cuotaMensual.toFixed(2)}/mes
              </option>
            ))}
            {residenciasDisponibles.length === 0 && (
              <option disabled>No hay casas disponibles</option>
            )}
          </select>
        </div>

        {/* Botón Asignar */}
        <div>
          <button
            onClick={handleAsignar}
            disabled={isPending || !selectedResidenteId || !selectedResidenciaId}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <UserCheck className="w-4 h-4 mr-2" />
            )}
            Asignar
          </button>
        </div>
      </div>

      {/* Error inline */}
      {error && (
        <p className="mt-3 text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};
