import React from "react";
import {
  Shield,
  Users,
  BarChart3,
  CheckCircle,
  ClipboardList,
  Target,
  DollarSign,
  Clock,
  MessageSquare,
  MapPin,
} from "lucide-react";
import VersionInfo from "../components/VersionInfo";

const DevelopmentWelcome = ({
  userName,
  onNavigate,
}) => {
  const hrTools = [
    {
      id: "employee-management",
      title: "Gestión de Personal",
      description: "Fichas de empleados, contratación y organigramas",
      icon: Users,
      features: [
        "Ficha del empleado",
        "Contratación y onboarding",
        "Organigrama",
        "Evaluación de desempeño",
      ],
      color: "#3b82f6",
    },
    {
      id: "payroll-benefits",
      title: "Nóminas y Beneficios",
      description: "Cálculo de salarios, beneficios y declaraciones fiscales",
      icon: DollarSign,
      features: [
        "Cálculo de nóminas",
        "Gestión de beneficios",
        "Declaraciones fiscales",
        "Historial salarial",
      ],
      color: "#10b981",
    },
    {
      id: "attendance-control",
      title: "Control de Asistencia",
      description: "Registro de horarios, vacaciones e incapacidades",
      icon: Clock,
      features: [
        "Registro entrada/salida",
        "Gestión de vacaciones",
        "Horarios flexibles",
        "Control de incapacidades",
      ],
      color: "#f59e0b",
    },
    {
      id: "health-safety",
      title: "Salud y Seguridad Laboral",
      description: "Exámenes médicos, EPP y protocolos de seguridad",
      icon: Shield,
      features: [
        "Exámenes médicos",
        "Equipo de protección",
        "Reportes de incidentes",
        "Protocolos de seguridad",
      ],
      color: "#8b5cf6",
    },
    {
      id: "workplace-climate",
      title: "Clima Laboral",
      description: "Encuestas, reconocimientos y comunicación interna",
      icon: MessageSquare,
      features: [
        "Encuestas de satisfacción",
        "Buzón de sugerencias",
        "Reconocimientos",
        "Comunicación interna",
      ],
      color: "#06b6d4",
    },
    {
      id: "field-technicians",
      title: "Técnicos en Campo",
      description: "Gestión especializada para técnicos móviles",
      icon: MapPin,
      features: [
        "Asignación de herramientas",
        "Evaluación de rutas",
        "Gamificación",
        "Soporte en tiempo real",
      ],
      color: "#ef4444",
    },
    {
      id: "hr-analytics",
      title: "Analítica de RRHH",
      description: "Reportes y KPIs de recursos humanos",
      icon: BarChart3,
      features: [
        "Rotación de personal",
        "Costos por empleado",
        "Diversidad e inclusión",
        "Indicadores clave",
      ],
      color: "#f97316",
    },
    {
      id: "training-development",
      title: "Capacitación y Desarrollo",
      description: "Programas de formación y crecimiento profesional",
      icon: Target,
      features: [
        "Planes de desarrollo",
        "Evaluación de competencias",
        "Programas de mentoring",
        "Certificaciones",
      ],
      color: "#84cc16",
    },
  ];

  const handleToolClick = (toolId) => {
    onNavigate(toolId);
  };

  return (
    <div className="welcome-module">
      <div className="welcome-header">
        <div className="department-badge">
          <Users size={24} />
          <span>Gestión de RRHH</span>
        </div>
        <h1 className="welcome-title">
          <span className="app-title-red">JLC</span>
          <span className="app-title-blue"> Gestión de RRHH</span>
        </h1>
        <p className="welcome-subtitle">Sistema Integral de Recursos Humanos</p>
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
            <h3>Objetivo del Departamento</h3>
            <p>
              Centralizar y optimizar la gestión del personal con herramientas
              integrales para el desarrollo profesional y bienestar de los
              empleados.
            </p>
          </div>
        </div>

        <div className="tools-grid">
          {hrTools.map((tool) => (
            <div
              key={tool.id}
              className="tool-card development-card"
              onClick={() => handleToolClick(tool.id)}
              style={{ "--accent-color": tool.color }}
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
            onClick={() => onNavigate("tasks")}
          >
            <ClipboardList size={18} />
            Registrar Horas de Trabajo
          </button>
        </div>

        <div className="department-stats">
          <div className="stat-card">
            <Users size={24} />
            <div>
              <h4>Empleados Activos</h4>
              <p className="stat-value">45</p>
            </div>
          </div>
          <div className="stat-card">
            <Target size={24} />
            <div>
              <h4>Evaluaciones Pendientes</h4>
              <p className="stat-value">8</p>
            </div>
          </div>
          <div className="stat-card">
            <BarChart3 size={24} />
            <div>
              <h4>Satisfacción Laboral</h4>
              <p className="stat-value">87%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentWelcome;
