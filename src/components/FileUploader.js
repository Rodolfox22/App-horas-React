import React from "react";
import PropTypes from "prop-types";

const FileUploader = ({ onFileLoaded, accept = ".json", children }) => {
  const fileInputRef = React.useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileContent = await readFileAsText(file);
      const jsonData = JSON.parse(fileContent);

      // Extraer metadata del nombre del archivo
      const fileNameParts = file.name.split(" ");
      const userNameFromFile = fileNameParts[0];
      const dateFromFile = fileNameParts.slice(1).join(" ").replace(accept, "");

      // Limpiar input para permitir nueva selección del mismo archivo
      e.target.value = "";

      // Ejecutar callback con los datos procesados
      onFileLoaded({
        data: jsonData,
        fileName: file.name,
        userNameF: userNameFromFile,
        date: dateFromFile,
        file,
      });
    } catch (error) {
      console.error("Error processing file:", error);
      onFileLoaded({ error });
    }
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        style={{ display: "none" }}
      />
      {React.cloneElement(children, {
        onClick: handleButtonClick,
      })}
    </div>
  );
};

FileUploader.propTypes = {
  onFileLoaded: PropTypes.func.isRequired,
  accept: PropTypes.string,
  children: PropTypes.element.isRequired,
};

export default FileUploader;
