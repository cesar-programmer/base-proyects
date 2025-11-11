/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Calendar, FileText, ClipboardList, Bell, Activity, CheckCircle, Clock, BarChart3 } from "lucide-react"
import { Link } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import activityService from '../../services/activityService';
import reportService from '../../services/reportService';
import { fechaLimiteService } from '../../services/fechaLimiteService';
import { toast } from 'react-toastify';

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

// Componente de tarjeta de estadísticas
const StatsCard = ({ title, value, icon: Icon, color = "green" }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
      </div>
      <div className={`p-3 bg-${color}-100 rounded-full`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
    </div>
  </Card>
);

// Componente de tarjeta de sección docente
const DocenteSectionCard = ({ section }) => (
  <Card className="hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-green-500">
    <div className="p-6 pb-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <section.icon className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-green-800">{section.title}</h3>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2">{section.description}</p>
    </div>
    <div className="p-6 pt-0">
      {section.Link ? (
        <Link 
          to={section.Link}
          className="w-full bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 px-4 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-block text-center"
        >
          {section.buttonText}
        </Link>
      ) : (
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white focus:ring-green-500">
          {section.buttonText}
        </Button>
      )}
    </div>
  </Card>
);

// Componente de encabezado del dashboard
const DashboardHeader = () => (
  <div className="text-center">
    <h1 className="text-3xl font-bold text-green-800 mb-2">
      Panel de Control del Docente
    </h1>
    <p className="text-green-600">Gestiona tus actividades académicas y reportes.</p>
  </div>
);

// Componente de tarjeta de resumen de actividades
const ActivitySummaryCard = ({ item }) => (
  <div className="text-center p-4">
    <div className={`text-4xl font-bold mb-2 ${item.color}`}>{item.count}</div>
    <div className="text-sm text-gray-600">{item.label}</div>
  </div>
);

// Componente de elemento de recordatorio
const ReminderItem = ({ reminder }) => (
  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors duration-200">
    <span className="text-gray-900 font-medium">{reminder.task}</span>
    <span className="text-green-600 font-medium">{reminder.date}</span>
  </div>
);

// Datos de las secciones del dashboard
const docenteSections = [
  {
    title: "Actividades Planificadas",
    description: "Organiza las actividades para el semestre",
    icon: Calendar,
    buttonText: "Ir a Actividades Planificadas",
    Link: "/docente/actividades-planificadas",
  },
  {
    title: "Actividades Realizadas", 
    description: "Registra las actividades que has completado",
    icon: FileText,
    buttonText: "Ir a Actividades Realizadas",
    Link: "/docente/historial-reportes",
  },
  {
    title: "Reportes Pendientes",
    description: "Revisa y envía los reportes pendientes", 
    icon: ClipboardList,
    buttonText: "Ver Reportes Pendientes",
    Link: "/docente/reportes-pendientes",
  },
  {
    title: "Mis Actividades (Período Activo)",
    description: "Consulta tus actividades ligadas al período actual",
    icon: Activity,
    buttonText: "Ver Mis Actividades",
    Link: "/docente/mis-actividades-periodo",
  },
];

// Componente principal
export default function DocenteDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    actividadesPlanificadas: 0,
    reportesCompletados: 0,
    reportesEnRevision: 0,
    progresoGeneral: 0
  });
  const [loading, setLoading] = useState(true);
  const [upcomingReminders, setUpcomingReminders] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Cargar actividades del docente del período académico activo
      let activities = [];
      try {
        console.log('📊 [Dashboard] Cargando actividades del período activo para usuario:', user.id);
        const activitiesResponse = await activityService.getActivitiesByUserCurrentPeriod(user.id);
        console.log('📊 [Dashboard] Respuesta de actividades:', activitiesResponse);
        
        const rawActivities = Array.isArray(activitiesResponse?.data)
          ? activitiesResponse.data
          : (Array.isArray(activitiesResponse) ? activitiesResponse : (Array.isArray(activitiesResponse?.items) ? activitiesResponse.items : []));
        activities = rawActivities;
        console.log('📊 [Dashboard] Total de actividades cargadas:', activities.length);
        console.log('📊 [Dashboard] Actividades:', activities);
      } catch (errActivitiesPeriod) {
        console.warn('⚠️ [Dashboard] Fallo al obtener actividades del período activo:', errActivitiesPeriod);
        const fallbackActivitiesResponse = await activityService.getActivitiesByTeacher(user.id);
        activities = Array.isArray(fallbackActivitiesResponse?.data) ? fallbackActivitiesResponse.data : [];
        console.log('📊 [Dashboard] Actividades fallback:', activities.length);
      }
      
      // Cargar reportes del docente, filtrando por período activo si está disponible
      let periodoActivoId = null;
      try {
        const deadlineResp = await reportService.getDeadlineInfo();
        const info = deadlineResp?.data || deadlineResp;
        periodoActivoId = info?.periodoActivoId || null;
        console.log('📊 [Dashboard] Período activo ID:', periodoActivoId);
      } catch (_) {
        console.warn('⚠️ [Dashboard] No se pudo obtener período activo');
      }
      
      console.log('📊 [Dashboard] Cargando reportes del docente...');
      const reportsResponse = await reportService.getReportsByTeacher(
        user.id,
        periodoActivoId ? { periodoAcademicoId: periodoActivoId } : {}
      );
      const reports = Array.isArray(reportsResponse?.data) ? reportsResponse.data : [];
      console.log('📊 [Dashboard] Total de reportes cargados:', reports.length);
      console.log('📊 [Dashboard] Reportes:', reports);

      // Cargar fechas límite próximas (recordatorios reales)
      try {
        const fechasResp = await fechaLimiteService.getFechasLimiteProximas(14);
        const fechasList = Array.isArray(fechasResp?.data) ? fechasResp.data : (Array.isArray(fechasResp) ? fechasResp : []);
        const reminders = fechasList.map((f) => ({
          task: f.nombre || 'Fecha límite',
          date: new Date(f.fecha_limite || f.fechaLimite).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })
        }));
        setUpcomingReminders(reminders);
      } catch (errFechas) {
        console.warn('⚠️ [Dashboard] No se pudieron cargar las fechas límite próximas:', errFechas);
        setUpcomingReminders([]);
      }
      
      // Calcular estadísticas
      // ACTIVIDADES PLANIFICADAS: Total de actividades del período (todas las que tiene)
      const actividadesPlanificadas = activities.length;
      
      // REPORTES COMPLETADOS: Estado "aprobado" o "completado"
      const reportesCompletados = reports.filter(r => {
        const estado = (r.estado_reporte || r.estado || '').toLowerCase();
        return estado === 'aprobado' || estado === 'completado';
      }).length;
      
      // REPORTES EN REVISIÓN: Estado "en_revision", "enviado", "revisado"
      const reportesEnRevision = reports.filter(r => {
        const estado = (r.estado_reporte || r.estado || '').toLowerCase();
        return estado === 'en_revision' || estado === 'enviado' || estado === 'revisado';
      }).length;
      
      // PROGRESO GENERAL: Porcentaje basado en reportes completados vs total
      const progresoGeneral = reports.length > 0 
        ? Math.round((reportesCompletados / reports.length) * 100) 
        : 0;
      
      console.log('📊 [Dashboard] Estadísticas calculadas:', {
        actividadesPlanificadas,
        reportesCompletados,
        reportesEnRevision,
        progresoGeneral
      });
      
      setStats({
        actividadesPlanificadas,
        reportesCompletados,
        reportesEnRevision,
        progresoGeneral
      });
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      toast.error('Error al cargar datos del dashboard');
      // Establecer valores por defecto en caso de error
      setStats({
        actividadesPlanificadas: 0,
        reportesCompletados: 0,
        reportesEnRevision: 0,
        progresoGeneral: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Datos del resumen de actividades
  const activitySummary = [
    { count: stats.actividadesPlanificadas, label: "Actividades Planificadas", color: "text-blue-600" },
    { count: stats.reportesCompletados, label: "Actividades Completadas", color: "text-green-600" },
    { count: stats.reportesEnRevision, label: "Reportes en Revisión", color: "text-orange-600" },
  ];

  // Próximos recordatorios
  // Se obtienen desde el backend en loadDashboardData; si no hay, se muestra vacío

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            Panel de Control del Docente
          </h1>
          <p className="text-green-600">Bienvenido, {user?.nombre || 'Docente'}. Gestiona tus actividades académicas y reportes.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard 
            title="Actividades Planificadas"
            value={stats.actividadesPlanificadas}
            icon={Calendar}
            color="blue"
          />
          <StatsCard 
            title="Reportes Completados"
            value={stats.reportesCompletados}
            icon={CheckCircle}
            color="green"
          />
          <StatsCard 
            title="Reportes en Revisión"
            value={stats.reportesEnRevision}
            icon={Clock}
            color="yellow"
          />
          <StatsCard 
            title="Progreso General"
            value={`${stats.progresoGeneral}%`}
            icon={BarChart3}
            color="purple"
          />
        </div>

        {/* Secciones principales del dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {docenteSections.map((section, index) => (
            <DocenteSectionCard key={index} section={section} />
          ))}
        </div>

        {/* Resumen de Actividades */}
        <Card>
          <div className="p-6 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-green-800">Resumen de Actividades</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activitySummary.map((item, index) => (
                <ActivitySummaryCard key={index} item={item} />
              ))}
            </div>
          </div>
        </Card>

        {/* Próximos Recordatorios */}
        <Card>
          <div className="p-6 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-green-800 flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Próximos Recordatorios
            </h2>
          </div>
          <div className="p-6">
            {upcomingReminders?.length > 0 ? (
              <div className="space-y-4">
                {upcomingReminders.map((reminder, index) => (
                  <ReminderItem key={index} reminder={reminder} />
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No hay recordatorios próximos.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}