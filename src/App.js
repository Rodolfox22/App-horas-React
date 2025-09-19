import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { X, FileUp } from "lucide-react";

// Componentes
import FileUploader from "./components/FileUploader";
import VersionInfo from "./components/VersionInfo";
import FileMergeComponent from "./components/FileMerge";

// Utils
import { defaultUsers, getUserRole, USER_ROLES } from "./utils/constants";
import { copyClipboard } from "./utils/CopyClipboard";
import { getCurrentDate } from "./utils/DateFormat";

// Services
import {
  getUsers,
  addUser,
  getUserTasks,
  saveUserTasks,
  clearUserTasks,
  calculateSummary as calculateSummaryService,
} from "./services/taskService";

import "./App.css";

// Módulos lazy
const LazyWelcomeModule = lazy(() => import('./modules/WelcomeModule'));
const LazyFinanceWelcome = lazy(() => import('./modules/FinanceWelcome'));
const LazyTechnicalWelcome = lazy(() => import('./modules/TechnicalWelcome'));
const LazyOperatorWelcome = lazy(() => import('./modules/OperatorWelcome'));
const LazyDevelopmentWelcome = lazy(() => import('./modules/DevelopmentWelcome'));
const LazyRegistroHoras = lazy(() => import('./modules/operator-module/apps/registro-hs'));

export default function TaskTrackingApp() {
  // Estados de navegación
  const [currentView, setCurrentView] = useState("login"); // 'login', 'welcome', 'tasks'
  const [userRole, setUserRole] = useState(""); // Rol del usuario actual

  // Estados de autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [existingUsers, setExistingUsers] = useState([]);

  // Estados
  const [showFileMerger, setShowFileMerger] = useState(false);

  // Variable local para módulos activos
  const [activeModules, setActiveModules] = useState({
    welcome: true, // Siempre activo para admin
    finance: false,
    technical: false,
    operator: false,
    development: false,
    tasks: false,
  });

  // Referencias para los inputs
  const userInputRef = useRef(null);

  const tagResumen = "\n\nResumen:\n";
  // Focus user input when not logged in
  useEffect(() => {
    if (!isLoggedIn && userInputRef.current) {
      userInputRef.current.focus();
      userInputRef.current.select();
    }
  }, [isLoggedIn]);

  // Cargar usuarios existentes al iniciar
  useEffect(() => {
    const storedUsers = getUsers();
    const mergedUsers = Array.from(new Set([...defaultUsers, ...storedUsers]));
    setExistingUsers(mergedUsers);
  }, []);


  // Formateo de nombre de usuario
  const formatUserName = (name) => {
    const firstName = name.split(" ")[0];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  };

  // Función para manejar navegación desde el módulo de bienvenida
  const handleNavigate = (view) => {
    if (
      view === "tasks" ||
      view === "work-orders" ||
      view === "system-status"
    ) {
      setCurrentView("tasks");
      setActiveModules(prev => ({ ...prev, tasks: true }));
    }
    // Aquí se pueden agregar más vistas en el futuro
  };

  // Función para manejar el login
  const handleLogin = (e) => {
    e.preventDefault();
    const formattedName = formatUserName(userName.trim());

    if (formattedName) {
      setUserName(formattedName);

      // Determinar el rol del usuario
      const role = getUserRole(formattedName);
      setUserRole(role);

      // Activar módulo correspondiente al rol
      setActiveModules(prev => {
        const newActive = { ...prev };
        switch (role) {
          case USER_ROLES.FINANZAS:
            newActive.finance = true;
            break;
          case USER_ROLES.TECNICO:
            newActive.technical = true;
            break;
          case USER_ROLES.OPERARIO:
            newActive.operator = true;
            break;
          case USER_ROLES.DESARROLLO:
            newActive.development = true;
            break;
          case USER_ROLES.ADMIN:
            newActive.welcome = true;
            break;
          default:
            newActive.operator = true;
            break;
        }
        return newActive;
      });

      // Actualizar lista de usuarios si es nuevo
      addUser(formattedName);

      setIsLoggedIn(true);
      setCurrentView("welcome"); // Ir al módulo de bienvenida después del login
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setUserRole("");
    setCurrentView("login");
  };


  // Mostrar módulo de bienvenida específico según el rol del usuario
  if (currentView === "welcome" && isLoggedIn) {
    let ModuleComponent = null;
    let isActive = false;
    switch (userRole) {
      case USER_ROLES.FINANZAS:
        if (activeModules.finance) {
          ModuleComponent = LazyFinanceWelcome;
          isActive = true;
        }
        break;
      case USER_ROLES.TECNICO:
        if (activeModules.technical) {
          ModuleComponent = LazyTechnicalWelcome;
          isActive = true;
        }
        break;
      case USER_ROLES.OPERARIO:
        if (activeModules.operator) {
          ModuleComponent = LazyOperatorWelcome;
          isActive = true;
        }
        break;
      case USER_ROLES.DESARROLLO:
        if (activeModules.development) {
          ModuleComponent = LazyDevelopmentWelcome;
          isActive = true;
        }
        break;
      case USER_ROLES.ADMIN:
        if (activeModules.welcome) {
          ModuleComponent = LazyWelcomeModule;
          isActive = true;
        }
        break;
      default:
        if (activeModules.operator) {
          ModuleComponent = LazyOperatorWelcome;
          isActive = true;
        }
        break;
    }

    if (isActive && ModuleComponent) {
      return (
        <Suspense fallback={<div>Cargando módulo...</div>}>
          <ModuleComponent userName={userName} onNavigate={handleNavigate} />
        </Suspense>
      );
    } else {
      return <div>Módulo no disponible o no activado</div>;
    }
  }

  // Vista de login
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-box">
          {!showFileMerger && (
            <>
              <div className="login-header">
                <h1 className="login-title">
                  <span
                    className="app-title-red"
                    onClick={() => setShowFileMerger(true)}
                    role="button"
                  >
                    JLC
                  </span>{" "}
                  <span className="app-title-blue">Montajes industriales</span>
                </h1>
                <p className="login-subtitle">Sistema de Registro de Tareas</p>
              </div>

              <div className="login-form">
                <input
                  ref={userInputRef}
                  type="text"
                  id="userName"
                  className="login-input"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Ingrese su nombre"
                  list="usersJLC"
                  name="userName"
                  autoComplete="on"
                />
                <datalist id="usersJLC">
                  {existingUsers.map((user, index) => (
                    <option key={index} value={user} />
                  ))}
                </datalist>
              </div>

              <button
                onClick={handleLogin}
                className="login-button"
                disabled={!userName.trim()}
              >
                Ingresar
              </button>
            </>
          )}

          {showFileMerger && (
            <div className="file-merger-popup">
              <FileMergeComponent onClose={() => setShowFileMerger(false)} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Vista principal de la aplicación (Registro de Horas)
  if (currentView === "tasks" && activeModules.tasks) {
    return (
      <Suspense fallback={<div>Cargando módulo de tareas...</div>}>
        <LazyRegistroHoras
          userName={userName}
          userRole={userRole}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      </Suspense>
    );
  }

  // Vista principal de la aplicación (fallback)
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span
              className="app-title app-title-red"
              onClick={() => setCurrentView("welcome")}
              role="button"
              tabIndex={0}
              title="Volver al inicio"
              style={{ cursor: "pointer" }}
            >
              JLC
            </span>{" "}
            <span className="app-title app-title-blue">
              Montajes Industriales
            </span>
          </h1>
          <div className="user-greeting">
            Bienvenido, {userName}
            <div>
              <button
                onClick={handleLogout}
                className="button button-red"
                disabled={!userName.trim()}
              >
                X
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="welcome-message">
          <h2>¡Bienvenido al Sistema de Registro de Tareas!</h2>
          <p>Selecciona una opción del menú para continuar.</p>
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} JLC Montajes Industriales</p>
        <a
          href="https://github.com/Rodolfox22/App-horas-React"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
          aria-label="GitHub"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.8 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.6-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1 .1 1.6.8 1.6.8.9 1.5 2.3 1 2.9.8.1-.7.4-1 .7-1.2-2.6-.3-5.3-1.3-5.3-5.9 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2A11.6 11.6 0 0112 6.3a11.6 11.6 0 012.9.4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.9 1.2 2 1.2 3.2 0 4.6-2.7 5.6-5.3 5.9.4.3.7.9.7 1.8v2.6c0 .3.2.6.8.5A10.6 10.6 0 0023.5 12C23.5 5.7 18.3.5 12 .5z" />
          </svg>
        </a>
      </footer>
    </div>
  );
}

