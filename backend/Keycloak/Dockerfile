# Usamos la imagen oficial de Keycloak
FROM quay.io/keycloak/keycloak:26.4.0

# Memoria asignada para Render
ENV JAVA_OPTS="-Xms512m -Xmx1024m"

# Admin temporal
ENV KC_BOOTSTRAP_ADMIN_USERNAME=admin
ENV KC_BOOTSTRAP_ADMIN_PASSWORD=admin123

# Puerto dinámico asignado por Render
ENV KC_HTTP_PORT=${PORT}

# Configuración de conexión a PostgreSQL (variables de entorno)
ENV KC_DB=postgres
ENV KC_DB_URL_HOST=${DB_HOST}
ENV KC_DB_URL_DATABASE=${DB_NAME}
ENV KC_DB_USERNAME=${DB_USERNAME}
ENV KC_DB_PASSWORD=${DB_PASSWORD}

# Arranca Keycloak en modo dev con persistencia
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev", "--http-port", "${KC_HTTP_PORT}"]
