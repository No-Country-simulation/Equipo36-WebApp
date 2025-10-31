import React, { useState } from 'react';
import type { Doctor } from '../../services/doctorService';
import type { SpecialtyItem } from '../../services/specialtyService';
import AdminDoctorForm from './AdminDoctorForm';

interface AdminDoctorsTableProps {
  doctors: Doctor[];
  specialties: SpecialtyItem[];
  search: string;
  setSearch: (value: string) => void;
  filterSpecialty: number;
  setFilterSpecialty: (value: number) => void;
  onExportCsv: () => void;
  onCreateNew: () => void;
  onEdit: (doctor: Doctor) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

interface AdminDoctorsTableProps {
  doctors: Doctor[];
  specialties: SpecialtyItem[];
  search: string;
  setSearch: (value: string) => void;
  filterSpecialty: number;
  setFilterSpecialty: (value: number) => void;
  onExportCsv: () => void;
  onCreateNew: () => void;
  onEdit: (doctor: Doctor) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

const AdminDoctorsTable: React.FC<AdminDoctorsTableProps> = ({
  doctors,
  specialties,
  search,
  setSearch,
  filterSpecialty,
  setFilterSpecialty,
  onExportCsv,
  onCreateNew,
  onEdit,
  onDelete,
  loading,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    specialty: 0,
    licenseNumber: '',
    experience: '',
    phone: '',
    password: '',
  });

  const filteredDoctors = doctors.filter((d) => {
    const q = search.trim().toLowerCase();
    const textMatch = !q || `${d.firstName} ${d.lastName} ${d.licenseNumber} ${(d as any).email || d.user?.email || ''}`
      .toLowerCase().includes(q);
    const specMatch = !filterSpecialty || `${d.specialty}` === `${filterSpecialty}`;
    return textMatch && specMatch;
  });

  const handleDeleteClick = (doctor: Doctor) => {
    setDoctorToDelete(doctor);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (doctorToDelete) {
      onDelete(doctorToDelete.id);
      setShowDeleteModal(false);
      setDoctorToDelete(null);
    }
  };

  const handleEditClick = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setEditFormData({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: (doctor as any).email || doctor.user?.email || '',
      specialty: Number(doctor.specialty) || 0,
      licenseNumber: doctor.licenseNumber,
      experience: doctor.experience || '',
      phone: doctor.phone || '',
      password: '',
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoctor) {
      const updatedDoctor = {
        ...editingDoctor,
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        specialty: editFormData.specialty.toString(),
        licenseNumber: editFormData.licenseNumber,
        experience: editFormData.experience,
        phone: editFormData.phone,
      };
      onEdit(updatedDoctor);
      setShowEditModal(false);
      setEditingDoctor(null);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingDoctor(null);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Buscar por nombre, licencia o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-w-[200px]"
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(Number(e.target.value))}
            >
              <option value={0}>Todas las especialidades</option>
              {specialties.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <button
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
              onClick={onExportCsv}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar CSV
            </button>
            <button
              className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={onCreateNew}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Médico
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 font-medium">Cargando médicos...</span>
          </div>
        )}

        {!loading && doctors.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay médicos registrados</h3>
            <p className="text-gray-600 mb-6">Comienza agregando un nuevo médico al sistema.</p>
            <button
              className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
              onClick={onCreateNew}
            >
              Agregar Primer Médico
            </button>
          </div>
        )}

        {!loading && doctors.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Médico
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Especialidad
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Licencia
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                          {doctor.firstName[0]}{doctor.lastName[0]}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {doctor.firstName} {doctor.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {doctor.id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {(doctor as any).email || doctor.user?.email || '—'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {doctor.phone || 'Sin teléfono'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {specialties.find(s => s.id === Number(doctor.specialty))?.name || doctor.specialty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{doctor.licenseNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        doctor.phone ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {doctor.phone ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-150"
                          onClick={() => handleEditClick(doctor)}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                        <button
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 transition-colors duration-150"
                          onClick={() => handleDeleteClick(doctor)}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && doctorToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl max-w-md w-full">
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-6">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white text-center mb-3">
                ¿Eliminar Médico?
              </h3>
              <p className="text-white/80 text-center mb-8 leading-relaxed">
                ¿Estás seguro de que quieres eliminar al Dr. <span className="font-semibold text-white">{doctorToDelete.firstName} {doctorToDelete.lastName}</span>?
                Esta acción no se puede deshacer.
              </p>
              <div className="flex space-x-4">
                <button
                  className="flex-1 px-6 py-3 border border-white/30 rounded-xl text-white hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="flex-1 px-6 py-3 bg-linear-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={confirmDelete}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <AdminDoctorForm
              isVisible={true}
              editingDoctor={editingDoctor}
              formData={editFormData}
              setFormData={setEditFormData}
              specialties={specialties}
              loading={loading}
              onSubmit={handleEditSubmit}
              onCancel={closeEditModal}
              isModal={true}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDoctorsTable;