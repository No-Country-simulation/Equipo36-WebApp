# Keycloak Local - Docker Compose

Este `docker-compose.yml` está configurado para levantar **Keycloak en modo desarrollo local** junto con PostgreSQL.  
Incluye soporte para:

- Importación automática del **realm** (`VitalMedic-realm.json`)
- Carga del **custom event listener** (`custom-event-listener.jar`) desde tu máquina local

> 🔹 Cualquier cambio en los archivos del realm o del listener se reflejará al reiniciar Keycloak sin necesidad de reconstruir la imagen.

---
## Estructura de carpetas

```text
Keycloak/
├── compose/
│   ├── docker-compose.yml       # Compose para desarrollo local
│   └── .env                     # Variables de entorno locales
├── realms/
│   └── VitalMedic-realm.json    # Realm que se importa automáticamente
└── extensions/
    └── custom-event-listener.jar # Listener personalizado cargado en Keycloak
```
## ⚙️ Variables de entorno

```env
# Credenciales de administrador de Keycloak
KEYCLOAK_ADMIN_USER=admin           # Usuario admin de Keycloak
KEYCLOAK_ADMIN_PASSWORD=password    # Contraseña del admin

# Configuración del webhook personalizado
KEYCLOAK_WEBHOOK_URL=http://host.docker.internal:8080/api/keycloak/webhook  # URL que Keycloak llamará para eventos
WEBHOOK_REALM=VitalMedic           # Realm que escucha el webhook

# URL base de Keycloak para callbacks
KEYCLOAK_BASE_URL=http://host.docker.internal:8085  # URL donde Keycloak estará disponible

# Credenciales de la base de datos PostgreSQL
DB_DATABASE=database            # Nombre de la base de datos
DB_USERNAME=username            # Usuario de la base de datos
DB_PASSWORD=pasword             # Contraseña de la base de datos
```
> 🔹 Nota: host.docker.internal permite que los contenedores se comuniquen con tu host en Windows/Mac.

### 🔧 Usar Google (OAuth) en este realm

Por seguridad el repositorio contiene **valores falsos** para los clientes OAuth de Google.  
Si quieres usar el inicio de sesión con Google en tu entorno local, debes **reemplazar dos valores** en tu proyecto:

- `google-client-id`
- `google-client-secret`

Estos valores aparecen en el JSON del realm (`realms/VitalMedic-realms.json`). Busca exactamente esas cadenas y sustitúyelas por las variables reales que obtengas desde Google Cloud Console.

#### Dónde cambiarlos
- Archivo template (recomendado): `realms/VitalMedic-realm.json`
- Alternativa: puedes editar el cliente en la Admin Console (`http://localhost:8085/admin`) después de importar el realm.






## 🚀 Levantar el entorno local

1. Navega a la carpeta del compose:

```bash
cd Keycloak/compose
`````````````````````````````````

2. Levanta los servicios en segundo plano
```bash   
docker-compose up -d
```

### 🔹 Servicios levantados

Esto iniciará:

- **PostgreSQL** en el puerto `5435`
- **Keycloak** en el puerto `8085` con:
    - Realm **VitalMedic** importado automáticamente
    - **Custom event listener** cargado

---

### 🔹 Acceso al login del realm

Puedes acceder al login de tu realm en:

> http://localhost:8085/realms/VitalMedic/account

### 🔹 Notas adicionales

- Cualquier cambio en los archivos de **realm** o **listener** se reflejará al reiniciar Keycloak sin reconstruir la imagen.
- Esta configuración es **solo para desarrollo local**. Para producción se recomienda usar un Dockerfile que incluya los archivos dentro de la imagen.
- Asegúrate de que los puertos `5435` y `8085` estén libres en tu máquina antes de levantar los contenedores.
- `host.docker.internal` permite que los contenedores se comuniquen con tu host en Windows/Mac; en Linux puede necesitar configuración adicional.
