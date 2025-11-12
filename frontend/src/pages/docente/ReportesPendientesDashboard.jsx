/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import {
  Search,
  MoreVertical,
  Eye,
  Send,
  Edit3,
  RotateCcw,
  Download,
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  X
} from "lucide-react"
import { useAuth } from '../../context/AuthContext'
import reportService from '../../services/reportService';
import { toast } from 'react-toastify'
import ModalCrearReporte from '../../components/ModalCrearReporte';
import ListaArchivosReporte from '../../components/ListaArchivosReporte';

// Componentes reutilizables
const Button = ({ children, className = "", variant = "default", disabled = false, ...props }) => {
  const baseClasses = "px-4 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variants = {
    default: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-300",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-300"
  }
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

const Card = ({ children, className = "", ...props }) => (
  <div 
    className={`bg-white rounded-lg border shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
)

function currentSemesterFor(date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const half = month <= 6 ? 1 : 2
  return `${year}-${half}`
}

function StatusBadge({ estado }) {
  if (estado === "Pendiente") {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
        Pendiente
      </span>
    )
  }
  if (estado === "En revisión") {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
        En revisión
      </span>
    )
  }
  if (estado === "Completado") {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
        Completado
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
      <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
      Devuelto
    </span>
  )
}

function TypeIcon({ tipo }) {
  switch (tipo) {
    case "Investigación":
      return <TrendingUp className="w-4 h-4 text-purple-600" />
    case "Docencia":
      return <FileText className="w-4 h-4 text-blue-600" />
    case "TUTORIAS":
      return <Clock className="w-4 h-4 text-green-600" />
    case "GESTION_ACADEMICA":
      return <Calendar className="w-4 h-4 text-orange-600" />
    case "EXTENSION":
      return <Clock className="w-4 h-4 text-emerald-600" />
    case "CAPACITACION":
      return <CheckCircle2 className="w-4 h-4 text-cyan-600" />
    default:
      return <FileText className="w-4 h-4 text-gray-600" />
  }
}

function Modal({ isOpen, onClose, children, title, description }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-green-200">
          <div>
            <h2 className="text-2xl font-bold text-green-800">{title}</h2>
            {description && <p className="text-green-600 mt-1">{description}</p>}
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            className="p-2 hover:bg-gray-100 bg-transparent border-0 focus:ring-gray-300 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function DropdownMenu({ trigger, children, isOpen, onToggle }) {
  return (
    <div className="relative">
      <Button onClick={onToggle} variant="ghost" className="p-2 hover:bg-gray-100 bg-transparent border-0 focus:ring-gray-300 rounded">
        {trigger}
      </Button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={onToggle} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              {children}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function DropdownMenuItem({ onClick, children, className = "" }) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center bg-transparent border-0 rounded-none focus:ring-gray-300 ${className}`}
    >
      {children}
    </Button>
  )
}

// Componente de encabezado del dashboard
const DashboardHeader = ({ semestre, fechaLimite }) => (
  <div className="text-center">
    <h1 className="text-3xl font-bold text-green-800 mb-2">
      Reportes Pendientes
    </h1>
    <p className="text-green-600 max-w-2xl mx-auto mb-4">
      Gestiona y completa tus reportes académicos pendientes de manera eficiente
    </p>
    <div className="flex justify-center items-center gap-6 text-sm">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
        !semestre || semestre === "N/A" 
          ? "bg-gray-50 border-gray-200" 
          : "bg-green-50 border-green-200"
      }`}>
        <Calendar className={`w-4 h-4 ${
          !semestre || semestre === "N/A" ? "text-gray-400" : "text-green-600"
        }`} />
        <span className={`font-medium ${
          !semestre || semestre === "N/A" ? "text-gray-500" : "text-green-800"
        }`}>
          Semestre: {!semestre || semestre === "N/A" ? "No hay semestre activo" : semestre}
        </span>
      </div>
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
        !fechaLimite || fechaLimite === "N/A" 
          ? "bg-gray-50 border-gray-200" 
          : "bg-amber-50 border-amber-200"
      }`}>
        <Clock className={`w-4 h-4 ${
          !fechaLimite || fechaLimite === "N/A" ? "text-gray-400" : "text-amber-600"
        }`} />
        <span className={`font-medium ${
          !fechaLimite || fechaLimite === "N/A" ? "text-gray-500" : "text-amber-800"
        }`}>
          Fecha límite: {!fechaLimite || fechaLimite === "N/A" ? "Sin fecha límite" : fechaLimite}
        </span>
      </div>
    </div>
  </div>
);

// Componente de tarjeta de estadísticas
const StatsCard = ({ stat, icon: Icon }) => (
  <Card className="hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-green-500">
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
          <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
        <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${stat.color}`} />
        </div>
      </div>
    </div>
  </Card>
);

// Componente de filtros de búsqueda
const SearchFilters = ({ busqueda, setBusqueda, tipoFiltro, setTipoFiltro, estadoFiltro, setEstadoFiltro }) => (
  <Card>
    <div className="p-6 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por título, tipo o estado"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <select
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">Todos los tipos</option>
          <option value="DOCENCIA">DOCENCIA</option>
          <option value="TUTORIAS">TUTORIAS</option>
          <option value="GESTION_ACADEMICA">GESTION_ACADEMICA</option>
          <option value="INVESTIGACION">INVESTIGACION</option>
          <option value="EXTENSION">EXTENSION</option>
          <option value="CAPACITACION">CAPACITACION</option>
          <option value="ADMINISTRATIVA">ADMINISTRATIVA</option>
          <option value="POSGRADO">POSGRADO</option>
          <option value="OTRA">OTRA</option>
        </select>
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En revisión">En revisión</option>
          <option value="Devuelto">Devuelto</option>
        </select>
      </div>
    </div>
  </Card>
);

// Componente ReportDetailDialog recreado con Tailwind
function ReportDetailDialog({ 
  open, 
  onOpenChange, 
  report, 
  showObservationsTab = false, 
  footer,
  semestreActual,
  fechaLimiteActual
}) {
  const [activeTab, setActiveTab] = useState("actividades")

  // Total de horas registradas: usa valor del backend si existe,
  // si el total es 0 o no viene, suma horas dedicadas por actividad
  const getHorasActividad = (a) => {
    const raw = a?.horas_dedicadas ?? a?.horasDedicadas ?? a?.horas ?? null;
    const num = raw != null ? Number(raw) : 0;
    return isNaN(num) ? 0 : num;
  };

  const sumHorasActividades = Array.isArray(report?.actividades)
    ? report.actividades.reduce((sum, a) => sum + getHorasActividad(a), 0)
    : 0;

  const totalBackendRaw = report?.totalHoras ?? report?.total_horas;
  const horasRegistradas = (totalBackendRaw != null && Number(totalBackendRaw) > 0)
    ? Number(totalBackendRaw)
    : Number(sumHorasActividades);

  if (!open || !report) return null

  return (
    <Modal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Detalle del reporte"
      description="Vista detallada del reporte del semestre actual"
    >
      <div className="space-y-6">
        {/* Report Header */}
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{report.titulo}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Tipo de Reporte:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <TypeIcon tipo={report.tipo} />
                    <span className="font-semibold text-gray-900">{report.tipo}</span>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Semestre:</span>
                  <p className="font-semibold text-gray-900 mt-1">{semestreActual || report.semestre}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Fecha límite:</span>
                  <p className="font-semibold text-gray-900 mt-1">{fechaLimiteActual || report.fechaLimite || "N/A"}</p>
                </div>
              </div>
            </div>
            <div className="ml-4">
              <StatusBadge estado={report.estado} />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Actividades Registradas</p>
                <p className="text-2xl font-bold text-blue-600">{report.actividades?.length || 0}</p>
                <p className="text-xs text-gray-500">Total en el período</p>
              </div>
            </div>
          </div>


          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Horas Registradas</p>
                <p className="text-2xl font-bold text-purple-600">{horasRegistradas}</p>
                <p className="text-xs text-gray-500">Horas académicas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="w-full">
          <div className="flex border-b border-gray-200 bg-gray-100 rounded-t-lg">
            <button
              onClick={() => setActiveTab("actividades")}
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                activeTab === "actividades"
                  ? "bg-white text-green-700 border-b-2 border-green-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Actividades Registradas
            </button>
            <button
              onClick={() => setActiveTab("resumen")}
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                activeTab === "resumen"
                  ? "bg-white text-green-700 border-b-2 border-green-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Resumen Ejecutivo
            </button>
            <button
              onClick={() => setActiveTab("documentos")}
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                activeTab === "documentos"
                  ? "bg-white text-green-700 border-b-2 border-green-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Documentos Adjuntos
            </button>
            {showObservationsTab && (
              <button
                onClick={() => setActiveTab("observaciones")}
                className={`flex-1 py-2 px-4 text-sm font-medium ${
                  activeTab === "observaciones"
                    ? "bg-white text-green-700 border-b-2 border-green-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Observaciones
              </button>
            )}
          </div>

          <div className="mt-4">
            {activeTab === "actividades" && (
              <div className="bg-white rounded-lg border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Actividades del Período</h3>
                </div>
                <div className="p-6 space-y-4">
                  {report.actividades && report.actividades.length > 0 ? (
                    report.actividades.map((a) => (
                      <div
                        key={a.id}
                        className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${
                          a.estado_realizado === "COMPLETADA"
                            ? "bg-green-50 border-l-green-500"
                            : a.estado_realizado === "EN_PROGRESO"
                              ? "bg-yellow-50 border-l-yellow-500"
                              : "bg-blue-50 border-l-blue-500"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              a.estado_realizado === "COMPLETADA"
                                ? "bg-green-500"
                                : a.estado_realizado === "EN_PROGRESO"
                                  ? "bg-yellow-500"
                                  : "bg-blue-500"
                            }`}
                          >
                            {a.estado_realizado === "COMPLETADA" ? (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            ) : a.estado_realizado === "EN_PROGRESO" ? (
                              <Clock className="w-4 h-4 text-white" />
                            ) : (
                              <Calendar className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900 block">{a.titulo}</span>
                            {a.descripcion && <span className="text-sm text-gray-600">{a.descripcion}</span>}
                            {a.categoria && (
                              <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                {a.categoria}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-sm font-medium block ${
                              a.estado_realizado === "COMPLETADA"
                                ? "text-green-600"
                                : a.estado_realizado === "EN_PROGRESO"
                                  ? "text-yellow-600"
                                  : "text-blue-600"
                            }`}
                          >
                            {a.estado_realizado === "COMPLETADA" ? "Completada" : 
                             a.estado_realizado === "EN_PROGRESO" ? "En Progreso" : "Planificada"}
                          </span>
                          <div className="mt-1 space-x-2">
                            <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                              <Clock className="w-3 h-3" /> {getHorasActividad(a)}h dedicadas
                            </span>
                          </div>
                          {a.fechaInicio && (
                            <span className="text-xs text-gray-500 block mt-1">
                              {new Date(a.fechaInicio).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No hay actividades registradas en este reporte</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "resumen" && (
              <div className="bg-white rounded-lg border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Resumen Ejecutivo del Período</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="prose max-w-none">
                    {report.resumenEjecutivo ? (
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {report.resumenEjecutivo}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No hay resumen ejecutivo disponible para este reporte.</p>
                        <p className="text-sm mt-1">El resumen ejecutivo se puede agregar al editar el reporte.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "documentos" && (
              <div className="bg-white rounded-lg border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Documentos de Respaldo</h3>
                </div>
                <div className="p-6">
                  <ListaArchivosReporte 
                    archivos={report.archivos || []} 
                    titulo="Archivos adjuntos"
                  />
                </div>
              </div>
            )}

            {activeTab === "observaciones" && showObservationsTab && (
              <div className="bg-white rounded-lg border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Observaciones del Administrador</h3>
                </div>
                <div className="p-6">
                  {report.comentariosRevision ? (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                      <p className="text-sm text-red-800">{report.comentariosRevision}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">Sin observaciones del administrador.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer con acciones */}
        {footer && (
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default function PendingReports() {
  const { user } = useAuth();
  const [semestreActual, setSemestreActual] = useState(currentSemesterFor());
  const [fechaLimiteActual, setFechaLimiteActual] = useState("N/A");
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("all");
  const [estadoFiltro, setEstadoFiltro] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportes, setReportes] = useState([]);
  const [periodoActivoId, setPeriodoActivoId] = useState(null);

  useEffect(() => {
    loadReports();
    loadDeadlineInfo();
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      loadReports();
    }
  }, [periodoActivoId]);

  const loadReports = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const options = {};
      if (periodoActivoId) options.periodoAcademicoId = periodoActivoId;
      const response = await reportService.getReportsByTeacher(user.id, options);
      console.log('Respuesta completa de reportes (filtrada por período si aplica):', response);
      
      // Asegurar que siempre sea un array
      const reportsData = response?.data || response || [];
      console.log('Datos de reportes extraídos:', reportsData);
      
      // Log de los estados de cada reporte
      if (Array.isArray(reportsData)) {
        reportsData.forEach((reporte, index) => {
          console.log(`Reporte ${index + 1}:`, {
            id: reporte.id,
            titulo: reporte.titulo,
            estado: reporte.estado,
            tipo: reporte.tipo
          });
        });
      }
      
      setReportes(Array.isArray(reportsData) ? reportsData : []);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
      toast.error('Error al cargar reportes: ' + error.message);
      setReportes([]); // Asegurar que sea un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const loadDeadlineInfo = async () => {
    try {
      console.log('🔍 [ReportesPendientes] Iniciando carga de fecha límite de ENTREGA...');
      // Usar el endpoint /deadline/info que ya busca fechas de categoría ENTREGA
      const response = await reportService.getDeadlineInfo();
      console.log('📋 [ReportesPendientes] Respuesta RAW de getDeadlineInfo:', response);
      console.log('📋 [ReportesPendientes] response.data:', response.data);
      
      // Los datos están en response.data
      const deadlineInfo = response.data || response;
      console.log('📋 [ReportesPendientes] deadlineInfo extraído:', deadlineInfo);
      
      if (deadlineInfo.semestre && deadlineInfo.semestre !== "N/A") {
        console.log('✅ [ReportesPendientes] Estableciendo semestre:', deadlineInfo.semestre);
        setSemestreActual(deadlineInfo.semestre);
      } else {
        console.log('⚠️ [ReportesPendientes] No hay semestre válido:', deadlineInfo.semestre);
      }
      
      if (deadlineInfo.fechaLimite && deadlineInfo.fechaLimite !== "N/A") {
        console.log('✅ [ReportesPendientes] Fecha límite de entrega recibida:', deadlineInfo.fechaLimite);
        const fechaFormateada = new Date(deadlineInfo.fechaLimite).toLocaleDateString('es-ES', { 
          day: 'numeric', 
          month: 'long' 
        });
        console.log('✅ [ReportesPendientes] Fecha límite de entrega formateada:', fechaFormateada);
        setFechaLimiteActual(fechaFormateada);
      } else {
        console.log('⚠️ [ReportesPendientes] No se recibió fecha límite de entrega válida:', deadlineInfo.fechaLimite);
        setFechaLimiteActual("N/A");
      }
      
      if (deadlineInfo.periodoActivoId) {
        console.log('✅ [ReportesPendientes] Periodo activo ID:', deadlineInfo.periodoActivoId);
        setPeriodoActivoId(deadlineInfo.periodoActivoId);
      }
    } catch (error) {
      console.error('❌ [ReportesPendientes] Error al cargar información de fecha límite de entrega:', error);
      console.error('❌ [ReportesPendientes] Error completo:', error.response?.data || error.message);
      // Mantener los valores por defecto en caso de error
      setFechaLimiteActual("N/A");
    }
  };

  // Mapear los reportes del backend al formato esperado por el frontend
  const mapReporteFromBackend = (reporte) => {
    const estadoMap = {
      'borrador': 'Pendiente',
      'enviado': 'En revisión',
      'revisado': 'En revisión',
      'aprobado': 'Completado',
      'rechazado': 'Devuelto',
      'devuelto': 'Devuelto'
    };

    const tipoMap = {
      'ACTIVIDADES_PLANIFICADAS': 'Docencia',
      'ACTIVIDADES_REALIZADAS': 'Docencia',
      'INVESTIGACION': 'Investigación',
      'EXTENSION': 'Extensión',
      'GESTION_ACADEMICA': 'Gestión',
      'TUTORIAS': 'Tutoría',
      'CAPACITACION': 'Capacitación'
    };

    // Acceder al estado correctamente - los datos vienen directamente en reporte.estado
    const estadoOriginal = reporte.estado;
    const estadoMapeado = estadoMap[estadoOriginal] || 'Pendiente';

    return {
      id: reporte.id,
      titulo: reporte.titulo,
      tipo: tipoMap[reporte.tipo] || 'Docencia',
      estado: estadoMapeado,
      fechaLimite: fechaLimiteActual,
      ultimaActualizacion: new Date(reporte.updatedAt || reporte.createdAt).toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long' 
      }),
      semestre: semestreActual,
      resumen: reporte.descripcion,
      descripcion: reporte.descripcion,
      resumenEjecutivo: reporte.resumenEjecutivo,
      comentariosRevision: reporte.comentariosRevision,
      fechaRealizacion: reporte.fechaRealizacion,
      participantesReales: reporte.participantesReales,
      resultados: reporte.resultados,
      observaciones: reporte.observaciones,
      recomendaciones: reporte.recomendaciones,
      actividades: reporte.actividades || [],
      archivos: reporte.archivos || [],
      totalHoras: Number(reporte.total_horas ?? reporte.totalHoras ?? 0)
    };
  };

  const reportesArray = Array.isArray(reportes) ? reportes.map(mapReporteFromBackend) : [];
  // Filtrar reportes completados - solo mostrar pendientes, en revisión y devueltos
  const reportesDelSemestre = reportesArray.filter((r) => r.estado !== "Completado")
  const reportesFiltrados = reportesDelSemestre.filter((r) => {
    const txt = `${r.titulo} ${r.tipo} ${r.estado} ${r.ultimaActualizacion}`.toLowerCase()
    const matchesSearch = txt.includes(busqueda.toLowerCase())
    const matchesTipo = tipoFiltro === "all" || r.tipo === tipoFiltro
    const matchesEstado = estadoFiltro === "all" || r.estado === estadoFiltro
    return matchesSearch && matchesTipo && matchesEstado
  })

  const stats = {
    pendientes: reportesDelSemestre.filter((r) => r.estado === "Pendiente").length,
    revision: reportesDelSemestre.filter((r) => r.estado === "En revisión").length,
    devueltos: reportesDelSemestre.filter((r) => r.estado === "Devuelto").length,
    completados: reportesDelSemestre.filter((r) => r.estado === "Completado").length,
  }

  const [reporteSeleccionado, setReporteSeleccionado] = useState(null)
  const [openDetalle, setOpenDetalle] = useState(false)
  const [openCrearReporte, setOpenCrearReporte] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [openEditarReporte, setOpenEditarReporte] = useState(false)
  const [reporteAEditar, setReporteAEditar] = useState(null)
  const [modoCorreccion, setModoCorreccion] = useState(false) // Para saber si es corrección

  const abrirDetalle = async (rep) => {
    try {
      setDropdownOpen(null)
      // Obtener los datos completos del reporte desde el backend
      const reporteCompleto = await reportService.getReportById(rep.id)
      
      // El backend devuelve { message: '...', data: ... }, no { success: true, data: ... }
      if (reporteCompleto && reporteCompleto.data) {
        console.log('Datos completos del reporte desde backend:', reporteCompleto.data);
        console.log('¿Tiene resumenEjecutivo?', reporteCompleto.data.resumenEjecutivo);
        console.log('¿Tiene archivos adjuntos?', reporteCompleto.data.archivos || reporteCompleto.data.documentos);
        console.log('Todas las propiedades del reporte:', Object.keys(reporteCompleto.data));
        
        // Aplicar el mapeo de estados al reporte del modal también
        const reporteMapeado = mapReporteFromBackend(reporteCompleto.data)
        setReporteSeleccionado(reporteMapeado)
        setOpenDetalle(true)
      } else {
        console.error('Estructura inesperada de respuesta:', reporteCompleto)
        toast.error('Error al cargar los detalles del reporte')
      }
    } catch (error) {
      console.error('Error al obtener detalles del reporte:', error)
      toast.error('Error al cargar los detalles del reporte')
    }
  }

  const abrirCorreccion = async (rep) => {
    try {
      setDropdownOpen(null)
      // Obtener los datos completos del reporte desde el backend (incluyendo actividades)
      const reporteCompleto = await reportService.getReportById(rep.id)
      
      if (reporteCompleto && reporteCompleto.data) {
        console.log('📝 Datos completos del reporte para corrección:', reporteCompleto.data);
        console.log('📋 Actividades del reporte:', reporteCompleto.data.actividades);
        
        // Aplicar el mapeo de estados al reporte
        const reporteMapeado = mapReporteFromBackend(reporteCompleto.data)
        
        // Usar el mismo modal de edición pero en modo corrección
        setReporteAEditar(reporteMapeado)
        setModoCorreccion(true)  // Activar modo corrección para mostrar comentarios
        setOpenEditarReporte(true)
      } else {
        console.error('Estructura inesperada de respuesta:', reporteCompleto)
        toast.error('Error al cargar los datos del reporte para corrección')
      }
    } catch (error) {
      console.error('Error al obtener datos del reporte para corrección:', error)
      toast.error('Error al cargar el reporte para corrección')
    }
  }

  const enviarReporte = async (rep) => {
    if (!rep?.id || enviando) return
    const toastId = toast.loading('Enviando reporte...')
    setEnviando(true)
    try {
      setDropdownOpen(null)
      await reportService.sendReport(rep.id)
      toast.update(toastId, { render: 'Reporte enviado para revisión', type: 'success', isLoading: false, autoClose: 1500 })
      setOpenDetalle(false)
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error('Error al enviar reporte:', error)
      toast.update(toastId, { render: 'Error al enviar el reporte', type: 'error', isLoading: false, autoClose: 3000 })
    } finally {
      setEnviando(false)
    }
  }

  const descargarReportePDF = async (reporte) => {
    try {
      const blob = await reportService.downloadReportPDF(reporte.id)
      
      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Reporte_${reporte.titulo || reporte.id}_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success('Reporte descargado exitosamente')
    } catch (error) {
      console.error('Error al descargar reporte:', error)
      toast.error('Error al descargar el reporte en PDF')
    }
  }

  const abrirEdicionReporte = (rep) => {
    setReporteAEditar(rep)
    setModoCorreccion(false) // Edición normal, no corrección
    setOpenEditarReporte(true)
  }

  // Verificar si ya tiene un reporte aprobado/completado en el período actual
  const tieneReporteAprobado = reportesArray.some(
    (r) => r.estado === "Completado" || r.estado === "completado"
  )

  const statsArray = [
    {
      label: "Pendientes",
      value: stats.pendientes,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      icon: AlertCircle
    },
    {
      label: "En revisión", 
      value: stats.revision,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      icon: Eye
    },
    {
      label: "Completados",
      value: stats.completados,
      color: "text-green-600",
      bgColor: "bg-green-100",
      icon: CheckCircle2
    },
    {
      label: "Devueltos",
      value: stats.devueltos,
      color: "text-red-600", 
      bgColor: "bg-red-100",
      icon: RotateCcw
    },
  ];

  const toggleDropdown = (reporteId) => {
    setDropdownOpen(dropdownOpen === reporteId ? null : reporteId)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardHeader semestre={semestreActual} fechaLimite={fechaLimiteActual} />

        {/* Banner de fecha límite no configurada */}
        {!loading && fechaLimiteActual === "N/A" && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-yellow-800 mb-1">
                  No hay fecha límite de entrega configurada
                </h3>
                <p className="text-sm text-yellow-700">
                  Actualmente no es posible crear reportes porque el administrador no ha configurado una fecha límite de entrega (categoría ENTREGA). 
                  Por favor, contacta al administrador para que configure la fecha límite de entrega de reportes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tarjetas de estado */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsArray.map((stat, index) => (
            <StatsCard key={index} stat={stat} icon={stat.icon} />
          ))}
        </section>

        {/* Filtros de Búsqueda */}
        <SearchFilters 
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          tipoFiltro={tipoFiltro}
          setTipoFiltro={setTipoFiltro}
          estadoFiltro={estadoFiltro}
          setEstadoFiltro={setEstadoFiltro}
        />

        {/* Listado */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Reportes activos ({reportesFiltrados.length})</h3>
            {tieneReporteAprobado ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-300 rounded-md">
                <CheckCircle2 className="w-5 h-5 text-green-700" />
                <span className="text-sm font-medium text-green-800">
                  Ya entregaste tu reporte semestral aprobado
                </span>
              </div>
            ) : (
              <Button 
                onClick={() => setOpenCrearReporte(true)}
                className="flex items-center gap-2"
                disabled={fechaLimiteActual === "N/A"}
                title={fechaLimiteActual === "N/A" ? "No se puede crear reporte sin fecha límite de entrega configurada" : "Crear nuevo reporte"}
              >
                <FileText className="w-4 h-4" />
                Crear Reporte
              </Button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="p-4 text-left text-gray-700 font-medium">Título</th>
                  <th className="p-4 text-left text-gray-700 font-medium">Tipo</th>
                  <th className="p-4 text-left text-gray-700 font-medium">Estado</th>
                  <th className="p-4 text-left text-gray-700 font-medium">Última actualización</th>
                  <th className="p-4 text-left text-gray-700 font-medium">Fecha límite</th>
                  <th className="p-4 text-left text-gray-700 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reportesFiltrados.map((r, idx) => (
                  <tr key={r.id} className={`border-b border-gray-100 ${idx % 2 ? "bg-white" : "bg-gray-50/40"}`}>
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{r.titulo}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{r.resumen}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <TypeIcon tipo={r.tipo} />
                        <span className="text-gray-700">{r.tipo}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge estado={r.estado} />
                    </td>
                    <td className="p-4 text-gray-700">{r.ultimaActualizacion}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        {r.fechaLimite}
                      </span>
                    </td>
                    <td className="p-4">
                      <DropdownMenu
                        trigger={<MoreVertical className="w-4 h-4" />}
                        isOpen={dropdownOpen === r.id}
                        onToggle={() => toggleDropdown(r.id)}
                      >
                        <DropdownMenuItem onClick={() => abrirDetalle(r)}>
                          <Eye className="w-4 h-4 mr-2 text-green-600" />
                          Ver detalles
                        </DropdownMenuItem>

                        {r.estado === "Pendiente" && (
                          <>
                            <DropdownMenuItem onClick={() => abrirEdicionReporte(r)}>
                              <Edit3 className="w-4 h-4 mr-2 text-blue-600" />
                              Editar reporte
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => !enviando && enviarReporte(r)} className={enviando ? 'opacity-50 cursor-not-allowed' : ''}>
                            <Send className="w-4 h-4 mr-2 text-blue-600" />
                            {enviando ? 'Enviando…' : 'Enviar para revisión'}
                          </DropdownMenuItem>
                        </>
                      )}

                      {r.estado === "Devuelto" && (
                        <DropdownMenuItem onClick={() => abrirCorreccion(r)}>
                          <RotateCcw className="w-4 h-4 mr-2 text-red-600" />
                          Corregir y reenviar
                        </DropdownMenuItem>
                      )}                        <DropdownMenuItem onClick={() => descargarReportePDF(r)}>
                          <Download className="w-4 h-4 mr-2 text-gray-600" />
                          Descargar PDF
                        </DropdownMenuItem>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {reportesFiltrados.length === 0 && (
              <div className="py-12 text-center text-gray-500">No hay reportes que coincidan con los filtros.</div>
            )}
          </div>
        </div>

        {/* Modal de detalle del reporte usando el componente ReportDetailDialog */}
        <ReportDetailDialog
          open={openDetalle}
          onOpenChange={setOpenDetalle}
          report={reporteSeleccionado || {
            id: "",
            titulo: "",
            tipo: "Docencia",
            estado: "Pendiente",
            semestre: "",
          }}
          showObservationsTab={true}
          semestreActual={semestreActual}
          fechaLimiteActual={fechaLimiteActual}
          footer={
            <>
              {reporteSeleccionado?.estado === "Pendiente" && (
                <>
                  <Button
                    onClick={() => abrirEdicionReporte(reporteSeleccionado)}
                    variant="outline"
                    className="inline-flex items-center px-4 py-2 border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent rounded-md transition-colors focus:ring-blue-500"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Editar reporte
                  </Button>
                  <Button
                    onClick={() => enviarReporte(reporteSeleccionado)}
                    disabled={enviando}
                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {enviando ? 'Enviando…' : 'Enviar para revisión'}
                  </Button>
                </>
              )}
              {reporteSeleccionado?.estado === "Devuelto" && (
                <Button
                  onClick={() => abrirCorreccion(reporteSeleccionado)}
                  variant="outline"
                  className="inline-flex items-center px-4 py-2 border-red-200 text-red-600 hover:bg-red-50 bg-transparent rounded-md transition-colors focus:ring-red-500"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Corregir y reenviar
                </Button>
              )}
              <Button 
                variant="outline"
                className="inline-flex items-center px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent rounded-md transition-colors focus:ring-gray-300"
                onClick={() => descargarReportePDF(reporteSeleccionado)}
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </Button>
            </>
          }
        />

        {/* Modal para crear reporte */}
        {openCrearReporte && (
          <ModalCrearReporte
            open={openCrearReporte}
            onClose={() => setOpenCrearReporte(false)}
            onReporteCreado={() => {
              setOpenCrearReporte(false);
              // Recargar reportes después de 2 segundos para asegurar que la operación se complete
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }}
          />
        )}

        {/* Modal para editar reporte */}
        {openEditarReporte && reporteAEditar && (
          <ModalCrearReporte
            open={openEditarReporte}
            onClose={() => {
              setOpenEditarReporte(false);
              setReporteAEditar(null);
              setModoCorreccion(false); // Resetear modo corrección
            }}
            onReporteCreado={() => {
              setOpenEditarReporte(false);
              setReporteAEditar(null);
              setModoCorreccion(false); // Resetear modo corrección
              // Recargar reportes después de 2 segundos
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }}
            reporteExistente={reporteAEditar}
            modoEdicion={true}
            modoCorreccion={modoCorreccion} // Pasar el modo corrección
          />
        )}
      </div>
    </main>
  )
}