# ==============================================
# Etapa de build: solo construir providers
# ==============================================
FROM quay.io/keycloak/keycloak:26.4.0 as builder

# Copiar el custom provider
COPY ../extensions/custom-event-listener.jar /opt/keycloak/providers/

# Construir Keycloak con el provider incluido
RUN /opt/keycloak/bin/kc.sh build


# ==============================================
# Etapa de runtime: copiar build + realm
# ==============================================
FROM quay.io/keycloak/keycloak:26.4.0

# Configuración básica de Keycloak
ENV KC_DB=postgres
ENV KC_HTTP_PORT=8080
ENV KC_HOSTNAME_STRICT=false

# Copiar los archivos construidos desde la etapa builder
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Copiar el realm exportado para importación al iniciar
COPY ../realms/VitalMedic-realm.json /opt/keycloak/data/import/VitalMedic-realm.json

# Exponer puerto
EXPOSE 8080

# Comando de inicio con importación del realm
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start", "--optimized", "--http-enabled=true", "--proxy-headers=xforwarded", "--hostname-strict=false", "--import-realm"]