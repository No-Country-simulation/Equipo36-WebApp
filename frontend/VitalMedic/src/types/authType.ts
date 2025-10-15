export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  roles?: string[];
}

export type UserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT';

export interface RoleBasedRoute {
  path: string;
  allowedRoles: UserRole[];
}
