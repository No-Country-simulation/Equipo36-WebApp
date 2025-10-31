import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types/authType';

interface AccessDeniedProps {
  requiredRoles: UserRole[];
  message?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ 
  requiredRoles, 
  message 
}) => {
  const { userProfile, getPrimaryRole, getDefaultDashboardPath } = useAuth();
  const userRole = getPrimaryRole();
  const defaultPath = getDefaultDashboardPath();

  return (
    <div className="access-denied">
      <div className="access-denied-content">
        <div className="access-denied-icon">🚫</div>
        <h2>Acceso Denegado</h2>
        
        <p className="access-denied-message">
          {message || 'No tienes permisos para acceder a esta sección.'}
        </p>
        
        <div className="access-info">
          <p><strong>Usuario:</strong> {userProfile?.firstName} {userProfile?.lastName}</p>
          <p><strong>Tu rol:</strong> {userRole}</p>
          <p><strong>Roles requeridos:</strong> {requiredRoles.join(', ')}</p>
        </div>

        <div className="access-actions">
          <a href={defaultPath} className="back-btn">
            Ir a mi panel ({userRole.toLowerCase()})
          </a>
          
          <div className="available-panels">
            <h4>Paneles disponibles según rol:</h4>
            <ul>
              {userRole === 'ADMIN' && (
                <>
                  <li><a href="/dashboard/admin">📊 Panel de Administración</a></li>
                  <li><a href="/dashboard/doctor">👨‍⚕️ Panel de Doctor</a></li>
                  <li><a href="/dashboard/app/patient">👤 Panel de Paciente</a></li>
                </>
              )}
              {userRole === 'DOCTOR' && (
                <>
                  <li><a href="/dashboard/doctor">👨‍⚕️ Panel de Doctor</a></li>
                  <li><a href="/dashboard/app/patient">👤 Panel de Paciente</a></li>
                </>
              )}
              {userRole === 'PATIENT' && (
                <li><a href="/dashboard/app/patient">👤 Panel de Paciente</a></li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;