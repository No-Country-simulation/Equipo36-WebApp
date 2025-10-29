import { useAppSelector } from "./reduxHooks";
import type { UserProfile } from "../types/authType";

/**
 * Hook personalizado para obtener y trabajar con los datos del perfil del usuario
 */
export const useUserProfile = () => {
  const userProfile = useAppSelector((state) => state.auth.userProfile);

  // Función para obtener el nombre completo
  const getFullName = (): string => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    }
    return userProfile?.firstName || "Usuario";
  };

  // Función para obtener el nombre de bienvenida
  const getWelcomeName = (): string => {
    return userProfile?.firstName || "Usuario";
  };

  // Función para obtener la fecha de nacimiento formateada
  const getFormattedBirthDate = (): string | null => {
    if (!userProfile?.birthDate) return null;
    
    return new Date(userProfile.birthDate).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para obtener la edad
  const getAge = (): number | null => {
    if (!userProfile?.birthDate) return null;
    
    const today = new Date();
    const birthDate = new Date(userProfile.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Función para obtener el género en español
  const getGenderInSpanish = (): string | null => {
    if (!userProfile?.gender) return null;
    
    const genderMap = {
      'MALE': 'Masculino',
      'FEMALE': 'Femenino',
      'OTHER': 'Otro'
    };
    
    return genderMap[userProfile.gender] || null;
  };

  // Función para verificar si el perfil está completo
  const isProfileComplete = (): boolean => {
    return !!(
      userProfile?.firstName &&
      userProfile?.lastName &&
      userProfile?.birthDate &&
      userProfile?.gender
    );
  };

  // Función para obtener información resumida del perfil
  const getProfileSummary = () => {
    return {
      fullName: getFullName(),
      welcomeName: getWelcomeName(),
      email: userProfile?.email || '',
      birthDate: getFormattedBirthDate(),
      age: getAge(),
      gender: getGenderInSpanish(),
      phone: userProfile?.phone || '',
      address: userProfile?.address || '',
      isComplete: isProfileComplete()
    };
  };

  return {
    userProfile,
    getFullName,
    getWelcomeName,
    getFormattedBirthDate,
    getAge,
    getGenderInSpanish,
    isProfileComplete,
    getProfileSummary
  };
};
