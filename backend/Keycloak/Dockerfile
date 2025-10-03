# Imagen oficial de Keycloak (Quarkus distribution)
FROM quay.io/keycloak/keycloak:25.0.0 as builder

# Copiamos un realm de ejemplo (opcional, puedes omitir si no tienes uno)
# COPY ./realm-export.json /opt/keycloak/data/import/

# Compilamos la distribución optimizada
RUN /opt/keycloak/bin/kc.sh build

# ----------------------------
# Imagen final
# ----------------------------
FROM quay.io/keycloak/keycloak:25.0.0

# Copiamos la build optimizada
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Variables de entorno para Render
ENV KC_DB=postgres \
    KC_DB_URL=jdbc:postgresql://$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB \
    KC_DB_USERNAME=$POSTGRES_USER \
    KC_DB_PASSWORD=$POSTGRES_PASSWORD \
    KC_HOSTNAME=$RENDER_EXTERNAL_HOSTNAME \
    KC_PROXY=edge \
    # 🔽 Ajuste crítico para no pasarse de 512 MB
    JAVA_OPTS="-Xms128m -Xmx384m -XX:+UseSerialGC"

# Puerto que Render asigna automáticamente
ENV PORT=8080

# Arranque optimizado (modo dev para MVP)
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev", "--http-port=8080"]
