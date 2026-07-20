import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { residenciaService } from '../services/residencia.service';
import type { ResidenciaRequest } from '../types/residencia';

export const useResidencias = () => {
  return useQuery({
    queryKey: ['residencias'],
    queryFn: residenciaService.listarResidencias,
  });
};

export const useCrearResidencia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ResidenciaRequest) => residenciaService.crearResidencia(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residencias'] });
    },
  });
};

export const useActualizarResidencia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ResidenciaRequest }) =>
      residenciaService.actualizarResidencia(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residencias'] });
    },
  });
};

/**
 * Cambia el estado de una residencia (OCUPADA ↔ DESOCUPADA).
 * Utiliza PUT /api/residencias/{id} — el campo 'estado' es opcional en el backend.
 */
export const useCambiarEstadoResidencia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ResidenciaRequest }) =>
      residenciaService.actualizarResidencia(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residencias'] });
    },
  });
};
