# Build stage
FROM quay.io/keycloak/keycloak:26.4.0 as builder

# Opciones de build-time
ENV KC_DB=postgres
ENV KC_HEALTH_ENABLED=true
ENV KC_HTTP_ENABLED=true

# Construir Keycloak
RUN /opt/keycloak/bin/kc.sh build

# Runtime stage
FROM quay.io/keycloak/keycloak:26.4.0

ENV KC_DB=postgres
ENV KC_HTTP_PORT=8080
ENV KC_HOSTNAME_STRICT=false

# Copiar la build
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Exponer puerto
EXPOSE 8080

# Arranque en runtime
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start", "--optimized", "--http-enabled=true", "--proxy-headers=xforwarded", "--hostname-strict=false"]
