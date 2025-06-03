import { useEffect, useRef, useState } from "react";

// Este componente recibe todas las props necesarias desde el componente padre
const DatePicker = ({
  showDatePicker,
  setShowDatePicker,
  newTaskDate,
  setNewTaskDate,
  newTaskTime,
  setNewTaskTime,
  newTaskDescription,
  setNewTaskDescription,
  newTaskFinished,
  setNewTaskFinished,
  addNewTask,
}) => {
  // NUEVOS ESTADOS para solicitante y notificación
  const [newTaskPartialDescription, setNewTaskPartialDescription] =
    useState("");
  const [newTaskSolicitante, setNewTaskSolicitante] = useState("");
  const [newTaskNotificacion, setNewTaskNotificacion] = useState("");

  // Estado para controlar cuándo agregar la tarea
  const [shouldAddTask, setShouldAddTask] = useState(false);

  // Referencias para los inputs
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const solicitaInputRef = useRef(null);
  const notificacionInputRef = useRef(null);
  const checkboxInputRef = useRef(null);
  const addButtonRef = useRef(null);

  // Efecto para enfocar el campo de horas cuando se abre el selector
  useEffect(() => {
    if (showDatePicker && timeInputRef.current) {
      // Pequeño retraso para asegurar que el componente esté renderizado
      setTimeout(() => {
        timeInputRef.current.focus();
      }, 10);
    }
  }, [showDatePicker]);

  // useEffect para agregar la tarea después de actualizar la descripción
  useEffect(() => {
    if (shouldAddTask) {
      addNewTask();
      setShouldAddTask(false);
    }
  }, [newTaskDescription, shouldAddTask, addNewTask]);

  // Manejador de teclas para navegación entre campos
  const handleKeyDown = (e, currentField) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Navegar al siguiente campo
      switch (currentField) {
        case "date":
          timeInputRef.current.focus();
          break;
        case "time":
          descriptionInputRef.current.focus();
          break;
        case "description":
          checkboxInputRef.current.focus();
          break;
        case "checkbox":
          solicitaInputRef.current.focus();
          break;
        case "solicita":
          notificacionInputRef.current.focus();
          break;
        case "notificacion":
          addButtonRef.current.focus();
          break;
        case "addButton":
          handleAddTask();
          break;
        default:
          break;
      }
    } else if (e.key === "Escape") {
      setShowDatePicker(false);
    }
  };

  const handleInputFocus = (event) => {
    const selectableTypes = [
      "text",
      "date",
      "number",
      "email",
      "password",
      "url",
      "tel",
    ];
    if (selectableTypes.includes(event.target.type)) {
      event.target.select();
    }
  };

  // Combina los textos y llama a addNewTask
  const handleAddTask = () => {
    const descripcionCompleta = `${newTaskPartialDescription}${
      newTaskSolicitante ? ". Solicita: " + newTaskSolicitante : ""
    }${
      newTaskNotificacion ? ". Notificación: " + newTaskNotificacion : ""
    }`.trim();

    console.log("Creando descripcion:");

    setNewTaskDescription(descripcionCompleta);
    setShouldAddTask(true);
  };

  if (!showDatePicker) return null;

  return (
    <div className="date-picker">
      <h3 className="date-picker-title">Nuevo trabajo</h3>

      <div className="input-group">
        <input
          className="date-input"
          ref={dateInputRef}
          type="date"
          value={newTaskDate || ""}
          onChange={(e) => setNewTaskDate(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={(e) => handleKeyDown(e, "date")}
        />
        <input
          ref={timeInputRef}
          type="number"
          value={newTaskTime || ""}
          onChange={(e) => setNewTaskTime(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={(e) => handleKeyDown(e, "time")}
          className="date-input"
          placeholder="Horas"
        />
      </div>

      <div className="input-group">
        <input
          className="date-input"
          ref={descriptionInputRef}
          type="text"
          value={newTaskPartialDescription || ""}
          onChange={(e) => setNewTaskPartialDescription(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={(e) => handleKeyDown(e, "description")}
          placeholder="Descripción"
        />
        <label className="checkbox-label">
          <input
            className="checkbox-input"
            ref={checkboxInputRef}
            type="checkbox"
            checked={!!newTaskFinished}
            onChange={(e) => setNewTaskFinished(e.target.checked)}
            onFocus={handleInputFocus}
            onKeyDown={(e) => handleKeyDown(e, "checkbox")}
          />
          Finalizado
        </label>
      </div>

      <div className="input-group">
        <input
          className="date-input"
          ref={solicitaInputRef}
          type="text"
          value={newTaskSolicitante}
          onChange={(e) => setNewTaskSolicitante(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={(e) => handleKeyDown(e, "solicita")}
          placeholder="Solicitante"
        />
        <input
          className="date-input"
          ref={notificacionInputRef}
          type="text"
          value={newTaskNotificacion}
          onChange={(e) => setNewTaskNotificacion(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={(e) => handleKeyDown(e, "notificacion")}
          placeholder="Número de notificación"
        />
      </div>

      <div className="button-group">
        <button
          className="button button-blue"
          ref={addButtonRef}
          onClick={handleAddTask}
          onKeyDown={(e) => handleKeyDown(e, "addButton")}
        >
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
  );
};

export default DatePicker;
