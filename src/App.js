import { useState, useEffect, useRef } from "react";
import {
  Plus,
  FileUp,
  Share2,
  Trash2,
  X,
  Eye,
  EyeOff,
  CalendarRange,
  CalendarCheck,
} from "lucide-react";

// Componentes
import DatePicker from "./components/DatePicker";
import FileUploader from "./components/FileUploader";
import {
  GroupVisibilityManager,
  useGroupVisibility,
} from "./components/GroupVisibilityManager";
import VersionInfo from "./components/VersionInfo";
import FileMergeComponent from "./components/FileMerge";

// Utils
import {
  normalizeShortDate,
  normalizeToDDMMYYYY,
  getCurrentDate,
} from "./utils/DateFormat";
import { taskDataKey, getUsersKey, defaultUsers } from "./utils/constants";
import { copyClipboard } from "./utils/CopyClipboard";
import { SelectContentEditable } from "./utils/DomUtils";
import { useKeyboardNavigation } from "./utils/KeyboardNavigation";

import "./App.css";

export default function TaskTrackingApp() {
  // Estados de autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [existingUsers, setExistingUsers] = useState([]);

  // Estados
  const [taskGroups, setTaskGroups] = useState([]);
  const [summary, setSummary] = useState([]);

  // New task form states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newTaskDate, setNewTaskDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [newTaskTime, setNewTaskTime] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskFinished, setNewTaskFinished] = useState(false);
  const [showTaskHeader, setShowTaskHeader] = useState(false);

  // Visibility management
  const {
    hiddenGroups,
    groupVisibility,
    toggleAllGroupsVisibility,
    toggleGroupVisibility,
  } = useGroupVisibility([], taskGroups);

  // Apartado de carga de archivos
  const [showFileMerger, setShowFileMerger] = useState(false);

  // Referencias para los inputs
  const userInputRef = useRef(null);
  const newInputRef = useRef(null);
  const hideInputRef = useRef(null);
  const clearInputRef = useRef(null);
  const shareInputRef = useRef(null);

  const tagResumen = "\n\nResumen:\n";
  // Focus user input when not logged in
  useEffect(() => {
    if (!isLoggedIn && userInputRef.current) {
      userInputRef.current.focus();
      userInputRef.current.select();
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
      const userData = localStorage.getItem(taskDataKey(userName));
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
      localStorage.setItem(taskDataKey(userName), JSON.stringify(taskGroups));
      calculateSummary(taskGroups);
    }
  }, [taskGroups, isLoggedIn, userName]);

  // Manejador de teclas para navegación entre campos
  const handleKeyDown = useKeyboardNavigation({
    navigation: {
      newButton: () => setShowDatePicker(true),
      clear: () => clearAllData(),
    },
    altKeyHandler: {
      n: (e) => {
        setShowDatePicker(true);
      },
      l: (e) => {
        clearAllData();
      },
      o: (e) => {
        toggleAllGroupsVisibility();
      },
      c: (e) => {
        shareData();
      },
      s: (e) => {
        exportToJson();
      },
    },
  });

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Usa el handler devuelto por useKeyboardNavigation
      handleKeyDown(e, "global");
    };

    document.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [handleKeyDown]);

  // Formateo de nombre de usuario
  const formatUserName = (name) => {
    const firstName = name.split(" ")[0];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  };

  // Función para manejar el login
  const handleLogin = (e) => {
    e.preventDefault();
    const formattedName = formatUserName(userName.trim());

    if (formattedName) {
      setUserName(formattedName);

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

  const createTask = (date, time, task, finished) => ({
    id: Date.now().toString(),
    hours: time,
    description: task,
    date: date,
    finished: finished,
  });

  const addNewTask = () => {
    const { date, time, task, finished } = {
      date: newTaskDate,
      time: newTaskTime,
      task: newTaskDescription,
      finished: newTaskFinished,
    };

    const existingGroup = taskGroups.find((group) => group.date === date);

    if (existingGroup) {
      const updatedGroups = taskGroups.map((group) =>
        group.date === date
          ? {
              ...group,
              tasks: [...group.tasks, createTask(date, time, task, finished)],
            }
          : group
      );
      setTaskGroups(updatedGroups);
    } else {
      const newGroup = {
        id: `group-${date}-${Date.now()}`,
        date: date,
        tasks: [createTask(date, time, task, finished)],
      };
      setTaskGroups(
        [...taskGroups, newGroup].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        )
      );
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
      localStorage.removeItem(taskDataKey(userName));
    }
  };

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

  // Función para compartir datos
  const shareData = () => {
    let text = "";

    taskGroups.forEach((group) => {
      group.tasks.forEach((task) => {
        let finishedText = "";
        if (task.finished === true) {
          finishedText = ". Completo.";
        }
        //Noralizar horas, si contiene un punto, cambiarlo por coma
        if (task.hours) {
          task.hours = task.hours.replace(".", ",");
        }
        if (task.hours || task.description) {
          text += `${normalizeShortDate(group.date)}\t${task.hours}\t${
            task.description
          }${finishedText}\t${userName}\n`;
        }
      });
    });
    text += tagResumen;
    summary.forEach((item) => {
      if (item.totalHours > 0) {
        text += `${normalizeShortDate(item.date)}: ${item.totalHours} hs.\n`;
      }
    });

    copyClipboard(text, () => {
      if (!isMobile()) alert("¡Copiado con éxito!");
      clearAllData();
    });
    if (isMobile() && navigator.share) {
      return shareMobileData(text);
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
      {/* Título arriba */}
      <h2 className="task-title">
        {/*TODO: agregar boton para ingresar datos pegados
          onClick={() => }
        role="button"*/}
        Registro de Tareas
      </h2>

      {/* Botones centrados */}
      <div className="action-buttons">
        <FileUploader
          onFileLoaded={({ data, userNameF, error }) => {
            if (error)
              return alert("Error al cargar archivo: " + error.message);
            if (userName === userNameF) {
              setTaskGroups(data);
              calculateSummary(data);
            }
            localStorage.setItem(taskDataKey(userNameF), JSON.stringify(data));
            alert(`Archivo cargado con éxito para el usuario: ${userNameF}`);
            setShowTaskHeader(false);
          }}
        >
          <button className="button button-gray">
            <FileUp size={18} className="mr-1" /> Abrir Archivo
          </button>
        </FileUploader>

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

      {/* Versión como footer */}
      <div className="version-footer">
        <VersionInfo compact />
      </div>
    </div>
  );

  const Popup = ({ onClose, children }) => {
    const popupRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
          onClose();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
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
          {!showFileMerger && (
            <>
              <div className="login-header">
                <h1 className="login-title">
                  <span
                    className="app-title-red"
                    onClick={() => setShowFileMerger(true)}
                    role="button"
                  >
                    JLC
                  </span>{" "}
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
            </>
          )}

          {showFileMerger && (
            <div className="file-merger-popup">
              <FileMergeComponent onClose={() => setShowFileMerger(false)} />
            </div>
          )}
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
              className="app-title app-title-red"
              onClick={() => setShowTaskHeader(true)}
              role="button"
              tabIndex={0}
            >
              JLC
            </span>{" "}
            <span className="app-title app-title-blue">
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
          <GroupVisibilityManager
            taskGroups={taskGroups}
            hiddenGroups={hiddenGroups}
            groupVisibility={groupVisibility}
            onToggleAllGroups={toggleAllGroupsVisibility}
            onToggleGroup={toggleGroupVisibility}
            render={({
              toggleAllGroupsVisibility,
              toggleGroupVisibility,
              hiddenGroups,
              groupVisibility,
            }) => (
              <>
                <div className="overflow-x-auto mb-6">
                  <table className="task-table">
                    <thead>
                      <tr>
                        <th className="task-date-cell">Fecha</th>
                        <th className="task-hours-cell">Hs</th>
                        <th className="task-description-cell">Descripción</th>
                        <th className="task-finished-cell global-visibility-control">
                          {" "}
                        </th>
                        <th className="task-actions-cell"></th>
                      </tr>
                    </thead>

                    <tbody>
                      {taskGroups.map((group) => {
                        if (hiddenGroups.includes(group.id)) return null;

                        const totalHours = group.tasks.reduce(
                          (sum, task) => sum + (parseFloat(task.hours) || 0),
                          0
                        );

                        return (
                          <tr key={group.id} className="group-row">
                            {/*Fila de cabecera con fecha y acciones*/}
                            <td colSpan={5} className="p-0">
                              <div className="group-header">
                                <div className="flex items-center">
                                  <div className="group-date">
                                    {normalizeToDDMMYYYY(group.date)}
                                    <span>
                                      {"   -   "}
                                      {totalHours} hs. - {group.tasks.length}{" "}
                                      tarea{group.tasks.length === 1 ? "" : "s"}
                                    </span>
                                  </div>
                                </div>
                                <div className="group-buttons">
                                  <button
                                    onClick={() =>
                                      toggleGroupVisibility(group.id)
                                    }
                                    className="group-visibility-button"
                                  >
                                    {groupVisibility[group.id] ? (
                                      <EyeOff size={22} />
                                    ) : (
                                      <Eye size={22} />
                                    )}
                                  </button>

                                  <button
                                    onClick={() => addTaskToGroup(group.id)}
                                    className="add-task-button"
                                    title="Agregar una nueva línea"
                                  >
                                    <Plus size={18} />
                                  </button>
                                </div>
                              </div>
                              {/*
TODO: Implementar navegación con Enter en el grupo
                              */}
                              {!groupVisibility[group.id] && (
                                <table className="task-table">
                                  <tbody>
                                    {group.tasks.map((task) => (
                                      <tr key={task.id} className="task-row">
                                        <td className="task-date-cell">
                                          <select
                                            value={
                                              task.date || group.date || ""
                                            }
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
                                            onFocus={(e) =>
                                              SelectContentEditable(e.target)
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
                                            onFocus={(e) =>
                                              SelectContentEditable(e.target)
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
                              )}
                            </td>
                          </tr>
                        );
                      })}
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
                        <div
                          key={index}
                          className={`summary-item ${
                            item.totalHours == 9 ? "white-bg" : ""
                          }`}
                        >
                          {normalizeShortDate(item.date)}: {item.totalHours} hs.
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}
          />

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

      {/* Botones de acción*/}
      <div className="footer-buttons">
        <button
          ref={newInputRef}
          onClick={() => setShowDatePicker(true)}
          className="button button-blue"
          title="Alt + N para nueva tarea"
          onKeyDown={(e) => {
            handleKeyDown(e, "newButton");
          }}
        >
          <Plus size={18} className="mr-1" /> <u>N</u>uevo
        </button>
        <button
          ref={clearInputRef}
          onClick={clearAllData}
          title="Alt + L para limpiar datos"
          onKeyDown={(e) => {
            handleKeyDown(e, "clear");
          }}
          className="button button-red"
        >
          <Trash2 size={18} className="mr-1" /> <u>L</u>impiar
        </button>
        <button
          ref={hideInputRef}
          onClick={toggleAllGroupsVisibility}
          className="button button-gray"
          title="Alt + O para ocultar/mostrar grupos completos"
          onKeyDown={(e) => {
            handleKeyDown(e, "toggleVisibility");
          }}
        >
          {hiddenGroups.length ? (
            <CalendarRange size={20} />
          ) : (
            <CalendarCheck size={20} />
          )}
          {hiddenGroups.length ? (
            <span>
              {" "}
              M<u>o</u>strar todos
            </span>
          ) : (
            <span>
              {" "}
              <u>O</u>cultar completos
            </span>
          )}
        </button>
        <button
          ref={shareInputRef}
          onClick={shareData}
          className="button button-blue"
          title="Alt + C para compartir datos"
          onKeyDown={(e) => {
            handleKeyDown(e, "share");
          }}
        >
          <Share2 size={18} className="mr-1" /> <u>C</u>ompartir
        </button>
      </div>

      {/* Mostrar ventana emergente cuando se hace click en el nombre de la aplicación */}
      {showTaskHeader && (
        <Popup onClose={() => setShowTaskHeader(false)}>
          <TaskHeaderContent />
        </Popup>
      )}

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} JLC Montajes Industriales</p>
        <a
          href="https://github.com/Rodolfox22/App-horas-React"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
          aria-label="GitHub"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.8 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.6-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1 .1 1.6.8 1.6.8.9 1.5 2.3 1 2.9.8.1-.7.4-1 .7-1.2-2.6-.3-5.3-1.3-5.3-5.9 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2A11.6 11.6 0 0112 6.3a11.6 11.6 0 012.9.4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.9 1.2 2 1.2 3.2 0 4.6-2.7 5.6-5.3 5.9.4.3.7.9.7 1.8v2.6c0 .3.2.6.8.5A10.6 10.6 0 0023.5 12C23.5 5.7 18.3.5 12 .5z" />
          </svg>
        </a>
      </footer>
    </div>
  );
}
