import React, { useState } from 'react';
import AdminUsersTable from './AdminUsersTable';
import AdminUserForm from './AdminUserForm';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminUsersManagementProps {
  users: User[];
  loading: boolean;
  onCreateUser: (userData: any) => Promise<void>;
  onUpdateUser: (id: string, userData: any) => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
  onToggleUserStatus: (id: string, isActive: boolean) => Promise<void>;
}

const AdminUsersManagement: React.FC<AdminUsersManagementProps> = ({
  users,
  loading,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  onToggleUserStatus,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [formLoading, setFormLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      role: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });
    setEditingUser(null);
    setShowForm(false);
  };

  const handleCreateNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      password: '',
      confirmPassword: '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (editingUser) {
        // Update existing user
        await onUpdateUser(editingUser.id, {
          username: formData.username,
          email: formData.email,
          role: formData.role,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        });
      } else {
        // Create new user
        if (formData.password !== formData.confirmPassword) {
          alert('Las contraseñas no coinciden');
          return;
        }
        await onCreateUser({
          username: formData.username,
          email: formData.email,
          role: formData.role,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          password: formData.password,
        });
      }
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error al guardar el usuario');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await onDeleteUser(id);
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error al eliminar el usuario');
      }
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await onToggleUserStatus(id, isActive);
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Error al cambiar el estado del usuario');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h2>
          <p className="text-gray-600 mt-1">Administra todos los usuarios del sistema</p>
        </div>
        <button
          className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
          onClick={handleCreateNew}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Usuario
        </button>
      </div>

      {/* Users Table */}
      <AdminUsersTable
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        loading={loading}
      />

      {/* User Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                  </h3>
                  <p className="text-white/80">
                    {editingUser ? 'Modifica la información del usuario seleccionado' : 'Ingresa los datos del nuevo usuario'}
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="text-white/60 hover:text-white transition-colors p-3 hover:bg-white/10 rounded-xl"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <AdminUserForm
                isVisible={true}
                editingUser={editingUser}
                formData={formData}
                setFormData={setFormData}
                loading={formLoading}
                onSubmit={handleSubmit}
                onCancel={resetForm}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersManagement;