export const taskDataKey = (username) => `jlcTaskData_${username}`;
export const getUsersKey = () => `jlcTaskUsers`;
export const defaultUsers = [
  "Anto",
  "Brian",
  "Esteban",
  "Jorge",
  "Maxi",
  "Pablo",
];
export const sectors = [
   "Acerma",
   "AlfaVet",
   "Almacenes",
   "Arrufo",
   "Banco Macro",
   "Baños",
   "Broalco",
   "Calidad",
   "Cámaras Polivalentes",
   "Camioneros",
   "CDR Rafaela",
   "Chacarita",
   "Comedor",
   "Cremería Local",
   "Dulcería",
   "Efluentes",
   "Expedición de quesos",
   "Famiq",
   "Fraccionado leche en polvo",
   "Fundido",
   "Granger",
   "Guardia",
   "JLC",
   "La Anónima",
   "Laboratorio",
   "Larga Vida",
   "Maduración",
   "Mantequería",
   "Menara",
   "Nanofiltración",
   "Oficinas",
   "PAER",
   "Planta 4 leche en polvo",
   "Planta 5 leche en polvo",
   "El Trébol",
   "Productos frescos",
   "Quesería de blandos",
   "Rafaela",
   "Rallado",
   "Recibo",
   "Red Gama",
   "Rezagos",
   "Sala de máquinas",
   "Santa Fe",
   "Saputo",
   "Servicio médico",
   "Taller JLC",
   "Taller de mantenimiento Ilolay",
   "Verónica",
   "Vio Banda",
];

// Roles de usuario
export const USER_ROLES = {
   FINANZAS: 'finanzas',
   TECNICO: 'tecnico',
   OPERARIO: 'operario',
   DESARROLLO: 'desarrollo',
   ADMIN: 'admin'
};

// Usuarios por defecto con roles
export const defaultUsersWithRoles = [
   /*
   { name: "Finanzas", role: USER_ROLES.FINANZAS },
   { name: "Tecnico", role: USER_ROLES.TECNICO },
   { name: "Operario", role: USER_ROLES.OPERARIO },
   { name: "Admin", role: USER_ROLES.ADMIN },
   { name: "Desarrollo", role: USER_ROLES.DESARROLLO },*/
   { name: "Anto", role: USER_ROLES.TECNICO },
   { name: "Pame", role: USER_ROLES.DESARROLLO },
   { name: "Jorge", role: USER_ROLES.TECNICO },
   { name: "Rosi", role: USER_ROLES.FINANZAS },
   { name: "Pablo", role: USER_ROLES.ADMIN },
];

// Función para determinar el rol del usuario
export const getUserRole = (userName) => {
   const user = defaultUsersWithRoles.find(u => u.name.toLowerCase() === userName.toLowerCase());
   return user ? user.role : USER_ROLES.OPERARIO; // Por defecto operario
};
