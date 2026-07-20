import { 
  Users, 
  Home, 
  AlertTriangle, 
  CheckCircle2, 
  Wallet,
  Megaphone,
  Loader2,
  DollarSign,
  Building
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useReporteGeneral } from '../../hooks/useReportes';
import { useResidentes } from '../../hooks/useResidentes';
import { useResidencias } from '../../hooks/useResidencias';
import { useCuotas } from '../../hooks/useCuotas';
import { useComunicados } from '../../hooks/useComunicados';
import { KpiCard } from '../../components/dashboard/KpiCard';

export const Dashboard = () => {
  const { user } = useAuth();
  
  const { data: reporte, isLoading: isReporteLoading, isError: isReporteError } = useReporteGeneral();
  const { data: residentes, isLoading: isResidentesLoading } = useResidentes();
  const { data: residencias, isLoading: isResidenciasLoading } = useResidencias();
  const { data: cuotas, isLoading: isCuotasLoading } = useCuotas();
  const { data: comunicados, isLoading: isComunicadosLoading } = useComunicados();

  const isLoading = isReporteLoading || isResidentesLoading || isResidenciasLoading || isCuotasLoading || isComunicadosLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-white rounded-2xl border border-slate-100 shadow-sm">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Cargando información consolidada...</p>
      </div>
    );
  }

  if (isReporteError) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-4 bg-red-50 rounded-full mb-4">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <p className="text-red-600 font-medium text-lg mb-2">Error de conexión</p>
        <p className="text-slate-500">No se pudo cargar la información del reporte general.</p>
      </div>
    );
  }

  // Cálculos solicitados
  const totalResidentes = residentes?.length || 0;
  const totalResidencias = residencias?.length || 0;
  const residenciasOcupadas = residencias?.filter(r => r.estado === 'OCUPADA').length || 0;
  const residenciasDesocupadas = residencias?.filter(r => r.estado === 'DESOCUPADA').length || 0;
  
  // Pagos pendientes (cantidad de cuotas con saldo)
  const pagosPendientes = cuotas?.filter(c => c.saldoPendiente > 0).length || 0;

  // Recaudación del mes actual (sumamos monto pagado de las cuotas cuyo mes/año coinciden con hoy)
  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth() + 1;
  const anioActual = fechaActual.getFullYear();
  const recaudacionMensual = cuotas
    ?.filter(c => c.mes === mesActual && c.anio === anioActual)
    .reduce((sum, c) => sum + c.montoPagado, 0) || 0;

  // Comunicados activos (sin vencimiento o con vencimiento futuro)
  const comunicadosActivos = comunicados?.filter(c => {
    if (!c.fechaVencimiento) return true;
    return new Date(c.fechaVencimiento) >= fechaActual;
  }).length || 0;

  const isEstadoOk = reporte?.estado === 'OK';

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Cabecera */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Hola, {user?.usuario} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Aquí tienes un resumen general del estado del condominio hoy.
        </p>
      </div>

      {/* Estado del Sistema */}
      <div className={`p-4 rounded-xl border flex items-center shadow-sm animate-in fade-in slide-in-from-bottom-4 ${
        isEstadoOk 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
          : 'bg-amber-50 border-amber-200 text-amber-800'
      }`}>
        <div className="mr-3">
          {isEstadoOk ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
        </div>
        <div>
          <h3 className="font-semibold">{isEstadoOk ? 'Estado: OK' : 'Estado: ALERTA'}</h3>
          <p className="text-sm opacity-90">
            {isEstadoOk 
              ? '🟢 Sin novedades. El condominio se encuentra al día.' 
              : `🔴 Alertas encontradas según sistema: ${reporte?.novedades?.map(n => n.tipo.replace('_', ' ')).join(', ')}`}
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total Residentes" 
          value={totalResidentes} 
          icon={<Users className="w-6 h-6 text-blue-600" />} 
          trend="Residentes registrados"
          trendUp={true}
        />
        <KpiCard 
          title="Total Residencias" 
          value={totalResidencias} 
          icon={<Home className="w-6 h-6 text-indigo-600" />} 
          trend={`${residenciasOcupadas} ocupadas, ${residenciasDesocupadas} vacías`}
          trendUp={residenciasDesocupadas === 0}
        />
        <KpiCard 
          title="Recaudación Mes" 
          value={`$${recaudacionMensual.toFixed(2)}`} 
          icon={<DollarSign className="w-6 h-6 text-emerald-600" />} 
          trend="Este mes"
          trendUp={true}
        />
        <KpiCard 
          title="Pagos Pendientes" 
          value={pagosPendientes} 
          icon={<Wallet className="w-6 h-6 text-amber-600" />} 
          trend={pagosPendientes > 0 ? 'Existen deudas' : 'Todo al día'}
          trendUp={pagosPendientes === 0}
        />
        <KpiCard 
          title="Residencias Ocupadas" 
          value={residenciasOcupadas} 
          icon={<Building className="w-6 h-6 text-indigo-600" />} 
        />
        <KpiCard 
          title="Residencias Desocupadas" 
          value={residenciasDesocupadas} 
          icon={<AlertTriangle className="w-6 h-6 text-amber-600" />} 
        />
        <KpiCard 
          title="Comunicados Activos" 
          value={comunicadosActivos} 
          icon={<Megaphone className="w-6 h-6 text-blue-600" />} 
        />
      </div>
    </div>
  );
};
