import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cuotaService } from '../services/cuota.service';
import type { CuotaRequest } from '../types/cuota';

export const useCuotas = () => {
  return useQuery({
    queryKey: ['cuotas'],
    queryFn: cuotaService.listarTodas,
  });
};

export const useCuotasResidencia = (idResidencia: number) => {
  return useQuery({
    queryKey: ['cuotas', 'residencia', idResidencia],
    queryFn: () => cuotaService.listarPorResidencia(idResidencia),
    enabled: !!idResidencia,
  });
};

export const useCrearCuota = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CuotaRequest) => cuotaService.crear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cuotas'] });
    },
  });
};
