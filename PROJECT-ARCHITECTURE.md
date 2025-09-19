# 🏗️ Arquitectura del Sistema ERP JLC Montajes

## 📋 Visión General

Sistema ERP departamental para gestión integral de operaciones en JLC Montajes Industriales, con especialización por roles y módulos específicos para cada departamento.

## 🏛️ Arquitectura General

### Patrón de Diseño
- **Component-Based Architecture** con React
- **Service Layer Pattern** para lógica de negocio
- **Role-Based Access Control (RBAC)** para especialización funcional
- **Modular Design** con separación clara de responsabilidades

### Flujo de Aplicación
```
Login → Módulo de Bienvenida Específico → Aplicación Principal
     ↓              ↓                          ↓
 Autenticación → Especialización por Rol → Funcionalidades Específicas
```

## 📁 Estructura de Archivos

```
app-horas-jlc/
├── src/
│   ├── components/           # Componentes de UI
│   │   ├── WelcomeModule.js          # Módulo genérico de bienvenida
│   │   ├── FinanceWelcome.js         # Bienvenida departamento Finanzas
│   │   ├── TechnicalWelcome.js       # Bienvenida departamento Técnico
│   │   ├── OperatorWelcome.js        # Bienvenida equipo de campo
│   │   ├── DevelopmentWelcome.js     # Bienvenida desarrollo de sistemas
│   │   ├── DatePicker.js             # Selector de fecha con campos dinámicos
│   │   ├── FileUploader.js           # Carga de archivos JSON
│   │   ├── GroupVisibilityManager.js # Gestión de visibilidad de grupos
│   │   ├── InputManager.js           # Componente de input reutilizable
│   │   └── VersionInfo.js            # Información de versión
│   ├── services/             # Servicios de negocio
│   │   └── taskService.js            # Servicio completo de gestión de tareas
│   ├── utils/                # Utilidades y constantes
│   │   ├── constants.js              # Constantes, roles y configuraciones
│   │   ├── DateFormat.js             # Utilidades de formato de fecha
│   │   ├── CopyClipboard.js          # Funciones de portapapeles
│   │   ├── DomUtils.js               # Utilidades DOM
│   │   └── KeyboardNavigation.js     # Sistema de navegación por teclado
│   ├── erp-module.js         # Módulo de integración ERP
│   ├── App.js                # Componente principal
│   ├── App.css               # Estilos principales
│   ├── App.test.js           # Tests principales
│   └── index.js              # Punto de entrada
├── public/                   # Archivos estáticos
├── package.json              # Dependencias y scripts
├── README-ERP.md            # Documentación de integración ERP
└── PROJECT-ARCHITECTURE.md  # Este documento
```

## 👥 Sistema de Roles y Usuarios

### Roles Definidos

```javascript
export const USER_ROLES = {
   FINANZAS: 'finanzas',      // Control financiero y fiscal
   TECNICO: 'tecnico',        // Gestión de mantenimiento
   OPERARIO: 'operario',      // Equipo de campo
   DESARROLLO: 'desarrollo',  // Sistemas y TI
   ADMIN: 'admin'            // Acceso completo
};
```

### Usuarios por Defecto

```javascript
export const defaultUsersWithRoles = [
   { name: "Admin", role: USER_ROLES.ADMIN },
   { name: "Finanzas", role: USER_ROLES.FINANZAS },
   { name: "Tecnico", role: USER_ROLES.TECNICO },
   { name: "Operario", role: USER_ROLES.OPERARIO },
   { name: "Desarrollo", role: USER_ROLES.DESARROLLO },
   // Usuarios adicionales con roles específicos
];
```

### Función de Determinación de Rol

```javascript
export const getUserRole = (userName) => {
   const user = defaultUsersWithRoles.find(u => u.name.toLowerCase() === userName.toLowerCase());
   return user ? user.role : USER_ROLES.OPERARIO; // Default: operario
};
```

## 🧩 Componentes Principales

### App.js - Componente Raíz
**Responsabilidades:**
- Gestión de estado global (autenticación, navegación, tema)
- Renderizado condicional según vista actual
- Coordinación entre módulos de bienvenida y aplicación principal
- Manejo de eventos globales (teclado, tema)

**Estados Gestionados:**
```javascript
const [currentView, setCurrentView] = useState('login');     // 'login', 'welcome', 'tasks'
const [currentTheme, setCurrentTheme] = useState('light');   // 'light', 'dark', 'auto'
const [userRole, setUserRole] = useState('');               // Rol del usuario actual
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [userName, setUserName] = useState("");
```

### Módulos de Bienvenida por Departamento

#### FinanceWelcome.js
**Herramientas Específicas:**
- Contabilidad General (libros contables, balances)
- Cuentas por Cobrar (facturación, seguimiento pagos)
- Cuentas por Pagar (pagos proveedores)
- Tesorería (flujo caja, conciliación)
- Impuestos (IVA, IIBB, declaraciones)
- Reportes Financieros (rentabilidad por cliente/servicio)

#### TechnicalWelcome.js
**Herramientas Específicas:**
- Órdenes de Trabajo (creación, asignación, seguimiento)
- Planificación y Agenda (asignación técnicos, rutas)
- Mantenimiento Preventivo (checklists, alertas)
- Historial de Equipos (registro intervenciones)
- App Móvil para Técnicos (OTs, tiempos, fotos)
- Gestión de Repuestos (inventario piezas)

#### OperatorWelcome.js
**Herramientas Específicas:**
- App Móvil (recepción OTs, registro actividades)
- Checklists Digitales (verificación mantenimiento)
- Carga de Horas (registro tiempo trabajado)
- GPS y Seguimiento (optimización rutas)
- Registro Fotográfico (evidencias trabajo)
- Comunicación Directa (chat con departamento técnico)

#### DevelopmentWelcome.js
**Herramientas Específicas:**
- Integración con APIs (sensores IoT, sistemas tickets)
- Personalización del ERP (adaptación procesos)
- Soporte Técnico (resolución incidencias)
- Seguridad y Backups (protección datos)
- Capacitación (entrenamiento usuarios)
- Desarrollo de Informes (dashboards personalizados)

## 🔧 Servicios y Utilidades

### taskService.js - Servicio Central
**Funciones Principales:**
```javascript
// Gestión de datos
getUserTasks(userName)           // Obtener tareas de usuario
saveUserTasks(userName, tasks)   // Guardar tareas
clearUserTasks(userName)         // Limpiar datos usuario

// Gestión de usuarios
getUsers()                       // Lista de usuarios
addUser(userName)               // Agregar usuario

// Operaciones con tareas
calculateSummary(tasks)         // Calcular resumen horas
createTask(date, time, desc)    // Crear nueva tarea
addTask(tasks, date, time, desc)// Agregar tarea a grupo
updateTask(tasks, groupId, taskId, field, value) // Actualizar tarea
deleteTask(tasks, groupId, taskId) // Eliminar tarea

// Utilidades
exportToJson(tasks)             // Exportar a JSON
shareData(tasks, user, summary) // Compartir datos formateados
```

### KeyboardNavigation.js - Sistema de Navegación
**Características:**
- Navegación por Enter entre campos
- Atajos de teclado (Alt + letra)
- Soporte para combinaciones Ctrl/Alt
- Configurable por componente

### DateFormat.js - Utilidades de Fecha
**Funciones:**
```javascript
normalizeShortDate(date)         // Formato corto DD/MM
normalizeToDDMMYYYY(date)        // Formato completo DD/MM/YYYY
getCurrentDate()                 // Fecha actual formateada
```

## 🎨 Sistema de Estilos

### Variables CSS Globales
```css
:root {
  --column-date-width: min(15vw, 70px);
  --column-hours-width: min(10vw, 60px);
  --column-finished-width: min(10vw, 60px);
  --column-actions-width: min(10vw, 60px);

  --border-color: #e5e7eb;
  --hover-bg-color: #f9fafb;
  --focus-bg-color: #dbeafe;
  --header-bg-color: #f3f4f6;
  --header-border-color: #3b82f6;
}
```

### Temas Disponibles
- **Claro**: Tema predeterminado con fondo claro
- **Oscuro**: Tema para reducción de fatiga visual
- **Automático**: Se adapta a las preferencias del sistema

### Diseño Responsive
- Breakpoints para móviles, tablets y desktop
- Componentes adaptativos
- Navegación táctil optimizada

## 🔄 Flujo de Datos

### Estados y Props
```
App.js (Estado Global)
├── currentView: 'login' | 'welcome' | 'tasks'
├── currentTheme: 'light' | 'dark' | 'auto'
├── userRole: USER_ROLES
├── isLoggedIn: boolean
├── userName: string
└── taskGroups: Array<TaskGroup>

TaskGroup Structure:
├── id: string
├── date: string (YYYY-MM-DD)
└── tasks: Array<Task>

Task Structure:
├── id: string
├── hours: string
├── description: string
├── date: string
├── finished: boolean
└── [other fields]
```

### Persistencia de Datos
- **localStorage** para datos de usuario
- **JSON** para exportación/importación
- **Sesión temporal** para estado de aplicación

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18.3.1**: Framework principal
- **React DOM**: Renderizado
- **Lucide React**: Iconografía
- **CSS3**: Estilos con variables CSS
- **JavaScript ES6+**: Lógica de aplicación

### Herramientas de Desarrollo
- **Create React App**: Boilerplate
- **ESLint**: Linting de código
- **Babel**: Transpilación
- **Webpack**: Bundling (vía CRA)
- **Jest**: Testing framework
- **React Testing Library**: Tests de componentes

### Utilidades
- **Cross-env**: Variables de entorno
- **Conventional Changelog**: Control de versiones
- **GH Pages**: Despliegue

## 🔌 API e Interfaces

### erp-module.js - Módulo de Integración
**Exports principales:**
```javascript
// Servicios
export { getUserTasks, saveUserTasks, addTask, calculateSummary } from './services/taskService';

// Utilidades
export { normalizeShortDate, getCurrentDate } from './utils/DateFormat';
export { copyClipboard } from './utils/CopyClipboard';

// Constantes
export { USER_ROLES, getUserRole } from './utils/constants';

// Componentes (opcional)
export { default as TaskTrackingApp } from './App';
```

### Función de Inicialización
```javascript
export const initializeTaskModule = (config = {}) => {
  const { customStorage, customDateFormat } = config;
  // Configuración personalizable para integración ERP
  return { /* API configurada */ };
};
```

## 🧪 Testing

### Cobertura de Tests
- **App.test.js**: Test básico de renderizado
- **Componentes**: Tests de funcionalidad crítica
- **Servicios**: Tests de lógica de negocio
- **Utilidades**: Tests de funciones helper

### Comando de Ejecución
```bash
npm run test          # Tests con watch
npm run test -- --watchAll=false  # Tests únicos
```

## 📊 Flujo de Trabajo Integrado

### Secuencia Operacional
```
1. FINANZAS emite facturas y controla pagos
2. TÉCNICO planifica y asigna órdenes de trabajo
3. OPERARIOS ejecutan tareas y registran información
4. DESARROLLO asegura funcionamiento e integración
```

### Interdependencias
- **Finanzas → Técnico**: Información de presupuesto y facturación
- **Técnico → Operarios**: Órdenes de trabajo y especificaciones
- **Operarios → Técnico**: Reportes de ejecución y problemas
- **Desarrollo → Todos**: Soporte técnico y actualizaciones

## 🔒 Consideraciones de Seguridad

### Autenticación
- Sistema de login básico con roles
- Persistencia de sesión por usuario
- Validación de acceso por rol

### Datos Sensibles
- Información financiera protegida
- Datos de ubicación (GPS) con consentimiento
- Información de usuarios segregada por rol

### Integración Segura
- Validación de inputs en servicios
- Sanitización de datos
- Manejo seguro de errores

## 📈 Escalabilidad y Mantenimiento

### Arquitectura Modular
- **Separación clara** entre UI, lógica y datos
- **Componentes reutilizables** con props configurables
- **Servicios independientes** para fácil testing

### Extensibilidad
- **Nuevos roles** fácilmente agregables
- **Módulos adicionales** plug-and-play
- **APIs externas** integrables vía servicios

### Rendimiento
- **Lazy loading** potencial para módulos grandes
- **Memoización** de componentes pesados
- **Optimización de re-renders** con hooks apropiados

## 🚀 Despliegue y Distribución

### Build de Producción
```bash
npm run build        # Genera build optimizado
npm run predeploy    # Build + actualización de versión
npm run deploy       # Despliegue a GitHub Pages
```

### Variables de Entorno
- **REACT_APP_VERSION**: Versión de la aplicación
- **Configurable** para diferentes entornos

### CDN y Assets
- **Optimización automática** de imágenes y assets
- **Code splitting** para carga eficiente
- **Service worker** para PWA (potencial)

## 🔧 Configuración y Personalización

### Temas y Apariencia
- Selector de temas integrado
- Variables CSS para fácil personalización
- Soporte para temas corporativos

### Configuración por Empresa
- Sectores personalizables
- Usuarios y roles adaptables
- Campos dinámicos en formularios

### Integración ERP
- Módulo dedicado para integración
- APIs configurables
- Documentación completa de interfaces

## 📝 Documentación

### README-ERP.md
- Guía de integración para sistemas ERP
- Ejemplos de uso de APIs
- Consideraciones de seguridad

### PROJECT-ARCHITECTURE.md (Este documento)
- Arquitectura completa del sistema
- Detalles técnicos de implementación
- Guías para desarrolladores

### Código Auto-documentado
- Comentarios JSDoc en funciones críticas
- Nombres descriptivos de variables y funciones
- Estructura clara de archivos

## 🎯 Próximas Mejoras Planificadas

### Funcionalidades
- [ ] Dashboard ejecutivo con métricas en tiempo real
- [ ] Notificaciones push para tareas urgentes
- [ ] Integración con calendario externo
- [ ] Reportes avanzados con gráficos
- [ ] API REST completa para integraciones

### Técnico
- [ ] Migración a TypeScript
- [ ] Implementación de Redux/Zustand para estado global
- [ ] Tests unitarios completos
- [ ] PWA con service worker
- [ ] Internacionalización (i18n)

### UX/UI
- [ ] Diseño responsive avanzado
- [ ] Modo oscuro completo
- [ ] Animaciones y transiciones mejoradas
- [ ] Accesibilidad WCAG 2.1
- [ ] Tema corporativo configurable

---

**Estado del Proyecto**: ✅ **Completado y Funcional**
**Última Actualización**: Septiembre 2024
**Versión**: 1.6.3
**Arquitecto**: Kilo Code (IA especializada)