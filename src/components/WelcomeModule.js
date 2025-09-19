import React from 'react';
import {
  Calendar,
  FileUp,
  Share2,
  Users,
  Settings,
  CheckCircle,
  ClipboardList,
  BarChart3
} from 'lucide-react';
import VersionInfo from './VersionInfo';

const WelcomeModule = ({ onNavigate }) => {
  const tools = [
    {
      id: 'tasks',
      title: 'Registro de Tareas',
      description: 'Registra y gestiona tus horas de trabajo por día',
      icon: Calendar,
      features: ['Agregar tareas', 'Editar horas', 'Marcar completadas', 'Organizar por fecha']
    },
    {
      id: 'file-management',
      title: 'Gestión de Archivos',
      description: 'Importa y exporta datos de tareas',
      icon: FileUp,
      features: ['Cargar archivos JSON', 'Exportar datos', 'Fusionar archivos', 'Guardar automáticamente']
    },
    {
      id: 'data-sharing',
      title: 'Compartir Datos',
      description: 'Comparte tus registros de manera fácil',
      icon: Share2,
      features: ['Copiar al portapapeles', 'Exportar a texto', 'Compartir en móvil', 'Formatos personalizados']
    },
    {
      id: 'reports',
      title: 'Reportes y Resúmenes',
      description: 'Visualiza estadísticas y resúmenes de tu trabajo',
      icon: BarChart3,
      features: ['Resumen por fecha', 'Totales de horas', 'Estadísticas semanales', 'Exportar reportes']
    },
    {
      id: 'user-management',
      title: 'Gestión de Usuarios',
      description: 'Administra múltiples perfiles de usuario',
      icon: Users,
      features: ['Múltiples usuarios', 'Datos independientes', 'Lista de usuarios', 'Cambio rápido']
    },
    {
      id: 'settings',
      title: 'Configuración',
      description: 'Personaliza la aplicación según tus necesidades',
      icon: Settings,
      features: ['Temas visuales', 'Atajos de teclado', 'Configuración regional', 'Preferencias']
    }
  ];

  const handleToolClick = (toolId) => {
    onNavigate(toolId);
  };

  return (
    <div className="welcome-module">
      <div className="welcome-header">
        <h1 className="welcome-title">
          <span className="app-title-red">JLC</span>
          <span className="app-title-blue"> Montajes Industriales</span>
        </h1>
        <p className="welcome-subtitle">Sistema de Registro de Tareas</p>
        <div className="welcome-version">
          <VersionInfo compact />
        </div>
      </div>

      <div className="welcome-content">
        <div className="tools-grid">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="tool-card"
              onClick={() => handleToolClick(tool.id)}
            >
              <div className="tool-icon">
                <tool.icon size={32} />
              </div>
              <div className="tool-info">
                <h3 className="tool-title">{tool.title}</h3>
                <p className="tool-description">{tool.description}</p>
                <ul className="tool-features">
                  {tool.features.map((feature, index) => (
                    <li key={index}>
                      <CheckCircle size={14} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="tool-arrow">→</div>
            </div>
          ))}
        </div>


        <div className="welcome-actions">
          <button
            className="button button-blue welcome-start-button"
            onClick={() => onNavigate("tasks")}
          >
            <ClipboardList size={18} />
            Registrar Horas de Trabajo
          </button>
        </div>
      </div>

    </div>
  );
};

export default WelcomeModule;