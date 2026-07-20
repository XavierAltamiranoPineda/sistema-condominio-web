import api from '../api/axios';
import type { Pago, PagoRequest } from '../types/pago';

export const pagoService = {
  listarTodos: async (): Promise<Pago[]> => {
    const { data } = await api.get<Pago[]>('/api/pagos');
    return data;
  },

  listarPorCuota: async (idCuota: number): Promise<Pago[]> => {
    const { data } = await api.get<Pago[]>(`/api/pagos/cuota/${idCuota}`);
    return data;
  },

  registrar: async (pago: PagoRequest): Promise<Pago> => {
    const { data } = await api.post<Pago>('/api/pagos', pago);
    return data;
  },
};
