import { useEffect, useRef } from "react";
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
  // Referencias para los inputs
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
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
          addButtonRef.current.focus();
          break;
        case "addButton":
          addNewTask();
          break;
        default:
          break;
      }
    } else if (e.key === "Escape") {
      // Cancelar si se presiona Esc
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
          value={newTaskDescription || ""}
          onChange={(e) => setNewTaskDescription(e.target.value)}
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

      <div className="button-group">
        <button
          className="button button-blue"
          ref={addButtonRef}
          onClick={addNewTask}
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
