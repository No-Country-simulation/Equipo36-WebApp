# Etapa builder
FROM quay.io/keycloak/keycloak:26.4.0 as builder

# Variables necesarias
ENV KC_DB=postgres
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

WORKDIR /opt/keycloak

# Construir Keycloak
RUN /opt/keycloak/bin/kc.sh build

# ----------------------------
# Etapa final
# ----------------------------
FROM quay.io/keycloak/keycloak:26.4.0

WORKDIR /opt/keycloak

# Copiar build optimizada
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Puerto y host para Render
ENV PORT=10000
ENV KC_HTTP_PORT=$PORT
ENV KC_HTTP_HOST=0.0.0.0

# Exponer el puerto dinámico
EXPOSE $PORT

# Arranque usando shell para que $PORT se expanda correctamente
# KEYCLOAK_ADMIN, KEYCLOAK_ADMIN_PASSWORD y variables de Postgres se definen externamente
ENTRYPOINT /opt/keycloak/bin/kc.sh start --http-port=$PORT --http-host=0.0.0.0
