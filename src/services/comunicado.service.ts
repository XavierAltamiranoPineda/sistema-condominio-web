import api from '../api/axios';
import type { Comunicado, ComunicadoRequest } from '../types/comunicado';

export const comunicadoService = {
  listarTodos: async (): Promise<Comunicado[]> => {
    const { data } = await api.get<Comunicado[]>('/api/comunicados');
    return data;
  },

  buscarPorId: async (id: number): Promise<Comunicado> => {
    const { data } = await api.get<Comunicado>(`/api/comunicados/${id}`);
    return data;
  },

  crear: async (comunicado: ComunicadoRequest): Promise<Comunicado> => {
    const { data } = await api.post<Comunicado>('/api/comunicados', comunicado);
    return data;
  },
};
