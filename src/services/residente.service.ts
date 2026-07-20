import api from '../api/axios';
import type { Residente, ResidenteRequest } from '../types/residente';

export const residenteService = {
  listarResidentes: async (): Promise<Residente[]> => {
    const { data } = await api.get<Residente[]>('/api/residentes');
    return data;
  },

  obtenerPorId: async (id: number): Promise<Residente> => {
    const { data } = await api.get<Residente>(`/api/residentes/${id}`);
    return data;
  },

  crearResidente: async (residente: ResidenteRequest): Promise<Residente> => {
    const { data } = await api.post<Residente>('/api/residentes', residente);
    return data;
  },

  actualizarResidente: async (id: number, residente: ResidenteRequest): Promise<Residente> => {
    const { data } = await api.put<Residente>(`/api/residentes/${id}`, residente);
    return data;
  },

  /**
   * Desactiva un residente (soft-delete → estado INACTIVO).
   * El backend implementa DELETE /api/residentes/{id} como soft-delete.
   * NO elimina físicamente el registro.
   */
  desactivarResidente: async (id: number): Promise<void> => {
    await api.delete(`/api/residentes/${id}`);
  },
};
