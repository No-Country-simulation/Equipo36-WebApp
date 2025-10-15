import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RoleSelector: React.FC = () => {
  const navigate = useNavigate();
  const { hasRole, userProfile, getPrimaryRole } = useAuth();
  const primaryRole = getPrimaryRole();

  const handleRoleSelection = (role: 'patient' | 'doctor' | 'admin') => {
    navigate(`/dashboard/${role}`);
  };

  // Redirigir automáticamente al panel principal del usuario
  React.useEffect(() => {
    const timer = setTimeout(() => {
      switch (primaryRole) {
        case 'ADMIN':
          navigate('/dashboard/admin');
          break;
        case 'DOCTOR':
          navigate('/dashboard/doctor');
          break;
        case 'PATIENT':
        default:
          navigate('/dashboard/patient');
          break;
      }
    }, 3000); // Esperar 3 segundos antes de redirigir automáticamente

    return () => clearTimeout(timer);
  }, [navigate, primaryRole]);

  return (
    <div className="role-selector">
      <div className="role-selector-content">
        <h1>Bienvenido a VitalMedic</h1>
        <div className="user-info">
          <p>Hola, <strong>{userProfile?.firstName} {userProfile?.lastName}</strong></p>
          <p>Tu rol principal: <strong>{primaryRole}</strong></p>
        </div>
        
        <p>Selecciona el panel al que deseas acceder:</p>
        
        <div className="role-cards">
          {/* Solo mostrar el panel de paciente si el usuario tiene acceso */}
          {hasRole('PATIENT') && (
            <div className="role-card" onClick={() => handleRoleSelection('patient')}>
              <div className="role-icon">👤</div>
              <h3>Panel de Paciente</h3>
              <p>Gestiona tus citas médicas, historial y configuración</p>
              <ul>
                <li>Mis citas</li>
                <li>Historial médico</li>
                <li>Agendar cita</li>
                <li>Configuración</li>
              </ul>
            </div>
          )}

          {/* Solo mostrar el panel de doctor si el usuario tiene acceso */}
          {hasRole('DOCTOR') && (
            <div className="role-card" onClick={() => handleRoleSelection('doctor')}>
              <div className="role-icon">👨‍⚕️</div>
              <h3>Panel de Doctor</h3>
              <p>Gestiona tu agenda, pacientes y perfil profesional</p>
              <ul>
                <li>Mi agenda</li>
                <li>Mis pacientes</li>
                <li>Perfil profesional</li>
                <li>Estadísticas</li>
              </ul>
            </div>
          )}

          {/* Solo mostrar el panel de admin si el usuario tiene acceso */}
          {hasRole('ADMIN') && (
            <div className="role-card" onClick={() => handleRoleSelection('admin')}>
              <div className="role-icon">⚙️</div>
              <h3>Panel de Administración</h3>
              <p>Gestiona el consultorio, doctores y configuraciones</p>
              <ul>
                <li>Gestión de doctores</li>
                <li>Crear nuevos doctores</li>
                <li>Configuración del consultorio</li>
                <li>Reportes</li>
              </ul>
            </div>
          )}
        </div>

        <div className="auto-redirect">
          <p>� Te redirigiremos automáticamente a tu panel principal en unos segundos...</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;