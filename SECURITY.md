# 🔐 Guía de Seguridad - VitalMedic

## ⚠️ CREDENCIALES EXPUESTAS - ACCIÓN REQUERIDA

**GitGuardian detectó credenciales expuestas el 16 de Octubre 2025.**

### 🚨 Credenciales Comprometidas:
- Contraseñas de prueba de usuarios (patient123, doctor123, admin123)
- Contraseña de base de datos local (local123)

### ✅ Acciones Correctivas Implementadas:
1. ✅ Eliminadas contraseñas hardcodeadas del código
2. ✅ Actualizado componente UserManagement.tsx
3. ✅ Actualizado script start-vitalmedic.ps1
4. ✅ Commit de seguridad aplicado

### 🔧 Configuración Segura:

#### Para Desarrollo Local:
1. **Base de Datos**: Usar variables de entorno en `.env`
2. **Keycloak**: Configurar usuarios con contraseñas seguras
3. **Testing**: Usar cuentas temporales, nunca hardcodeadas

#### Variables de Entorno Requeridas:
```env
# Base de datos
DB_PASSWORD=your_secure_password_here
DB_USER=vitalmedic_user
DB_NAME=vitalmedic_local

# Keycloak
KEYCLOAK_ADMIN_PASSWORD=your_keycloak_admin_password
```

### 🏠 Para Desarrolladores:
- **NUNCA** commitear contraseñas reales
- Usar `.env` para credenciales locales
- Usar `[CONFIGURAR]` o `[VER .ENV]` en lugar de contraseñas hardcodeadas
- Revisar commits antes de push

### 📞 En caso de exposición:
1. Cambiar inmediatamente las contraseñas comprometidas
2. Revocar tokens de acceso
3. Notificar al equipo
4. Aplicar commit de corrección

---
**Última actualización**: 16 Octubre 2025
**Estado**: ✅ Credenciales removidas del código