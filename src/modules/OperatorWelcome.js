import React from 'react';
import {
  Smartphone,
  ClipboardCheck,
  ClipboardList,
  MapPin,
  Clock,
  Camera,
  MessageSquare,
  CheckCircle,
  Users,
  Target
} from 'lucide-react';
import VersionInfo from '../components/VersionInfo';

const OperatorWelcome = ({ userName, onNavigate }) => {
  const operatorTools = [
    {
      id: 'new-request',
      title: 'Agregar Nueva Solicitud',
      description: 'Crear y enviar nuevas solicitudes de mantenimiento',
      icon: Target,
      features: ['Solicitudes personalizadas', 'Categorización automática', 'Priorización', 'Seguimiento de estado'],
      color: '#3b82f6'
    },
    {
      id: 'work-in-progress',
      title: 'Trabajos en Curso',
      description: 'Seguimiento y gestión de tareas actualmente en ejecución',
      icon: ClipboardCheck,
      features: ['Estado en tiempo real', 'Progreso de tareas', 'Tiempos estimados', 'Alertas de retraso'],
      color: '#10b981'
    },
    {
      id: 'time-tracking',
      title: 'Carga de Horas',
      description: 'Registro preciso del tiempo trabajado en cada tarea',
      icon: Clock,
      features: ['Inicio/fin automático', 'Pausas y reanudaciones', 'Categorización por tipo', 'Reportes de productividad'],
      color: '#f59e0b'
    },
    {
      id: 'pending-work',
      title: 'Trabajos Pendientes',
      description: 'Lista de tareas asignadas pendientes de ejecución',
      icon: MapPin,
      features: ['Lista priorizada', 'Fechas límite', 'Recordatorios', 'Reasignación automática'],
      color: '#8b5cf6'
    },
    {
      id: 'photo-evidence',
      title: 'Registro Fotográfico',
      description: 'Captura de evidencias antes, durante y después del trabajo',
      icon: Camera,
      features: ['Fotos geolocalizadas', 'Marcas de agua', 'Almacenamiento en nube', 'Acceso desde web'],
      color: '#06b6d4'
    },
    {
      id: 'communication',
      title: 'Comunicación Directa',
      description: 'Chat y notificaciones con el departamento técnico',
      icon: MessageSquare,
      features: ['Mensajes instantáneos', 'Notificaciones push', 'Historial de conversaciones', 'Archivos adjuntos'],
      color: '#ef4444'
    }
  ];

  const handleToolClick = (toolId) => {
    onNavigate(toolId);
  };

  return (
    <div className="welcome-module">
      <div className="welcome-header">
        <div className="department-badge">
          <Smartphone size={24} />
          <span>Equipo de Campo</span>
        </div>
        <h1 className="welcome-title">
          <span className="app-title-red">JLC</span>
          <span className="app-title-blue"> App Móvil</span>
        </h1>
        <p className="welcome-subtitle">Sistema Móvil para Técnicos de Campo</p>
        <div className="user-info">
          <Users size={16} />
          <span>Bienvenido, {userName}</span>
        </div>
        <div className="welcome-version">
          <VersionInfo compact />
        </div>
      </div>

      <div className="welcome-content">
        <div className="department-objective">
          <Target size={20} />
          <div>
            <h3>Objetivo del Equipo</h3>
            <p>Ejecutar las tareas de mantenimiento de manera eficiente y con información en tiempo real desde el campo.</p>
          </div>
        </div>

        <div className="tools-grid">
          {operatorTools.map((tool) => (
            <div
              key={tool.id}
              className="tool-card operator-card"
              onClick={() => handleToolClick(tool.id)}
              style={{ '--accent-color': tool.color }}
            >
              <div className="tool-icon" style={{ color: tool.color }}>
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
            onClick={() => onNavigate('tasks')}
          >
            <ClipboardList size={18} />
            Registrar Horas de Trabajo
          </button>
        </div>

        <div className="department-stats">
          <div className="stat-card">
            <ClipboardCheck size={24} />
            <div>
              <h4>Tareas Hoy</h4>
              <p className="stat-value">6</p>
            </div>
          </div>
          <div className="stat-card">
            <Clock size={24} />
            <div>
              <h4>Horas Registradas</h4>
              <p className="stat-value">7.5</p>
            </div>
          </div>
          <div className="stat-card">
            <CheckCircle size={24} />
            <div>
              <h4>Tareas Completadas</h4>
              <p className="stat-value">4</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default OperatorWelcome;