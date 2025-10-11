import type Keycloak from "keycloak-js";
import { createContext } from "react";
import type { UserProfile } from "../types/authType";

// import type { UserProfile } from "../types/authType";

interface Auth {
  keycloak: Keycloak | null;
  initialized: boolean;
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
}

export const AuthContext = createContext({} as Auth);
