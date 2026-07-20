import { useState, useMemo } from 'react';
import { Wallet, DollarSign, CreditCard, AlertCircle, Plus } from 'lucide-react';
import { useCuotas, useCrearCuota } from '../../hooks/useCuotas';
import { usePagos, useRegistrarPago } from '../../hooks/usePagos';
import { CuotaTable } from './components/CuotaTable';
import { PagoTable } from './components/PagoTable';
import { CuotaForm } from './components/CuotaForm';
import { PagoForm } from './components/PagoForm';
import { Modal } from './components/Modal';
import type { Cuota, CuotaRequest } from '../../types/cuota';
import type { PagoRequest } from '../../types/pago';

const extraerMensajeError = (error: unknown): string => {
  const axiosErr = error as { response?: { data?: { message?: string }; status?: number } };
  const status = axiosErr?.response?.status;
  const apiMsg = axiosErr?.response?.data?.message;

  if (apiMsg) return apiMsg;
  if (status === 400) return 'Datos inválidos. Verifique la información ingresada.';
  if (status === 404) return 'Recurso no encontrado.';
  if (status === 409) return 'Conflicto: ya existe un registro similar.';
  if (status === 500) return 'Error interno del servidor.';
  return 'No se pudo completar la operación.';
};

export const PagosPage = () => {
  const { data: cuotas, isLoading: isCuotasLoading, isError: isCuotasError } = useCuotas();
  const { data: pagos, isLoading: isPagosLoading, isError: isPagosError } = usePagos();
  
  const { mutateAsync: crearCuota, isPending: isCreandoCuota } = useCrearCuota();
  const { mutateAsync: registrarPago, isPending: isRegistrandoPago } = useRegistrarPago();

  const [activeTab, setActiveTab] = useState<'CUOTAS' | 'PAGOS'>('CUOTAS');
  
  const [isCuotaModalOpen, setIsCuotaModalOpen] = useState(false);
  const [isPagoModalOpen, setIsPagoModalOpen] = useState(false);
  const [cuotaSeleccionada, setCuotaSeleccionada] = useState<Cuota | null>(null);

  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const mostrarExito = (msj: string) => {
    setMensajeExito(msj);
    setMensajeError(null);
    setTimeout(() => setMensajeExito(null), 5000);
  };

  const mostrarError = (msj: string) => {
    setMensajeError(msj);
    setMensajeExito(null);
    setTimeout(() => setMensajeError(null), 5000);
  };

  // Cálculos para el resumen
  const resumen = useMemo(() => {
    let totalRecaudado = 0;
    let totalPendiente = 0;
    let deudaAcumulada = 0;

    cuotas?.forEach(c => {
      totalRecaudado += c.montoPagado;
      totalPendiente += c.saldoPendiente;
      if (c.saldoPendiente > 0) {
        deudaAcumulada += c.saldoPendiente; // Similar a pendiente, pero sumando conceptualmente la "deuda"
      }
    });

    return { totalRecaudado, totalPendiente, deudaAcumulada };
  }, [cuotas]);

  const handleCrearCuota = async (data: CuotaRequest) => {
    try {
      await crearCuota(data);
      setIsCuotaModalOpen(false);
      mostrarExito('Cuota generada correctamente');
    } catch (error) {
      mostrarError(extraerMensajeError(error));
    }
  };

  const handleRegistrarPago = async (data: PagoRequest) => {
    try {
      await registrarPago(data);
      setIsPagoModalOpen(false);
      setCuotaSeleccionada(null);
      mostrarExito('Pago registrado correctamente');
    } catch (error) {
      mostrarError(extraerMensajeError(error));
    }
  };

  const openPagoModal = (cuota: Cuota) => {
    setCuotaSeleccionada(cuota);
    setIsPagoModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestión de Pagos</h1>
          <p className="text-slate-500 text-sm mt-1">
            Control de cuotas mensuales y pagos de residentes
          </p>
        </div>
      </div>

      {/* Resumen Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center">
          <div className="p-3 bg-emerald-50 rounded-xl mr-4">
            <DollarSign className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Recaudado</p>
            <h3 className="text-2xl font-bold text-slate-800">${resumen.totalRecaudado.toFixed(2)}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center">
          <div className="p-3 bg-amber-50 rounded-xl mr-4">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pagos Pendientes</p>
            <h3 className="text-2xl font-bold text-slate-800">${resumen.totalPendiente.toFixed(2)}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center">
          <div className="p-3 bg-red-50 rounded-xl mr-4">
            <CreditCard className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Deuda Acumulada</p>
            <h3 className="text-2xl font-bold text-slate-800">${resumen.deudaAcumulada.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {mensajeExito && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center shadow-sm animate-in fade-in">
          <span className="font-medium text-sm">{mensajeExito}</span>
        </div>
      )}
      {mensajeError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center shadow-sm animate-in fade-in">
          <span className="font-medium text-sm">{mensajeError}</span>
        </div>
      )}

      {/* Tabs y Acciones */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-xl w-full md:w-auto">
            <button
              onClick={() => setActiveTab('CUOTAS')}
              className={`flex items-center justify-center flex-1 md:flex-none px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'CUOTAS'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Wallet className="w-4 h-4 mr-2" />
              Cuotas Mensuales
            </button>
            <button
              onClick={() => setActiveTab('PAGOS')}
              className={`flex items-center justify-center flex-1 md:flex-none px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'PAGOS'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Historial de Pagos
            </button>
          </div>

          <div>
            {activeTab === 'CUOTAS' && (
              <button
                onClick={() => setIsCuotaModalOpen(true)}
                className="flex items-center px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Generar Cuota
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      {activeTab === 'CUOTAS' ? (
        <CuotaTable 
          cuotas={cuotas} 
          isLoading={isCuotasLoading} 
          isError={isCuotasError} 
          onPagar={openPagoModal}
        />
      ) : (
        <PagoTable 
          pagos={pagos} 
          isLoading={isPagosLoading} 
          isError={isPagosError} 
        />
      )}

      {/* Modales */}
      <Modal 
        isOpen={isCuotaModalOpen} 
        onClose={() => setIsCuotaModalOpen(false)} 
        title="Generar Cuota Mensual"
      >
        <CuotaForm 
          onSubmit={handleCrearCuota}
          isLoading={isCreandoCuota}
          onCancel={() => setIsCuotaModalOpen(false)}
        />
      </Modal>

      <Modal 
        isOpen={isPagoModalOpen} 
        onClose={() => {
          setIsPagoModalOpen(false);
          setCuotaSeleccionada(null);
        }} 
        title="Registrar Pago"
      >
        {cuotaSeleccionada && (
          <PagoForm 
            cuota={cuotaSeleccionada}
            onSubmit={handleRegistrarPago}
            isLoading={isRegistrandoPago}
            onCancel={() => {
              setIsPagoModalOpen(false);
              setCuotaSeleccionada(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};
