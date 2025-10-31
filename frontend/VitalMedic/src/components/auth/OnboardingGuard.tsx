import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { OnboardingService } from '../../services/onboardingService';
import { isBackendErrorFlagSet, setBackendErrorFlag } from '../../utils/onboardingUtils';
import CargandoPagina from '../ui/CargandoPagina';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

/**
 * OnboardingGuard - Componente que verifica si el usuario necesita completar el onboarding
 * 
 * Funcionalidad:
 * 1. Solo aplica a usuarios con rol PATIENT
 * 2. Consulta el estado del onboarding en el backend
 * 3. Redirige automáticamente a /onboarding si no está completado
 * 4. Permite acceso normal si el onboarding está completado
 */
const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [backendError, setBackendError] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      // Solo verificar onboarding para pacientes autenticados
      if (!isAuthenticated || !hasRole('PATIENT')) {
        setIsCheckingOnboarding(false);
        return;
      }

      // Si ya está en la página de onboarding, no redirigir
      if (location.pathname === '/onboarding') {
        setIsCheckingOnboarding(false);
        return;
      }

      // PRIORIDAD 1: Si hay un error de backend previo, permitir acceso inmediatamente
      if (isBackendErrorFlagSet()) {
        setBackendError(true);
        setNeedsOnboarding(false);
        setIsCheckingOnboarding(false);
        return;
      }

      try {
        const statusResponse = await OnboardingService.getOnboardingStatus();
        const onboardingStatus = statusResponse.status;

        // Si el onboarding no está completado, necesita completarlo
        if (onboardingStatus !== 'COMPLETED') {
          setNeedsOnboarding(true);
        } else {
          setNeedsOnboarding(false);
        }
      } catch (error: any) {
        // En caso de error del backend, marcar como error y permitir acceso
        setBackendErrorFlag();
        setBackendError(true);
        setNeedsOnboarding(false);
      } finally {
        setIsCheckingOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, [isAuthenticated, hasRole, location.pathname]);

  // Mostrar loading mientras verifica el estado
  if (isCheckingOnboarding) {
    return <CargandoPagina />;
  }

  // PRIORIDAD 1: Si hay error del backend, permitir acceso para evitar bucles
  if (backendError) {
    return <>{children}</>;
  }

  // Si necesita onboarding, redirigir
  if (needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  // Si no necesita onboarding, mostrar el contenido protegido
  return <>{children}</>;
};

export default OnboardingGuard;
