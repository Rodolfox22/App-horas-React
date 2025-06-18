import { useEffect, useRef, useState } from "react";
import { useEnterNavigation } from "../utils/KeyboardNavigation";
import { sectors } from "../utils/constants";

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
  // Estados para generar descripcion
  const [newTaskSector, setNewTaskSector] = useState("");
  const [newTaskPartialDescription, setNewTaskPartialDescription] =
    useState("");
  const [newTaskRequester, setNewTaskRequester] = useState("");
  const [newTaskNotification, setNewTaskNotification] = useState("");
  const [newTaskMaterials, setNewTaskMaterials] = useState("");

  // Estado para controlar cuándo agregar la tarea
  const [shouldAddTask, setShouldAddTask] = useState(false);

  // Lista de sectores predefinidos
    const [existingSectors, setExistingSectors] = useState([]);

  // Referencias para los inputs
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);
  const sectorInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const requestJobInputRef = useRef(null);
  const notificationInputRef = useRef(null);
  const checkboxInputRef = useRef(null);
  const materialInputRef = useRef(null);
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

  useEffect(() => {
    // Crear una lista de sectores existentes
     const storedSectors = JSON.parse(
          localStorage.getItem("jlcSectors") || "[]"
        );
        const mergedSectors = Array.from(
          new Set([...sectors, ...storedSectors])
        );    
        setExistingSectors(mergedSectors);
  }, []);

  // Combina los textos y llama a addNewTask
  const handleAddTask = () => {
    const descripcionCompleta = `${newTaskPartialDescription.trim()}${
      newTaskSector ? ". Sector: " + newTaskSector : ""
    }${newTaskRequester ? ". Solicita: " + newTaskRequester : ""}${
      newTaskNotification ? ". Notificación: " + newTaskNotification : ""
    }${newTaskMaterials ? ". Materiales: " + newTaskMaterials : ""}`;

    console.log("Creando descripcion");

    setNewTaskDescription(descripcionCompleta);
    setShouldAddTask(true);
  };

  // Manejador de teclas para navegación entre campos
  const handleKeyDown = useEnterNavigation({
    navigation: {
      date: timeInputRef,
      time: sectorInputRef,
      sector: descriptionInputRef,
      description: checkboxInputRef,
      checkbox: requestJobInputRef,
      requestJob: notificationInputRef,
      notificacion: materialInputRef,
      materials: addButtonRef,
      addButton: handleAddTask,
    },
    onEscape: () => setShowDatePicker(false),
  });

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
          className="date-input time-input"
          placeholder="Horas"
        />
      </div>

      <div className="input-group">
        <input
          className="date-input"
          ref={sectorInputRef}
          type="text"
          value={newTaskSector || ""}
          onChange={(e) => setNewTaskSector(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={(e) => handleKeyDown(e, "sector")}
          placeholder="Sector"
          list="sectores"
        />
        <datalist id="sectores">
          {existingSectors.map((sector, index) => (
            <option key={index} value={sector} />
          ))}
        </datalist>

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
          ref={descriptionInputRef}
          type="text"
          value={newTaskPartialDescription || ""}
          onChange={(e) => setNewTaskPartialDescription(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={(e) => handleKeyDown(e, "description")}
          placeholder="Descripción"
        />
      </div>
      <div className="input-group">
        <input
          className="date-input"
          ref={requestJobInputRef}
          type="text"
          value={newTaskRequester}
          onChange={(e) => setNewTaskRequester(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={(e) => handleKeyDown(e, "requestJob")}
          placeholder="Solicitante (opcional)"
        />
        <input
          className="date-input"
          ref={notificationInputRef}
          type="text"
          value={newTaskNotification}
          onChange={(e) => setNewTaskNotification(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={(e) => handleKeyDown(e, "notificacion")}
          placeholder="Número de notificación (opcional)"
        />
      </div>
      <div className="input-group">
        <input
          className="date-input"
          ref={materialInputRef}
          type="text"
          value={newTaskMaterials}
          onChange={(e) => setNewTaskMaterials(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={(e) => handleKeyDown(e, "materials")}
          placeholder="Materiales (opcional)"
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
