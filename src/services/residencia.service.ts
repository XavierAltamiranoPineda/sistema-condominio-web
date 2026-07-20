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

  /**
   * Actualiza código, propietario, cuota y/o estado de una residencia.
   * El campo 'estado' es opcional en el backend (EstadoResidencia: OCUPADA | DESOCUPADA).
   * Si se omite, el backend conserva el estado actual.
   *
   * Endpoint: PUT /api/residencias/{id}
   */
  actualizarResidencia: async (id: number, residencia: ResidenciaRequest): Promise<Residencia> => {
    const { data } = await api.put<Residencia>(`/api/residencias/${id}`, residencia);
    return data;
  },
};
