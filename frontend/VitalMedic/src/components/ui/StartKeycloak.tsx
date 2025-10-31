import { useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router";
import {
  initializedToTrue,
  setKeycloak,
  startAuth,
} from "../../features/auth/authSlice";
import { useAppDispatch } from "../../hooks/reduxHooks";
import type { UserProfile } from "../../types/authType";
import keycloakClient from "../../utils/keycloak";
import { VITE_KEYCLOAK_CLIENT_ID } from "../../utils/keycloak";

const StartKeycloak = () => {
  const navigate = useNavigate();
  const dispatchAuth = useAppDispatch();

  const initializedRef = useRef(false);

  useEffect(() => {
    const initkeycloak = async () => {
      if (initializedRef.current) {
        return;
      }

      initializedRef.current = true;

      try {
        const auth = await keycloakClient.init({
          onLoad: "login-required",
        });

        if (auth) {
          const profile =
            (await keycloakClient.loadUserProfile()) as UserProfile;

          dispatchAuth(
            startAuth({
              initialized: true,
              isAuthenticated: auth,
              userProfile: profile,
            }),
          );

          // Verificar si el usuario es PACIENTE y necesita onboarding
          const roles = keycloakClient.tokenParsed?.resource_access?.[VITE_KEYCLOAK_CLIENT_ID]?.roles || [];
          
          // TEMPORAL: Permitir que cualquier usuario autenticado vaya al onboarding
          // En producción, esto debe ser: if (roles.includes("PATIENT")) {
          if (true) { // Forzar onboarding para cualquier usuario en desarrollo
            try {
              // Importar dinámicamente para evitar dependencia circular
              const { OnboardingService } = await import("../../services/onboardingService");
              const status = await OnboardingService.getOnboardingStatus();
              
              // Redirigir según el estado del onboarding
              if (status.status === "COMPLETED") {
                navigate("/dashboard/patient/");
              } else {
                navigate("/onboarding");
              }
            } catch (error) {
              // Si hay error al verificar el estado (error 500 del backend), 
              // ir directamente a onboarding para permitir que el usuario se registre
              navigate("/onboarding");
            }
          } else {
            // Para otros roles (DOCTOR, ADMIN), ir al dashboard general
            navigate("/dashboard");
          }
        }
      } catch (error) {
        dispatchAuth(initializedToTrue());
      }
    };

    dispatchAuth(setKeycloak(keycloakClient));
    initkeycloak();
  }, [dispatchAuth, navigate]);

  return <Outlet />;
};

export default StartKeycloak;
