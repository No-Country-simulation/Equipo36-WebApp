import { useState, useEffect } from 'react';
import { PatientService } from '../services/patientService';
import { useAuth } from './useAuth';

export interface PatientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: string;
  phone?: string;
  address?: string;
  curp?: string;
  identifiers?: any[];
  onboardingStatus: string;
}

export const usePatientData = () => {
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userProfile, isAuthenticated } = useAuth();

  const fetchPatientData = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const response = await PatientService.getPatientData();
      
      if (response && response.data) {
        setPatientData(response.data);
      } else if (response) {
        // Si la respuesta directa es los datos del paciente
        setPatientData(response);
      }
    } catch (err: any) {
      console.error('Error fetching patient data:', err);
      
      // Si hay error 404, significa que el paciente no existe en el backend
      // pero tenemos datos de Keycloak, usar esos datos
      if (err.response?.status === 404 && userProfile) {
        console.log('Patient not found in backend, using Keycloak data');
        setPatientData({
          id: userProfile.id || '',
          firstName: userProfile.firstName || '',
          lastName: userProfile.lastName || '',
          email: userProfile.email || '',
          birthDate: userProfile.birthDate || '',
          gender: userProfile.gender || '',
          phone: userProfile.phone || '',
          address: userProfile.address || '',
          onboardingStatus: 'PENDING_IDENTIFIER'
        });
      } else {
        setError('Error al cargar los datos del paciente');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPatientData();
    }
  }, [isAuthenticated]);

  // Función para obtener el nombre completo
  const getFullName = () => {
    if (!patientData) return userProfile?.firstName || 'Usuario';
    return `${patientData.firstName} ${patientData.lastName}`.trim() || 'Usuario';
  };

  // Función para obtener el nombre de bienvenida
  const getWelcomeName = () => {
    if (!patientData) return userProfile?.firstName || 'Usuario';
    return patientData.firstName || userProfile?.firstName || 'Usuario';
  };

  // Función para obtener la edad
  const getAge = () => {
    const birthDate = patientData?.birthDate || userProfile?.birthDate;
    if (!birthDate) return null;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Función para obtener el género en español
  const getGenderInSpanish = () => {
    const gender = patientData?.gender || userProfile?.gender;
    switch (gender?.toUpperCase()) {
      case 'MALE':
        return 'Masculino';
      case 'FEMALE':
        return 'Femenino';
      case 'OTHER':
        return 'Otro';
      default:
        return 'No especificado';
    }
  };

  return {
    patientData,
    loading,
    error,
    refetch: fetchPatientData,
    fullName: getFullName(),
    welcomeName: getWelcomeName(),
    age: getAge(),
    genderInSpanish: getGenderInSpanish(),
    email: patientData?.email || userProfile?.email || '',
    phone: patientData?.phone || userProfile?.phone || '',
    address: patientData?.address || userProfile?.address || '',
    birthDate: patientData?.birthDate || userProfile?.birthDate || '',
    patientId: patientData?.id || userProfile?.id || ''
  };
};