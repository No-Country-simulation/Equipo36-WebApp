import React, { useState, useEffect } from 'react';
import { DoctorService } from '../../services/doctorService';
import type { Doctor } from '../../services/doctorService';
import UserManagement from '../../components/admin/UserManagement';

const AdminDashboard: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'doctors' | 'users'>('doctors');

  const [newDoctor, setNewDoctor] = useState({
    firstName: '',
    lastName: '',
    email: '',
    specialty: '',
    licenseNumber: '',
    experience: '',
    phone: '',
    password: ''
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const doctorsData = await DoctorService.getAllDoctors();
      setDoctors(doctorsData);
    } catch (error: any) {
      setError('Error al cargar los doctores: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await DoctorService.createDoctor(newDoctor);
      setShowCreateForm(false);
      setNewDoctor({
        firstName: '',
        lastName: '',
        email: '',
        specialty: '',
        licenseNumber: '',
        experience: '',
        phone: '',
        password: ''
      });
      await loadDoctors(); // Recargar la lista
    } catch (error: any) {
      setError('Error al crear doctor: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este doctor?')) {
      return;
    }

    setLoading(true);
    try {
      await DoctorService.deleteDoctor(id);
      await loadDoctors(); // Recargar la lista
    } catch (error: any) {
      setError('Error al eliminar doctor: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Panel de Administración - VitalMedic</h1>
        <p>Gestión del consultorio y doctores</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="admin-content">
        <div className="admin-tabs">
          <button 
            className={`tab ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            Gestión de Doctores
          </button>
          <button 
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Gestión de Usuarios
          </button>
        </div>

        {activeTab === 'doctors' && (
        <div className="doctors-section">
          <div className="section-header">
            <h2>Gestión de Doctores</h2>
            <button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="create-btn"
            >
              {showCreateForm ? 'Cancelar' : 'Agregar Doctor'}
            </button>
          </div>

          {showCreateForm && (
            <div className="create-doctor-form">
              <h3>Crear Nuevo Doctor</h3>
              <form onSubmit={handleCreateDoctor}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre(s) *</label>
                    <input
                      type="text"
                      value={newDoctor.firstName}
                      onChange={(e) => setNewDoctor({...newDoctor, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Apellidos *</label>
                    <input
                      type="text"
                      value={newDoctor.lastName}
                      onChange={(e) => setNewDoctor({...newDoctor, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={newDoctor.email}
                      onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Teléfono *</label>
                    <input
                      type="tel"
                      value={newDoctor.phone}
                      onChange={(e) => setNewDoctor({...newDoctor, phone: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Especialidad *</label>
                    <input
                      type="text"
                      value={newDoctor.specialty}
                      onChange={(e) => setNewDoctor({...newDoctor, specialty: e.target.value})}
                      placeholder="ej. Medicina General, Cardiología"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Número de Licencia *</label>
                    <input
                      type="text"
                      value={newDoctor.licenseNumber}
                      onChange={(e) => setNewDoctor({...newDoctor, licenseNumber: e.target.value})}
                      placeholder="ej. MED-2024-001"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Experiencia *</label>
                  <textarea
                    value={newDoctor.experience}
                    onChange={(e) => setNewDoctor({...newDoctor, experience: e.target.value})}
                    placeholder="Describe la experiencia del doctor"
                    rows={3}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Contraseña *</label>
                  <input
                    type="password"
                    value={newDoctor.password}
                    onChange={(e) => setNewDoctor({...newDoctor, password: e.target.value})}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'Creando...' : 'Crear Doctor'}
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

          <div className="doctors-list">
            {loading && <div className="loading">Cargando doctores...</div>}
            
            {!loading && doctors.length === 0 && (
              <div className="no-data">No hay doctores registrados</div>
            )}

            {!loading && doctors.length > 0 && (
              <div className="doctors-grid">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="doctor-card">
                    <div className="doctor-info">
                      <h3>{doctor.firstName} {doctor.lastName}</h3>
                      <p className="specialty">{doctor.specialty}</p>
                      <p className="license">Licencia: {doctor.licenseNumber}</p>
                      <p className="phone">📞 {doctor.phone}</p>
                      <p className="email">✉️ {doctor.user.email}</p>
                      <p className="experience">{doctor.experience}</p>
                    </div>
                    <div className="doctor-actions">
                      <button 
                        onClick={() => handleDeleteDoctor(doctor.id)}
                        className="delete-btn"
                        disabled={loading}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        )}

        {activeTab === 'users' && (
          <UserManagement />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;