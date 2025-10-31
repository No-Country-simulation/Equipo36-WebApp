# Keycloak - Docker Producción

Este proyecto incluye un **Dockerfile** para levantar Keycloak en producción con:

- Realm importado automáticamente
- Custom event listener cargado
- Conexión a PostgreSQL

> 🔹 Este setup es para entornos de producción, donde los archivos del realm y listener se incluyen directamente en la imagen.

---

## 📁 Estructura de carpetas

```text
Keycloak/
├── docker/
│   ├── Dockerfile
│   ├── .env.prod
├── realms/
│   └── VitalMedic-realm.json
└── extensions/
    └── custom-event-listener.jar
```

## ⚙️ Variables de entorno

Archivo `.env` con las variables necesarias para producción:

```env
# ──────────────── ⚙️ JAVA SETTINGS ────────────────
JAVA_OPTS="-Xms128m -Xmx384m -XX:+UseSerialGC"        # Configura la memoria y el recolector de basura de la JVM

# ──────────────── 🗄️ DATABASE CONFIG ────────────────
KC_DB_URL=jdbc:postgresql://your-db-host:5432/your_database   # URL de conexión a la base de datos PostgreSQL
KC_DB_USERNAME=your_db_user                                   # Usuario de la base de datos
KC_DB_PASSWORD=your_db_password                               # Contraseña del usuario de la base de datos

# ──────────────── 🧠 KEYCLOAK CONFIG ────────────────
KEYCLOAK_ADMIN=admin                                          # Usuario administrador de Keycloak
KEYCLOAK_ADMIN_PASSWORD=Admin123!                             # Contraseña del usuario administrador
KEYCLOAK_BASE_URL=https://your-keycloak-domain.com            # URL base pública de tu instancia de Keycloak
KC_HEALTH_ENABLED=true                                        # Habilita el endpoint de salud (/health)

# ──────────────── 🔔 WEBHOOK CONFIG ────────────────
KEYCLOAK_WEBHOOK_URL=http://host.docker.internal:8080/api/keycloak/webhook   # Endpoint al que Keycloak enviará eventos
WEBHOOK_REALM=YourRealmName                                                   # Nombre del realm que disparará el webhook

```