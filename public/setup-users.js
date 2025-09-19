/**
 * Script para configurar usuarios directamente en el navegador
 * Ejecutar desde la consola del navegador después de iniciar la aplicación
 */

// Función para crear usuarios en el navegador
window.setupCompanyUsers = async function() {
  console.log('🚀 Configurando usuarios de la empresa...');

  const users = [
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

  try {
    // Importar las funciones necesarias
    const { createSecureUser } = await import('./src/services/authService.js');

    for (const userData of users) {
      console.log(`📝 Creando usuario: ${userData.userName} (${userData.role})`);

      const user = await createSecureUser(
        userData.userName,
        userData.password,
        userData.role,
        userData.enable2FA
      );

      console.log('✅ Usuario creado exitosamente');
    }

    console.log('\n🎉 ¡Todos los usuarios han sido creados exitosamente!');
    console.log('\n📋 USUARIOS CONFIGURADOS:');
    console.log('=======================');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.userName}`);
      console.log(`   Contraseña: ${user.password}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   2FA: ${user.enable2FA ? 'Habilitado' : 'Deshabilitado'}`);
      console.log('');
    });

    console.log('🔐 INSTRUCCIONES:');
    console.log('1. Ingresa el nombre de usuario en la pantalla inicial');
    console.log('2. Si el usuario NO es operario, será redirigido a "Acceso Seguro"');
    console.log('3. Ingresa la contraseña correspondiente');
    console.log('4. Si 2FA está habilitado, usa Google Authenticator');

  } catch (error) {
    console.error('❌ Error configurando usuarios:', error);
  }
};

// Función para verificar usuarios existentes
window.checkUsers = function() {
  try {
    const users = JSON.parse(localStorage.getItem('jlc_secure_users') || '[]');
    console.log('👥 Usuarios existentes:', users.length);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.userName} (${user.role}) - 2FA: ${user.twoFactorEnabled ? '✅' : '❌'}`);
    });
  } catch (error) {
    console.error('Error verificando usuarios:', error);
  }
};

// Función para limpiar todos los usuarios
window.clearAllUsers = function() {
  if (confirm('¿Estás seguro de que quieres eliminar todos los usuarios?')) {
    localStorage.removeItem('jlc_secure_users');
    localStorage.removeItem('jlc-users');
    console.log('🗑️ Todos los usuarios han sido eliminados');
  }
};

console.log('🔧 Funciones disponibles en la consola:');
console.log('- setupCompanyUsers(): Crea todos los usuarios de la empresa');
console.log('- checkUsers(): Muestra usuarios existentes');
console.log('- clearAllUsers(): Elimina todos los usuarios');
console.log('');
console.log('📝 Para configurar usuarios, ejecuta: setupCompanyUsers()');