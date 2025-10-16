import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const UserManagement: React.FC = () => {
  const { hasRole } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userType, setUserType] = useState<'admin' | 'doctor' | 'patient'>('patient');

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    specialty: '', // Solo para doctores
    licenseNumber: '', // Solo para doctores
    experience: '', // Solo para doctores
    phone: ''
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aquí iría la lógica para crear el usuario
    console.log('Creando usuario:', { ...newUser, type: userType });
    
    // Reset form
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      specialty: '',
      licenseNumber: '',
      experience: '',
      phone: ''
    });
    setShowCreateForm(false);
  };

  // Solo los admins pueden crear usuarios
  if (!hasRole('ADMIN')) {
    return (
      <div className="access-denied">
        <p>Solo los administradores pueden gestionar usuarios.</p>
      </div>
    );
  }

  return (
    <div className="user-management">
      <h2>Gestión de Usuarios</h2>
      
      <div className="create-user-section">
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="create-btn"
        >
          {showCreateForm ? 'Cancelar' : 'Crear Usuario de Prueba'}
        </button>

        {showCreateForm && (
          <div className="create-user-form">
            <h3>Crear Usuario para Testing</h3>
            
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label>Tipo de Usuario</label>
                <select 
                  value={userType} 
                  onChange={(e) => setUserType(e.target.value as 'admin' | 'doctor' | 'patient')}
                >
                  <option value="patient">Paciente</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Apellido *</label>
                  <input
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono *</label>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Contraseña *</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                />
              </div>

              {userType === 'doctor' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Especialidad *</label>
                      <input
                        type="text"
                        value={newUser.specialty}
                        onChange={(e) => setNewUser({...newUser, specialty: e.target.value})}
                        placeholder="ej. Medicina General"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Número de Licencia *</label>
                      <input
                        type="text"
                        value={newUser.licenseNumber}
                        onChange={(e) => setNewUser({...newUser, licenseNumber: e.target.value})}
                        placeholder="ej. MED-2024-001"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Experiencia *</label>
                    <textarea
                      value={newUser.experience}
                      onChange={(e) => setNewUser({...newUser, experience: e.target.value})}
                      placeholder="Describe la experiencia profesional"
                      rows={3}
                      required
                    />
                  </div>
                </>
              )}

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Crear {userType === 'admin' ? 'Administrador' : userType === 'doctor' ? 'Doctor' : 'Paciente'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowCreateForm(false)}
                  className="cancel-btn"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="test-accounts">
        <h3>Cuentas de Prueba Recomendadas</h3>
        <div className="account-suggestions">
          <div className="account-card">
            <h4>👤 Paciente de Prueba</h4>
            <p><strong>Email:</strong> paciente@vitalmedic.com</p>
            <p><strong>Password:</strong> [Configurar en Keycloak]</p>
            <p><strong>Acceso:</strong> Solo panel de paciente</p>
          </div>
          
          <div className="account-card">
            <h4>👨‍⚕️ Doctor de Prueba</h4>
            <p><strong>Email:</strong> doctor@vitalmedic.com</p>
            <p><strong>Password:</strong> [Configurar en Keycloak]</p>
            <p><strong>Acceso:</strong> Panel de doctor + paciente</p>
          </div>
          
          <div className="account-card">
            <h4>⚙️ Admin de Prueba</h4>
            <p><strong>Email:</strong> admin@vitalmedic.com</p>
            <p><strong>Password:</strong> [Configurar en Keycloak]</p>
            <p><strong>Acceso:</strong> Todos los paneles</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;