import { FileText, Users, Home, Wallet, AlertCircle, Megaphone, Loader2 } from 'lucide-react';
import { useReporteGeneral } from '../../hooks/useReportes';
import { useResidentes } from '../../hooks/useResidentes';
import { useResidencias } from '../../hooks/useResidencias';
import { useCuotas } from '../../hooks/useCuotas';
import { usePagos } from '../../hooks/usePagos';
import { useComunicados } from '../../hooks/useComunicados';
import { generatePDF } from '../../utils/pdfGenerator';
import { ExportPdfButton } from '../../components/reportes/ExportPdfButton';
import { ReporteCard } from '../../components/reportes/ReporteCard';
import { useState } from 'react';

export const ReportesPage = () => {
  const { isLoading: isLoadingGeneral } = useReporteGeneral();
  const { data: residentes, isLoading: isLoadingResidentes } = useResidentes();
  const { data: residencias, isLoading: isLoadingResidencias } = useResidencias();
  const { data: cuotas, isLoading: isLoadingCuotas } = useCuotas();
  const { data: pagos, isLoading: isLoadingPagos } = usePagos();
  const { data: comunicados, isLoading: isLoadingComunicados } = useComunicados();

  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const isLoading = isLoadingGeneral || isLoadingResidentes || isLoadingResidencias || isLoadingCuotas || isLoadingPagos || isLoadingComunicados;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-white rounded-2xl border border-slate-100 shadow-sm">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Cargando base de datos para reportes...</p>
      </div>
    );
  }

  // Generadores de PDF
  const handleReporteGeneral = () => {
    const totalResidentes = residentes?.length || 0;
    const activos = residentes?.filter(r => r.estado === 'ACTIVO').length || 0;
    const inactivos = residentes?.filter(r => r.estado === 'INACTIVO').length || 0;
    const ocupadas = residencias?.filter(r => r.estado === 'OCUPADA').length || 0;
    const desocupadas = residencias?.filter(r => r.estado === 'DESOCUPADA').length || 0;
    const totalCuotas = cuotas?.length || 0;
    const totalPagos = pagos?.length || 0;
    
    let deudaPendiente = 0;
    cuotas?.forEach(c => { deudaPendiente += c.saldoPendiente; });
    
    const comunicadosActivos = comunicados?.filter(c => !c.fechaVencimiento || new Date(c.fechaVencimiento) >= new Date()).length || 0;

    const columns = ['Métrica', 'Valor'];
    const data = [
      ['Total Residentes', totalResidentes],
      ['Residentes Activos', activos],
      ['Residentes Inactivos', inactivos],
      ['Total Residencias', residencias?.length || 0],
      ['Residencias Ocupadas', ocupadas],
      ['Residencias Desocupadas', desocupadas],
      ['Total Cuotas Generadas', totalCuotas],
      ['Total Pagos Registrados', totalPagos],
      ['Total Deuda Pendiente', `$${deudaPendiente.toFixed(2)}`],
      ['Comunicados Activos', comunicadosActivos],
    ];

    generatePDF({
      title: 'Reporte General del Sistema Residencial',
      filename: `reporte-general-${new Date().toISOString().split('T')[0]}.pdf`,
      columns,
      data
    });
  };

  const handleReporteResidentes = () => {
    const columns = ['ID', 'Cédula', 'Nombres y Apellidos', 'Teléfono', 'Estado'];
    const data = residentes?.map(r => [
      r.idResidente,
      r.cedula,
      `${r.nombres} ${r.apellidos}`,
      r.telefono,
      r.estado
    ]) || [];

    generatePDF({
      title: 'Reporte General de Residentes',
      filename: `reporte-residentes-${new Date().toISOString().split('T')[0]}.pdf`,
      columns,
      data
    });
  };

  const handleReporteResidencias = () => {
    const columns = ['Código', 'Cuota ($)', 'Estado', 'Propietario ID'];
    const data = residencias?.map(r => [
      r.codigoCasa,
      `$${r.cuotaMensual.toFixed(2)}`,
      r.estado,
      r.idPropietario ? r.idPropietario : 'Sin asignar'
    ]) || [];

    generatePDF({
      title: 'Reporte General de Residencias',
      filename: `reporte-residencias-${new Date().toISOString().split('T')[0]}.pdf`,
      columns,
      data
    });
  };

  const handleReporteMorosidad = () => {
    const cuotasDeudoras = cuotas?.filter(c => c.saldoPendiente > 0) || [];
    const columns = ['ID Cuota', 'Casa', 'Período', 'Valor Original', 'Deuda Pendiente'];
    const data = cuotasDeudoras.map(c => [
      c.idCuota,
      c.codigoCasa,
      `${c.mes}/${c.anio}`,
      `$${c.valor.toFixed(2)}`,
      `$${c.saldoPendiente.toFixed(2)}`
    ]);

    generatePDF({
      title: 'Reporte de Morosidad y Deudas',
      filename: `reporte-morosidad-${new Date().toISOString().split('T')[0]}.pdf`,
      columns,
      data
    });
  };

  const handleReportePagosPeriodo = () => {
    let pagosFiltrados = pagos || [];
    if (fechaInicio) {
      pagosFiltrados = pagosFiltrados.filter(p => new Date(p.fechaPago) >= new Date(fechaInicio));
    }
    if (fechaFin) {
      pagosFiltrados = pagosFiltrados.filter(p => new Date(p.fechaPago) <= new Date(fechaFin));
    }

    const columns = ['ID Pago', 'Casa', 'Cuota ID', 'Fecha', 'Monto Pagado', 'Estado'];
    const data = pagosFiltrados.map(p => [
      p.idPago,
      p.codigoCasa,
      p.idCuota,
      new Date(p.fechaPago).toLocaleDateString('es-EC'),
      `$${p.montoPagado.toFixed(2)}`,
      p.estado
    ]);

    generatePDF({
      title: `Reporte de Pagos ${fechaInicio ? 'desde ' + fechaInicio : ''} ${fechaFin ? 'hasta ' + fechaFin : ''}`,
      filename: `reporte-pagos-${new Date().toISOString().split('T')[0]}.pdf`,
      columns,
      data
    });
  };

  const handleReporteComunicados = () => {
    const columns = ['ID', 'Título', 'Prioridad', 'Fecha Creación', 'Estado'];
    const hoy = new Date();
    const data = comunicados?.map(c => {
      const isVencido = c.fechaVencimiento ? new Date(c.fechaVencimiento) < hoy : false;
      return [
        c.idComunicado,
        c.titulo,
        c.prioridad,
        new Date(c.createdAt).toLocaleDateString('es-EC'),
        isVencido ? 'VENCIDO' : 'ENVIADO'
      ];
    }) || [];

    generatePDF({
      title: 'Historial de Comunicados Emitidos',
      filename: `reporte-comunicados-${new Date().toISOString().split('T')[0]}.pdf`,
      columns,
      data
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Centro de Reportes</h1>
          <p className="text-slate-500 text-sm mt-1">
            Generación y descarga de información consolidada en formato PDF
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Reporte General */}
        <ReporteCard 
          title="Reporte General"
          description="Resumen global de todos los módulos del condominio (residentes, residencias, pagos, comunicados)."
          icon={<FileText className="w-6 h-6" />}
          action={<ExportPdfButton onClick={handleReporteGeneral} />}
        />

        {/* Reporte Residentes */}
        <ReporteCard 
          title="Reporte de Residentes"
          description="Listado completo de residentes, estado de sus cuentas, datos de contacto y casas asociadas."
          icon={<Users className="w-6 h-6" />}
          action={<ExportPdfButton onClick={handleReporteResidentes} />}
        />

        {/* Reporte Residencias */}
        <ReporteCard 
          title="Reporte de Residencias"
          description="Catastro de propiedades, indicando las que están ocupadas, vacías y sus cuotas."
          icon={<Home className="w-6 h-6" />}
          action={<ExportPdfButton onClick={handleReporteResidencias} />}
        />

        {/* Reporte Morosidad */}
        <ReporteCard 
          title="Reporte de Morosidad"
          description="Listado detallado de todas las cuotas que tienen saldos pendientes organizadas por casa."
          icon={<AlertCircle className="w-6 h-6" />}
          action={<ExportPdfButton onClick={handleReporteMorosidad} />}
        />

        {/* Reporte Comunicados */}
        <ReporteCard 
          title="Reporte de Comunicados"
          description="Historial de mensajes, alertas y oficios enviados a los residentes de manera masiva o individual."
          icon={<Megaphone className="w-6 h-6" />}
          action={<ExportPdfButton onClick={handleReporteComunicados} />}
        />

      </div>

      {/* Reporte Personalizado (Filtros de Pagos) */}
      <div className="mt-8 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-slate-50 text-slate-600 rounded-xl">
            <Wallet className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">Reporte de Pagos por Período</h3>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Inicio</label>
            <input 
              type="date" 
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Fin</label>
            <input 
              type="date" 
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            />
          </div>
          <div>
            <ExportPdfButton onClick={handleReportePagosPeriodo} />
          </div>
        </div>
      </div>
      
    </div>
  );
};
