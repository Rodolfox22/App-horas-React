import React from 'react';
import {
  Wrench,
  ClipboardList,
  Calendar,
  MapPin,
  AlertTriangle,
  Settings,
  Users,
  CheckCircle,
  Target
} from 'lucide-react';
import VersionInfo from './VersionInfo';

const TechnicalWelcome = ({ userName, onNavigate }) => {
  const technicalTools = [
    {
      id: 'work-orders-stacked',
      title: 'Órdenes de Trabajo (OT)',
      description: 'Creación, asignación y seguimiento completo de OTs',
      icon: ClipboardList,
      features: ['Creación automática', 'Asignación de técnicos', 'Seguimiento en tiempo real', 'Historial completo'],
      color: '#3b82f6'
    },
    {
      id: 'work-inbox',
      title: 'Bandeja de Entrada de Trabajos',
      description: 'Recepción y asignación de tareas pendientes para técnicos',
      icon: Target,
      features: ['Tareas entrantes', 'Asignación automática', 'Priorización', 'Notificaciones'],
      color: '#10b981'
    },
    {
      id: 'planning',
      title: 'Planificación y Agenda',
      description: 'Optimización de rutas y asignación de técnicos',
      icon: Calendar,
      features: ['Asignación automática', 'Rutas optimizadas', 'Calendario interactivo', 'Conflictos de agenda'],
      color: '#10b981'
    },
    {
      id: 'preventive',
      title: 'Mantenimiento Preventivo',
      description: 'Programación y control de revisiones periódicas',
      icon: Settings,
      features: ['Checklists digitales', 'Alertas automáticas', 'Historial de mantenimientos', 'Reportes de cumplimiento'],
      color: '#f59e0b'
    },
    {
      id: 'equipment-history',
      title: 'Historial de Equipos',
      description: 'Registro completo de intervenciones por máquina',
      icon: Wrench,
      features: ['Historial por equipo', 'Técnicos asignados', 'Repuestos utilizados', 'Tiempos de reparación'],
      color: '#8b5cf6'
    },
    {
      id: 'mobile-app',
      title: 'App Móvil para Técnicos',
      description: 'Acceso completo desde dispositivos móviles',
      icon: MapPin,
      features: ['OTs en tiempo real', 'Registro de tiempos', 'Fotos y evidencias', 'Firmas digitales'],
      color: '#06b6d4'
    },
    {
      id: 'inventory',
      title: 'Gestión de Repuestos',
      description: 'Control de inventario de piezas y herramientas',
      icon: AlertTriangle,
      features: ['Stock en tiempo real', 'Alertas de reposición', 'Ubicación de piezas', 'Historial de uso'],
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
          <Wrench size={24} />
          <span>Departamento Técnico</span>
        </div>
        <h1 className="welcome-title">
          <span className="app-title-red">JLC</span>
          <span className="app-title-blue"> ERP Técnico</span>
        </h1>
        <p className="welcome-subtitle">Sistema de Gestión de Mantenimiento</p>
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
            <p>Planificar, ejecutar y supervisar los servicios de mantenimiento de manera eficiente y preventiva.</p>
          </div>
        </div>

        <div className="tools-grid">
          {technicalTools.map((tool) => (
            <div
              key={tool.id}
              className="tool-card technical-card"
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
            onClick={() => onNavigate('work-orders')}
          >
            <ClipboardList size={18} />
            Registrar Horas de Trabajo
          </button>
        </div>

        <div className="department-stats">
          <div className="stat-card">
            <ClipboardList size={24} />
            <div>
              <h4>OTs Activas</h4>
              <p className="stat-value">12</p>
            </div>
          </div>
          <div className="stat-card">
            <AlertTriangle size={24} />
            <div>
              <h4>Mantenimientos Pendientes</h4>
              <p className="stat-value">8</p>
            </div>
          </div>
          <div className="stat-card">
            <CheckCircle size={24} />
            <div>
              <h4>Completadas Hoy</h4>
              <p className="stat-value">5</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TechnicalWelcome;