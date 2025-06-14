/**
 * Configuración centralizada de roles del sistema
 * SOLO desde aquí se pueden definir y modificar los roles
 */

// Roles disponibles en el sistema
export const ROLES = {
  ADMIN: 'admin',
  PROFESOR: 'profesor', 
  PADRE: 'padre'
}

// Rol por defecto para nuevos usuarios
export const DEFAULT_ROLE = ROLES.PADRE

// Lista de roles válidos (para validaciones)
export const VALID_ROLES = Object.values(ROLES)

// Configuración de permisos por rol
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    canManageUsers: true,
    canManageStudents: true,
    canManageParents: true,
    canViewReports: true,
    canManageSystem: true
  },
  [ROLES.PROFESOR]: {
    canManageUsers: true,
    canManageStudents: true,
    canManageParents: false,
    canViewReports: true,
    canManageSystem: false
  },
  [ROLES.PADRE]: {
    canManageUsers: false,
    canManageStudents: false, // Solo sus propios hijos
    canManageParents: false,
    canViewReports: false, // Solo sus propios reportes
    canManageSystem: false,
    canCallStudents: true, // Permiso para llamar estudiantes
    canViewOwnStudents: true // Puede ver sus estudiantes asignados
  }
}

// Nombres legibles de los roles
export const ROLE_NAMES = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.PROFESOR]: 'Profesor',
  [ROLES.PADRE]: 'Representante'
}

/**
 * Valida si un rol es válido
 * @param {string} role - Rol a validar
 * @returns {boolean}
 */
export function isValidRole(role) {
  return VALID_ROLES.includes(role)
}

/**
 * Obtiene el nombre legible de un rol
 * @param {string} role - Rol
 * @returns {string}
 */
export function getRoleName(role) {
  return ROLE_NAMES[role] || 'Rol desconocido'
}

/**
 * Verifica si un rol tiene un permiso específico
 * @param {string} role - Rol del usuario
 * @param {string} permission - Permiso a verificar
 * @returns {boolean}
 */
export function hasPermission(role, permission) {
  return ROLE_PERMISSIONS[role]?.[permission] || false
}

/**
 * Obtiene todos los permisos de un rol
 * @param {string} role - Rol del usuario
 * @returns {Object}
 */
export function getRolePermissions(role) {
  return ROLE_PERMISSIONS[role] || {}
} 