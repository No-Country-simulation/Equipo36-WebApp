export interface UserProfile {
  id: string;
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  birthDate?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  phone?: string;
  address?: string;
  // Datos adicionales que pueden venir de Keycloak u otras fuentes
  userProfileMetadata?: unknown;
}

export type UserRole = "ADMIN" | "DOCTOR" | "PATIENT";
