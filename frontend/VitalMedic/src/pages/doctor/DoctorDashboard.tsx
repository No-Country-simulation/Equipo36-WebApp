import React, { useState, useEffect } from 'react';
import { DoctorService } from '../../services/doctorService';
import type { Doctor } from '../../services/doctorService';

const DoctorDashboard: React.FC = () => {
  const [doctorProfile, setDoctorProfile] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'agenda' | 'patients' | 'profile'>('agenda');

  // Simular el ID del doctor logueado (en una app real vendría del contexto de autenticación)
  const currentDoctorId = "9a7b8c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d"; // Dr. Juan García

  useEffect(() => {
    loadDoctorProfile();
  }, []);

  const loadDoctorProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const doctorData = await DoctorService.getDoctorById(currentDoctorId);
      setDoctorProfile(doctorData);
    } catch (error: any) {
      setError('Error al cargar el perfil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderAgendaTab = () => (
    <div className="agenda-section">
      <h3>Mi Agenda</h3>
      <div className="agenda-content">
        <div className="today-appointments">
          <h4>Citas de Hoy</h4>
          <div className="appointment-list">
            <div className="appointment-item">
              <div className="appointment-time">09:00 AM</div>
              <div className="appointment-patient">
                <strong>María González</strong>
                <p>Consulta general</p>
              </div>
              <div className="appointment-status">Programada</div>
            </div>
            
            <div className="appointment-item">
              <div className="appointment-time">10:30 AM</div>
              <div className="appointment-patient">
                <strong>Carlos Ruiz</strong>
                <p>Seguimiento</p>
              </div>
              <div className="appointment-status">En espera</div>
            </div>
            
            <div className="appointment-item">
              <div className="appointment-time">02:00 PM</div>
              <div className="appointment-patient">
                <strong>Ana Martín</strong>
                <p>Primera consulta</p>
              </div>
              <div className="appointment-status">Programada</div>
            </div>
          </div>
        </div>

        <div className="agenda-actions">
          <button className="action-btn">Ver Agenda Completa</button>
          <button className="action-btn">Bloquear Horario</button>
        </div>
      </div>
    </div>
  );

  const renderPatientsTab = () => (
    <div className="patients-section">
      <h3>Mis Pacientes</h3>
      <div className="patients-content">
        <div className="patients-stats">
          <div className="stat-card">
            <h4>Pacientes Activos</h4>
            <p className="stat-number">45</p>
          </div>
          <div className="stat-card">
            <h4>Consultas Este Mes</h4>
            <p className="stat-number">128</p>
          </div>
          <div className="stat-card">
            <h4>Nuevos Pacientes</h4>
            <p className="stat-number">8</p>
          </div>
        </div>

        <div className="recent-patients">
          <h4>Pacientes Recientes</h4>
          <div className="patient-list">
            <div className="patient-item">
              <div className="patient-info">
                <strong>María González</strong>
                <p>Última consulta: Hace 2 días</p>
                <p>Diagnóstico: Hipertensión controlada</p>
              </div>
              <button className="view-btn">Ver Historial</button>
            </div>
            
            <div className="patient-item">
              <div className="patient-info">
                <strong>Carlos Ruiz</strong>
                <p>Última consulta: Hace 1 semana</p>
                <p>Diagnóstico: Diabetes tipo 2</p>
              </div>
              <button className="view-btn">Ver Historial</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="profile-section">
      <h3>Mi Perfil Profesional</h3>
      {doctorProfile && (
        <div className="profile-content">
          <div className="profile-info">
            <div className="info-group">
              <label>Nombre Completo</label>
              <p>{doctorProfile.firstName} {doctorProfile.lastName}</p>
            </div>
            
            <div className="info-group">
              <label>Especialidad</label>
              <p>{doctorProfile.specialty}</p>
            </div>
            
            <div className="info-group">
              <label>Número de Licencia</label>
              <p>{doctorProfile.licenseNumber}</p>
            </div>
            
            <div className="info-group">
              <label>Experiencia</label>
              <p>{doctorProfile.experience}</p>
            </div>
            
            <div className="info-group">
              <label>Teléfono</label>
              <p>{doctorProfile.phone}</p>
            </div>
            
            <div className="info-group">
              <label>Email</label>
              <p>{doctorProfile.user.email}</p>
            </div>
          </div>
          
          <div className="profile-actions">
            <button className="edit-btn">Editar Perfil</button>
            <button className="schedule-btn">Configurar Horarios</button>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return <div className="loading">Cargando panel del doctor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="doctor-dashboard">
      <div className="doctor-header">
        <h1>Panel del Doctor - VitalMedic</h1>
        {doctorProfile && (
          <div className="doctor-welcome">
            <p>Bienvenido, Dr. {doctorProfile.firstName} {doctorProfile.lastName}</p>
            <span className="specialty">{doctorProfile.specialty}</span>
          </div>
        )}
      </div>

      <div className="doctor-tabs">
        <button 
          className={`tab ${activeTab === 'agenda' ? 'active' : ''}`}
          onClick={() => setActiveTab('agenda')}
        >
          Mi Agenda
        </button>
        <button 
          className={`tab ${activeTab === 'patients' ? 'active' : ''}`}
          onClick={() => setActiveTab('patients')}
        >
          Mis Pacientes
        </button>
        <button 
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Mi Perfil
        </button>
      </div>

      <div className="doctor-content">
        {activeTab === 'agenda' && renderAgendaTab()}
        {activeTab === 'patients' && renderPatientsTab()}
        {activeTab === 'profile' && renderProfileTab()}
      </div>
    </div>
  );
};

export default DoctorDashboard;