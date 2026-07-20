import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pagoService } from '../services/pago.service';
import type { PagoRequest } from '../types/pago';

export const usePagos = () => {
  return useQuery({
    queryKey: ['pagos'],
    queryFn: pagoService.listarTodos,
  });
};

export const usePagosCuota = (idCuota: number) => {
  return useQuery({
    queryKey: ['pagos', 'cuota', idCuota],
    queryFn: () => pagoService.listarPorCuota(idCuota),
    enabled: !!idCuota,
  });
};

export const useRegistrarPago = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PagoRequest) => pagoService.registrar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagos'] });
      // Invalidar cuotas también para que se actualicen los montos pagados / pendientes
      queryClient.invalidateQueries({ queryKey: ['cuotas'] });
    },
  });
};
