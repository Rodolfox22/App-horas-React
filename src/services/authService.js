/**
 * Servicio de autenticación segura con cifrado y 2FA
 */

import bcrypt from 'bcryptjs';
import qrcode from 'qrcode';

// Constantes para localStorage
const USERS_STORAGE_KEY = 'jlc_secure_users';
const SALT_ROUNDS = 12;

/**
 * Genera un hash seguro de la contraseña
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} Hash de la contraseña
 */
export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Error al procesar la contraseña');
  }
};

/**
 * Verifica una contraseña contra su hash
 * @param {string} password - Contraseña en texto plano
 * @param {string} hashedPassword - Hash almacenado
 * @returns {Promise<boolean>} True si la contraseña es correcta
 */
export const verifyPassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};

/**
 * Genera un secret para autenticación de dos factores
 * @param {string} userName - Nombre del usuario
 * @returns {Object} Objeto con secret y URL para QR
 */
export const generate2FASecret = (userName) => {
  // Generar un secret simple de 32 caracteres
  const secret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const otpauth_url = `otpauth://totp/JLC%20Sistema:${userName}?secret=${secret}&issuer=JLC%20Sistema`;

  return {
    secret: secret,
    otpauth_url: otpauth_url
  };
};

/**
 * Genera código QR para configurar 2FA
 * @param {string} otpauth_url - URL OTP Auth
 * @returns {Promise<string>} Data URL del código QR
 */
export const generateQRCode = async (otpauth_url) => {
  try {
    return await qrcode.toDataURL(otpauth_url);
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Error al generar código QR');
  }
};

/**
 * Verifica un código TOTP (implementación simplificada)
 * @param {string} secret - Secret del usuario
 * @param {string} token - Código TOTP proporcionado
 * @returns {boolean} True si el código es válido
 */
export const verify2FAToken = (secret, token) => {
  try {
    // Para esta implementación simplificada, verificamos si el token tiene 6 dígitos
    // En un entorno de producción, se debería usar una biblioteca TOTP completa
    if (!token || token.length !== 6 || !/^\d{6}$/.test(token)) {
      return false;
    }

    // Generar un código basado en el tiempo actual y el secret
    const timeWindow = Math.floor(Date.now() / 30000); // 30 segundos
    const hash = simpleHash(secret + timeWindow);
    const generatedCode = (hash % 1000000).toString().padStart(6, '0');

    return generatedCode === token;
  } catch (error) {
    console.error('Error verifying 2FA token:', error);
    return false;
  }
};

/**
 * Función hash simple para generar códigos TOTP
 * @param {string} input - Input para hashear
 * @returns {number} Hash numérico
 */
function simpleHash(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash &= hash; // Convertir a 32 bits
  }
  return Math.abs(hash);
}

/**
 * Obtiene todos los usuarios seguros
 * @returns {Array} Array de usuarios
 */
export const getSecureUsers = () => {
  try {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error getting secure users:', error);
    return [];
  }
};

/**
 * Guarda usuarios seguros
 * @param {Array} users - Array de usuarios
 */
export const saveSecureUsers = (users) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving secure users:', error);
  }
};

/**
 * Crea un nuevo usuario con contraseña y 2FA opcional
 * @param {string} userName - Nombre del usuario
 * @param {string} password - Contraseña
 * @param {string} role - Rol del usuario
 * @param {boolean} enable2FA - Si habilitar 2FA
 * @returns {Promise<Object>} Usuario creado
 */
export const createSecureUser = async (userName, password, role = 'operario', enable2FA = false) => {
  try {
    const hashedPassword = await hashPassword(password);
    const user = {
      id: Date.now().toString(),
      userName,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
      isSuperUser: role === 'admin',
      twoFactorEnabled: enable2FA
    };

    if (enable2FA) {
      const { secret, otpauth_url } = generate2FASecret(userName);
      user.twoFactorSecret = secret;
      user.twoFactorUrl = otpauth_url;
    }

    const users = getSecureUsers();
    users.push(user);
    saveSecureUsers(users);

    return user;
  } catch (error) {
    console.error('Error creating secure user:', error);
    throw new Error('Error al crear usuario');
  }
};

/**
 * Autentica un usuario
 * @param {string} userName - Nombre del usuario
 * @param {string} password - Contraseña
 * @param {string} twoFactorToken - Token 2FA (opcional)
 * @returns {Promise<Object|null>} Usuario autenticado o null
 */
export const authenticateUser = async (userName, password, twoFactorToken = null) => {
  try {
    const users = getSecureUsers();
    const user = users.find(u => u.userName.toLowerCase() === userName.toLowerCase());

    if (!user) {
      return null;
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Verificar 2FA si está habilitado
    if (user.twoFactorEnabled) {
      if (!twoFactorToken) {
        return { requires2FA: true, user: { ...user, password: undefined } };
      }

      const is2FAValid = verify2FAToken(user.twoFactorSecret, twoFactorToken);
      if (!is2FAValid) {
        return null;
      }
    }

    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
};

/**
 * Actualiza la configuración 2FA de un usuario
 * @param {string} userId - ID del usuario
 * @param {boolean} enable2FA - Si habilitar o deshabilitar 2FA
 * @returns {boolean} True si se actualizó correctamente
 */
export const updateUser2FA = (userId, enable2FA) => {
  try {
    const users = getSecureUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return false;
    }

    if (enable2FA) {
      const { secret, otpauth_url } = generate2FASecret(users[userIndex].userName);
      users[userIndex].twoFactorEnabled = true;
      users[userIndex].twoFactorSecret = secret;
      users[userIndex].twoFactorUrl = otpauth_url;
    } else {
      users[userIndex].twoFactorEnabled = false;
      delete users[userIndex].twoFactorSecret;
      delete users[userIndex].twoFactorUrl;
    }

    saveSecureUsers(users);
    return true;
  } catch (error) {
    console.error('Error updating user 2FA:', error);
    return false;
  }
};

/**
 * Verifica si un usuario es superusuario
 * @param {string} userName - Nombre del usuario
 * @returns {boolean} True si es superusuario
 */
export const isSuperUser = (userName) => {
  const users = getSecureUsers();
  const user = users.find(u => u.userName.toLowerCase() === userName.toLowerCase());
  return user ? user.isSuperUser : false;
};

/**
 * Obtiene información de 2FA para un usuario
 * @param {string} userName - Nombre del usuario
 * @returns {Object|null} Información de 2FA
 */
export const getUser2FAInfo = (userName) => {
  const users = getSecureUsers();
  const user = users.find(u => u.userName.toLowerCase() === userName.toLowerCase());

  if (!user || !user.twoFactorEnabled) {
    return null;
  }

  return {
    enabled: user.twoFactorEnabled,
    otpauth_url: user.twoFactorUrl
  };
};