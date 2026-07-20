import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el usuario tiene al menos uno de los roles permitidos
  if (allowedRoles && user) {
    const hasRole = user.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      // Si no tiene el rol, podríamos redirigir a una página de No Autorizado o al Dashboard principal
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};
