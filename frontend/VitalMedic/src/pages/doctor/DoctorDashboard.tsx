import React, { useState, useEffect } from 'react';
import { DoctorService } from '../../services/doctorService';
import type { Doctor } from '../../services/doctorService';
import DoctorHeader from '../../components/doctor/DoctorHeader';
import DoctorStats from '../../components/doctor/DoctorStats';
import DoctorAppointments from '../../components/doctor/DoctorAppointments';
import DoctorNextSlots from '../../components/doctor/DoctorNextSlots';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';

export type TabType = 'dashboard' | 'agenda' | 'patients' | 'historiales' | 'teleconsultas' | 'reportes';

interface DoctorSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const DoctorDashboard: React.FC = () => {
  const [doctorProfile, setDoctorProfile] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  // Simulación de datos para los componentes
  const stats = [
    { label: 'Pacientes Activos', value: 45 },
    { label: 'Consultas Este Mes', value: 128 },
    { label: 'Nuevos Pacientes', value: 8 },
  ];
  const appointments = [
    { name: 'María González', time: '09:00 AM', type: 'Consulta general', status: 'CONFIRMADO' as const, initials: 'MG' },
    { name: 'Carlos Ruiz', time: '10:30 AM', type: 'Seguimiento', status: 'PENDIENTE' as const, initials: 'CR' },
    { name: 'Ana Martín', time: '02:00 PM', type: 'Primera consulta', status: 'CONFIRMADO' as const, initials: 'AM' },
  ];
  const [selectedSlot, setSelectedSlot] = useState('16:00');
  const nextSlots = ['16:00', '16:30', '17:00', '17:30'];

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

  const renderDashboardTab = () => (
    <div className="dashboard-section">
      <h3>Bienvenido al Panel Médico</h3>
      <div className="dashboard-welcome">Tienes 8 citas programadas para hoy</div>
      <div className="dashboard-stats">
        <div className="stat-card"><div className="stat-number">12</div><div className="stat-label">Citas Hoy</div></div>
        <div className="stat-card"><div className="stat-number">3</div><div className="stat-label">En Espera</div></div>
        <div className="stat-card"><div className="stat-number">5</div><div className="stat-label">Virtuales</div></div>
        <div className="stat-card"><div className="stat-number">92%</div><div className="stat-label">Satisfacción</div></div>
      </div>
    </div>
  );

  const renderAgendaTab = () => (
    <div className="agenda-section">
      <h3>Mi Agenda</h3>
      <div className="agenda-content">
        <DoctorAppointments appointments={appointments} />
        <DoctorNextSlots slots={nextSlots} selectedSlot={selectedSlot} onSelect={setSelectedSlot} />
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
        <DoctorStats stats={stats} />
        {/* Aquí puedes agregar un componente para pacientes recientes si lo deseas */}
      </div>
    </div>
  );

  const renderHistorialesTab = () => (
    <div className="historiales-section">
      <h3>Historiales</h3>
      <div>Contenido de historiales (mock)</div>
    </div>
  );

  const renderTeleconsultasTab = () => (
    <div className="teleconsultas-section">
      <h3>Teleconsultas</h3>
      <div>Contenido de teleconsultas (mock)</div>
    </div>
  );

  const renderReportesTab = () => (
    <div className="reportes-section">
      <h3>Reportes</h3>
      <div>Contenido de reportes (mock)</div>
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
      <div className="doctor-main-layout">
        <DoctorSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="doctor-main-content">
          {doctorProfile && (
            <DoctorHeader name={`Dr. ${doctorProfile.firstName} ${doctorProfile.lastName}`} specialty={doctorProfile.specialty} />
          )}
          <div className="doctor-content">
            {activeTab === 'dashboard' && renderDashboardTab()}
            {activeTab === 'agenda' && renderAgendaTab()}
            {activeTab === 'patients' && renderPatientsTab()}
            {activeTab === 'historiales' && renderHistorialesTab()}
            {activeTab === 'teleconsultas' && renderTeleconsultasTab()}
            {activeTab === 'reportes' && renderReportesTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;