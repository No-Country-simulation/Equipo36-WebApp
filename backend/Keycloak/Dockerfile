# Imagen oficial de Keycloak (Quarkus distribution)
FROM quay.io/keycloak/keycloak:25.0.0 as builder

# (Opcional) Copiar un realm exportado si lo tienes
# COPY ./realm-export.json /opt/keycloak/data/import/

# Construir Keycloak optimizado
RUN /opt/keycloak/bin/kc.sh build

# ----------------------------
# Imagen final
# ----------------------------
FROM quay.io/keycloak/keycloak:25.0.0

# Copiar build optimizada desde el builder
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Variables de entorno para Render
ENV KC_DB=postgres \
    KC_DB_URL=jdbc:postgresql://$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB \
    KC_DB_USERNAME=$POSTGRES_USER \
    KC_DB_PASSWORD=$POSTGRES_PASSWORD \
    KC_PROXY=edge \
    KC_HOSTNAME=$RENDER_EXTERNAL_HOSTNAME \
    # 🔽 Limitar memoria para que no supere los 512 MB del plan gratuito
    JAVA_OPTS="-Xms128m -Xmx384m -XX:+UseSerialGC"

# Render inyecta automáticamente el puerto en la variable $PORT
ENV PORT=8080

# Exponer el puerto (Render lo escaneará aquí)
EXPOSE 8080

# Arrancar Keycloak escuchando en 0.0.0.0:$PORT (Render lo exige)
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev", "--http-port=${PORT}", "--hostname-strict=false", "--hostname-strict-https=false"]
