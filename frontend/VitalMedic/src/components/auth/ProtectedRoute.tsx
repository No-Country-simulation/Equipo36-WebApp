import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types/authType';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  fallbackPath 
}) => {
  const { isAuthenticated, hasAnyRole, getDefaultDashboardPath } = useAuth();
  const location = useLocation();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Si no tiene los roles requeridos, redirigir
  if (!hasAnyRole(allowedRoles)) {
    const redirectPath = fallbackPath || getDefaultDashboardPath();
    return <Navigate to={redirectPath} replace />;
  }

  // Si tiene acceso, mostrar el contenido
  return <>{children}</>;
};

export default ProtectedRoute;