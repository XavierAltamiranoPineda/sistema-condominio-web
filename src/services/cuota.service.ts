import api from '../api/axios';
import type { Cuota, CuotaRequest } from '../types/cuota';

export const cuotaService = {
  listarTodas: async (): Promise<Cuota[]> => {
    const { data } = await api.get<Cuota[]>('/api/cuotas');
    return data;
  },

  listarPorResidencia: async (idResidencia: number): Promise<Cuota[]> => {
    const { data } = await api.get<Cuota[]>(`/api/cuotas/residencia/${idResidencia}`);
    return data;
  },

  crear: async (cuota: CuotaRequest): Promise<Cuota> => {
    const { data } = await api.post<Cuota>('/api/cuotas', cuota);
    return data;
  },
};
