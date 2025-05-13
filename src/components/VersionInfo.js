const VersionInfo = () => {
  // Obtiene la versión del entorno o usa '1.0.0' como fallback
  const appVersion = process.env.REACT_APP_VERSION || '1.0.0';
  
  return (
    <div className="version-info">
      <p>Versión: {appVersion}</p>
    </div>
  );
};

export default VersionInfo;