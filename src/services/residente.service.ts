import api from '../api/axios';
import type { Residente, ResidenteRequest } from '../types/residente';

export const residenteService = {
  listarResidentes: async (): Promise<Residente[]> => {
    const { data } = await api.get<Residente[]>('/api/residentes');
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

  eliminarResidente: async (id: number): Promise<void> => {
    await api.delete(`/api/residentes/${id}`);
  }
};
