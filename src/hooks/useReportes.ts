import { useQuery } from '@tanstack/react-query';
import { reporteService } from '../services/reporte.service';

export const useReporteGeneral = () => {
  return useQuery({
    queryKey: ['reporte-general'],
    queryFn: reporteService.obtenerReporteGeneral,
    // refetchInterval heredado del QueryClient global → 8 segundos
  });
};
