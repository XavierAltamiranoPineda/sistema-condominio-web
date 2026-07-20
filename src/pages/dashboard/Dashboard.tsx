import { Users, Building, CreditCard, Bell, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bienvenido, {user?.usuario}</h1>
          <p className="text-slate-500 mt-1">Aquí tienes un resumen del estado del condominio.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tarjeta 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/50 hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              +12% <ArrowUpRight className="w-3 h-3 ml-1" />
            </span>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900">--</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Total Residentes</p>
          </div>
        </div>

        {/* Tarjeta 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/50 hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Building className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900">--</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Residencias Registradas</p>
          </div>
        </div>

        {/* Tarjeta 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/50 hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900">--</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Pagos Pendientes</p>
          </div>
        </div>

        {/* Tarjeta 4 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/50 hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900">--</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Comunicados Activos</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100/50 min-h-[400px]">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Actividad Reciente</h3>
          <div className="flex items-center justify-center h-[300px] bg-slate-50 rounded-xl border border-dashed border-slate-200">
             <p className="text-slate-400">Gráficos en desarrollo</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/50 min-h-[400px]">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Últimos Comunicados</h3>
          <div className="flex items-center justify-center h-[300px] bg-slate-50 rounded-xl border border-dashed border-slate-200">
             <p className="text-slate-400">Sin comunicados recientes</p>
          </div>
        </div>
      </div>
    </div>
  );
};
