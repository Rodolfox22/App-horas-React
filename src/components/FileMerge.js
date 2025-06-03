import React, { useState, useRef, useEffect } from "react";
import { copyClipboard } from "../utils/CopyClipboard";

// Componente para unir archivos
const FileMergeComponent = ({ onClose, TAG_RESUMEN = "\n\n" }) => {
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
  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setShowDropZone(false);
    setShowFileList(true);

    // Agregar archivos a la lista mostrada
    setDroppedFiles((prevFiles) => [
      ...prevFiles,
      ...files.map((file) => ({
        id: Date.now() + Math.random(), // Generar un ID único
        name: file.name,
      })),
    ]);

    // Leer y procesar archivos
    const texto = await procesarArchivos(files);
    setTextoCompleto(texto);
    console.log("Texto completo procesado:", texto);
  };

  // Función auxiliar para leer y filtrar archivos
  const procesarArchivos = async (files) => {
    let textoAcumulado = "";

    for (const file of files) {
      const contenido = await leerArchivoComoTexto(file);
      const filtrado = contenido.split(TAG_RESUMEN);
      if (filtrado.length === 2) {
        textoAcumulado += filtrado[0] + "\n";
      } else {
        console.log(`Archivo ${file.name}: no contiene la etiqueta esperada.`);
      }
    }

    return textoAcumulado;
  };

  // Función que devuelve una promesa para leer archivos
  const leerArchivoComoTexto = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  // Renderiza el componente de unir archivos
  return (
    <div className="file-merge-container">
      <h1 className="file-merge-header">Unir Archivos</h1>

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
              <div>
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
          onClick={() => {
            copyClipboard(textoCompleto, () => {
              alert("Texto copiado al portapapeles");
              onClose(); // Solo cierra cuando se copia
            });
          }}
          className="button-red"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default FileMergeComponent;
