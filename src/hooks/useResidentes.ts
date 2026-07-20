import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { residenteService } from '../services/residente.service';
import type { ResidenteRequest } from '../types/residente';

export const useResidentes = () => {
  return useQuery({
    queryKey: ['residentes'],
    queryFn: residenteService.listarResidentes,
  });
};

export const useCrearResidente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ResidenteRequest) => residenteService.crearResidente(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residentes'] });
    },
  });
};

export const useActualizarResidente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ResidenteRequest }) => 
      residenteService.actualizarResidente(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residentes'] });
    },
  });
};

export const useEliminarResidente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => residenteService.eliminarResidente(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residentes'] });
    },
  });
};
