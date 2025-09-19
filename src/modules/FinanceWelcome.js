import React from 'react';
import {
  DollarSign,
  FileText,
  CreditCard,
  TrendingUp,
  Calculator,
  ClipboardList,
  BarChart3,
  Receipt,
  PieChart,
  Calendar,
  Users,
  CheckCircle,
  Target
} from 'lucide-react';
import VersionInfo from '../components/VersionInfo';

const FinanceWelcome = ({ userName, onNavigate }) => {
  const financeTools = [
    {
      id: 'accounting',
      title: 'Contabilidad General',
      description: 'Gestión completa de libros contables y estados financieros',
      icon: FileText,
      features: ['Libros contables', 'Balances generales', 'Estados financieros', 'Análisis de cuentas'],
      color: '#10b981'
    },
    {
      id: 'receivables',
      title: 'Cuentas por Cobrar',
      description: 'Facturación a clientes y seguimiento de pagos pendientes',
      icon: CreditCard,
      features: ['Facturación automática', 'Seguimiento de pagos', 'Recordatorios', 'Reportes de mora'],
      color: '#3b82f6'
    },
    {
      id: 'payables',
      title: 'Cuentas por Pagar',
      description: 'Gestión de pagos a proveedores y técnicos',
      icon: Receipt,
      features: ['Pagos programados', 'Proveedores registrados', 'Historial de pagos', 'Alertas de vencimiento'],
      color: '#f59e0b'
    },
    {
      id: 'treasury',
      title: 'Tesorería',
      description: 'Control de flujo de caja y conciliación bancaria',
      icon: DollarSign,
      features: ['Flujo de caja', 'Conciliación bancaria', 'Presupuestos', 'Proyecciones financieras'],
      color: '#8b5cf6'
    },
    {
      id: 'taxes',
      title: 'Impuestos',
      description: 'Cálculo y declaración automática de impuestos',
      icon: Calculator,
      features: ['IVA automático', 'IIBB provincial', 'Declaraciones juradas', 'Calendario fiscal'],
      color: '#ef4444'
    },
    {
      id: 'reports',
      title: 'Reportes Financieros',
      description: 'Análisis de rentabilidad y dashboards ejecutivos',
      icon: BarChart3,
      features: ['Rentabilidad por cliente', 'Análisis por servicio', 'Dashboards en tiempo real', 'Exportación de reportes'],
      color: '#06b6d4'
    }
  ];

  const handleToolClick = (toolId) => {
    onNavigate(toolId);
  };

  return (
    <div className="welcome-module">
      <div className="welcome-header">
        <div className="department-badge">
          <DollarSign size={24} />
          <span>Departamento de Finanzas</span>
        </div>
        <h1 className="welcome-title">
          <span className="app-title-red">JLC</span>
          <span className="app-title-blue"> ERP Finanzas</span>
        </h1>
        <p className="welcome-subtitle">Sistema de Control Financiero y Fiscal</p>
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
            <p>Controlar ingresos, gastos, facturación y cumplimiento fiscal para asegurar la salud financiera de la empresa.</p>
          </div>
        </div>

        <div className="tools-grid">
          {financeTools.map((tool) => (
            <div
              key={tool.id}
              className="tool-card finance-card"
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
            <TrendingUp size={24} />
            <div>
              <h4>Ingresos del Mes</h4>
              <p className="stat-value">$1,250,000</p>
            </div>
          </div>
          <div className="stat-card">
            <PieChart size={24} />
            <div>
              <h4>Facturas Pendientes</h4>
              <p className="stat-value">23</p>
            </div>
          </div>
          <div className="stat-card">
            <Calendar size={24} />
            <div>
              <h4>Vencimientos Hoy</h4>
              <p className="stat-value">5</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FinanceWelcome;