// Módulo de Gestión de Usuarios
// Este módulo maneja la administración de usuarios y permisos con autenticación segura

import {
  createSecureUser,
  authenticateUser,
  getSecureUsers,
  updateUser2FA,
  isSuperUser,
  getUser2FAInfo,
  generateQRCode
} from '../../services/authService';

export const MODULE_INFO = {
  id: "user-management",
  name: "Gestión de Usuarios",
  description: "Administración de usuarios y permisos del sistema con autenticación segura",
  version: "2.0.0",
  dependencies: ["authService"],
};

// Funciones del módulo de gestión de usuarios
export const userManagementFunctions = {
  getModuleInfo: () => MODULE_INFO,

  // Validación de usuarios
  validateUser: (userName) => {
    if (!userName || userName.trim().length < 2) {
      throw new Error("El nombre de usuario debe tener al menos 2 caracteres");
    }
    return true;
  },

  // Obtener rol de usuario basado en el nombre (para compatibilidad)
  getUserRole: (userName) => {
    const name = userName.toLowerCase();
    if (name.includes("tecnico") || name.includes("tech")) {
      return "TECNICO";
    }
    if (name.includes("operario") || name.includes("campo")) {
      return "OPERARIO";
    }
    if (name.includes("finanzas") || name.includes("finance")) {
      return "FINANZAS";
    }
    if (name.includes("desarrollo") || name.includes("dev")) {
      return "DESARROLLO";
    }
    if (name.includes("admin")) {
      return "ADMIN";
    }
    return "OPERARIO"; // Rol por defecto
  },

  // Verificar permisos de usuario
  hasPermission: (userRole, requiredPermission) => {
    const permissions = {
      ADMIN: ["read", "write", "delete", "admin", "manage_users", "system_config"],
      TECNICO: ["read", "write", "technical"],
      OPERARIO: ["read", "write", "field"],
      FINANZAS: ["read", "write", "finance"],
      DESARROLLO: ["read", "write", "development"],
    };

    return permissions[userRole]?.includes(requiredPermission) || false;
  },

  // Obtener lista de usuarios activos (compatibilidad)
  getActiveUsers: () => {
    try {
      return JSON.parse(localStorage.getItem("jlc-users") || "[]");
    } catch {
      return [];
    }
  },

  // ===== FUNCIONES DE AUTENTICACIÓN SEGURA =====

  // Crear usuario seguro (solo para superusuarios)
  createSecureUser: async (userName, password, role = 'operario', enable2FA = false) => {
    try {
      return await createSecureUser(userName, password, role, enable2FA);
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  },

  // Autenticar usuario
  authenticateUser: async (userName, password, twoFactorToken = null) => {
    try {
      return await authenticateUser(userName, password, twoFactorToken);
    } catch (error) {
      console.error('Error en autenticación:', error);
      return null;
    }
  },

  // Obtener usuarios seguros
  getSecureUsers: () => {
    return getSecureUsers();
  },

  // Verificar si es superusuario
  isSuperUser: (userName) => {
    return isSuperUser(userName);
  },

  // Actualizar configuración 2FA
  updateUser2FA: (userId, enable2FA) => {
    return updateUser2FA(userId, enable2FA);
  },

  // Obtener información 2FA de usuario
  getUser2FAInfo: (userName) => {
    return getUser2FAInfo(userName);
  },

  // Generar código QR para 2FA
  generateQRCode: async (otpauth_url) => {
    try {
      return await generateQRCode(otpauth_url);
    } catch (error) {
      throw new Error(`Error al generar código QR: ${error.message}`);
    }
  },

  // ===== FUNCIONES PARA SUPERUSUARIOS =====

  // Obtener todos los usuarios del sistema (solo superusuarios)
  getAllSystemUsers: () => {
    const secureUsers = getSecureUsers();
    const legacyUsers = JSON.parse(localStorage.getItem("jlc-users") || "[]");

    // Combinar usuarios seguros con usuarios legacy
    const allUsers = [...secureUsers];

    // Agregar usuarios legacy que no estén en el sistema seguro
    legacyUsers.forEach(legacyUser => {
      const exists = secureUsers.some(secure => secure.userName === legacyUser);
      if (!exists) {
        allUsers.push({
          id: `legacy-${legacyUser}`,
          userName: legacyUser,
          role: userManagementFunctions.getUserRole(legacyUser),
          isLegacy: true,
          createdAt: null
        });
      }
    });

    return allUsers;
  },

  // Migrar usuario legacy a sistema seguro (solo superusuarios)
  migrateUserToSecure: async (userName, password, enable2FA = false) => {
    try {
      const role = userManagementFunctions.getUserRole(userName);
      const newUser = await createSecureUser(userName, password, role, enable2FA);

      // Remover de lista legacy
      const legacyUsers = JSON.parse(localStorage.getItem("jlc-users") || "[]");
      const updatedLegacy = legacyUsers.filter(user => user !== userName);
      localStorage.setItem("jlc-users", JSON.stringify(updatedLegacy));

      return newUser;
    } catch (error) {
      throw new Error(`Error al migrar usuario: ${error.message}`);
    }
  },

  // Eliminar usuario (solo superusuarios)
  deleteUser: (userId) => {
    try {
      const users = getSecureUsers();
      const filteredUsers = users.filter(user => user.id !== userId);
      localStorage.setItem('jlc_secure_users', JSON.stringify(filteredUsers));
      return true;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      return false;
    }
  },

  // Cambiar contraseña de usuario (solo superusuarios)
  changeUserPassword: async (userId, newPassword) => {
    try {
      const users = getSecureUsers();
      const userIndex = users.findIndex(user => user.id === userId);

      if (userIndex === -1) {
        return false;
      }

      // Importar hashPassword aquí para evitar dependencias circulares
      const { hashPassword } = await import('../../services/authService');
      const hashedPassword = await hashPassword(newPassword);

      users[userIndex].password = hashedPassword;
      localStorage.setItem('jlc_secure_users', JSON.stringify(users));

      return true;
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      return false;
    }
  },

  // Obtener estadísticas de seguridad (solo superusuarios)
  getSecurityStats: () => {
    const users = getSecureUsers();
    const totalUsers = users.length;
    const superUsers = users.filter(user => user.isSuperUser).length;
    const usersWith2FA = users.filter(user => user.twoFactorEnabled).length;
    const legacyUsers = JSON.parse(localStorage.getItem("jlc-users") || "[]").length;

    return {
      totalUsers,
      superUsers,
      usersWith2FA,
      legacyUsers,
      secureUsers: totalUsers - legacyUsers,
      securityScore: Math.round(((usersWith2FA / totalUsers) * 100) || 0)
    };
  }
};

export const UserManagementModule = {
  name: "UserManagementModule",
  functions: userManagementFunctions,
};

export default UserManagementModule;
