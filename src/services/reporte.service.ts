import api from '../api/axios';
import type { ReporteGeneral } from '../types/reporte';

export const reporteService = {
  obtenerReporteGeneral: async (): Promise<ReporteGeneral> => {
    const { data } = await api.get<ReporteGeneral>('/api/reportes/general');
    return data;
  },
};
