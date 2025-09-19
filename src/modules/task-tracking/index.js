// Módulo de Registro de Tareas
// Este módulo proporciona las funcionalidades básicas de registro y gestión de tareas

export const MODULE_INFO = {
  id: 'task-tracking',
  name: 'Registro de Tareas',
  description: 'Sistema básico de registro y gestión de horas de trabajo',
  version: '1.0.0',
  dependencies: []
};

// Funciones principales del módulo
export const taskTrackingFunctions = {
  // Aquí se pueden agregar funciones específicas del módulo
  getModuleInfo: () => MODULE_INFO,

  // Funciones específicas del módulo de tareas
  validateTask: (task) => {
    // Validación básica de tareas
    if (!task.date || !task.description) {
      throw new Error('Fecha y descripción son requeridas');
    }
    return true;
  },

  formatTaskForDisplay: (task) => {
    // Formateo de tareas para display
    return {
      ...task,
      displayDate: new Date(task.date).toLocaleDateString('es-ES'),
      status: task.finished ? 'Completada' : 'Pendiente'
    };
  }
};

// Componente principal del módulo (si es necesario)
export const TaskTrackingModule = {
  // Componentes y funciones específicas del módulo
  name: 'TaskTrackingModule',
  functions: taskTrackingFunctions
};

export default TaskTrackingModule;