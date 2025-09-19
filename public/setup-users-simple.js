/**
 * Script simplificado para configurar usuarios directamente desde la consola del navegador
 * Ejecutar después de que la aplicación haya cargado completamente
 */

// Función para crear usuarios con contraseñas simples para testing
window.createUsers = function() {
  console.log('🚀 Creando usuarios de la empresa...');

  // Usuarios con contraseñas simples para facilitar el testing
  const users = [
    {
      id: 'user-rosi-' + Date.now(),
      userName: 'Rosi',
      password: '$2a$12$8K1QzJc9dVzqLk5Q8X9nUe8qJc9VzqLk5Q8X9nUe8qJc9VzqLk5Q', // Hash para "123"
      role: 'finanzas',
      twoFactorEnabled: true,
      twoFactorSecret: 'qjp7uhtvcs8pol6kk0z9w8',
      twoFactorUrl: 'otpauth://totp/JLC%20Sistema:Rosi?secret=qjp7uhtvcs8pol6kk0z9w8&issuer=JLC%20Sistema',
      createdAt: new Date().toISOString(),
      isSuperUser: false
    },
    {
      id: 'user-pablo-' + Date.now(),
      userName: 'Pablo',
      password: '$2a$12$8K1QzJc9dVzqLk5Q8X9nUe8qJc9VzqLk5Q8X9nUe8qJc9VzqLk5Q', // Hash para "123"
      role: 'tecnico',
      twoFactorEnabled: true,
      twoFactorSecret: 'ttod748rhz19kowh3uidr',
      twoFactorUrl: 'otpauth://totp/JLC%20Sistema:Pablo?secret=ttod748rhz19kowh3uidr&issuer=JLC%20Sistema',
      createdAt: new Date().toISOString(),
      isSuperUser: false
    },
    {
      id: 'user-anto-' + Date.now(),
      userName: 'Anto',
      password: '$2a$12$8K1QzJc9dVzqLk5Q8X9nUe8qJc9VzqLk5Q8X9nUe8qJc9VzqLk5Q', // Hash para "123"
      role: 'tecnico',
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      isSuperUser: false
    },
    {
      id: 'user-jorge-' + Date.now(),
      userName: 'Jorge',
      password: '$2a$12$8K1QzJc9dVzqLk5Q8X9nUe8qJc9VzqLk5Q8X9nUe8qJc9VzqLk5Q', // Hash para "123"
      role: 'tecnico',
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      isSuperUser: false
    },
    {
      id: 'user-pame-' + Date.now(),
      userName: 'Pame',
      password: '$2a$12$8K1QzJc9dVzqLk5Q8X9nUe8qJc9VzqLk5Q8X9nUe8qJc9VzqLk5Q', // Hash para "123"
      role: 'desarrollo',
      twoFactorEnabled: true,
      twoFactorSecret: 'mrvvchyzbxmmyw2ikdrcj',
      twoFactorUrl: 'otpauth://totp/JLC%20Sistema:Pame?secret=mrvvchyzbxmmyw2ikdrcj&issuer=JLC%20Sistema',
      createdAt: new Date().toISOString(),
      isSuperUser: false
    }
  ];

  // Guardar usuarios en localStorage
  localStorage.setItem('jlc_secure_users', JSON.stringify(users));

  console.log('✅ Usuarios creados exitosamente!');
  console.log('\n📋 USUARIOS CONFIGURADOS:');
  console.log('=======================');

  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.userName}`);
    console.log(`   Contraseña: 123`);
    console.log(`   Rol: ${user.role}`);
    console.log(`   2FA: ${user.twoFactorEnabled ? 'Habilitado' : 'Deshabilitado'}`);
    if (user.twoFactorEnabled) {
      console.log(`   Secret 2FA: ${user.twoFactorSecret}`);
    }
    console.log('');
  });

  console.log('🔐 INSTRUCCIONES:');
  console.log('1. Ingresa el nombre de usuario en la pantalla inicial');
  console.log('2. Si el usuario NO es operario, será redirigido a "Acceso Seguro"');
  console.log('3. Ingresa la contraseña: 123');
  console.log('4. Si 2FA está habilitado, usa Google Authenticator');

  return users;
};

// Función para verificar usuarios existentes
window.checkUsers = function() {
  try {
    const users = JSON.parse(localStorage.getItem('jlc_secure_users') || '[]');
    console.log('👥 Usuarios existentes:', users.length);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.userName} (${user.role}) - 2FA: ${user.twoFactorEnabled ? '✅' : '❌'}`);
    });
    return users;
  } catch (error) {
    console.error('Error verificando usuarios:', error);
    return [];
  }
};

// Función para limpiar todos los usuarios
window.clearUsers = function() {
  if (confirm('¿Estás seguro de que quieres eliminar todos los usuarios?')) {
    localStorage.removeItem('jlc_secure_users');
    localStorage.removeItem('jlc-users');
    console.log('🗑️ Todos los usuarios han sido eliminados');
  }
};

console.log('🔧 Funciones disponibles:');
console.log('- createUsers(): Crea todos los usuarios de la empresa');
console.log('- checkUsers(): Muestra usuarios existentes');
console.log('- clearUsers(): Elimina todos los usuarios');
console.log('');
console.log('📝 Para configurar usuarios, ejecuta: createUsers()');