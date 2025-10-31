/**
 * Utilidades para el manejo del onboarding
 */

const BACKEND_ERROR_FLAG = 'onboarding_backend_error';

/**
 * Marca que el backend está fallando para evitar bucles de redirección
 */
export const setBackendErrorFlag = (): void => {
  localStorage.setItem(BACKEND_ERROR_FLAG, 'true');
};

/**
 * Limpia la bandera de error del backend
 */
export const clearBackendErrorFlag = (): void => {
  localStorage.removeItem(BACKEND_ERROR_FLAG);
};

/**
 * Verifica si el backend está marcado como fallando
 */
export const isBackendErrorFlagSet = (): boolean => {
  return localStorage.getItem(BACKEND_ERROR_FLAG) === 'true';
};

/**
 * Resetea completamente el estado del onboarding
 */
export const resetOnboardingState = (): void => {
  clearBackendErrorFlag();
  // Aquí se pueden agregar más limpiezas si es necesario
};
