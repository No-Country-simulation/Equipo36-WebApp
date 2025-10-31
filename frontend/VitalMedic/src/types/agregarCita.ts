export interface T_Especialidad {
  id: number;
  name: string;
  averageDurationMinutes: number;
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  licenseNumber?: string;
  experience?: string;
  phone?: string;
  email?: string;
}

export type RespEspecialidad = Promise<{
  success: boolean;
  message: string;
  data: T_Especialidad[];
}>;
