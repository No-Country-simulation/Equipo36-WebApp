# Usamos la imagen oficial de Keycloak 26.4.0 con Quarkus
FROM quay.io/keycloak/keycloak:26.4.0 as builder

# Modo build: empaquetamos con las configuraciones necesarias
ENV KC_DB=postgres

RUN /opt/keycloak/bin/kc.sh build

# Runtime
FROM quay.io/keycloak/keycloak:26.4.0

ENV KC_DB=postgres
ENV KC_HTTP_PORT=8080
ENV KC_HOSTNAME_STRICT=false
ENV KC_HOSTNAME_STRICT_HTTPS=false

# Copiar lo que se construyó en la etapa anterior
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Exponer el puerto que Render asignará
EXPOSE 8080

ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start", "--optimized", "--http-enabled=true", "--proxy-headers=xforwarded", "--hostname-strict=false", "--hostname-strict-https=false"]