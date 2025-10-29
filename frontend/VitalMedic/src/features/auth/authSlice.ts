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

const initialState: AuthState = {
  keycloak: null,
  initialized: false,
  isAuthenticated: false,
  userProfile: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startAuth: (state, action: PayloadAction<Omit<AuthState, "keycloak">>) => {
      state.initialized = action.payload.initialized;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.userProfile = action.payload.userProfile;
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
      }
    },
  },
});

export const { startAuth, initializedToTrue, setKeycloak, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
