# Usamos la imagen oficial de Keycloak
FROM quay.io/keycloak/keycloak:26.4.0

# Variables de entorno de memoria
ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Puerto dinámico para Render
ENV KC_HTTP_PORT=${PORT}

# Instrucciones para arrancar Keycloak en modo dev
ENTRYPOINT /opt/keycloak/bin/kc.sh start-dev --http-port $KC_HTTP_PORT
