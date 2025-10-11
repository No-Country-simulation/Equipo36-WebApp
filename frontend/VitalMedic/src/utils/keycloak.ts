import Keycloak from "keycloak-js";

const keycloakClient = new Keycloak({
  url: "https://vitalmedic-auth.onrender.com/",
  realm: "VitalMedic",
  clientId: "vital-medic",
});

export default keycloakClient;
