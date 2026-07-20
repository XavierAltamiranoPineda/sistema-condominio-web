import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { comunicadoService } from '../services/comunicado.service';
import type { ComunicadoRequest } from '../types/comunicado';

export const useComunicados = () => {
  return useQuery({
    queryKey: ['comunicados'],
    queryFn: comunicadoService.listarTodos,
  });
};

export const useCrearComunicado = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ComunicadoRequest) => comunicadoService.crear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunicados'] });
    },
  });
};
