import React from 'react';
import type { Doctor } from '../../services/doctorService';
import type { SpecialtyItem } from '../../services/specialtyService';

interface AdminDoctorFormProps {
  isVisible: boolean;
  editingDoctor: Doctor | null;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    specialty: number;
    licenseNumber: string;
    experience: string;
    phone: string;
    password: string;
  };
  setFormData: (data: any) => void;
  specialties: SpecialtyItem[];
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isModal?: boolean;
}

const AdminDoctorForm: React.FC<AdminDoctorFormProps> = ({
  isVisible,
  editingDoctor,
  formData,
  setFormData,
  specialties,
  loading,
  onSubmit,
  onCancel,
  isModal = false,
}) => {
  if (!isVisible) return null;

  const containerClasses = isModal
    ? "p-8"
    : "bg-white border border-gray-200 rounded-2xl p-8 shadow-lg mb-6";

  const headerClasses = isModal
    ? "flex items-center justify-between mb-8"
    : "flex items-center justify-between mb-6";

  const titleClasses = isModal
    ? "text-2xl font-bold text-white mb-2"
    : "text-lg font-semibold text-gray-900";

  const subtitleClasses = isModal
    ? "text-white/80"
    : "text-sm text-gray-600 mt-1";

  const closeButtonClasses = isModal
    ? "text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
    : "text-gray-400 hover:text-gray-600";

  const sectionClasses = isModal
    ? "backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6"
    : "bg-gray-50 rounded-lg p-4";

  const sectionTitleClasses = isModal
    ? "text-lg font-semibold text-white mb-6 flex items-center gap-2"
    : "text-sm font-medium text-gray-900 mb-4";

  const labelClasses = isModal
    ? "block text-sm font-medium text-white/90 mb-2"
    : "block text-sm font-medium text-gray-700 mb-1";

  const inputClasses = isModal
    ? "w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
    : "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  const selectClasses = isModal
    ? "w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
    : "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  const textareaClasses = isModal
    ? "w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200 resize-none"
    : "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  const actionsClasses = isModal
    ? "flex justify-end space-x-4 pt-6 border-t border-white/20"
    : "flex justify-end space-x-3 pt-4 border-t border-gray-200";

  const cancelButtonClasses = isModal
    ? "px-6 py-3 border border-white/30 rounded-xl text-white hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
    : "px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors";

  const submitButtonClasses = isModal
    ? "px-8 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
    : "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

  return (
    <div className={containerClasses}>
      <div className={headerClasses}>
        <div>
          <h3 className={titleClasses}>
            {editingDoctor ? 'Editar Médico' : 'Crear Nuevo Médico'}
          </h3>
          <p className={subtitleClasses}>
            {editingDoctor ? 'Modifica la información del médico' : 'Ingresa los datos del nuevo médico'}
          </p>
        </div>
        <button
          onClick={onCancel}
          className={closeButtonClasses}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* Información Personal */}
        <div className={sectionClasses}>
          <h4 className={sectionTitleClasses}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Información Personal
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>
                Nombre(s) *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className={inputClasses}
                placeholder="Ingresa el nombre"
                required
              />
            </div>
            <div>
              <label className={labelClasses}>
                Apellidos *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className={inputClasses}
                placeholder="Ingresa los apellidos"
                required
              />
            </div>
          </div>
        </div>

        {/* Información de Contacto */}
        <div className={sectionClasses}>
          <h4 className={sectionTitleClasses}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Información de Contacto
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClasses}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            <div>
              <label className={labelClasses}>
                Teléfono *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={inputClasses}
                placeholder="+57 300 123 4567"
                required
              />
            </div>
          </div>
        </div>

        {/* Información Profesional */}
        <div className={sectionClasses}>
          <h4 className={sectionTitleClasses}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Información Profesional
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>
                Especialidad *
              </label>
              <select
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: Number(e.target.value) })}
                className={selectClasses}
                required
              >
                <option value={0} disabled>Seleccione especialidad</option>
                {specialties.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClasses}>
                Número de Licencia *
              </label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                placeholder="ej. MED-2024-001"
                className={inputClasses}
                required
              />
            </div>
          </div>
          <div className="mt-6">
            <label className={labelClasses}>
              Experiencia *
            </label>
            <textarea
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              placeholder="Describe la experiencia del médico"
              rows={4}
              className={textareaClasses}
              required
            />
          </div>
        </div>

        {/* Seguridad */}
        {!editingDoctor && (
          <div className={sectionClasses}>
            <h4 className={sectionTitleClasses}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Seguridad
            </h4>
            <div>
              <label className={labelClasses}>
                Contraseña *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={inputClasses}
                placeholder="Contraseña segura"
                required
              />
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className={actionsClasses}>
          <button
            type="button"
            onClick={onCancel}
            className={cancelButtonClasses}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className={submitButtonClasses}
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {editingDoctor ? (loading ? 'Guardando...' : 'Guardar Cambios') : (loading ? 'Creando...' : 'Crear Médico')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminDoctorForm;