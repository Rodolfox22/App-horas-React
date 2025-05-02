import { useState, useEffect, useRef } from "react";
import {
  Plus,
  FileUp,
  Share2,
  Trash2,
  RefreshCw,
  Calendar,
  Logout,
} from "lucide-react";
import "./App.css"; // Importar el archivo CSS

// Componente principal de la aplicación
export default function TaskTrackingApp() {
  // Estados
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [existingUsers, setExistingUsers] = useState([]);
  const [taskGroups, setTaskGroups] = useState([]);
  const [summary, setSummary] = useState([]);
  const fileInputRef = useRef(null);
  const [dragItemGroup, setDragItemGroup] = useState(null);
  const [dragItemTask, setDragItemTask] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newTaskDate, setNewTaskDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [newTaskTime, setNewTaskTime] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  // Cargar usuarios existentes al iniciar
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("jlcTaskUsers") || "[]");
    setExistingUsers(users);
  }, []);

  // Cargar datos del usuario cuando cambia
  useEffect(() => {
    if (isLoggedIn && userName) {
      const userData = localStorage.getItem(`jlcTaskData_${userName}`);
      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          setTaskGroups(parsedData);
          calculateSummary(parsedData);
        } catch (e) {
          console.error("Error parsing saved data:", e);
        }
      } else {
        setTaskGroups([]);
        setSummary([]);
      }
    }
  }, [isLoggedIn, userName]);

  // Guardar datos cuando cambian
  useEffect(() => {
    if (isLoggedIn && userName && taskGroups.length > 0) {
      localStorage.setItem(
        `jlcTaskData_${userName}`,
        JSON.stringify(taskGroups)
      );
      calculateSummary(taskGroups);
    }
  }, [taskGroups, isLoggedIn, userName]);

  // Función para formatear el nombre
  const formatUserName = (name) => {
    // Tomar solo el primer nombre (antes del primer espacio)
    const firstName = name.split(" ")[0];
    // Capitalizar primera letra y minúsculas el resto
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  };

  // Función para manejar el login
  const handleLogin = (e) => {
    e.preventDefault();
    const formattedName = formatUserName(userName.trim());

    if (formattedName) {
      setUserName(formattedName); // Actualizar con el nombre formateado

      // Actualizar lista de usuarios si es nuevo
      const users = JSON.parse(localStorage.getItem("jlcTaskUsers") || "[]");
      if (!users.includes(formattedName)) {
        const updatedUsers = [...users, formattedName];
        localStorage.setItem("jlcTaskUsers", JSON.stringify(updatedUsers));
      }

      setIsLoggedIn(true);
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
  };

    //TODO: necesito que las tareas pueda moverse de manera individual dentro del grupo y hacia otros grupos arrastrando
    // Función para reorganizar las tareas por fecha
    const reorganizeTasks = (tasks) => {
      // Agrupar por fecha
      const groupedByDate = {};

      tasks.forEach((group) => {
        group.tasks.forEach((task) => {
          const date = task.date || group.date;

          if (!groupedByDate[date]) {
            groupedByDate[date] = [];
          }

          groupedByDate[date].push({
            id: task.id,
            hours: task.hours,
            description: task.description,
            date: date,
          });
        });
      });

      // Crear nuevos grupos
      const newGroups = Object.keys(groupedByDate)
        .sort()
        .map((date) => {
          return {
            id: `group-${date}-${Date.now()}`,
            date: date,
            tasks: groupedByDate[date],
          };
        });

      return newGroups;
    };

    // Función para agregar una tarea a un grupo
    const addTaskToGroup = (groupId) => {
      const updatedGroups = taskGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            tasks: [
              ...group.tasks,
              {
                id: Date.now().toString(),
                hours: group.time,
                description: group.description,
                date: group.date,
              },
            ],
          };
        }
        return group;
      });

      setTaskGroups(updatedGroups);
    };

    //TODO: Revisar formato de visualizacion
    // Función para calcular el resumen de horas por fecha
    const calculateSummary = (data) => {
      const summaryData = [];
      data.forEach((group) => {
        const totalHours = group.tasks.reduce((sum, task) => {
          return sum + (parseFloat(task.hours) || 0);
        }, 0);

        summaryData.push({
          date: group.date,
          totalHours: totalHours.toFixed(1),
        });
      });

      setSummary(summaryData);
    };

    //TODO: revisar funcion porque no hace lo que necesito, reordena los items que hay en un grupo, yo necesito que ordene los grupos por fecha, debe tomar los grupos por fecha y reordenarlos de lugar para mejorar la organización de las tareas
    // Funcion para ordenar las tareas por fecha
    const reorderTaskByDate = (groupId, fromIndex, toIndex) => {
      const updatedGroups = taskGroups.map((group) => {
        if (group.id === groupId) {
          const newTasks = [...group.tasks];
          const [removed] = newTasks.splice(fromIndex, 1);
          newTasks.splice(toIndex, 0, removed);

          return {
            ...group,
            tasks: newTasks,
          };
        }
        return group;
      });

      setTaskGroups(updatedGroups);
    };

    // Función para agregar una nueva tarea con la fecha especificada
    const addNewTask = () => {
      const date = newTaskDate;
      const time = newTaskTime;
      const task = newTaskDescription;
      const existingGroup = taskGroups.find((group) => group.date === date);

      if (existingGroup) {
        // Agregar tarea a grupo existente
        const updatedGroups = taskGroups.map((group) => {
          if (group.date === date) {
            return {
              ...group,
              tasks: [
                ...group.tasks,
                {
                  id: Date.now().toString(),
                  hours: time,
                  description: task,
                  date: date,
                },
              ],
            };
          }
          return group;
        });
        setTaskGroups(updatedGroups);
      } else {
        // Crear nuevo grupo con la primera tarea
        const newGroup = {
          id: `group-${date}-${Date.now()}`,
          date: date,
          tasks: [
            {
              id: Date.now().toString(),
              hours: time,
              description: task,
              date: date,
            },
          ],
        };

        // Agregar nuevo grupo y ordenar
        const newGroups = [...taskGroups, newGroup].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setTaskGroups(newGroups);
      }

      setShowDatePicker(false);
    };

    // Función para actualizar la fecha de una tarea
    const updateTaskDate = (groupId, taskId, newDate) => {
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

      setTaskGroups(newGroups);
    };

    // Función para limpiar todos los datos
    const clearAllData = () => {
      if (
        window.confirm("¿Está seguro de que desea eliminar todos los datos?")
      ) {
        setTaskGroups([]);
        setSummary([]);
        localStorage.removeItem("jlcTaskData");
      }
    };

    //TODO: acomodar formato para copiar datos y agregar compartir con funciones de celular, si es pc, copiar, si es celular, compartir
    // Función para compartir datos (copiar al portapapeles)
    const shareData = () => {
      let text = "Fecha\tHs\tDescripción\n";

      taskGroups.forEach((group) => {
        group.tasks.forEach((task) => {
          text += `${group.date}\t${task.hours}\t${task.description}\n`;
        });
      });

      navigator.clipboard
        .writeText(text)
        .then(() => alert("Datos copiados al portapapeles"))
        .catch((err) => alert("Error al copiar datos: " + err));
    };

    // Función para cargar archivo JSON
    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const jsonData = JSON.parse(event.target.result);
            setTaskGroups(jsonData);
            calculateSummary(jsonData);
            alert("Archivo cargado con éxito");
          } catch (error) {
            alert("Error al procesar el archivo: " + error);
          }
        };
        reader.readAsText(file);
      }
    };

    // Función para exportar datos a JSON y descargar
    const exportToJson = () => {
      const dataStr = JSON.stringify(taskGroups, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = "jlc_tareas.json";

      let linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
    };

    // Actualizar tarea
    const updateTask = (groupId, taskId, field, value) => {
      const updatedGroups = taskGroups.map((group) => {
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

      setTaskGroups(updatedGroups);
    };

    // Mover tarea entre grupos
    const moveTask = (fromGroupId, taskId, toGroupId) => {
      let taskToMove = null;
      let sourceGroup = null;

      // Encontrar la tarea a mover y su grupo
      const updatedGroups = taskGroups.map((group) => {
        if (group.id === fromGroupId) {
          sourceGroup = group;
          const remainingTasks = group.tasks.filter(
            (task) => task.id !== taskId
          );
          const task = group.tasks.find((task) => task.id === taskId);

          if (task) {
            taskToMove = {
              ...task,
              date: taskGroups.find((g) => g.id === toGroupId).date,
            };
          }

          return {
            ...group,
            tasks: remainingTasks,
          };
        }
        return group;
      });

      // Añadir la tarea al grupo destino
      const finalGroups = updatedGroups.map((group) => {
        if (group.id === toGroupId && taskToMove) {
          return {
            ...group,
            tasks: [...group.tasks, taskToMove],
          };
        }
        return group;
      });

      // Eliminar grupos vacíos
      const nonEmptyGroups = finalGroups.filter(
        (group) => group.tasks.length > 0
      );

      setTaskGroups(nonEmptyGroups);
    };

    // Reordenar tarea dentro del mismo grupo
    const reorderTask = (groupId, fromIndex, toIndex) => {
      const updatedGroups = taskGroups.map((group) => {
        if (group.id === groupId) {
          const newTasks = [...group.tasks];
          const [removed] = newTasks.splice(fromIndex, 1);
          newTasks.splice(toIndex, 0, removed);

          return {
            ...group,
            tasks: newTasks,
          };
        }
        return group;
      });

      setTaskGroups(updatedGroups);
    };

    // Funciones para el drag and drop de grupos
    const handleGroupDragStart = (e, index) => {
      setDragItemGroup(index);
      e.dataTransfer.setData("type", "group");
      e.dataTransfer.setData("index", index);
      e.currentTarget.style.opacity = "0.4";
    };

    const handleGroupDragOver = (e, index) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      return false;
    };

    const handleGroupDragEnter = (e, index) => {
      e.preventDefault();
      e.currentTarget.classList.add("bg-blue-50");
    };

    const handleGroupDragLeave = (e) => {
      e.currentTarget.classList.remove("bg-blue-50");
    };

    const handleGroupDrop = (e, toIndex) => {
      e.preventDefault();
      e.currentTarget.classList.remove("bg-blue-50");

      const type = e.dataTransfer.getData("type");

      if (type === "group") {
        const fromIndex = parseInt(e.dataTransfer.getData("index"));
        if (fromIndex === toIndex) return;

        const newGroups = [...taskGroups];
        const [movedItem] = newGroups.splice(fromIndex, 1);
        newGroups.splice(toIndex, 0, movedItem);

        setTaskGroups(newGroups);
      }

      setDragItemGroup(null);
    };

    const handleGroupDragEnd = (e) => {
      e.currentTarget.style.opacity = "1";
      setDragItemGroup(null);
    };

    // Funciones para el drag and drop de tareas individuales
    const handleTaskDragStart = (e, groupIndex, taskIndex) => {
      setDragItemTask({ groupIndex, taskIndex });
      e.dataTransfer.setData("type", "task");
      e.dataTransfer.setData("groupIndex", groupIndex);
      e.dataTransfer.setData("taskIndex", taskIndex);
      e.currentTarget.style.opacity = "0.4";
    };

    const handleTaskDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      return false;
    };

    const handleTaskDragEnter = (e) => {
      e.preventDefault();
      e.currentTarget.classList.add("bg-blue-50");
    };

    const handleTaskDragLeave = (e) => {
      e.currentTarget.classList.remove("bg-blue-50");
    };

    const handleTaskDrop = (e, toGroupIndex, toTaskIndex) => {
      e.preventDefault();
      e.currentTarget.classList.remove("bg-blue-50");

      const type = e.dataTransfer.getData("type");

      if (type === "task") {
        const fromGroupIndex = parseInt(e.dataTransfer.getData("groupIndex"));
        const fromTaskIndex = parseInt(e.dataTransfer.getData("taskIndex"));

        const fromGroupId = taskGroups[fromGroupIndex].id;
        const toGroupId = taskGroups[toGroupIndex].id;
        const taskId = taskGroups[fromGroupIndex].tasks[fromTaskIndex].id;

        if (fromGroupId === toGroupId) {
          // Reordenar dentro del mismo grupo
          reorderTask(fromGroupId, fromTaskIndex, toTaskIndex);
        } else {
          // Mover a otro grupo
          moveTask(fromGroupId, taskId, toGroupId);
        }
      }

      setDragItemTask(null);
    };

    const handleTaskDragEnd = (e) => {
      e.currentTarget.style.opacity = "1";
      setDragItemTask(null);
    };

    // Eliminar tarea
    const deleteTask = (groupId, taskId) => {
      const updatedGroups = taskGroups
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

      setTaskGroups(updatedGroups);
    };

    // Vista de login
    if (!isLoggedIn) {
      return (
        <div className="login-container">
          <div className="login-box">
            <div className="login-header">
              <h1 className="login-title">
                <span className="app-title-red">JLC</span>{" "}
                <span className="app-title-blue">Montajes Industriales</span>
              </h1>
              <p className="login-subtitle">Sistema de Registro de Tareas</p>
            </div>

            <div className="login-form">
              <label htmlFor="userName" className="login-label">
                Ingrese su nombre
              </label>
              <input
                type="text"
                id="userName"
                className="login-input"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Ingrese su nombre"
              />
            </div>

            <button
              onClick={handleLogin}
              className="login-button"
              disabled={!userName.trim()}
            >
              Ingresar
            </button>
          </div>
        </div>
      );
    }

    // Vista principal de la aplicación
    return (
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">
              <span className="app-title-red">JLC</span>{" "}
              <span className="app-title-blue">Montajes Industriales</span>
            </h1>
            <div className="user-greeting">Bienvenido, {userName}</div>
          </div>
        </header>

        <main className="main-content">
          <div className="task-container">
            <div className="task-header">
              <h2 className="task-title">Registro de Tareas</h2>
              <div className="action-buttons">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="button button-gray"
                >
                  <FileUp size={18} className="mr-1" /> Abrir Archivo
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".json"
                  className="hidden"
                />
                <button onClick={exportToJson} className="button button-gray">
                  <FileUp size={18} className="mr-1" /> Guardar Archivo
                </button>
              </div>
            </div>

            {/* Tabla de tareas con grupos por fecha */}
            <div className="overflow-x-auto mb-6">
              <table className="task-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Hs</th>
                    <th>Descripción</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {taskGroups.map((group, groupIndex) => (
                    <tr
                      key={group.id}
                      draggable
                      onDragStart={(e) => handleGroupDragStart(e, groupIndex)}
                      onDragOver={(e) => handleGroupDragOver(e, groupIndex)}
                      onDragEnter={(e) => handleGroupDragEnter(e, groupIndex)}
                      onDragLeave={handleGroupDragLeave}
                      onDrop={(e) => handleGroupDrop(e, groupIndex)}
                      onDragEnd={handleGroupDragEnd}
                      className="group-row"
                    >
                      <td colSpan={4} className="p-0">
                        <div className="group-header">
                          <div className="flex items-center">
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              className="group-date"
                              onBlur={(e) => {
                                const newDate = e.target.textContent;
                                if (
                                  /^\d{4}-\d{2}-\d{2}$/.test(newDate) ||
                                  /^\d{2}\/\d{2}\/\d{4}$/.test(newDate)
                                ) {
                                  const updatedGroups = taskGroups.map(
                                    (g, i) => {
                                      if (i === groupIndex) {
                                        return { ...g, date: newDate };
                                      }
                                      return g;
                                    }
                                  );
                                  setTaskGroups(reorganizeTasks(updatedGroups));
                                } else {
                                  e.target.textContent = group.date;
                                  alert(
                                    "Formato de fecha inválido. Use YYYY-MM-DD o DD/MM/YYYY"
                                  );
                                }
                              }}
                            >
                              {group.date}
                            </div>
                            <span className="group-hint">|</span>
                            <span className="text-sm text-gray-500">
                              Arrastre para mover el grupo
                            </span>
                          </div>
                          <button
                            onClick={() => addTaskToGroup(group.id)}
                            className="add-task-button"
                            title="Agregar una nueva línea"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                        <table className="task-table">
                          <tbody>
                            {group.tasks.map((task, taskIndex) => (
                              <tr
                                key={task.id}
                                draggable
                                onDragStart={(e) =>
                                  handleTaskDragStart(e, groupIndex, taskIndex)
                                }
                                onDragOver={handleTaskDragOver}
                                onDragEnter={handleTaskDragEnter}
                                onDragLeave={handleTaskDragLeave}
                                onDrop={(e) =>
                                  handleTaskDrop(e, groupIndex, taskIndex)
                                }
                                onDragEnd={handleTaskDragEnd}
                                className="task-row"
                              >
                                <td className="task-date-cell">
                                  <div className="flex items-center gap-1">
                                    <span>↕</span>
                                    <select
                                      value={task.date || group.date}
                                      onChange={(e) =>
                                        updateTaskDate(
                                          group.id,
                                          task.id,
                                          e.target.value
                                        )
                                      }
                                      className="task-select"
                                    >
                                      {taskGroups.map((g) => (
                                        <option key={g.id} value={g.date}>
                                          {g.date}
                                        </option>
                                      ))}
                                      <option value="">Otra fecha...</option>
                                    </select>
                                  </div>
                                </td>
                                <td className="task-hours-cell">
                                  <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    className="editable-cell"
                                    onBlur={(e) =>
                                      updateTask(
                                        group.id,
                                        task.id,
                                        "hours",
                                        e.target.textContent
                                      )
                                    }
                                    dangerouslySetInnerHTML={{
                                      __html: task.hours,
                                    }}
                                  />
                                </td>
                                <td className="task-description-cell">
                                  <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    className="editable-cell"
                                    onBlur={(e) =>
                                      updateTask(
                                        group.id,
                                        task.id,
                                        "description",
                                        e.target.textContent
                                      )
                                    }
                                    dangerouslySetInnerHTML={{
                                      __html: task.description,
                                    }}
                                  />
                                </td>
                                <td className="task-actions-cell">
                                  <button
                                    onClick={() =>
                                      deleteTask(group.id, task.id)
                                    }
                                    className="delete-button"
                                  >
                                    ✕
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Resumen de horas */}
            <div className="mb-6">
              <h3 className="summary-title">Resumen</h3>
              <div className="summary-items">
                {summary.map((item, index) => (
                  <div key={index} className="summary-item">
                    {item.date}: {item.totalHours} hs.
                  </div>
                ))}
              </div>
            </div>

            {/* Selector de fecha para nueva tarea */}
            {showDatePicker && (
              <div className="date-picker">
                <h3 className="date-picker-title">
                  Seleccionar fecha para nueva tarea
                </h3>
                <div className="date-picker-controls">
                  <input
                    type="date"
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    className="date-input"
                  />
                  <input
                    type="number"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    className="date-input"
                  />
                  <input
                    type="text"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    className="date-input"
                  />
                  <button onClick={addNewTask} className="button button-blue">
                    Agregar
                  </button>
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="button button-gray"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowDatePicker(true)}
                className="button button-blue"
              >
                <Plus size={18} className="mr-1" /> Nuevo
              </button>
              <button onClick={clearAllData} className="button button-red">
                <Trash2 size={18} className="mr-1" /> Limpiar
              </button>
              <button onClick={shareData} className="button button-blue">
                <Share2 size={18} className="mr-1" /> Compartir
              </button>
              <button
                onClick={() =>
                  reorderTaskByDate(
                    taskGroups[0].id,
                    0,
                    taskGroups[0].tasks.length - 1
                  )
                }
                className="button button-blue"
              >
                <RefreshCw size={18} className="mr-1" /> Ordenar
              </button>
            </div>
          </div>
        </main>

        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} JLC Montajes Industriales</p>
        </footer>
      </div>
    );
  };
