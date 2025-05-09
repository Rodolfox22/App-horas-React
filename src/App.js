import { useState, useEffect, useRef } from "react";
import { Plus, FileUp, Share2, Trash2, X } from "lucide-react";
import "./App.css"; // Importar el archivo CSS
import DatePicker from "./components/DatePicker";
import {
  normalizeShortDate,
  normalizeToDDMMYYYY,
  getCurrentDate,
} from "./utils/DateFormat";
import { setTaskDataKey, getUsersKey, defaultUsers } from "./utils/constants"; // Importar las constantes

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
  const [newTaskFinished, setNewTaskFinished] = useState(false);
  const [showTaskHeader, setShowTaskHeader] = useState(false); // Controla la visibilidad de la ventana emergente

  const userInputRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn && userInputRef.current) {
      userInputRef.current.focus();
      userInputRef.current.select(); // Selecciona el contenido si ya hay texto
    }
  }, [isLoggedIn]);

  // Cargar usuarios existentes al iniciar
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem(getUsersKey()) || "[]");
    const mergedUsers = Array.from(new Set([...defaultUsers, ...storedUsers]));
    setExistingUsers(mergedUsers);
  }, []);

  // Cargar datos del usuario cuando cambia
  useEffect(() => {
    if (isLoggedIn && userName) {
      const userData = localStorage.getItem(setTaskDataKey(userName));
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
        setTaskDataKey(userName),
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

  // Declarar constantes
  const taskStorageKey = setTaskDataKey(userName);

  // Función para manejar el login
  const handleLogin = (e) => {
    e.preventDefault();
    const formattedName = formatUserName(userName.trim());

    if (formattedName) {
      setUserName(formattedName); // Actualizar con el nombre formateado

      // Actualizar lista de usuarios si es nuevo
      const users = JSON.parse(localStorage.getItem(getUsersKey()) || "[]");
      if (!users.includes(formattedName)) {
        const updatedUsers = [...users, formattedName];
        localStorage.setItem(getUsersKey(), JSON.stringify(updatedUsers));
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
  //Funcion para reordenar los grupos por fecha en orden ascendente o descendente
  const reorderGroupsByDate = (groupId, fromIndex, toIndex, order) => {
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

  // Función para crear una nueva tarea
  const createTask = (date, time, task, finished) => {
    return {
      id: Date.now().toString(),
      hours: time,
      description: task,
      date: date,
      finished: finished,
    };
  };

  // Función para agregar una nueva tarea con la fecha especificada
  const addNewTask = () => {
    const date = newTaskDate;
    const time = newTaskTime;
    const task = newTaskDescription;
    const finished = newTaskFinished;
    const existingGroup = taskGroups.find((group) => group.date === date);

    if (existingGroup) {
      // Agregar tarea a grupo existente
      const updatedGroups = taskGroups.map((group) => {
        if (group.date === date) {
          return {
            ...group,
            tasks: [...group.tasks, createTask(date, time, task, finished)],
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
        tasks: [createTask(date, time, task, finished)],
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
    if (window.confirm("¿Está seguro de que desea eliminar todos los datos?")) {
      setTaskGroups([]);
      setSummary([]);
      localStorage.removeItem(setTaskDataKey(userName));
    }
  };

  //TODO: acomodar formato para copiar datos y agregar compartir con funciones de celular, si es pc, copiar, si es celular, compartir

  const isMobile = () =>
    /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);

  // Compartir usando API de Web Share (dispositivos móviles compatibles)
  const shareMobileData = (text) => {
    const date = getCurrentDate();
    const fileName = `${userName} ${date}.txt`;
    const blob = new Blob([text], { type: "text/plain" });
    const file = new File([blob], fileName, { type: "text/plain" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator
        .share({
          title: "Tareas",
          text: "Archivo de tareas",
          files: [file],
        })
        .catch((err) => alert("Error al compartir: " + err));
    } else {
      alert("Tu navegador no soporta compartir archivos.");
    }
  };

  // Copiar al portapapeles (PC o móvil sin Web Share API)
  const copyClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        if (!isMobile()) {
          alert("Datos copiados al portapapeles");
        }
      })
      .catch((err) => alert("Error al copiar datos: " + err));
  };

  // Función para compartir datos
  const shareData = () => {
    let text = "";

    taskGroups.forEach((group) => {
      group.tasks.forEach((task) => {
        let finishedText = "";
        if (task.finished === "true") {
          finishedText = ". Completo.";
        }
        if (task.hours || task.description) {
          text += `${normalizeShortDate(group.date)}\t${task.hours}\t${
            task.description
          }${finishedText}\t${userName}\n`;
        }
      });
    });
    text += `\nResumen de horas:\n`;
    summary.forEach((item) => {
      if (item.totalHours > 0) {
        text += `${normalizeShortDate(item.date)}: ${item.totalHours} hs.\n`;
      }
    });

    copyClipboard(text);
    if (isMobile() && navigator.share) {
      return shareMobileData(text);
    }
  };

  // Función para cargar archivo JSON
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = file.name;

      // Extraer userName del nombre del archivo (formato: `${userName} ${date}.json`)
      const fileNameParts = fileName.split(" ");
      const userNameFromFile = fileNameParts[0]; // El primer elemento es el userName
      const dateFromFile = fileNameParts
        .slice(1)
        .join(" ")
        .replace(".json", ""); // El resto es la fecha (opcional)

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);

          // Actualizar taskGroups con los datos del archivo
          setTaskGroups(jsonData);

          // Calcular el resumen con los nuevos datos
          calculateSummary(jsonData);

          // Guardar los nuevos datos en el localStorage usando el userName del archivo
          localStorage.setItem(
            setTaskDataKey(userNameFromFile),
            JSON.stringify(jsonData)
          );

          alert(
            `Archivo cargado con éxito para el usuario: ${userNameFromFile}`
          );
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
    const date = getCurrentDate();
    const exportFileDefaultName = `${userName} ${date}.json`;

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
        const remainingTasks = group.tasks.filter((task) => task.id !== taskId);
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

  // Componente para mostrar la ventana emergente de la cabecera de la tarea
  const TaskHeaderContent = () => (
    <div className="task-header">
      <h2 className="task-title">Registro de Tareas</h2>
      <div className="action-buttons">
        <button
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
              setTimeout(() => {
                setShowTaskHeader(false);
              }, 300);
            } else {
              alert("El selector de archivos no está disponible.");
            }
          }}
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
        />{" "}
        <button
          onClick={() => {
            setShowTaskHeader(false);
            setTimeout(exportToJson, 300);
          }}
          className="button button-gray"
        >
          <FileUp size={18} className="mr-1" /> Guardar Archivo
        </button>
      </div>
    </div>
  );

  // Popup component
  const Popup = ({ onClose, children }) => {
    // Close popup when clicking outside
    const popupRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
          onClose();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [onClose]);

    return (
      <div className="popup-overlay">
        <div className="popup-content" ref={popupRef}>
          <button className="popup-close-button" onClick={onClose}>
            <X size={18} />
          </button>
          {children}
        </div>
      </div>
    );
  };

  // Vista de login
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <h1 className="login-title">
              <span className="app-title-red">JLC</span>{" "}
              <span className="app-title-blue">Montajes industriales</span>
            </h1>
            <p className="login-subtitle">Sistema de Registro de Tareas</p>
          </div>

          <div className="login-form">
            <input
              ref={userInputRef}
              type="text"
              id="userName"
              className="login-input"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Ingrese su nombre"
              list="usersJLC"
              name="userName"
              autoComplete="on"
            />
            <datalist id="usersJLC">
              {existingUsers.map((user, index) => (
                <option key={index} value={user} />
              ))}
            </datalist>
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
            <span
              className="app-title app-title-red app-title-header"
              onClick={() => setShowTaskHeader(true)}
              style={{ cursor: "pointer" }}
              role="button"
              tabIndex={0}
            >
              JLC
            </span>{" "}
            <span className="app-title app-title-blue app-title-header">
              Montajes Industriales
            </span>
          </h1>
          <div className="user-greeting">
            Bienvenido, {userName}
            <div>
              <button
                onClick={handleLogout}
                className="button button-red"
                disabled={!userName.trim()}
              >
                X
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="task-container">
          {/* Tabla de tareas con grupos por fecha */}
          <div className="overflow-x-auto mb-6">
            <table className="task-table">
              <thead>
                <tr>
                  <th className="task-date-cell">Fecha</th>
                  <th className="task-hours-cell">Hs</th>
                  <th className="task-description-cell">Descripción</th>
                  <th className="task-finished-cell"></th>
                  <th className="task-actions-cell"></th>
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
                    {/*Fila de cabecera con fecha y acciones*/}
                    <td colSpan={5} className="p-0">
                      <div className="group-header">
                        <div className="flex items-center">
                          <div
                            suppressContentEditableWarning
                            className="group-date"
                            onBlur={(e) => {
                              const input = e.target.textContent;
                              if (
                                /^\d{4}-\d{2}-\d{2}$/.test(input) ||
                                /^\d{2}\/\d{2}\/\d{4}$/.test(input)
                              ) {
                                const normalizedDate =
                                  normalizeToDDMMYYYY(input);
                                const updatedGroups = taskGroups.map((g, i) => {
                                  if (i === groupIndex) {
                                    return { ...g, date: normalizedDate };
                                  }
                                  return g;
                                });
                                setTaskGroups(reorganizeTasks(updatedGroups));
                              } else {
                                e.target.textContent = normalizeShortDate(
                                  group.date
                                );
                                alert(
                                  "Formato de fecha inválido. Use YYYY-MM-DD o DD/MM/YYYY"
                                );
                              }
                            }}
                          >
                            {normalizeToDDMMYYYY(group.date)}
                          </div>

                          {/*
                          <span className="group-hint">|</span>
                          <span className="text-sm text-gray-500">
                            Arrastre para mover el grupo
                          </span>*/}
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
                                <select
                                  value={task.date || group.date || ""}
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
                                      {normalizeToDDMMYYYY(g.date)}
                                    </option>
                                  ))}
                                </select>
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
                                    __html: task.hours || "",
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
                                    __html: task.description || "",
                                  }}
                                />
                              </td>
                              <td className="task-finished-cell">
                                <input
                                  type="checkbox"
                                  className="editable-checkbox"
                                  checked={!!task.finished}
                                  onChange={(e) =>
                                    updateTask(
                                      group.id,
                                      task.id,
                                      "finished",
                                      e.target.checked
                                    )
                                  }
                                />
                              </td>
                              <td className="task-actions-cell">
                                <button
                                  onClick={() => deleteTask(group.id, task.id)}
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
              {summary
                .filter((item) => item.totalHours > 0)
                .map((item, index) => (
                  <div key={index} className="summary-item">
                    {normalizeShortDate(item.date)}: {item.totalHours} hs.
                  </div>
                ))}
            </div>
          </div>

          {/* Selector de fecha para nueva tarea */}
          <DatePicker
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
            newTaskDate={newTaskDate}
            setNewTaskDate={setNewTaskDate}
            newTaskTime={newTaskTime}
            setNewTaskTime={setNewTaskTime}
            newTaskDescription={newTaskDescription}
            setNewTaskDescription={setNewTaskDescription}
            newTaskFinished={newTaskFinished}
            setNewTaskFinished={setNewTaskFinished}
            addNewTask={addNewTask}
          />
        </div>
      </main>

      <div>
        {/* Botones de acción */}
        <div className="footer-buttons">
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
        </div>
      </div>

      {/* Mostrar ventana emergente cuando se hace click en el nombre de la aplicación */}
      {showTaskHeader && (
        <Popup onClose={() => setShowTaskHeader(false)}>
          <TaskHeaderContent />
        </Popup>
      )}

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} JLC Montajes Industriales</p>
      </footer>
    </div>
  );
}
