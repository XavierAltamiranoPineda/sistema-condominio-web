import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Users, Building, FileText, CreditCard, Bell } from 'lucide-react';
import clsx from 'clsx';

export const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Residentes', path: '/residentes' },
    { icon: Building, label: 'Residencias', path: '/residencias' },
    { icon: CreditCard, label: 'Pagos', path: '/pagos' },
    { icon: Bell, label: 'Comunicados', path: '/comunicados' },
    { icon: FileText, label: 'Reportes', path: '/reportes' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800">
          <div className="p-2 bg-blue-600/20 rounded-lg mr-3">
            <Building className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-xl font-bold tracking-tight">CondoAdmin</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1.5 px-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    "flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all",
                    isActive 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  )}
                >
                  <item.icon className={clsx("w-5 h-5 mr-3", isActive ? "text-blue-200" : "text-slate-500")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-bold text-white mr-3 shadow-inner">
              {user?.usuario?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user?.usuario}</p>
              <p className="text-xs text-slate-400 truncate">{user?.roles[0]?.replace('ROLE_', '')}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 border border-slate-800 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all group"
          >
            <LogOut className="w-4 h-4 mr-2 group-hover:text-red-400 transition-colors" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-slate-800">
            {navItems.find(item => item.path === location.pathname)?.label || 'Panel de Administración'}
          </h2>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto fade-in">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
