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
import activityService from "../../services/activityService"
import { useStats } from "../../context/StatsContext"

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

// Componente de actividad pendiente
const PendingActivityItem = ({ activity }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
    <div className="flex items-center gap-3">
      <AlertTriangle className="h-5 w-5 text-orange-500" />
      <div>
        <div className="font-medium text-gray-900">{activity.name}</div>
        <div className="text-sm text-gray-600">{activity.activity}</div>
      </div>
    </div>
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
      Pendiente
    </span>
  </div>
);

// Componente de encabezado del dashboard
const DashboardHeader = () => (
  <div className="text-center">
    <h1 className="text-3xl font-bold text-green-800 mb-2">
      Panel de Control del Administrador
    </h1>
  </div>
);

// Componente de sección de cumplimiento
const ComplianceSection = ({ data = [] }) => (
  <Card>
    <div className="p-6 pb-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-green-800 flex items-center gap-2">
        <CheckCircle className="h-6 w-6" />
        Resumen de Cumplimiento
      </h2>
    </div>
    
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((item, index) => (
          <ComplianceProgress key={index} item={item} />
        ))}
      </div>
    </div>
  </Card>
);

// Componente de sección de actividades pendientes
const PendingActivitiesSection = ({ activities = [] }) => (
  <Card>
    <div className="p-6 pb-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-green-800 flex items-center gap-2">
        <Clock className="h-6 w-6" />
        Actividades Pendientes de Revisión
      </h2>
    </div>
    
    <div className="p-6">
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <PendingActivityItem key={index} activity={activity} />
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            No hay actividades pendientes de revisión
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
    title: "Revisión de Actividades",
    description: "Revisa las actividades registradas por los docentes",
    icon: ClipboardList,
    buttonText: "Ver Revisión de Actividades",
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
    title: "Correcciones Pendientes",
    description: "Consulta formularios devueltos para seguimiento y control",
    icon: RefreshCcw,
    buttonText: "Ver Correcciones",
    buttonAction: () => {},
    link: "/admin/correcciones",
  },
];

// Componente principal
export default function AdminDashboard() {
  const [complianceData, setComplianceData] = useState([]);
  const [pendingActivities, setPendingActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Usar StatsContext
  const { stats: contextStats, loading: contextLoading, error: contextError } = useStats();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        console.log('🔄 AdminDashboard: Iniciando fetchDashboardData...');
        console.log('📊 AdminDashboard: contextStats disponible:', !!contextStats);
        console.log('📊 AdminDashboard: contextLoading:', contextLoading);
        console.log('📊 AdminDashboard: contextError:', contextError);
        
        let statsResponse;
        
        // Intentar usar datos del contexto primero
        if (contextStats && !contextLoading && !contextError) {
          console.log('✅ AdminDashboard: Usando datos del contexto');
          console.log('📋 AdminDashboard: contextStats:', contextStats);
          statsResponse = contextStats;
        } else {
          console.log('⚠️ AdminDashboard: Contexto no disponible, usando llamada directa');
          // Fallback: llamada directa al servicio
          const directResponse = await activityService.getActivityStatsByStatus();
          console.log('📡 AdminDashboard: Respuesta directa:', directResponse);
          statsResponse = directResponse.data || directResponse;
        }
        
        console.log('📊 AdminDashboard: statsResponse final:', statsResponse);
        console.log('📊 AdminDashboard: porcentajes:', statsResponse?.porcentajes);
        console.log('📊 AdminDashboard: conteos:', statsResponse?.conteos);
        
        // Transformar datos para el componente de compliance
        const transformedComplianceData = [
          { 
            label: "Actividades Completadas", 
            percentage: statsResponse?.porcentajes?.completadas || 0, 
            color: "bg-green-500", 
            textColor: "text-green-600",
            count: statsResponse?.conteos?.completadas || 0
          },
          { 
            label: "Actividades Pendientes", 
            percentage: statsResponse?.porcentajes?.pendientes || 0, 
            color: "bg-orange-500", 
            textColor: "text-orange-600",
            count: statsResponse?.conteos?.pendientes || 0
          },
          { 
            label: "Actividades Atrasadas", 
            percentage: statsResponse?.porcentajes?.atrasadas || 0, 
            color: "bg-red-500", 
            textColor: "text-red-600",
            count: statsResponse?.conteos?.atrasadas || 0
          },
        ];
        
        console.log('📈 AdminDashboard: transformedComplianceData:', transformedComplianceData);
        setComplianceData(transformedComplianceData);
        
        // Obtener actividades pendientes de revisión
        console.log('📋 AdminDashboard: Obteniendo actividades pendientes...');
        const pendingResponse = await activityService.getPendingActivitiesForDashboard(5);
        console.log('📋 AdminDashboard: Actividades pendientes:', pendingResponse);
        setPendingActivities(pendingResponse);
        
      } catch (err) {
        console.error('❌ AdminDashboard: Error al cargar datos del dashboard:', err);
        setError('Error al cargar los datos del dashboard');
        
        // Datos de fallback en caso de error
        setComplianceData([
          { label: "Actividades Completadas", percentage: 0, color: "bg-green-500", textColor: "text-green-600", count: 0 },
          { label: "Actividades Pendientes", percentage: 0, color: "bg-orange-500", textColor: "text-orange-600", count: 0 },
          { label: "Actividades Atrasadas", percentage: 0, color: "bg-red-500", textColor: "text-red-600", count: 0 },
        ]);
        setPendingActivities([]);
      } finally {
        setLoading(false);
        console.log('🏁 AdminDashboard: fetchDashboardData completado');
      }
    };

    fetchDashboardData();
  }, [contextStats, contextLoading, contextError]);

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
        <DashboardHeader />
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ComplianceSection data={complianceData} />
          </div>
          <div>
            <PendingActivitiesSection activities={pendingActivities} />
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