import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type Keycloak from "keycloak-js";
import type { UserProfile } from "../../types/authType";

interface AuthState {
  keycloak: Keycloak | null;
  initialized: boolean;
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
}

// Función para cargar el estado desde localStorage
const loadStateFromLocalStorage = (): Partial<AuthState> => {
  try {
    const serializedState = localStorage.getItem('vitalmedic_auth_state');
    if (serializedState === null) {
      return {};
    }
    const parsedState = JSON.parse(serializedState);
    // Solo cargar userProfile, no keycloak ni otros datos sensibles
    return {
      userProfile: parsedState.userProfile || null,
      isAuthenticated: parsedState.isAuthenticated || false
    };
  } catch (err) {
    console.warn('Error loading auth state from localStorage:', err);
    return {};
  }
};

// Función para guardar el estado en localStorage
const saveStateToLocalStorage = (state: AuthState) => {
  try {
    const stateToSave = {
      userProfile: state.userProfile,
      isAuthenticated: state.isAuthenticated
    };
    const serializedState = JSON.stringify(stateToSave);
    localStorage.setItem('vitalmedic_auth_state', serializedState);
  } catch (err) {
    console.warn('Error saving auth state to localStorage:', err);
  }
};

const persistedState = loadStateFromLocalStorage();

const initialState: AuthState = {
  keycloak: null,
  initialized: false,
  isAuthenticated: persistedState.isAuthenticated || false,
  userProfile: persistedState.userProfile || null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startAuth: (state, action: PayloadAction<Omit<AuthState, "keycloak">>) => {
      state.initialized = action.payload.initialized;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.userProfile = action.payload.userProfile;
      
      // Guardar en localStorage
      saveStateToLocalStorage(state);
    },
    setKeycloak: (state, action: PayloadAction<Keycloak>) => {
      state.keycloak = action.payload;
    },
    initializedToTrue: (state) => {
      state.initialized = true;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.userProfile) {
        state.userProfile = { ...state.userProfile, ...action.payload };
        
        // Guardar en localStorage
        saveStateToLocalStorage(state);
      }
    },
    clearAuth: (state) => {
      state.keycloak = null;
      state.initialized = false;
      state.isAuthenticated = false;
      state.userProfile = null;
      
      // Limpiar localStorage
      localStorage.removeItem('vitalmedic_auth_state');
    },
  },
});

export const { startAuth, initializedToTrue, setKeycloak, updateUserProfile, clearAuth } = authSlice.actions;
export default authSlice.reducer;
