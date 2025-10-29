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
        console.log('📍 OnboardingGuard: Usuario ya en onboarding, no redirigir');
        setIsCheckingOnboarding(false);
        return;
      }

      // PRIORIDAD 1: Si hay un error de backend previo, permitir acceso inmediatamente
      if (isBackendErrorFlagSet()) {
        console.log('🔓 OnboardingGuard: Backend con error previo, permitiendo acceso inmediato');
        setBackendError(true);
        setNeedsOnboarding(false);
        setIsCheckingOnboarding(false);
        return;
      }

      try {
        console.log('🔍 OnboardingGuard: Verificando estado del onboarding...');
        
        const statusResponse = await OnboardingService.getOnboardingStatus();
        const onboardingStatus = statusResponse.status;
        
        console.log('📊 OnboardingGuard: Estado actual:', onboardingStatus);

        // Si el onboarding no está completado, necesita completarlo
        if (onboardingStatus !== 'COMPLETED') {
          console.log('🔄 OnboardingGuard: Redirigiendo a onboarding...');
          setNeedsOnboarding(true);
        } else {
          console.log('✅ OnboardingGuard: Onboarding completado, permitiendo acceso');
          setNeedsOnboarding(false);
        }
      } catch (error: any) {
        console.warn('⚠️ OnboardingGuard: Error al verificar estado:', error.message);
        
        // En caso de error del backend, marcar como error y permitir acceso
        console.log('🔄 OnboardingGuard: Error del backend, permitiendo acceso (usuario puede completar onboarding manualmente)');
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
    console.log('🔓 OnboardingGuard: Backend fallando, permitiendo acceso');
    return <>{children}</>;
  }

  // Si necesita onboarding, redirigir
  if (needsOnboarding) {
    console.log('🔄 OnboardingGuard: Redirigiendo a onboarding...');
    return <Navigate to="/onboarding" replace />;
  }

  // Si no necesita onboarding, mostrar el contenido protegido
  console.log('✅ OnboardingGuard: Permitiendo acceso al dashboard');
  return <>{children}</>;
};

export default OnboardingGuard;
