import { useCallback, useMemo, useState, useEffect } from "react";
import { useAppSelector } from "./reduxHooks";
import { OnboardingService } from "../services/onboardingService";
import type { UserRole } from "../types/authType";

export const useAuth = () => {
  const { keycloak, isAuthenticated, userProfile } = useAppSelector(
    (state) => state.auth,
  );

  // Estados para onboarding
  const [onboardingStatus, setOnboardingStatus] = useState<string | null>(null);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false);

  const userRoles = useMemo<UserRole[]>(() => {
    if (!keycloak || !isAuthenticated) {
      return [];
    }

    // Obtener roles de Keycloak
    const realmRoles = keycloak.realmAccess?.roles || [];
    const clientRoles =
      keycloak.resourceAccess?.["vitalmedic-frontend"]?.roles || [];

    // Combinar roles y filtrar solo los que nos interesan
    const allRoles = [...realmRoles, ...clientRoles];
    const validRoles: UserRole[] = [];

    if (allRoles.includes("admin") || allRoles.includes("ADMIN")) {
      validRoles.push("ADMIN");
    }
    if (allRoles.includes("doctor") || allRoles.includes("DOCTOR")) {
      validRoles.push("DOCTOR");
    }
    if (allRoles.includes("patient") || allRoles.includes("PATIENT")) {
      validRoles.push("PATIENT");
    }

    // Si no tiene roles específicos, por defecto es paciente
    if (validRoles.length === 0) {
      validRoles.push("PATIENT");
    }

    return validRoles;
  }, [isAuthenticated, keycloak]);

  // Función para verificar el estado del onboarding
  const checkOnboardingStatus = useCallback(async () => {
    if (!isAuthenticated || !hasRole("PATIENT")) {
      setOnboardingStatus(null);
      return;
    }

    setIsCheckingOnboarding(true);
    try {
      const statusResponse = await OnboardingService.getOnboardingStatus();
      setOnboardingStatus(statusResponse.status);
    } catch (error) {
      setOnboardingStatus("PENDING_IDENTIFIER"); // Asumir estado inicial
    } finally {
      setIsCheckingOnboarding(false);
    }
  }, [isAuthenticated, userRoles]);

  // Verificar onboarding cuando cambie la autenticación
  useEffect(() => {
    checkOnboardingStatus();
  }, [checkOnboardingStatus]);

  const getUserRoles = useCallback((): UserRole[] => userRoles, [userRoles]);

  const hasRole = useCallback(
    (role: UserRole): boolean => userRoles.includes(role),
    [userRoles],
  );

  const hasAnyRole = useCallback(
    (roles: UserRole[]): boolean => roles.some((role) => userRoles.includes(role)),
    [userRoles],
  );

  const getPrimaryRole = useCallback((): UserRole => {
    // Prioridad: ADMIN > DOCTOR > PATIENT
    if (userRoles.includes("ADMIN")) return "ADMIN";
    if (userRoles.includes("DOCTOR")) return "DOCTOR";
    return "PATIENT";
  }, [userRoles]);

  const getDefaultDashboardPath = useCallback((): string => {
    const primaryRole = getPrimaryRole();

    switch (primaryRole) {
      case "ADMIN":
        return "/dashboard/admin";
      case "DOCTOR":
        return "/dashboard/doctor";
      case "PATIENT":
      default:
        return "/dashboard/patient";
    }
  }, [getPrimaryRole]);

  // Lógica específica para onboarding
  const needsOnboarding = useMemo(() => {
    return isAuthenticated && 
           hasRole("PATIENT") && 
           onboardingStatus !== null && 
           onboardingStatus !== "COMPLETED";
  }, [isAuthenticated, hasRole, onboardingStatus]);

  const shouldRedirectToOnboarding = useMemo(() => {
    return needsOnboarding && !isCheckingOnboarding;
  }, [needsOnboarding, isCheckingOnboarding]);

  const refreshOnboardingStatus = useCallback(() => {
    checkOnboardingStatus();
  }, [checkOnboardingStatus]);

  return {
    keycloak,
    isAuthenticated,
    userProfile,
    getUserRoles,
    hasRole,
    hasAnyRole,
    getPrimaryRole,
    getDefaultDashboardPath,
    // Estados de onboarding
    onboardingStatus,
    needsOnboarding,
    shouldRedirectToOnboarding,
    isCheckingOnboarding,
    refreshOnboardingStatus,
  };
};
