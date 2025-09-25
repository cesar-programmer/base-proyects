/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  BarChart3,
  Calendar,
  Users,
  Bell,
  Settings,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react"
import { Link } from "react-router-dom"
import reportService from "../../services/reportService"

// Componentes reutilizables
const Button = ({ children, className, ...props }) => (
  <button 
    className={`px-4 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ children, className, ...props }) => (
  <div 
    className={`bg-white shadow-lg rounded-lg border border-gray-200 ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Componente de tarjeta de sección administrativa
const AdminSectionCard = ({ title, description, icon: Icon, buttonText, link, buttonAction }) => (
  <Card className="hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-green-500">
    <div className="p-6 pb-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <Icon className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-green-800">{title}</h3>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
    
    <div className="px-6 pb-6">
      {link ? (
        <Link to={link}>
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium focus:ring-green-500"
          >
            {buttonText}
          </Button>
        </Link>
      ) : (
        <Button
          onClick={buttonAction}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium focus:ring-green-500"
        >
          {buttonText}
        </Button>
      )}
    </div>
  </Card>
);

// Componente de progreso de cumplimiento
const ComplianceProgress = ({ item }) => (
  <div className="text-center">
    <div className={`text-4xl font-bold mb-2 ${item.textColor}`}>
      {item.percentage}%
    </div>
    <div className="text-sm text-gray-600 mb-3">{item.label}</div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`${item.color} h-2 rounded-full transition-all duration-500`}
        style={{ width: `${item.percentage}%` }}
      ></div>
    </div>
  </div>
);



// Componente de reporte pendiente
const PendingReportItem = ({ report }) => (
  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
    <div className="flex items-center gap-3">
      <BarChart3 className="h-5 w-5 text-blue-500" />
      <div>
        <div className="font-medium text-gray-900">{report.docenteNombre || 'Docente'}</div>
        <div className="text-sm text-gray-600">{report.titulo || 'Reporte de actividades'}</div>
      </div>
    </div>
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
      {report.estado || 'Pendiente'}
    </span>
  </div>
);



// Componente de encabezado del dashboard
const DashboardHeader = ({ onRefresh, isRefreshing }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="text-center flex-1">
      <h1 className="text-3xl font-bold text-green-800 mb-2">
        Panel de Control del Administrador
      </h1>
    </div>
    <div className="flex items-center gap-2">
      <Button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="bg-green-600 hover:bg-green-700 text-white font-medium focus:ring-green-500 flex items-center gap-2"
      >
        <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Actualizando...' : 'Refrescar Datos'}
      </Button>
    </div>
  </div>
);





// Componente de sección de cumplimiento de reportes
const ReportComplianceSection = ({ data = [] }) => {
  // Validación adicional para asegurar que data sea un array
  const safeData = Array.isArray(data) ? data : [];
  
  return (
    <Card>
      <div className="p-6 pb-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Resumen de Reportes Completos
        </h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {safeData.map((item, index) => (
            <ComplianceProgress key={index} item={item} />
          ))}
        </div>
      </div>
    </Card>
  );
};

// Componente de sección de reportes pendientes
const PendingReportsSection = ({ reports = [] }) => (
  <Card>
    <div className="p-6 pb-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
        <BarChart3 className="h-6 w-6" />
        Reportes Pendientes de Revisión
      </h2>
    </div>
    
    <div className="p-6">
      <div className="space-y-4">
        {reports.length > 0 ? (
          reports.map((report, index) => (
            <PendingReportItem key={index} report={report} />
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            No hay reportes pendientes de revisión
          </div>
        )}
      </div>
    </div>
  </Card>
);



// Componente de pie de página
const DashboardFooter = () => (
  <div className="text-center py-6 border-t border-green-200 bg-green-800 text-white rounded-lg">
    <p className="text-sm">
      © 2023 Universidad Autónoma de Baja California. Todos los derechos reservados.
    </p>
  </div>
);

const adminSections = [
  {
    title: "Revisión de Reportes",
    description: "Revisa los reportes registrados por los docentes",
    icon: ClipboardList,
    buttonText: "Ver Revisión de Reportes",
    buttonAction: () => {},
    link: "/admin/revision-actividades",
  },
  {
    title: "Reportes y Estadísticas",
    description: "Genera reportes personalizados y visualiza estadísticas",
    icon: BarChart3,
    buttonText: "Ver Reportes y Estadísticas",
    buttonAction: () => {},
    link: "/admin/estadisticas",
  },
  {
    title: "Configuración de Fechas",
    description: "Establece las fechas límite para actividades",
    icon: Calendar,
    buttonText: "Configurar Fechas",
    buttonAction: () => {},
    link: "/admin/configuracion-fechas",
  },
  {
    title: "Gestión de Usuarios",
    description: "Administra usuarios y asigna permisos",
    icon: Users,
    buttonText: "Gestionar Usuarios",
    buttonAction: () => {},
    link: "/admin/gestion-usuarios",
  },
  {
    title: "Configuración de Recordatorios",
    description: "Configura recordatorios automáticos para los docentes",
    icon: Bell,
    buttonText: "Configurar Recordatorios",
    buttonAction: () => {},
    link: "/admin/configuracion-recordatorio",
  },
  {
    title: "Revisión de Actividades",
    description: "Revisa las actividades registradas por los docentes de manera centralizada",
    icon: RefreshCcw,
    buttonText: "Ver Revisión de Actividades",
    buttonAction: () => {},
    link: "/admin/revision-reportes",
  },
];

// Componente principal
export default function AdminDashboard() {
  const [reportComplianceData, setReportComplianceData] = useState([])
  const [pendingReports, setPendingReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async (isManualRefresh = false) => {
    console.log('🚀 AdminDashboard: Iniciando fetchDashboardData...');
    
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      // Obtener reportes pendientes para el dashboard
      console.log('📊 AdminDashboard: Obteniendo reportes pendientes...');
      const pendingReportsResponse = await reportService.getPendingReportsForDashboard();
      console.log('📊 AdminDashboard: Reportes pendientes:', pendingReportsResponse);
      setPendingReports(pendingReportsResponse);
      
      // Obtener estadísticas de reportes
      console.log('📈 AdminDashboard: Obteniendo estadísticas de reportes...');
      const reportStatsResponse = await reportService.getReportStats();
      console.log('📈 AdminDashboard: Estadísticas de reportes:', reportStatsResponse);
      
      // Transformar estadísticas de reportes
      const transformedReportData = [
        { 
          label: "Reportes Aprobados", 
          percentage: reportStatsResponse?.porcentajes?.completados || 0, 
          color: "bg-green-500", 
          textColor: "text-green-600",
          count: reportStatsResponse?.completados || 0
        },
        { 
          label: "Reportes Pendientes", 
          percentage: reportStatsResponse?.porcentajes?.pendientes || 0, 
          color: "bg-yellow-500", 
          textColor: "text-yellow-600",
          count: reportStatsResponse?.pendientes || 0
        },
        { 
          label: "Reportes Devueltos", 
          percentage: reportStatsResponse?.porcentajes?.devueltos || 0, 
          color: "bg-red-500", 
          textColor: "text-red-600",
          count: reportStatsResponse?.devueltos || 0
        },
      ];
      
      console.log('📊 AdminDashboard: transformedReportData:', transformedReportData);
      setReportComplianceData(transformedReportData);
      
    } catch (err) {
      console.error('❌ AdminDashboard: Error al cargar datos del dashboard:', err);
      setError('Error al cargar los datos del dashboard');
      setPendingReports([]);
      setReportComplianceData([
        { label: "Reportes Aprobados", percentage: 0, color: "bg-green-500", textColor: "text-green-600", count: 0 },
        { label: "Reportes Pendientes", percentage: 0, color: "bg-yellow-500", textColor: "text-yellow-600", count: 0 },
        { label: "Reportes Devueltos", percentage: 0, color: "bg-red-500", textColor: "text-red-600", count: 0 },
      ]);
    } finally {
      if (isManualRefresh) {
        setIsRefreshing(false);
      } else {
        setLoading(false);
      }
      console.log('🏁 AdminDashboard: fetchDashboardData completado');
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchDashboardData();
  }, []);



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Cargando dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="lg:col-span-1">
            <ReportComplianceSection data={reportComplianceData} />
          </div>
          <div>
            <PendingReportsSection reports={pendingReports} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {adminSections.map((section, index) => (
            <AdminSectionCard key={index} {...section} />
          ))}
        </div>
        
        <DashboardFooter />
      </div>
    </div>
  );
}