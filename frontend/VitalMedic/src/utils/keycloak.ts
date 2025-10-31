import Keycloak from "keycloak-js";

// Exportar el clientId para uso en otros componentes
export const VITE_KEYCLOAK_CLIENT_ID = "vital-medic";

const keycloakClient = new Keycloak({
  url: "https://vitalmedic-auth.onrender.com/",
  realm: "VitalMedic",
  clientId: VITE_KEYCLOAK_CLIENT_ID,
});

export default keycloakClient;
