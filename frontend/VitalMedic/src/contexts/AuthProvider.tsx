import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import type { UserProfile } from "../types/authType";
import keycloakClient from "../utils/keycloak";
import { AuthContext } from "./AuthContext";

const AuthProvider = () => {
  const [initialized, setInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

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

        setIsAuthenticated(auth);
        setInitialized(true);

        if (auth) {
          const profile =
            (await keycloakClient.loadUserProfile()) as UserProfile;
          setUserProfile(profile);

          navigate("/dashboard/patient/");
        }
      } catch (error) {
        console.error("Error fatal al inicializar Keycloak", error);
        setInitialized(true);
      }
    };

    initkeycloak();
  });

  return (
    <AuthContext.Provider
      value={{
        keycloak: keycloakClient,
        initialized,
        isAuthenticated,
        userProfile,
      }}
    >
      <Outlet />
    </AuthContext.Provider>
  );
};

export default AuthProvider;
