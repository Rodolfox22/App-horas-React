// Módulo de Gestión de Usuarios
// Este módulo maneja la administración de usuarios y permisos

export const MODULE_INFO = {
  id: 'user-management',
  name: 'Gestión de Usuarios',
  description: 'Administración de usuarios y permisos del sistema',
  version: '1.0.0',
  dependencies: []
};

// Funciones del módulo de gestión de usuarios
export const userManagementFunctions = {
  getModuleInfo: () => MODULE_INFO,

  // Validación de usuarios
  validateUser: (userName) => {
    if (!userName || userName.trim().length < 2) {
      throw new Error('El nombre de usuario debe tener al menos 2 caracteres');
    }
    return true;
  },

  // Obtener rol de usuario basado en el nombre
  getUserRole: (userName) => {
    const name = userName.toLowerCase();
    if (name.includes('tecnico') || name.includes('tech')) return 'TECNICO';
    if (name.includes('operario') || name.includes('campo')) return 'OPERARIO';
    if (name.includes('finanzas') || name.includes('finance')) return 'FINANZAS';
    if (name.includes('desarrollo') || name.includes('dev')) return 'DESARROLLO';
    if (name.includes('admin')) return 'ADMIN';
    return 'OPERARIO'; // Rol por defecto
  },

  // Verificar permisos de usuario
  hasPermission: (userRole, requiredPermission) => {
    const permissions = {
      ADMIN: ['read', 'write', 'delete', 'admin'],
      TECNICO: ['read', 'write', 'technical'],
      OPERARIO: ['read', 'write', 'field'],
      FINANZAS: ['read', 'write', 'finance'],
      DESARROLLO: ['read', 'write', 'development']
    };

    return permissions[userRole]?.includes(requiredPermission) || false;
  },

  // Obtener lista de usuarios activos
  getActiveUsers: () => {
    try {
      const users = JSON.parse(localStorage.getItem('jlc-users') || '[]');
      return users;
    } catch {
      return [];
    }
  }
};

export const UserManagementModule = {
  name: 'UserManagementModule',
  functions: userManagementFunctions
};

export default UserManagementModule;