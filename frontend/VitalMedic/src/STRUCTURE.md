# 🏥 VitalMedic - Frontend Structure

## 📁 Estructura del Proyecto

```
src/
├── 🧩 components/           # Componentes reutilizables
│   ├── common/             # Componentes generales
│   ├── layout/             # Layout, headers, sidebars
│   ├── ui/                 # Buttons, inputs, modals
│   └── forms/              # Formularios específicos
│
├── ⚡ features/             # Módulos por funcionalidad
│   ├── auth/               # Autenticación y autorización
│   ├── appointments/       # Gestión de citas médicas
│   ├── patients/           # Gestión de pacientes
│   ├── doctors/            # Gestión de médicos
│   ├── teleconsult/        # Videollamadas y chat
│   ├── medical-records/    # Historiales médicos
│   ├── notifications/      # Sistema de notificaciones
│   └── dashboard/          # Dashboards por rol
│
├── 📄 pages/                # Páginas principales
│   ├── auth/               # Login, registro, recuperar contraseña
│   ├── patient/            # Portal del paciente
│   ├── doctor/             # Portal del médico
│   └── admin/              # Portal administrativo
│
├── 🔌 services/            # APIs y servicios externos
│   ├── api/                # Cliente HTTP para backend
│   ├── websocket/          # Conexiones tiempo real
│   └── integrations/       # FHIR, videollamadas, calendarios
│
├── 🎣 hooks/               # Custom React hooks
├── 🌐 contexts/            # React contexts para estado global
├── 📝 types/               # Definiciones TypeScript
├── 🔧 utils/               # Utilidades y helpers
├── 📋 constants/           # Constantes de la aplicación
└── 🎨 assets/              # Recursos estáticos
```

## 🎯 Funcionalidades por Módulo

### Must-Have ✅
- **Auth**: Login, registro, recuperación de contraseña, roles
- **Appointments**: Agenda, citas presenciales/virtuales, disponibilidad
- **Teleconsult**: Videollamadas WebRTC, chat, sala de espera
- **Medical Records**: Historiales, integración FHIR
- **Notifications**: Recordatorios automáticos email/SMS

### Nice-to-Have 🌟
- **Dashboard**: Analytics y reportes
- **Billing**: Facturación automática
- **Waiting Lists**: Gestión de listas de espera
- **Predictions**: Algoritmos de cancelaciones

## 🚀 Tecnologías

- **Framework**: React 19 + TypeScript
- **Styling**: TailwindCSS 4.x
- **Routing**: React Router 7
- **Build Tool**: Vite
- **State Management**: React Context + Custom Hooks

## 📱 Roles de Usuario

1. **Paciente**: Agendar citas, ver historial, teleconsultas
2. **Médico**: Gestionar agenda, historiales, teleconsultas
3. **Admin**: Gestión general, reportes, configuración

## 🔗 Integraciones Planificadas

- Backend Spring Boot (API REST)
- FHIR para historiales médicos
- WebRTC para videollamadas
- Google Calendar/Outlook
- Servicios de email/SMS
- Zoom/Google Meet APIs

---
**Equipo 36 - No Country Simulation**  
**Proyecto**: Portal Web de Coordinación de Citas y Teleasistencia  
**Vertical**: HealthTech