import { useQuery } from '@tanstack/react-query';
import { reporteService } from '../services/reporte.service';

export const useReporteGeneral = () => {
  return useQuery({
    queryKey: ['reporte-general'],
    queryFn: reporteService.obtenerReporteGeneral,
    refetchInterval: 30000, // Actualización automática cada 30 segundos
  });
};
