import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration';
import UpdateNotifier from './components/UpdateNotifier'; // Asegúrate de crear este componente

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UpdateNotifier />
    <App />
  </React.StrictMode>
);

// Registra el Service Worker con configuración de actualización
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    if (registration.waiting) {
      // Mostrar notificación al usuario
      if (window.confirm('Hay una nueva versión disponible. ¿Quieres actualizar ahora?')) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
