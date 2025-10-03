# Contexts

React Contexts para estado global:

## Contexts principales:
- `AuthContext`: Estado de autenticación y usuario actual
- `ThemeContext`: Tema y configuraciones de UI
- `NotificationContext`: Sistema de notificaciones
- `AppointmentContext`: Estado de citas en tiempo real
- `SocketContext`: Conexiones WebSocket

## Patrón:
Cada context incluye:
- Provider component
- Custom hook para consumir el context
- Types para el estado