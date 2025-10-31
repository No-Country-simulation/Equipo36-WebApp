# ========================================
# Dockerfile - VitalMedic Frontend
# ========================================

FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Variables de entorno (pasadas desde docker-compose)
ARG VITE_API_BASE_URL
ARG VITE_KEYCLOAK_URL
ARG VITE_KEYCLOAK_REALM
ARG VITE_KEYCLOAK_CLIENT_ID
ARG VITE_JITSI_DOMAIN

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL
ENV VITE_KEYCLOAK_REALM=$VITE_KEYCLOAK_REALM
ENV VITE_KEYCLOAK_CLIENT_ID=$VITE_KEYCLOAK_CLIENT_ID
ENV VITE_JITSI_DOMAIN=$VITE_JITSI_DOMAIN

# Exponer puerto de Vite
EXPOSE 5173

# Comando para desarrollo (hot reload)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
