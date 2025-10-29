import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import modalReducer from "./features/modal/modalSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar estas rutas de acción para valores no serializables
        ignoredActions: [
          'auth/setKeycloak',
          'auth/startAuth',
          'auth/loginSuccess',
          'auth/logout',
        ],
        // Ignorar estas rutas de estado para valores no serializables
        ignoredPaths: [
          'auth.keycloak',
          'auth.keycloak.token',
          'auth.keycloak.refreshToken',
          'auth.keycloak.idToken',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
