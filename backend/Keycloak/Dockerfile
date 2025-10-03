# Imagen oficial de Keycloak
FROM quay.io/keycloak/keycloak:26.4.0

# Configuramos memoria para Render Free (512 MB)
ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Credenciales de admin inicial
ENV KC_BOOTSTRAP_ADMIN_USERNAME=admin
ENV KC_BOOTSTRAP_ADMIN_PASSWORD=admin123

# Puerto dinámico asignado por Render
ENV KC_HTTP_PORT=${PORT}

# Arrancamos Keycloak en modo desarrollo
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev", "--http-port", "${KC_HTTP_PORT}"]
