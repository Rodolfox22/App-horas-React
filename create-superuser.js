/**
 * Script para crear usuarios con autenticación segura
 */

const { createSecureUser } = require('./src/services/authService');

const USERS_TO_CREATE = [
  {
    userName: 'Rosi',
    password: 'RosiFinance2024!',
    role: 'finanzas',
    enable2FA: true
  },
  {
    userName: 'Pablo',
    password: 'PabloTech2024!',
    role: 'tecnico',
    enable2FA: true
  },
  {
    userName: 'Anto',
    password: 'AntoTech2024!',
    role: 'tecnico',
    enable2FA: false
  },
  {
    userName: 'Jorge',
    password: 'JorgeTech2024!',
    role: 'tecnico',
    enable2FA: false
  },
  {
    userName: 'Pame',
    password: 'PameDev2024!',
    role: 'desarrollo',
    enable2FA: true
  }
];

async function createCompanyUsers() {
  console.log('🚀 Creando usuarios de la empresa con autenticación segura...\n');

  const results = [];

  for (const userData of USERS_TO_CREATE) {
    try {
      console.log(`📝 Creando usuario: ${userData.userName} (${userData.role})`);

      const user = await createSecureUser(
        userData.userName,
        userData.password,
        userData.role,
        userData.enable2FA
      );

      results.push({
        userName: user.userName,
        role: user.role,
        password: userData.password,
        twoFactorEnabled: user.twoFactorEnabled,
        twoFactorSecret: user.twoFactorSecret
      });

      console.log('✅ Usuario creado exitosamente\n');

    } catch (error) {
      console.error(`❌ Error creando usuario ${userData.userName}:`, error.message);
    }
  }

  console.log('\n🎉 Resumen de usuarios creados:\n');
  console.log('=' .repeat(80));

  results.forEach((user, index) => {
    console.log(`${index + 1}. ${user.userName}`);
    console.log(`   Rol: ${user.role}`);
    console.log(`   Contraseña: ${user.password}`);
    console.log(`   2FA Habilitado: ${user.twoFactorEnabled ? '✅ Sí' : '❌ No'}`);
    if (user.twoFactorEnabled) {
      console.log(`   Secret 2FA: ${user.twoFactorSecret}`);
      console.log(`   URL QR: otpauth://totp/JLC%20Sistema:${user.userName}?secret=${user.twoFactorSecret}&issuer=JLC%20Sistema`);
    }
    console.log('');
  });

  console.log('=' .repeat(80));
  console.log('\n📋 INSTRUCCIONES PARA USAR EL SISTEMA:');
  console.log('');
  console.log('1. Inicia la aplicación con: npm start');
  console.log('2. Ingresa el nombre de usuario en la pantalla inicial');
  console.log('3. Si el usuario NO es operario, será redirigido a "Acceso Seguro"');
  console.log('4. Ingresa la contraseña correspondiente');
  console.log('5. Si 2FA está habilitado, usa Google Authenticator o similar');
  console.log('6. Escanea el código QR o ingresa el secret manualmente');
  console.log('');
  console.log('🔒 USUARIOS QUE REQUIEREN AUTENTICACIÓN SEGURA:');
  console.log('   - Rosi (Finanzas)');
  console.log('   - Pablo (Técnico)');
  console.log('   - Anto (Técnico)');
  console.log('   - Jorge (Técnico)');
  console.log('   - Pame (Desarrollo)');
  console.log('');
  console.log('👷 USUARIOS CON LOGIN SIMPLE (operarios):');
  console.log('   - Cualquier otro nombre no listado arriba');
  console.log('');
  console.log('⚠️  IMPORTANTE: Cambia estas contraseñas en producción!');
}

// Función para crear un solo usuario
async function createSingleUser(userName, password, role, enable2FA = false) {
  try {
    const user = await createSecureUser(userName, password, role, enable2FA);
    console.log(`✅ Usuario ${userName} creado exitosamente`);
    return user;
  } catch (error) {
    console.error(`❌ Error creando usuario ${userName}:`, error.message);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createCompanyUsers();
}

module.exports = {
  createCompanyUsers,
  createSingleUser,
  USERS_TO_CREATE
};