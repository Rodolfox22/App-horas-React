# Módulo ERP - Sistema de Registro de Tareas JLC

Este documento describe cómo integrar el sistema de registro de tareas como un módulo en sistemas ERP existentes.

## Instalación

1. Copie los archivos del proyecto `app-horas-jlc/src/` a su proyecto ERP.
2. Instale las dependencias necesarias:
   ```bash
   npm install react lucide-react
   ```

## Uso Básico

### Importar el módulo

```javascript
import {
  getUserTasks,
  saveUserTasks,
  addTask,
  calculateSummary,
  shareData
} from './erp-module';
```

### Ejemplo de uso

```javascript
// Obtener tareas de un usuario
const tasks = getUserTasks('Juan');

// Agregar una nueva tarea
const updatedTasks = addTask(tasks, '2024-01-15', '8.5', 'Trabajo en sector A', false);

// Guardar tareas
saveUserTasks('Juan', updatedTasks);

// Calcular resumen
const summary = calculateSummary(updatedTasks);

// Compartir datos
const sharedText = shareData(updatedTasks, 'Juan', summary, '\n\nResumen:\n');
```

## API del Módulo

### Funciones Principales

#### Gestión de Tareas
- `getUserTasks(userName)`: Obtiene las tareas de un usuario
- `saveUserTasks(userName, taskGroups)`: Guarda las tareas de un usuario
- `clearUserTasks(userName)`: Elimina todas las tareas de un usuario
- `addTask(taskGroups, date, time, description, finished)`: Agrega una nueva tarea
- `updateTask(taskGroups, groupId, taskId, field, value)`: Actualiza una tarea
- `deleteTask(taskGroups, groupId, taskId)`: Elimina una tarea
- `updateTaskDate(taskGroups, groupId, taskId, newDate)`: Cambia la fecha de una tarea

#### Utilidades
- `calculateSummary(taskGroups)`: Calcula el resumen de horas por fecha
- `shareData(taskGroups, userName, summary, tagResumen)`: Formatea datos para compartir
- `exportToJson(taskGroups)`: Exporta tareas a JSON
- `createTask(date, time, description, finished)`: Crea un objeto tarea

#### Gestión de Usuarios
- `getUsers()`: Obtiene la lista de usuarios
- `addUser(userName)`: Agrega un nuevo usuario

### Utilidades Adicionales
- `normalizeShortDate(date)`: Formatea fecha corta
- `normalizeToDDMMYYYY(date)`: Formatea fecha DD/MM/YYYY
- `getCurrentDate()`: Obtiene fecha actual
- `copyClipboard(text, callback)`: Copia texto al portapapeles

## Integración en Componentes React

### Usar el componente principal

```javascript
import { TaskTrackingApp } from './erp-module';

function MyERPApp() {
  return (
    <div>
      <TaskTrackingApp />
    </div>
  );
}
```

### Usar componentes individuales

```javascript
import { DatePicker, FileUploader } from './erp-module';

// En su componente
<DatePicker
  showDatePicker={showPicker}
  setShowDatePicker={setShowPicker}
  // ... otros props
/>
```

## Configuración

### Inicialización

```javascript
import { initializeTaskModule } from './erp-module';

const taskModule = initializeTaskModule({
  customStorage: myCustomStorage, // Opcional
  customDateFormat: myDateFormat, // Opcional
});
```

## Estructura de Datos

### Grupo de Tareas
```javascript
{
  id: "group-2024-01-15-123456789",
  date: "2024-01-15",
  tasks: [
    {
      id: "task-123456789",
      hours: "8.5",
      description: "Trabajo en sector A",
      date: "2024-01-15",
      finished: false
    }
  ]
}
```

### Resumen
```javascript
[
  {
    date: "2024-01-15",
    totalHours: "8.5"
  }
]
```

## Consideraciones de Seguridad

- El módulo utiliza `localStorage` por defecto para persistencia
- Para producción, considere implementar un backend seguro
- Las funciones no validan automáticamente los inputs - implemente validación según sus necesidades

## Soporte

Para soporte técnico, consulte la documentación original del proyecto en:
https://github.com/Rodolfox22/App-horas-React