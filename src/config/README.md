# Sistema de Roles Centralizado

## 📋 Descripción

Este sistema centraliza la definición y gestión de roles en un solo archivo: `roles.js`. 

**IMPORTANTE**: Los roles SOLO se pueden definir y modificar desde:
1. ✅ `src/config/roles.js` (configuración principal)
2. ✅ Supabase Dashboard (base de datos)

## 🔧 Configuración Actual

### Roles Disponibles
- **admin**: Administrador del sistema
- **profesor**: Profesor del colegio (puede gestionar usuarios y estudiantes)
- **padre**: Representante legal de los estudiantes (ROL POR DEFECTO)

### Rol Por Defecto
Todas las nuevas cuentas se crean automáticamente con el rol **"padre"** (mostrado como "Representante").

#### Características del Rol "padre" (Representante):
- ✅ Puede **llamar** a sus estudiantes asignados
- ✅ Puede **ver** solo sus estudiantes asignados
- ✅ Puede **crear** registros de salida de sus estudiantes
- ✅ Puede **ver** sus propios reportes de llamadas
- ❌ **No puede gestionar** otros usuarios del sistema
- ❌ **No puede ver** estudiantes de otros representantes

## 📁 Archivos Afectados

### Configuración Principal
- `src/config/roles.js` - Definición centralizada de roles y permisos

### Archivos que Usan la Configuración
- `src/supabase.js` - Funciones de autenticación
- `src/utils/userHelpers.js` - Funciones auxiliares de usuarios
- `src/scripts/updateUserRole.js` - Script para cambiar roles
- `src/stores/auth.js` - Store de autenticación
- `src/components/AuthForm.vue` - Formulario de registro

## 🚀 Cómo Usar

### Crear Usuario con Rol Por Defecto
```javascript
// Automáticamente será 'padre' (mostrado como "Representante")
await auth.signUp('representante@email.com', 'password123')
```

### Crear Usuario con Rol Específico (Solo Admins)
```javascript
// Solo para casos especiales (admin creando profesor)
await auth.signUp('profesor@colegio.com', 'password123', { 
  role: 'profesor',
  nombre: 'María',
  apellido: 'González'
})
```

### Cambiar Rol de Usuario Existente
```bash
# Usando el script
node src/scripts/updateUserRole.js usuario@email.com admin

# Listar todos los usuarios
node src/scripts/updateUserRole.js --list
```

### Verificar Permisos
```javascript
import { hasPermission, getRolePermissions } from '../config/roles.js'

// Verificar permiso específico
if (hasPermission(userRole, 'canCallStudents')) {
  // Usuario puede llamar a estudiantes
}

// Obtener todos los permisos
const permissions = getRolePermissions(userRole)
```

## 🔒 Seguridad

- ✅ Validación automática de roles válidos
- ✅ Rol por defecto seguro ('padre')
- ✅ Configuración centralizada
- ✅ Funciones de validación incluidas
- ✅ Documentación de permisos por rol
- ✅ Políticas de seguridad específicas por rol

## ⚠️ Importante

**NO modifiques roles directamente en otros archivos**. Siempre usa:
1. `src/config/roles.js` para cambios en código
2. Supabase Dashboard para cambios en base de datos
3. Script `updateUserRole.js` para cambios individuales

## 📊 Roles Actuales y Permisos

| Rol | Gestionar Usuarios | Gestionar Estudiantes | Ver Reportes | Llamar Estudiantes | Configuración |
|-----|-------------------|----------------------|--------------|-------------------|---------------|
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Profesor** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Padre (Representante)** | ❌ | Solo asignados | Solo propios | Solo asignados | ❌ |

## 🔄 Agregar Nuevo Rol

1. Edita `src/config/roles.js`
2. Agrega el nuevo rol a `ROLES`
3. Define sus permisos en `ROLE_PERMISSIONS`
4. Agrega nombre legible en `ROLE_NAMES`
5. Actualiza la restricción en Supabase si es necesario

```javascript
// Ejemplo: Agregar rol 'coordinador'
export const ROLES = {
  // ... roles existentes
  COORDINADOR: 'coordinador'
}

export const ROLE_PERMISSIONS = {
  // ... permisos existentes
  [ROLES.COORDINADOR]: {
    canManageUsers: false,
    canManageStudents: true,
    // ... otros permisos
  }
}
```
