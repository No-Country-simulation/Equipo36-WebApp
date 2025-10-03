# Usamos la imagen oficial de Keycloak
FROM quay.io/keycloak/keycloak

# Configuración de memoria para Render (512MB)
ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Puerto en el que escucha Keycloak
EXPOSE 8080

# Iniciamos Keycloak en modo desarrollo (start-dev)
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev"]