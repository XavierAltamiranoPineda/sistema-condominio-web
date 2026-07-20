import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { residenteService } from '../services/residente.service';
import type { ResidenteRequest } from '../types/residente';

export const useResidentes = () => {
  return useQuery({
    queryKey: ['residentes'],
    queryFn: residenteService.listarResidentes,
  });
};

export const useResidente = (id: number | undefined) => {
  return useQuery({
    queryKey: ['residente', id],
    queryFn: () => residenteService.obtenerPorId(id!),
    enabled: !!id && id > 0,
    retry: false, // No reintentar si da 404
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

/**
 * Desactiva un residente mediante DELETE /api/residentes/{id}.
 * El backend realiza un soft-delete: cambia el estado a INACTIVO.
 * El registro NO se elimina físicamente.
 */
export const useDesactivarResidente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => residenteService.desactivarResidente(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residentes'] });
    },
  });
};

/**
 * Activa un residente enviando estado=ACTIVO en el PUT /api/residentes/{id}.
 * Mantiene los demás datos del residente intactos.
 */
export const useActivarResidente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ResidenteRequest }) =>
      residenteService.actualizarResidente(id, { ...data, estado: 'ACTIVO' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residentes'] });
    },
  });
};
