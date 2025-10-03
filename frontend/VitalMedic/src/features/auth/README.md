# Authentication Module

Módulo de autenticación y autorización:

## Funcionalidades:
- Login/Logout
- Registro de usuarios (pacientes/médicos)
- Recuperación de contraseña
- Autenticación multifactor
- Control de permisos por rol
- JWT token management

## Estructura:
- `components/`: Componentes de UI para auth
- `hooks/`: useAuth, usePermissions
- `services/`: API calls para autenticación
- `types/`: User, Role, AuthState types