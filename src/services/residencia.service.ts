import api from '../api/axios';
import type { Residencia, ResidenciaRequest } from '../types/residencia';

export const residenciaService = {
  listarResidencias: async (): Promise<Residencia[]> => {
    const { data } = await api.get<Residencia[]>('/api/residencias');
    return data;
  },

  crearResidencia: async (residencia: ResidenciaRequest): Promise<Residencia> => {
    const { data } = await api.post<Residencia>('/api/residencias', residencia);
    return data;
  },

  actualizarResidencia: async (id: number, residencia: ResidenciaRequest): Promise<Residencia> => {
    const { data } = await api.put<Residencia>(`/api/residencias/${id}`, residencia);
    return data;
  },

  eliminarResidencia: async (id: number): Promise<void> => {
    await api.delete(`/api/residencias/${id}`);
  },
};
