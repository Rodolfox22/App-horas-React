import React, { useState, useRef, useEffect } from "react";

// Componente para unir archivos
const FileMergeComponent = ({ onClose , TAG_RESUMEN="\n\n"}) => {
  const [droppedFiles, setDroppedFiles] = useState([]);
  const [textoCompleto, setTextoCompleto] = useState("");
  const [showDropZone, setShowDropZone] = useState(true);
  const [showFileList, setShowFileList] = useState(false);
  const volverBtnRef = useRef(null);

  // Efecto para manejar el foco en el botón volver
  useEffect(() => {
    if (volverBtnRef.current) {
      volverBtnRef.current.focus();
    }
  }, [showFileList]);

  // Efecto para manejar el evento de la tecla Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        if (volverBtnRef.current) {
          volverBtnRef.current.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Manejador para el evento dragover
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Manejador para el evento drop
  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    setShowDropZone(false);
    setShowFileList(true);

    // Procesar cada archivo
    Array.from(files).forEach((file) => {
      setDroppedFiles((prevFiles) => [
        ...prevFiles,
        { id: Date.now() + Math.random(), name: file.name },
      ]);

      const reader = new FileReader();
      reader.onload = function (e) {
        const contenido = e.target.result;
        const filtrado = contenido.split(TAG_RESUMEN);

        if (filtrado.length === 2) {
          console.log("Correcto!");
          setTextoCompleto((prevTexto) => prevTexto + filtrado[0] + "\n");
        } else {
          console.log("Que pato");
        }
      };

      reader.readAsText(file);
    });
  };

  // Renderiza el componente de unir archivos
  return (
    <div className="file-merge-container">
      <h1 className="file-merge-header">
        Unir Archivos
      </h1>

      <div className="file-merge-content">
        {showDropZone && (
          <div
            id="fileDropArea"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            Suelta archivos aquí para unirlos
          </div>
        )}

        {showFileList && (
          <div className="filemerge-content">
            <h2 id="h2Drop">Archivos seleccionados:</h2>
            <ul id="files">
              {droppedFiles.map((file) => (
                <li key={file.id}>{file.name}</li>
              ))}
            </ul>

            {textoCompleto && (
              <div style={{ marginTop: "20px" }}>
                <h3>Resultado:</h3>
                <div className="TextoCompleto">
                  <p>Archivos copiados correctamente.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="file-merge-footer">
        <button
          id="volver"
          ref={volverBtnRef}
          onClick={onClose}
          className="button-red"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default FileMergeComponent;
