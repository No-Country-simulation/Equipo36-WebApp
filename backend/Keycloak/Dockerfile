# Usamos la imagen oficial de Keycloak
FROM quay.io/keycloak/keycloak

# Puerto en el que escucha Keycloak
EXPOSE 8080

# Iniciamos Keycloak en modo desarrollo (start-dev)
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev"]