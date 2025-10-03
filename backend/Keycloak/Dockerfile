# Imagen base oficial de Keycloak (distribución Quarkus)
FROM quay.io/keycloak/keycloak:25.0.6 as builder

# Variables de entorno
ENV KC_DB=postgres
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

WORKDIR /opt/keycloak

# Compilación de Keycloak con las configuraciones necesarias
RUN /opt/keycloak/bin/kc.sh build

# Etapa final
FROM quay.io/keycloak/keycloak:25.0.6

WORKDIR /opt/keycloak

COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Render define la variable de entorno PORT automáticamente (por defecto 10000)
# Aquí nos aseguramos de que Keycloak escuche en ese puerto
ENV PORT=10000
ENV KC_HTTP_PORT=${PORT}
ENV KC_HTTP_HOST=0.0.0.0

# Exponer el puerto dinámico
EXPOSE ${PORT}

# Comando de arranque
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start", "--http-port=${PORT}", "--http-host=0.0.0.0"]
