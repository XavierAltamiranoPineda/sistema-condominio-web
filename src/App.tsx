import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Login } from './pages/auth/Login';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/dashboard/Dashboard';
import { ResidentesPage } from './pages/residentes/ResidentesPage';
import { ResidenciasPage } from './pages/residencias/ResidenciasPage';

import { PagosPage } from './pages/pagos/PagosPage';
import { ComunicadosPage } from './pages/comunicados/ComunicadosPage';

import { ReportesPage } from './pages/reportes/ReportesPage';

const queryClient = new QueryClient();

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
                  <Route path="/pagos" element={<PagosPage />} />
                  <Route path="/comunicados" element={<ComunicadosPage />} />
                  <Route path="/reportes" element={<ReportesPage />} />
                </Route>
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
