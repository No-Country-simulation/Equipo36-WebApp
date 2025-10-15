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

          // Redirigir según el rol del usuario
          const realmRoles = keycloakClient.realmAccess?.roles || [];
          const clientRoles = keycloakClient.resourceAccess?.['vitalmedic-frontend']?.roles || [];
          const allRoles = [...realmRoles, ...clientRoles];

          if (allRoles.includes('admin') || allRoles.includes('ADMIN')) {
            navigate("/dashboard/admin/");
          } else if (allRoles.includes('doctor') || allRoles.includes('DOCTOR')) {
            navigate("/dashboard/doctor/");
          } else {
            navigate("/dashboard/patient/");
          }
        }
      } catch (error) {
        console.error("Error fatal al inicializar Keycloak", error);
        dispatchAuth(initializedToTrue());
      }
    };

    dispatchAuth(setKeycloak(keycloakClient));
    initkeycloak();
  });

  return <Outlet />;
};

export default StartKeycloak;
