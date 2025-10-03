FROM quay.io/keycloak/keycloak:26.4.0

# Configuración de memoria para Render (512MB)
ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Admin bootstrap
ENV KC_BOOTSTRAP_ADMIN_USERNAME=admin
ENV KC_BOOTSTRAP_ADMIN_PASSWORD=admin123

# Usamos el puerto dinámico de Render
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev", "--http-port", "${PORT}", "--http-host", "0.0.0.0"]
