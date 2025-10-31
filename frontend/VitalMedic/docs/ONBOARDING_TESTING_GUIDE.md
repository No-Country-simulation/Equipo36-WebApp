# 🚀 Guía de Testing del Onboarding - VitalMedic

## 📋 **Resumen de la Implementación**

He implementado un sistema completo de onboarding automático que incluye:

### ✅ **Componentes Implementados:**
1. **OnboardingGuard** - Redirección automática de pacientes sin onboarding completado
2. **useAuth actualizado** - Hook con lógica de onboarding status
3. **CompleteOnboarding mejorado** - Manejo robusto de errores y estados
4. **OnboardingDebug** - Componente para testing y debugging
5. **Routing actualizado** - Integración del guard en el routing principal

### 🔧 **Funcionalidades Clave:**
- **Redirección automática**: Los pacientes son redirigidos automáticamente al onboarding
- **Manejo de estados**: El sistema respeta los estados del backend (PENDING_IDENTIFIER, IMPORT_PROMPT, MANUAL_ENTRY, COMPLETED)
- **Manejo robusto de errores**: Si el backend falla, el sistema permite continuar funcionalmente
- **Debug integrado**: Componente de debug para testing en desarrollo

---

## 🧪 **Cómo Probar el Onboarding**

### **Paso 1: Preparar el Entorno**

1. **Asegúrate de que el backend esté funcionando:**
   ```bash
   # Verificar que el backend responda
   curl https://vitalmedic-backend.onrender.com/api/enums/identifier-systems
   ```

2. **Iniciar el frontend en modo desarrollo:**
   ```bash
   cd frontend/VitalMedic
   npm run dev
   ```

### **Paso 2: Crear Usuario de Prueba**

1. **Acceder a Keycloak Admin:**
   - URL: `https://vitalmedic-auth.onrender.com/admin`
   - Realm: `VitalMedic`

2. **Crear usuario de prueba:**
   - Email: `test@vitalmedic.com`
   - Password: `test123`
   - Roles: `patient`, `PATIENT`

### **Paso 3: Probar el Flujo Completo**

#### **Escenario 1: Usuario Nuevo (Onboarding Completo)**

1. **Login como paciente nuevo**
2. **Verificar redirección automática** a `/onboarding`
3. **Completar Paso 1:**
   - Seleccionar tipo: CURP
   - Ingresar CURP válido: `GORA850101HDFRRL09`
   - Hacer clic en "Verificar Identificación"
4. **Completar Paso 2:**
   - Llenar formulario de perfil
   - Hacer clic en "Completar Registro"
5. **Verificar redirección** a `/dashboard/patient`

#### **Escenario 2: Usuario con Onboarding Parcial**

1. **Login como usuario existente**
2. **Verificar que continúa desde el paso correcto** según su estado en BD
3. **Completar los pasos faltantes**

#### **Escenario 3: Manejo de Errores**

1. **Probar con CURP inválido**
2. **Probar con CURP ya existente**
3. **Simular error de conexión** (desconectar internet)
4. **Verificar que el sistema maneja errores gracefully**

---

## 🔍 **Usando el Componente de Debug**

El componente `OnboardingDebug` está disponible en modo desarrollo y te permite:

### **Funciones de Debug:**
- **🔍 Estado Onboarding**: Verifica el estado actual del usuario
- **👤 Datos Usuario**: Verifica qué datos tiene el usuario en la BD
- **🆔 Probar CURP**: Prueba la API de verificación de identificadores
- **📝 Probar Perfil**: Prueba la API de actualización de perfil

### **Información Mostrada:**
- Estado de autenticación
- Roles del usuario
- Estado actual del onboarding
- Si necesita onboarding
- Si debería redirigir
- Resultados de las pruebas de API

---

## 🌐 **Endpoints del Backend Utilizados**

### **APIs de Onboarding:**
```typescript
// Verificar identificador
POST /api/patient/onbording/identifier
{
  "system": "CURP",
  "value": "GORA850101HDFRRL09"
}

// Estado del onboarding
GET /api/patient/onboarding/status

// Actualizar perfil
POST /api/patient/onboarding/profile
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "birthDate": "1990-01-01",
  "gender": "MALE",
  "phone": "+52 55 1234 5678",
  "address": "Calle 123"
}

// Importar datos FHIR
POST /api/patient/onboarding/import
{
  "importAll": true
}
```

### **Sistemas de Identificación Soportados:**
- **CURP**: Clave Única de Registro de Población
- **RFC**: Registro Federal de Contribuyentes  
- **NSS_IMSS**: Número de Seguridad Social del IMSS
- **ISSSTE**: Número ISSSTE
- **PRIVATE_INSURANCE**: Seguro Privado

---

## 🚦 **Estados del Onboarding**

### **Flujo de Estados:**
```
PENDING_IDENTIFIER → IMPORT_PROMPT → MANUAL_ENTRY → COMPLETED
```

### **Descripción de Estados:**
- **PENDING_IDENTIFIER**: Usuario necesita verificar su identidad
- **IMPORT_PROMPT**: Usuario puede elegir importar datos de FHIR o llenar manualmente
- **MANUAL_ENTRY**: Usuario debe completar su perfil manualmente
- **COMPLETED**: Onboarding completado, acceso total al sistema

---

## 🐛 **Troubleshooting**

### **Problemas Comunes:**

#### **1. Error 500 del Backend**
- **Síntoma**: El onboarding no funciona
- **Solución**: El sistema maneja esto automáticamente, permite continuar funcionalmente

#### **2. Redirección Infinita**
- **Síntoma**: El usuario queda en loop de redirección
- **Solución**: Verificar que el usuario tenga rol PATIENT y estado correcto

#### **3. Token Expirado**
- **Síntoma**: Error 401 en las APIs
- **Solución**: El sistema renueva tokens automáticamente

#### **4. CURP Ya Existe**
- **Síntoma**: Error al verificar identificador
- **Solución**: Usar un CURP diferente o verificar en la BD

### **Logs de Debug:**
El sistema incluye logs detallados en la consola del navegador:
- `🔍 OnboardingGuard: Verificando estado del onboarding...`
- `📊 CompleteOnboarding: Estado actual: PENDING_IDENTIFIER`
- `✅ CompleteOnboarding: Perfil actualizado exitosamente`

---

## 📊 **Testing Checklist**

### **Funcionalidad Básica:**
- [ ] Usuario nuevo es redirigido automáticamente al onboarding
- [ ] Usuario con onboarding completado accede directamente al dashboard
- [ ] Usuario puede completar el onboarding paso a paso
- [ ] Redirección automática al dashboard al completar

### **Manejo de Errores:**
- [ ] Error de conexión con backend se maneja gracefully
- [ ] CURP inválido muestra mensaje de error apropiado
- [ ] CURP ya existente muestra mensaje de error apropiado
- [ ] Campos obligatorios se validan correctamente

### **Estados Persistentes:**
- [ ] Usuario puede salir y regresar al onboarding
- [ ] El sistema recuerda el estado del usuario
- [ ] Usuario continúa desde el paso correcto

### **Integración con Backend:**
- [ ] APIs responden correctamente
- [ ] Estados se sincronizan con la BD
- [ ] Tokens de autenticación funcionan correctamente

---

## 🎯 **Próximos Pasos**

### **Mejoras Sugeridas:**
1. **Analytics del onboarding**: Tracking de conversión por paso
2. **A/B Testing**: Probar diferentes versiones del flujo
3. **Onboarding para doctores**: Extender el sistema a otros roles
4. **Validación biométrica**: Integrar verificación adicional
5. **PWA**: Permitir onboarding offline

### **Optimizaciones:**
1. **Caché de validaciones**: Evitar validaciones repetidas
2. **Prefetch de datos**: Cargar datos FHIR anticipadamente
3. **Lazy loading**: Cargar componentes bajo demanda
4. **Error boundaries**: Manejo más robusto de errores

---

**Última actualización**: Enero 2025  
**Versión**: 1.0.0  
**Equipo**: Equipo 36 - VitalMedic
