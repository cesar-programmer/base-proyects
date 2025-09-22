/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import { Search, Eye, Download, MoreVertical, Filter, Calendar, FileText, TrendingUp, Clock, X } from "lucide-react"
import { useAuth } from '../../context/AuthContext'
import reportService from '../../services/reportService';
import { toast } from 'react-hot-toast'

const Report = {
  id: "",
  titulo: "",
  tipo: "",
  estado: "Completado",
  fechaEnvio: "",
  semestre: "",
  descripcion: "",
  fechaCreacion: ""
}

export default function HistorialReportesDashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("activities");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    loadReports();
  }, [user]);

  const loadReports = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const response = await reportService.getReportHistory(user.id);
      setReports(response.data || []);
    } catch (error) {
      toast.error('Error al cargar historial de reportes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const [mockReports] = useState([
    {
      id: "1",
      titulo: "Reporte de Investigación Q1 2024",
      tipo: "Investigación",
      estado: "Completado",
      fechaEnvio: "14 de marzo, 2024",
      semestre: "2024-1",
      descripcion: "Reporte trimestral de actividades de investigación",
      fechaCreacion: "10 de marzo, 2024",
    },
    {
      id: "2",
      titulo: "Actividades de Tutoría Febrero 2024",
      tipo: "Tutoría",
      estado: "En revisión",
      fechaEnvio: "27 de febrero, 2024",
      semestre: "2024-1",
      descripcion: "Informe mensual de actividades de tutoría estudiantil",
      fechaCreacion: "25 de febrero, 2024",
    },
    {
      id: "3",
      titulo: "Informe de Gestión Académica 2023",
      tipo: "Gestión",
      estado: "Completado",
      fechaEnvio: "19 de diciembre, 2023",
      semestre: "2023-2",
      descripcion: "Reporte anual de actividades de gestión académica",
      fechaCreacion: "15 de diciembre, 2023",
    },
    {
      id: "4",
      titulo: "Reporte de Docencia Semestre 2023-2",
      tipo: "Docencia",
      estado: "Completado",
      fechaEnvio: "29 de noviembre, 2023",
      semestre: "2023-2",
      descripcion: "Informe semestral de actividades docentes",
      fechaCreacion: "25 de noviembre, 2023",
    },
    {
      id: "5",
      titulo: "Plan de Investigación 2024",
      tipo: "Investigación",
      estado: "Pendiente",
      fechaEnvio: "09 de enero, 2024",
      semestre: "2024-1",
      descripcion: "Plan anual de proyectos de investigación",
      fechaCreacion: "05 de enero, 2024",
    },
    {
      id: "6",
      titulo: "Evaluación de Cursos Primer Semestre",
      tipo: "Docencia",
      estado: "Completado",
      fechaEnvio: "15 de junio, 2023",
      semestre: "2023-1",
      descripcion: "Evaluación y retroalimentación de cursos impartidos",
      fechaCreacion: "12 de junio, 2023",
    },
    {
      id: "7",
      titulo: "Actividades de Extensión Universitaria",
      tipo: "Extensión",
      estado: "En revisión",
      fechaEnvio: "20 de abril, 2024",
      semestre: "2024-1",
      descripcion: "Reporte de participación en actividades de extensión",
      fechaCreacion: "18 de abril, 2024",
    },
    {
      id: "8",
      titulo: "Capacitación Docente 2024",
      tipo: "CAPACITACION",
      estado: "Pendiente",
      fechaEnvio: "05 de febrero, 2024",
      semestre: "2024-1",
      descripcion: "Informe de cursos de capacitación completados",
      fechaCreacion: "02 de febrero, 2024",
    },
  ])

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.semestre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || report.tipo === filterType
    const matchesStatus = filterStatus === "all" || report.estado === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completado":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Completado
          </span>
        )
      case "En revisión":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            En revisión
          </span>
        )
      case "Pendiente":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
            Pendiente
          </span>
        )
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "Investigación":
        return <TrendingUp className="w-4 h-4 text-purple-600" />
      case "Docencia":
        return <FileText className="w-4 h-4 text-blue-600" />
      case "Tutoría":
        return <Clock className="w-4 h-4 text-green-600" />
      case "Gestión":
        return <Calendar className="w-4 h-4 text-orange-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const stats = [
    {
      label: "Total de Reportes",
      value: reports.length,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Completados",
      value: reports.filter((r) => r.estado === "Completado").length,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "En Revisión",
      value: reports.filter((r) => r.estado === "En revisión").length,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Pendientes",
      value: reports.filter((r) => r.estado === "Pendiente").length,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ]

  const clearFilters = () => {
    setSearchTerm("")
    setFilterType("all")
    setFilterStatus("all")
  }

  const openReportDetails = (report) => {
    setSelectedReport(report)
    setIsDetailDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDetailDialogOpen(false)
    setSelectedReport(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-3">Historial de Reportes - Actividades Realizadas</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Visualiza y gestiona tu historial completo de reportes académicos y actividades realizadas de manera eficiente
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                    <FileText className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg border-0">
          <div className="border-b border-gray-100 p-6">
            <h2 className="text-xl text-gray-900 flex items-center gap-2 font-semibold">
              <Filter className="w-5 h-5 text-green-600" />
              Filtros de Búsqueda
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por título, tipo, estado o semestre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
              >
                <option value="all">Todos los tipos</option>
                <option value="INVESTIGACION">INVESTIGACION</option>
                <option value="DOCENCIA">DOCENCIA</option>
                <option value="TUTORIAS">TUTORIAS</option>
                <option value="GESTION_ACADEMICA">GESTION_ACADEMICA</option>
                <option value="EXTENSION">EXTENSION</option>
                <option value="CAPACITACION">CAPACITACION</option>
                <option value="ADMINISTRATIVA">ADMINISTRATIVA</option>
                <option value="POSGRADO">POSGRADO</option>
                <option value="OTRA">OTRA</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
              >
                <option value="all">Todos los estados</option>
                <option value="Completado">Completado</option>
                <option value="En revisión">En revisión</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow-lg border-0">
          <div className="border-b border-gray-100 p-6">
            <h2 className="text-xl text-gray-900 font-semibold">Listado de Reportes ({filteredReports.length})</h2>
          </div>
          <div className="p-0">
            {filteredReports.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left p-4 font-semibold text-gray-700">Título</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Tipo</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Estado</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Fecha de Envío</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Semestre</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report, index) => (
                      <tr
                        key={report.id}
                        className={`border-b border-gray-50 hover:bg-green-25 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-25"
                        }`}
                      >
                        <td className="p-4">
                          <div>
                            <span className="font-semibold text-gray-900 block">{report.titulo}</span>
                            {report.descripcion && (
                              <span className="text-sm text-gray-500 mt-1 block">{report.descripcion}</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(report.tipo)}
                            <span className="text-gray-700 font-medium">{report.tipo}</span>
                          </div>
                        </td>
                        <td className="p-4">{getStatusBadge(report.estado)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{report.fechaEnvio}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            {report.semestre}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="relative">
                            <button
                              onClick={() => setDropdownOpen(dropdownOpen === report.id ? null : report.id)}
                              className="p-2 hover:bg-green-100 rounded-md transition-colors"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            {dropdownOpen === report.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-20">
                                <button
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center"
                                  onClick={() => {
                                    openReportDetails(report)
                                    setDropdownOpen(null)
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-2 text-green-600" />
                                  Ver detalles
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center">
                                  <Download className="w-4 h-4 mr-2 text-blue-600" />
                                  Descargar PDF
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron reportes</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  No hay reportes que coincidan con los filtros seleccionados. Intenta ajustar los criterios de
                  búsqueda.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Report Detail Dialog */}
        {isDetailDialogOpen && selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeDialog}></div>
            <div className="relative bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-y-auto w-full mx-4">
              <div className="border-b border-green-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-green-800">Detalles del Reporte</h2>
                    <p className="text-green-600">Información completa y actividades registradas en el reporte</p>
                  </div>
                  <button
                    onClick={closeDialog}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="space-y-6 p-6">
                {/* Report Header */}
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedReport.titulo}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Tipo de Reporte:</span>
                          <div className="flex items-center gap-2 mt-1">
                            {getTypeIcon(selectedReport.tipo)}
                            <span className="font-semibold text-gray-900">{selectedReport.tipo}</span>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Semestre:</span>
                          <p className="font-semibold text-gray-900 mt-1">{selectedReport.semestre}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Fecha de Envío:</span>
                          <p className="font-semibold text-gray-900 mt-1">{selectedReport.fechaEnvio}</p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">{getStatusBadge(selectedReport.estado)}</div>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Progreso del Reporte</p>
                        <p className="text-2xl font-bold text-green-600">85%</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Actividades Registradas</p>
                        <p className="text-2xl font-bold text-blue-600">12</p>
                        <p className="text-xs text-gray-500">Total en el período</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Actividades Completadas</p>
                        <p className="text-2xl font-bold text-green-600">10</p>
                        <p className="text-xs text-gray-500">83% del total</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Horas Registradas</p>
                        <p className="text-2xl font-bold text-purple-600">240</p>
                        <p className="text-xs text-gray-500">Horas académicas</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs Section */}
                <div className="w-full">
                  <div className="flex border-b border-gray-200 bg-gray-100 rounded-t-lg">
                    <button
                      onClick={() => setActiveTab("activities")}
                      className={`flex-1 py-2 px-4 text-sm font-medium ${
                        activeTab === "activities"
                          ? "bg-white text-green-700 border-b-2 border-green-700"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Actividades Registradas
                    </button>
                    <button
                      onClick={() => setActiveTab("summary")}
                      className={`flex-1 py-2 px-4 text-sm font-medium ${
                        activeTab === "summary"
                          ? "bg-white text-green-700 border-b-2 border-green-700"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Resumen Ejecutivo
                    </button>
                    <button
                      onClick={() => setActiveTab("documents")}
                      className={`flex-1 py-2 px-4 text-sm font-medium ${
                        activeTab === "documents"
                          ? "bg-white text-green-700 border-b-2 border-green-700"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Documentos Adjuntos
                    </button>
                  </div>

                  <div className="mt-4">
                    {activeTab === "activities" && (
                      <div className="bg-white rounded-lg border">
                        <div className="p-6 border-b">
                          <h3 className="text-lg font-semibold text-gray-900">Actividades del Período</h3>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-l-4 border-l-green-500">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <FileText className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <span className="font-medium text-gray-900 block">Preparación de material didáctico</span>
                                <span className="text-sm text-gray-600">
                                  Desarrollo de contenidos para Matemáticas Avanzadas
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium text-green-600">Completada</span>
                              <p className="text-xs text-gray-500">2023-05-10</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-l-4 border-l-green-500">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <Clock className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <span className="font-medium text-gray-900 block">Asesoría a estudiantes</span>
                                <span className="text-sm text-gray-600">Sesiones de tutoría académica individual</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium text-green-600">Completada</span>
                              <p className="text-xs text-gray-500">2023-05-12</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border-l-4 border-l-yellow-500">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <span className="font-medium text-gray-900 block">Actualización de syllabus</span>
                                <span className="text-sm text-gray-600">
                                  Revisión y actualización de contenidos programáticos
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium text-yellow-600">En Progreso</span>
                              <p className="text-xs text-gray-500">2023-05-15</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <span className="font-medium text-gray-900 block">Participación en congreso</span>
                                <span className="text-sm text-gray-600">
                                  Congreso Internacional de Educación Superior
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium text-blue-600">Programada</span>
                              <p className="text-xs text-gray-500">2023-06-20</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "summary" && (
                      <div className="bg-white rounded-lg border">
                        <div className="p-6 border-b">
                          <h3 className="text-lg font-semibold text-gray-900">Resumen Ejecutivo del Período</h3>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="prose max-w-none">
                            <h4 className="text-md font-semibold text-gray-900 mb-3">Actividades de Docencia</h4>
                            <p className="text-gray-700 mb-4">
                              Durante el período reportado, se impartieron 3 materias correspondientes a la carga
                              académica asignada, con un total de 240 horas de clase. Se desarrollaron nuevos materiales
                              didácticos para mejorar el proceso de enseñanza-aprendizaje, incluyendo presentaciones
                              interactivas y casos de estudio prácticos.
                            </p>

                            <h4 className="text-md font-semibold text-gray-900 mb-3">Actividades de Investigación</h4>
                            <p className="text-gray-700 mb-4">
                              Se continuó con el proyecto de investigación "Metodologías Innovadoras en Educación
                              Superior", logrando avances significativos en la recolección de datos y análisis
                              preliminares. Se presentaron resultados parciales en el Congreso Nacional de Educación.
                            </p>

                            <h4 className="text-md font-semibold text-gray-900 mb-3">Actividades de Tutoría</h4>
                            <p className="text-gray-700 mb-4">
                              Se brindó asesoría académica a 15 estudiantes de licenciatura y 3 de posgrado, con un
                              enfoque personalizado para apoyar su desarrollo académico y profesional. Se implementaron
                              estrategias de seguimiento continuo para mejorar el rendimiento estudiantil.
                            </p>

                            <h4 className="text-md font-semibold text-gray-900 mb-3">Logros Destacados</h4>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                              <li>Publicación de artículo en revista indexada</li>
                              <li>Participación como ponente en congreso internacional</li>
                              <li>Implementación de nuevas tecnologías educativas</li>
                              <li>Mejora del 15% en evaluaciones estudiantiles</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "documents" && (
                      <div className="bg-white rounded-lg border">
                        <div className="p-6 border-b">
                          <h3 className="text-lg font-semibold text-gray-900">Documentos de Respaldo</h3>
                        </div>
                        <div className="p-6">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <div>
                                  <span className="font-medium text-gray-900 block">Evidencias de Docencia.pdf</span>
                                  <span className="text-sm text-gray-500">2.4 MB • Subido el 10 de marzo, 2024</span>
                                </div>
                              </div>
                              <button className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Descargar
                              </button>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-green-600" />
                                <div>
                                  <span className="font-medium text-gray-900 block">
                                    Certificado de Participación.pdf
                                  </span>
                                  <span className="text-sm text-gray-500">1.8 MB • Subido el 12 de marzo, 2024</span>
                                </div>
                              </div>
                              <button className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Descargar
                              </button>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-purple-600" />
                                <div>
                                  <span className="font-medium text-gray-900 block">Evaluaciones Estudiantiles.xlsx</span>
                                  <span className="text-sm text-gray-500">856 KB • Subido el 14 de marzo, 2024</span>
                                </div>
                              </div>
                              <button className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Descargar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Descargar Reporte Completo
                  </button>

                  <button className="text-blue-600 border border-blue-200 hover:bg-blue-50 bg-transparent px-4 py-2 rounded-md transition-colors flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Generar Versión PDF
                  </button>

                  <button className="text-gray-600 border border-gray-200 hover:bg-gray-50 bg-transparent px-4 py-2 rounded-md transition-colors flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Vista Previa de Impresión
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Backdrop click handler */}
        {dropdownOpen && (
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setDropdownOpen(null)}
          ></div>
        )}
      </div>
    </div>
  )
}