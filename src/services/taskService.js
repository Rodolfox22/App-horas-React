/**
 * Servicio para manejar operaciones de tareas
 * Diseñado para ser integrable en sistemas ERP
 */

import { taskDataKey, getUsersKey } from '../utils/constants';

/**
 * Obtiene las tareas de un usuario
 * @param {string} userName - Nombre del usuario
 * @returns {Array} Array de grupos de tareas
 */
export const getUserTasks = (userName) => {
  const userData = localStorage.getItem(taskDataKey(userName));
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (e) {
      console.error("Error parsing saved data:", e);
      return [];
    }
  }
  return [];
};

/**
 * Guarda las tareas de un usuario
 * @param {string} userName - Nombre del usuario
 * @param {Array} taskGroups - Grupos de tareas
 */
export const saveUserTasks = (userName, taskGroups) => {
  localStorage.setItem(taskDataKey(userName), JSON.stringify(taskGroups));
};

/**
 * Elimina todas las tareas de un usuario
 * @param {string} userName - Nombre del usuario
 */
export const clearUserTasks = (userName) => {
  localStorage.removeItem(taskDataKey(userName));
};

/**
 * Obtiene la lista de usuarios
 * @returns {Array} Array de usuarios
 */
export const getUsers = () => {
  return JSON.parse(localStorage.getItem(getUsersKey()) || "[]");
};

/**
 * Agrega un nuevo usuario
 * @param {string} userName - Nombre del usuario
 */
export const addUser = (userName) => {
  const users = getUsers();
  if (!users.includes(userName)) {
    const updatedUsers = [...users, userName];
    localStorage.setItem(getUsersKey(), JSON.stringify(updatedUsers));
  }
};

/**
 * Calcula el resumen de horas por fecha
 * @param {Array} taskGroups - Grupos de tareas
 * @returns {Array} Resumen de horas
 */
export const calculateSummary = (taskGroups) => {
  const summaryData = [];
  taskGroups.forEach((group) => {
    const totalHours = group.tasks.reduce((sum, task) => {
      return sum + (parseFloat(task.hours) || 0);
    }, 0);

    summaryData.push({
      date: group.date,
      totalHours: totalHours.toFixed(1),
    });
  });

  return summaryData;
};

/**
 * Crea una nueva tarea
 * @param {string} date - Fecha
 * @param {string} time - Horas
 * @param {string} description - Descripción
 * @param {boolean} finished - Si está finalizada
 * @returns {Object} Nueva tarea
 */
export const createTask = (date, time, description, finished = false) => ({
  id: Date.now().toString(),
  hours: time,
  description: description,
  date: date,
  finished: finished,
});

/**
 * Agrega una tarea a un grupo existente o crea uno nuevo
 * @param {Array} taskGroups - Grupos actuales
 * @param {string} date - Fecha
 * @param {string} time - Horas
 * @param {string} description - Descripción
 * @param {boolean} finished - Si está finalizada
 * @returns {Array} Nuevos grupos
 */
export const addTask = (taskGroups, date, time, description, finished = false) => {
  const existingGroup = taskGroups.find((group) => group.date === date);

  if (existingGroup) {
    return taskGroups.map((group) =>
      group.date === date
        ? {
            ...group,
            tasks: [...group.tasks, createTask(date, time, description, finished)],
          }
        : group
    );
  } else {
    const newGroup = {
      id: `group-${date}-${Date.now()}`,
      date: date,
      tasks: [createTask(date, time, description, finished)],
    };
    return [...taskGroups, newGroup].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }
};

/**
 * Actualiza una tarea
 * @param {Array} taskGroups - Grupos actuales
 * @param {string} groupId - ID del grupo
 * @param {string} taskId - ID de la tarea
 * @param {string} field - Campo a actualizar
 * @param {*} value - Nuevo valor
 * @returns {Array} Nuevos grupos
 */
export const updateTask = (taskGroups, groupId, taskId, field, value) => {
  return taskGroups.map((group) => {
    if (group.id === groupId) {
      const updatedTasks = group.tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, [field]: value };
        }
        return task;
      });
      return { ...group, tasks: updatedTasks };
    }
    return group;
  });
};

/**
 * Elimina una tarea
 * @param {Array} taskGroups - Grupos actuales
 * @param {string} groupId - ID del grupo
 * @param {string} taskId - ID de la tarea
 * @returns {Array} Nuevos grupos
 */
export const deleteTask = (taskGroups, groupId, taskId) => {
  return taskGroups
    .map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          tasks: group.tasks.filter((task) => task.id !== taskId),
        };
      }
      return group;
    })
    .filter((group) => group.tasks.length > 0);
};

/**
 * Actualiza la fecha de una tarea
 * @param {Array} taskGroups - Grupos actuales
 * @param {string} groupId - ID del grupo
 * @param {string} taskId - ID de la tarea
 * @param {string} newDate - Nueva fecha
 * @returns {Array} Nuevos grupos
 */
export const updateTaskDate = (taskGroups, groupId, taskId, newDate) => {
  let allTasks = [];
  let taskToUpdate = null;

  // Extraer todas las tareas y encontrar la que se va a actualizar
  taskGroups.forEach((group) => {
    group.tasks.forEach((task) => {
      if (group.id === groupId && task.id === taskId) {
        taskToUpdate = { ...task, date: newDate };
      } else {
        allTasks.push({ ...task, date: task.date || group.date });
      }
    });
  });

  if (taskToUpdate) {
    allTasks.push(taskToUpdate);
  }

  // Reorganizar todas las tareas por fecha
  const newGroups = [];
  const groupedByDate = {};

  allTasks.forEach((task) => {
    if (!groupedByDate[task.date]) {
      groupedByDate[task.date] = [];
    }
    groupedByDate[task.date].push(task);
  });

  Object.keys(groupedByDate)
    .sort()
    .forEach((date) => {
      newGroups.push({
        id: `group-${date}-${Date.now()}`,
        date: date,
        tasks: groupedByDate[date],
      });
    });

  return newGroups;
};

/**
 * Agrega una tarea a un grupo específico
 * @param {Array} taskGroups - Grupos actuales
 * @param {string} groupId - ID del grupo
 * @param {string} time - Horas
 * @param {string} description - Descripción
 * @param {string} date - Fecha del grupo
 * @returns {Array} Nuevos grupos
 */
export const addTaskToGroup = (taskGroups, groupId, time, description, date) => {
  return taskGroups.map((group) => {
    if (group.id === groupId) {
      return {
        ...group,
        tasks: [
          ...group.tasks,
          createTask(date, time, description, false),
        ],
      };
    }
    return group;
  });
};

/**
 * Exporta datos a JSON
 * @param {Array} taskGroups - Grupos de tareas
 * @returns {string} JSON string
 */
export const exportToJson = (taskGroups) => {
  return JSON.stringify(taskGroups, null, 2);
};

/**
 * Comparte datos formateados
 * @param {Array} taskGroups - Grupos de tareas
 * @param {string} userName - Nombre del usuario
 * @param {Array} summary - Resumen
 * @param {string} tagResumen - Etiqueta para resumen
 * @returns {string} Texto formateado
 */
export const shareData = (taskGroups, userName, summary, tagResumen) => {
  let text = "";

  taskGroups.forEach((group) => {
    group.tasks.forEach((task) => {
      let finishedText = "";
      if (task.finished === true) {
        finishedText = ". Completo.";
      }
      // Normalizar horas, si contiene un punto, cambiarlo por coma
      if (task.hours) {
        task.hours = task.hours.replace(".", ",");
      }
      if (task.hours || task.description) {
        text += `${task.date}\t${task.hours}\t${task.description}${finishedText}\t${userName}\n`;
      }
    });
  });
  text += tagResumen;
  summary.forEach((item) => {
    if (item.totalHours > 0) {
      text += `${item.date}: ${item.totalHours} hs.\n`;
    }
  });

  return text;
};