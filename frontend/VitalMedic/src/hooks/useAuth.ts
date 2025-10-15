import { useAppSelector } from './reduxHooks';
import type { UserRole } from '../types/authType';

export const useAuth = () => {
  const { keycloak, isAuthenticated, userProfile } = useAppSelector(state => state.auth);

  const getUserRoles = (): UserRole[] => {
    if (!keycloak || !isAuthenticated) {
      return [];
    }

    // Obtener roles de Keycloak
    const realmRoles = keycloak.realmAccess?.roles || [];
    const clientRoles = keycloak.resourceAccess?.['vitalmedic-frontend']?.roles || [];
    
    // Combinar roles y filtrar solo los que nos interesan
    const allRoles = [...realmRoles, ...clientRoles];
    const validRoles: UserRole[] = [];

    if (allRoles.includes('admin') || allRoles.includes('ADMIN')) {
      validRoles.push('ADMIN');
    }
    if (allRoles.includes('doctor') || allRoles.includes('DOCTOR')) {
      validRoles.push('DOCTOR');
    }
    if (allRoles.includes('patient') || allRoles.includes('PATIENT')) {
      validRoles.push('PATIENT');
    }

    // Si no tiene roles específicos, por defecto es paciente
    if (validRoles.length === 0) {
      validRoles.push('PATIENT');
    }

    return validRoles;
  };

  const hasRole = (role: UserRole): boolean => {
    const userRoles = getUserRoles();
    return userRoles.includes(role);
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    const userRoles = getUserRoles();
    return roles.some(role => userRoles.includes(role));
  };

  const getPrimaryRole = (): UserRole => {
    const roles = getUserRoles();
    
    // Prioridad: ADMIN > DOCTOR > PATIENT
    if (roles.includes('ADMIN')) return 'ADMIN';
    if (roles.includes('DOCTOR')) return 'DOCTOR';
    return 'PATIENT';
  };

  const getDefaultDashboardPath = (): string => {
    const primaryRole = getPrimaryRole();
    
    switch (primaryRole) {
      case 'ADMIN':
        return '/dashboard/admin';
      case 'DOCTOR':
        return '/dashboard/doctor';
      case 'PATIENT':
      default:
        return '/dashboard/patient';
    }
  };

  return {
    keycloak,
    isAuthenticated,
    userProfile,
    getUserRoles,
    hasRole,
    hasAnyRole,
    getPrimaryRole,
    getDefaultDashboardPath,
  };
};