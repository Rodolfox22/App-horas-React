import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./utils/serviceWorkerRegistration";
import UpdateNotifier from "./components/UpdateNotifier";

const root = ReactDOM.createRoot(document.getElementById("root"));

function RootComponent() {
  // Efecto para verificación periódica de versión
  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      const checkVersion = async () => {
        try {
          const res = await fetch(
            `${process.env.PUBLIC_URL}/version.json?t=${Date.now()}`
          );
          const data = await res.json();

          if (data.version !== process.env.REACT_APP_VERSION) {
            window.location.reload(true);
          }
        } catch (error) {
          console.error("Error verificando versión:", error);
        }
      };

      const interval = setInterval(checkVersion, 3600000); // Cada hora
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

root.render(<RootComponent />);

// Configuración del Service Worker
if (process.env.NODE_ENV === "production") {
  serviceWorkerRegistration.register({
    onUpdate: (registration) => {
      if (registration.waiting) {
        const userResponse = window.confirm(
          "Hay una nueva versión disponible. ¿Quieres actualizar ahora?"
        );

        if (userResponse) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
          window.location.reload();
        }
      }
    },
    onSuccess: () => {
      console.log("Service Worker registrado con éxito");
    },
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
