# 🚀 Sistema de Onboarding Inteligente - VitalMedic

## 📋 **Resumen**

El sistema de onboarding de VitalMedic es un flujo inteligente que guía a los nuevos pacientes a través del proceso de registro, siguiendo los estados definidos en la base de datos y conectándose automáticamente con el backend.

---

## 🎯 **Flujo del Onboarding**

### **Estados de la Base de Datos**
```sql
-- Estados posibles en la tabla patients.onboarding_status
PENDING_IDENTIFIER  -- ⏳ Esperando verificación de identificación
IMPORT_PROMPT      -- 🤔 Preguntando si importar datos de FHIR
MANUAL_ENTRY       -- ✍️  Llenado manual de datos
COMPLETED          -- ✅ Onboarding completado
```

### **Flujo Visual**
```
Usuario se registra en Keycloak
         ↓
   Se crea en tabla `users` con role PATIENT
         ↓
   Se crea en tabla `patients` con onboarding_status = 'PENDING_IDENTIFIER'
         ↓
┌─────────────────────────────────────────┐
│  PASO 1: VERIFICACIÓN DE IDENTIDAD     │
│  Estado: PENDING_IDENTIFIER             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • Usuario ingresa CURP/RFC/NSS         │
│  • Sistema verifica que no exista       │
│  • Se guarda en patient_identifiers     │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  PASO 2: OPCIÓN DE IMPORTACIÓN         │
│  Estado: IMPORT_PROMPT                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • ¿Importar de FHIR o manual?         │
│  • Si FHIR: intenta importar datos     │
│  • Si manual: va a MANUAL_ENTRY        │
└─────────────────────────────────────────┘
         ↓                    ↓
  ┌─────────────┐      ┌─────────────────────┐
  │ IMPORTACIÓN │      │  ENTRADA MANUAL     │
  │ EXITOSA     │      │  Estado: MANUAL_ENTRY │
  │ ↓           │      │  ━━━━━━━━━━━━━━━━━━━  │
  │ COMPLETED   │      │  • Formulario datos │
  │             │      │  • Validaciones     │
  └─────────────┘      │  • Guardado perfil  │
         ↓             └─────────────────────┘
                              ↓
┌─────────────────────────────────────────┐
│         ONBOARDING COMPLETADO          │
│         Estado: COMPLETED              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • Usuario puede usar la plataforma    │
│  • Acceso completo a funcionalidades   │
└─────────────────────────────────────────┘
```

---

## 🔧 **Componentes Técnicos**

### **1. OnboardingService (`services/onboardingService.ts`)**
Maneja toda la lógica de comunicación con el backend:

```typescript
// Métodos principales
OnboardingService.getOnboardingStatus()     // Estado actual del usuario
OnboardingService.verifyIdentifier()        // Verificar CURP/RFC/NSS
OnboardingService.importFromFhir()          // Importar datos de FHIR
OnboardingService.updateProfile()           // Actualizar perfil manualmente
OnboardingService.completeOnboarding()      // Marcar como completado
```

### **2. SmartOnboarding (`pages/onboarding/SmartOnboarding.tsx`)**
Componente principal que renderiza el flujo basado en el estado:

```typescript
// Estados del componente
- loading: Cargando estado inicial
- identifier: Verificación de identidad
- import_prompt: Opción importar vs manual
- manual_entry: Formulario manual
- completed: Registro completado
```

### **3. OnboardingGuard (`components/auth/OnboardingGuard.tsx`)**
Middleware que redirige automáticamente al onboarding:

```typescript
// Lógica de redirección
- Verifica si el usuario es PATIENT
- Consulta su onboarding_status
- Redirige si status !== 'COMPLETED'
- Evita loops de redirección
```

### **4. useAuth Hook (actualizado)**
Incluye lógica de onboarding:

```typescript
const {
  // Estados de onboarding
  onboardingStatus,           // Estado actual
  needsOnboarding,           // Booleano: necesita completar
  shouldRedirectToOnboarding, // Booleano: debe redirigir
  refreshOnboardingStatus    // Función: actualizar estado
} = useAuth();
```

---

## 🌐 **Endpoints del Backend**

### **APIs Utilizadas**
```typescript
// Verificación de identificadores
POST /api/patient/onbording/identifier
{
  "system": "CURP" | "RFC" | "NSS_IMSS" | "ISSSTE" | "PRIVATE_INSURANCE",
  "value": "CURP123456789012345"
}

// Estado del onboarding
GET /api/patient/onboarding/status

// Importar de FHIR
POST /api/patient/onboarding/import
{
  "system": "CURP",
  "value": "CURP123456789012345"
}

// Actualizar perfil
POST /api/patient/onboarding/profile
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "birthDate": "1990-01-01",
  "gender": "MALE",
  "phone": "+52 55 1234 5678",
  "address": "Calle 123, Ciudad"
}
```

---

## 📋 **Validaciones Implementadas**

### **Formato de Identificadores**
```typescript
// CURP: 4 letras + 6 números + H/M + 5 letras + 2 números
CURP: /^[A-Z]{4}\d{6}[HM][A-Z]{5}\d{2}$/

// RFC Persona Física: 4 letras + 6 números + 3 alfanuméricos
RFC: /^[A-Z]{4}\d{6}[A-Z0-9]{3}$/

// RFC Persona Moral: 3 letras + 6 números + 3 alfanuméricos  
RFC: /^[A-Z]{3}\d{6}[A-Z0-9]{3}$/

// NSS IMSS: 11 dígitos
NSS: /^\d{11}$/
```

### **Campos del Perfil**
- **Obligatorios**: firstName, lastName, birthDate, gender
- **Opcionales**: phone, address
- **Validaciones**: Formato de fecha, longitud mínima, caracteres permitidos

---

## 🚦 **Estados de Error Manejados**

### **Respuestas del Backend**
```typescript
// Identificador ya existe
Status: 400 - "Este CURP ya está registrado"

// Identificador no encontrado (bueno para registro)
Status: 404 - "Identificador disponible"

// Error de conexión FHIR
Status: 500 - "Error al conectar con FHIR"

// Error de autorización
Status: 401 - "Token inválido o expirado"
```

### **Manejo en Frontend**
- **Loading states**: Spinners durante llamadas API
- **Error messages**: Mensajes claros y accionables
- **Success feedback**: Confirmaciones de acciones exitosas
- **Retry logic**: Opciones para reintentar en caso de error

---

## 🔄 **Integración con Keycloak**

### **Flujo de Autenticación**
1. Usuario se registra en Keycloak
2. Keycloak webhook notifica al backend
3. Backend crea registro en tabla `users`
4. Backend crea registro en tabla `patients` con `onboarding_status = 'PENDING_IDENTIFIER'`
5. Frontend detecta el estado y redirige al onboarding

### **Roles y Permisos**
```typescript
// Solo pacientes necesitan onboarding
- PATIENT: Requiere completar onboarding
- DOCTOR: Acceso directo al dashboard
- ADMIN: Acceso directo al dashboard
```

---

## 🎨 **Diseño y UX**

### **Principios de Diseño**
- **Progresivo**: Un paso a la vez, sin sobrecargar
- **Contextual**: Explicaciones claras en cada paso
- **Recuperable**: Puede salir y continuar después
- **Eficiente**: Mínima fricción para completar

### **Componentes UI**
- **Progress indicator**: Muestra el progreso visual
- **Loading states**: Feedback durante operaciones
- **Error boundaries**: Manejo elegante de errores
- **Responsive design**: Funciona en móvil y desktop

### **Accesibilidad**
- Labels apropiados para screen readers
- Navegación por teclado
- Contraste adecuado de colores
- Mensajes de error descriptivos

---

## 🧪 **Testing**

### **Casos de Prueba Recomendados**
```typescript
// Flujo exitoso completo
✅ Nuevo usuario → Verificar CURP → Importar FHIR → Completado

// Flujo manual
✅ Nuevo usuario → Verificar RFC → Manual → Llenar form → Completado

// Casos de error
❌ CURP ya existe
❌ Formato inválido de identificador  
❌ Error de conexión FHIR
❌ Campos obligatorios faltantes

// Estados persistentes
✅ Usuario sale en paso 2 → Regresa → Continúa en paso 2
✅ Usuario completo → No ve onboarding nunca más
```

---

## 🚀 **Próximos Pasos**

### **Mejoras Planificadas**
- [ ] Importación desde múltiples fuentes FHIR
- [ ] Verificación biométrica opcional
- [ ] Onboarding para médicos y admins
- [ ] Analytics del flujo de onboarding
- [ ] A/B testing de diferentes versiones

### **Optimizaciones**
- [ ] Caché de validaciones de identificadores
- [ ] Prefetch de datos de FHIR
- [ ] Lazy loading de componentes
- [ ] PWA para uso offline

---

## 📚 **Recursos Adicionales**

- **Documentación FHIR**: https://www.hl7.org/fhir/
- **Keycloak Docs**: https://www.keycloak.org/documentation
- **React Router**: https://reactrouter.com/
- **TailwindCSS**: https://tailwindcss.com/

---

**Última actualización**: Enero 2025  
**Versión**: 1.0.0  
**Equipo**: Equipo 36 - VitalMedic