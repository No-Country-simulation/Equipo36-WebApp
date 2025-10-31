import React from "react";

type TabType = 'dashboard' | 'agenda' | 'patients' | 'historiales' | 'teleconsultas' | 'reportes';
interface DoctorSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const DoctorSidebar: React.FC<DoctorSidebarProps> = ({ activeTab, onTabChange }) => (
  <aside className="doctor-sidebar">
    <button
      className={`sidebar-tab${activeTab === 'dashboard' ? ' active' : ''}`}
      onClick={() => onTabChange('dashboard')}
    >
      Dashboard
    </button>
    <button
      className={`sidebar-tab${activeTab === 'agenda' ? ' active' : ''}`}
      onClick={() => onTabChange('agenda')}
    >
      Mi Agenda
    </button>
    <button
      className={`sidebar-tab${activeTab === 'patients' ? ' active' : ''}`}
      onClick={() => onTabChange('patients')}
    >
      Pacientes
    </button>
    <button
      className={`sidebar-tab${activeTab === 'historiales' ? ' active' : ''}`}
      onClick={() => onTabChange('historiales')}
    >
      Historiales
    </button>
    <button
      className={`sidebar-tab${activeTab === 'teleconsultas' ? ' active' : ''}`}
      onClick={() => onTabChange('teleconsultas')}
    >
      Teleconsultas
    </button>
    <button
      className={`sidebar-tab${activeTab === 'reportes' ? ' active' : ''}`}
      onClick={() => onTabChange('reportes')}
    >
      Reportes
    </button>
  </aside>
);

export default DoctorSidebar;
