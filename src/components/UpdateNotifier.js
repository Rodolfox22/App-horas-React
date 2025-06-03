import { useEffect } from 'react';

const UpdateNotifier = () => {
  useEffect(() => {
    // Verificación periódica de versión
    const checkVersion = async () => {
      try {
        const res = await fetch('/version.json?t=' + Date.now());
        const data = await res.json();
        
        if (data.version !== process.env.REACT_APP_VERSION) {
          window.location.reload();
        }
      } catch (error) {
        console.error('Error verificando versión:', error);
      }
    };

    const interval = setInterval(checkVersion, 86400000); // Cada día
    return () => clearInterval(interval);
  }, []);

  return null;
};

export default UpdateNotifier;