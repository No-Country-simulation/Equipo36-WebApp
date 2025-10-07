# Etapa de build
FROM quay.io/keycloak/keycloak:26.4.0 as builder

# Configuración básica
ENV KC_DB=postgres
ENV KC_HEALTH_ENABLED=true
ENV KC_HTTP_ENABLED=true

# Copiar custom-event-listener.jar al directorio de providers
COPY custom-event-listener.jar /opt/keycloak/providers/

# Construir Keycloak con el provider incluido
RUN /opt/keycloak/bin/kc.sh build

# Etapa de runtime
FROM quay.io/keycloak/keycloak:26.4.0

ENV KC_DB=postgres
ENV KC_HTTP_PORT=8080
ENV KC_HOSTNAME_STRICT=false

# Copiar los archivos construidos desde la etapa anterior
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Exponer puerto
EXPOSE 8080

# Comando de inicio
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start", "--optimized", "--http-enabled=true", "--proxy-headers=xforwarded", "--hostname-strict=false"]
