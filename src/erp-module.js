/**
 * Módulo ERP - Sistema de Registro de Tareas JLC
 *
 * Este módulo proporciona funciones para integrar el sistema de tareas
 * en aplicaciones ERP existentes con soporte para módulos descargables.
 */

// Sistema de módulos descargables
class ModuleManager {
  constructor() {
    this.modules = new Map();
    this.activeModules = new Set();
    this.moduleRegistry = new Map();
  }

  // Registrar un módulo disponible
  registerModule(moduleId, moduleInfo) {
    this.moduleRegistry.set(moduleId, {
      id: moduleId,
      name: moduleInfo.name,
      description: moduleInfo.description,
      version: moduleInfo.version,
      dependencies: moduleInfo.dependencies || [],
      isInstalled: false,
      isActive: false,
      ...moduleInfo
    });
  }

  // Instalar un módulo
  installModule(moduleId) {
    const moduleInfo = this.moduleRegistry.get(moduleId);
    if (!moduleInfo) {
      throw new Error(`Módulo ${moduleId} no encontrado en el registro`);
    }

    // Verificar dependencias
    for (const dep of moduleInfo.dependencies) {
      if (!this.isModuleInstalled(dep)) {
        throw new Error(`Dependencia no satisfecha: ${dep} requerida por ${moduleId}`);
      }
    }

    moduleInfo.isInstalled = true;
    this.saveModuleState();
    return moduleInfo;
  }

  // Desinstalar un módulo
  uninstallModule(moduleId) {
    const moduleInfo = this.moduleRegistry.get(moduleId);
    if (!moduleInfo) {
      throw new Error(`Módulo ${moduleId} no encontrado`);
    }

    // Verificar si otros módulos dependen de este
    for (const [id, mod] of this.moduleRegistry) {
      if (mod.dependencies.includes(moduleId) && mod.isInstalled) {
        throw new Error(`No se puede desinstalar ${moduleId}: es requerido por ${id}`);
      }
    }

    moduleInfo.isInstalled = false;
    moduleInfo.isActive = false;
    this.activeModules.delete(moduleId);
    this.saveModuleState();
  }

  // Activar un módulo
  activateModule(moduleId) {
    const moduleInfo = this.moduleRegistry.get(moduleId);
    if (!moduleInfo || !moduleInfo.isInstalled) {
      throw new Error(`Módulo ${moduleId} no está instalado`);
    }

    moduleInfo.isActive = true;
    this.activeModules.add(moduleId);
    this.saveModuleState();
  }

  // Desactivar un módulo
  deactivateModule(moduleId) {
    moduleInfo.isActive = false;
    this.activeModules.delete(moduleId);
    this.saveModuleState();
  }

  // Verificar si un módulo está instalado
  isModuleInstalled(moduleId) {
    const moduleInfo = this.moduleRegistry.get(moduleId);
    return moduleInfo && moduleInfo.isInstalled;
  }

  // Verificar si un módulo está activo
  isModuleActive(moduleId) {
    return this.activeModules.has(moduleId);
  }

  // Obtener lista de módulos disponibles
  getAvailableModules() {
    return Array.from(this.moduleRegistry.values());
  }

  // Obtener módulos instalados
  getInstalledModules() {
    return Array.from(this.moduleRegistry.values()).filter(m => m.isInstalled);
  }

  // Obtener módulos activos
  getActiveModules() {
    return Array.from(this.moduleRegistry.values()).filter(m => m.isActive);
  }

  // Cargar estado desde localStorage
  loadModuleState() {
    try {
      const savedState = localStorage.getItem('jlc-erp-modules');
      if (savedState) {
        const state = JSON.parse(savedState);
        for (const [moduleId, moduleState] of Object.entries(state)) {
          const moduleInfo = this.moduleRegistry.get(moduleId);
          if (moduleInfo) {
            moduleInfo.isInstalled = moduleState.isInstalled;
            moduleInfo.isActive = moduleState.isActive;
            if (moduleState.isActive) {
              this.activeModules.add(moduleId);
            }
          }
        }
      }
    } catch (error) {
      console.warn('Error cargando estado de módulos:', error);
    }
  }

  // Guardar estado en localStorage
  saveModuleState() {
    try {
      const state = {};
      for (const [moduleId, moduleInfo] of this.moduleRegistry) {
        state[moduleId] = {
          isInstalled: moduleInfo.isInstalled,
          isActive: moduleInfo.isActive
        };
      }
      localStorage.setItem('jlc-erp-modules', JSON.stringify(state));
    } catch (error) {
      console.warn('Error guardando estado de módulos:', error);
    }
  }

  // Cargar módulo dinámicamente
  async loadModule(moduleId) {
    if (!this.isModuleActive(moduleId)) {
      throw new Error(`Módulo ${moduleId} no está activo`);
    }

    try {
      // Importación dinámica del módulo
      const module = await import(`./modules/${moduleId}/index.js`);
      this.modules.set(moduleId, module);
      return module;
    } catch (error) {
      throw new Error(`Error cargando módulo ${moduleId}: ${error.message}`);
    }
  }

  // Obtener módulo cargado
  getModule(moduleId) {
    return this.modules.get(moduleId);
  }
}

// Instancia global del gestor de módulos
export const moduleManager = new ModuleManager();

// Definición de módulos disponibles
const AVAILABLE_MODULES = {
  'task-tracking': {
    name: 'Registro de Tareas',
    description: 'Sistema básico de registro y gestión de horas de trabajo',
    version: '1.0.0',
    dependencies: []
  },
  'user-management': {
    name: 'Gestión de Usuarios',
    description: 'Administración de usuarios y permisos',
    version: '1.0.0',
    dependencies: []
  },
  'reporting': {
    name: 'Reportes y Estadísticas',
    description: 'Generación de reportes y análisis de datos',
    version: '1.0.0',
    dependencies: ['task-tracking']
  },
  'file-management': {
    name: 'Gestión de Archivos',
    description: 'Importación y exportación de datos',
    version: '1.0.0',
    dependencies: []
  },
  'technical-module': {
    name: 'Módulo Técnico',
    description: 'Funcionalidades específicas para el departamento técnico',
    version: '1.0.0',
    dependencies: ['task-tracking']
  },
  'operator-module': {
    name: 'Módulo de Operarios',
    description: 'Funcionalidades específicas para operarios de campo',
    version: '1.0.0',
    dependencies: ['task-tracking']
  },
  'finance-module': {
    name: 'Módulo de Finanzas',
    description: 'Funcionalidades específicas para el departamento de finanzas',
    version: '1.0.0',
    dependencies: ['task-tracking']
  },
  'hr-module': {
    name: 'Gestión de RRHH',
    description: 'Sistema completo de gestión de recursos humanos',
    version: '1.0.0',
    dependencies: ['user-management', 'reporting']
  }
};

// Registrar módulos disponibles
for (const [moduleId, moduleInfo] of Object.entries(AVAILABLE_MODULES)) {
  moduleManager.registerModule(moduleId, moduleInfo);
}

// Cargar estado guardado al inicializar
moduleManager.loadModuleState();

// Exportar servicios principales (solo si el módulo base está activo)
export {
  getUserTasks,
  saveUserTasks,
  clearUserTasks,
  getUsers,
  addUser,
  calculateSummary,
  createTask,
  addTask,
  updateTask,
  deleteTask,
  updateTaskDate,
  addTaskToGroup,
  exportToJson,
  shareData,
} from './services/taskService';

// Exportar utilidades
export {
  normalizeShortDate,
  normalizeToDDMMYYYY,
  getCurrentDate,
} from './utils/DateFormat';

export { copyClipboard } from './utils/CopyClipboard';
export { SelectContentEditable } from './utils/DomUtils';
export { useKeyboardNavigation, useEnterNavigation } from './utils/KeyboardNavigation';
export { taskDataKey, getUsersKey, defaultUsers, sectors } from './utils/constants';

// Exportar componentes (opcional, para integración UI)
export { default as TaskTrackingApp } from './App';
export { default as DatePicker } from './components/DatePicker';
export { default as FileUploader } from './components/FileUploader';
export {
  GroupVisibilityManager,
  useGroupVisibility,
} from './components/GroupVisibilityManager';
export { default as VersionInfo } from './components/VersionInfo';

// Función de inicialización para ERP con soporte de módulos
export const initializeTaskModule = (config = {}) => {
  const {
    customStorage = localStorage,
    customDateFormat = null,
    enabledModules = ['task-tracking', 'user-management'], // Módulos habilitados por defecto
    // Otras configuraciones futuras
  } = config;

  // Instalar y activar módulos por defecto
  for (const moduleId of enabledModules) {
    try {
      if (!moduleManager.isModuleInstalled(moduleId)) {
        moduleManager.installModule(moduleId);
      }
      if (!moduleManager.isModuleActive(moduleId)) {
        moduleManager.activateModule(moduleId);
      }
    } catch (error) {
      console.warn(`Error inicializando módulo ${moduleId}:`, error.message);
    }
  }

  return {
    // Retornar funciones configuradas
    getUserTasks: (userName) => {
      // Implementación con customStorage si es necesario
      return getUserTasks(userName);
    },
    // API del gestor de módulos
    moduleManager: {
      installModule: (moduleId) => moduleManager.installModule(moduleId),
      uninstallModule: (moduleId) => moduleManager.uninstallModule(moduleId),
      activateModule: (moduleId) => moduleManager.activateModule(moduleId),
      deactivateModule: (moduleId) => moduleManager.deactivateModule(moduleId),
      getAvailableModules: () => moduleManager.getAvailableModules(),
      getInstalledModules: () => moduleManager.getInstalledModules(),
      getActiveModules: () => moduleManager.getActiveModules(),
      isModuleInstalled: (moduleId) => moduleManager.isModuleInstalled(moduleId),
      isModuleActive: (moduleId) => moduleManager.isModuleActive(moduleId),
      loadModule: (moduleId) => moduleManager.loadModule(moduleId),
    },
    // Otras funciones...
  };
};