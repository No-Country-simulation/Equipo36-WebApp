# 🔐 Sistema de Protección de Rutas - VitalMedic

## ✅ **Implementado:**

### **1. Sistema de Autenticación y Autorización**
- **Hook `useAuth`**: Gestiona roles desde Keycloak
- **Componente `ProtectedRoute`**: Protege rutas según roles
- **Componente `AccessDenied`**: Muestra mensaje cuando no tiene permisos

### **2. Roles del Sistema**
- **ADMIN**: Acceso completo a todos los paneles
- **DOCTOR**: Acceso a panel de doctor + paciente
- **PATIENT**: Solo acceso a panel de paciente

### **3. Rutas Protegidas**
```
/dashboard/admin/*     -> Solo ADMIN
/dashboard/doctor/*    -> ADMIN + DOCTOR
/dashboard/patient/*   -> ADMIN + DOCTOR + PATIENT
```

### **4. Redirección Automática**
El sistema redirige automáticamente según el rol:
- Admin → `/dashboard/admin`
- Doctor → `/dashboard/doctor`  
- Patient → `/dashboard/patient`

## 🧪 **Testing del Sistema:**

### **Paso 1: Crear Cuentas de Prueba en Keycloak**

Necesitas crear usuarios en Keycloak con diferentes roles:

1. **Admin de Prueba:**
   - Email: `admin@vitalmedic.com`
   - Password: `admin123`
   - Roles: `admin`, `ADMIN`

2. **Doctor de Prueba:**
   - Email: `doctor@vitalmedic.com`
   - Password: `doctor123`
   - Roles: `doctor`, `DOCTOR`

3. **Paciente de Prueba:**
   - Email: `paciente@vitalmedic.com`
   - Password: `patient123`
   - Roles: `patient`, `PATIENT`

### **Paso 2: Acceder a Keycloak Admin**

1. Ve a: `https://vitalmedic-auth.onrender.com/admin`
2. Login con credenciales de admin de Keycloak
3. Selecciona realm: `VitalMedic`
4. Ve a `Users` → `Add User`

### **Paso 3: Configurar Roles**

1. En Keycloak Admin, ve a `Realm Roles`
2. Crea los roles si no existen:
   - `ADMIN`
   - `DOCTOR` 
   - `PATIENT`
3. Asigna roles a cada usuario

### **Paso 4: Testing de Acceso**

**Prueba 1 - Usuario Admin:**
```bash
# Login como admin@vitalmedic.com
# Debería redirigir a: /dashboard/admin
# Puede acceder a:
✅ /dashboard/admin
✅ /dashboard/doctor  
✅ /dashboard/patient
```

**Prueba 2 - Usuario Doctor:**
```bash
# Login como doctor@vitalmedic.com
# Debería redirigir a: /dashboard/doctor
# Puede acceder a:
❌ /dashboard/admin (Acceso denegado)
✅ /dashboard/doctor
✅ /dashboard/patient
```

**Prueba 3 - Usuario Paciente:**
```bash
# Login como paciente@vitalmedic.com
# Debería redirigir a: /dashboard/patient
# Puede acceder a:
❌ /dashboard/admin (Acceso denegado)
❌ /dashboard/doctor (Acceso denegado)
✅ /dashboard/patient
```

## 🔗 **URLs de Testing:**

- **Login**: http://localhost:5173/
- **Panel Admin**: http://localhost:5173/dashboard/admin
- **Panel Doctor**: http://localhost:5173/dashboard/doctor
- **Panel Paciente**: http://localhost:5173/dashboard/patient

## ⚙️ **Configuración de Keycloak:**

El sistema busca roles en:
1. `keycloak.realmAccess.roles`
2. `keycloak.resourceAccess['vitalmedic-frontend'].roles`

Asegúrate de configurar los roles correctamente en Keycloak.

## 🚨 **Comportamiento Esperado:**

1. **Sin autenticación**: Redirige al login
2. **Sin permisos**: Muestra página de "Acceso Denegado"
3. **Con permisos**: Muestra el panel correspondiente
4. **Auto-redirección**: Según el rol principal del usuario

¿Quieres que te ayude a configurar las cuentas de prueba en Keycloak?