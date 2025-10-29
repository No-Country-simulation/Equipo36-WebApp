export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  birthDate?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  phone?: string;
  address?: string;
}

export type UserRole = "ADMIN" | "DOCTOR" | "PATIENT";
