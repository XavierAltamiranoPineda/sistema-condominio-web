import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Login } from './pages/auth/Login';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/dashboard/Dashboard';
import { ResidentesPage } from './pages/residentes/ResidentesPage';
import { ResidenciasPage } from './pages/residencias/ResidenciasPage';

const queryClient = new QueryClient();

// Componentes temporales (Placeholders)
const Placeholder = ({ title }: { title: string }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100/50 h-[600px] flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-slate-700 mb-2">{title}</h2>
      <p className="text-slate-400">Módulo en construcción...</p>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Rutas generales protegidas para cualquier usuario autenticado */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMINISTRADOR', 'ROLE_RESIDENTE']} />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                
                {/* Rutas exclusivas para el Administrador */}
                <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMINISTRADOR']} />}>
                  <Route path="/residentes" element={<ResidentesPage />} />
                  <Route path="/residencias" element={<ResidenciasPage />} />
                </Route>

                <Route path="/pagos" element={<Placeholder title="Gestión de Pagos" />} />
                <Route path="/comunicados" element={<Placeholder title="Comunicados" />} />
                <Route path="/reportes" element={<Placeholder title="Reportes" />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
