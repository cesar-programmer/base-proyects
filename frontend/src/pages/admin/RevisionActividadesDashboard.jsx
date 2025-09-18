/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import {
  Eye,
  CheckCircle,
  XCircle,
  Send,
  Download,
  Search,
  Filter,
  Calendar,
  User,
  FileText,
  Clock,
  AlertCircle,
  AlertTriangle,
} from "lucide-react"
import { useAuth } from '../../context/AuthContext'
import activityService from '../../services/activityService'
import { toast } from 'react-hot-toast'

// Simple Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Simple Tabs Component
const Tabs = ({ activeTab, onTabChange, children }) => {
  return <div>{children}</div>;
};

const TabsList = ({ children, className = "" }) => {
  return <div className={`flex ${className}`}>{children}</div>;
};

const TabsTrigger = ({ value, activeTab, onTabChange, children, className = "" }) => {
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => onTabChange(value)}
      className={`px-4 py-2 font-medium transition-colors ${
        isActive 
          ? "bg-green-600 text-white" 
          : "bg-green-50 text-green-800 hover:bg-green-100"
      } ${className}`}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, activeTab, children }) => {
  if (activeTab !== value) return null;
  return <div>{children}</div>;
};

export default function RevisionActividadesDashboard() {
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [reviewComment, setReviewComment] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("pendientes")
  const [activeDetailTab, setActiveDetailTab] = useState("activities")
  const [newComment, setNewComment] = useState("")
  const [notificationRecipients, setNotificationRecipients] = useState("")
  const [notificationMessage, setNotificationMessage] = useState("")

  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [teachers, setTeachers] = useState([])
  const [stats, setStats] = useState({ pending: 0, approved: 0, returned: 0 })
  
  const { user } = useAuth()

  // Función para cargar actividades desde la API
  const loadActivities = async () => {
    try {
      setLoading(true)
      console.log('🔄 Cargando actividades...')
      const response = await activityService.getAllActivities()
      console.log('📊 Respuesta completa de la API:', response)
      console.log('📋 Datos de actividades:', response.data)
      
      // CORRECCIÓN: El backend retorna { message, data }, así que necesitamos response.data.data
      const activitiesData = response.data?.data || response.data || []
      setActivities(activitiesData)
      console.log('✅ Actividades cargadas correctamente:', activitiesData?.length || 0)
    } catch (error) {
      console.error('❌ Error al cargar actividades:', error)
      toast.error('Error al cargar actividades: ' + error.message)
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    if (user) {
      loadActivities()
    }
  }, [user])

  const filteredActivities = (activities || []).filter((activity) => {
    const matchesSearch =
      (activity.usuario?.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (activity.titulo?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || activity.categoria === filterCategory
    return matchesSearch && matchesCategory
  })

  const getActivitiesByStatus = (status) => {
    return filteredActivities.filter((activity) => activity.estado_realizado === status)
  }

  const handleReviewActivity = (activity, newStatus) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === activity.id ? { ...act, estado: newStatus, comentarios: reviewComment } : act)),
    )
    setReviewComment("")
    setIsReviewDialogOpen(false)
    setSelectedActivity(null)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pendiente":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </span>
        )
      case "aprobada":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Aprobada
          </span>
        )
      case "devuelta":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Devuelta
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            {status || 'Sin estado'}
          </span>
        )
    }
  }

  const ActivityTable = ({ activities }) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-green-200 bg-green-50">
            <th className="text-left p-4 font-semibold text-green-800">Docente</th>
            <th className="text-left p-4 font-semibold text-green-800">Actividad</th>
            <th className="text-left p-4 font-semibold text-green-800">Fecha</th>
            <th className="text-left p-4 font-semibold text-green-800">Categoría</th>
            <th className="text-left p-4 font-semibold text-green-800">Estado</th>
            <th className="text-left p-4 font-semibold text-green-800">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id} className="border-b border-gray-100 hover:bg-green-25 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-gray-900">{activity.usuario?.nombre || 'N/A'}</span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">{activity.titulo || 'N/A'}</span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">{activity.fechaInicio ? new Date(activity.fechaInicio).toLocaleDateString() : 'N/A'}</span>
                </div>
              </td>
              <td className="p-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  {activity.categoria || 'N/A'}
                </span>
              </td>
              <td className="p-4">{getStatusBadge(activity.estado_realizado)}</td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedActivity(activity)
                      setIsViewDialogOpen(true)
                    }}
                    className="inline-flex items-center px-3 py-1.5 border border-green-200 text-sm font-medium rounded-md text-green-600 bg-transparent hover:bg-green-50 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </button>

                  {activity.estado_realizado === "pendiente" && (
                    <button
                      onClick={() => {
                        setSelectedActivity(activity)
                        setIsReviewDialogOpen(true)
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Revisar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Revisión y Aprobación de Actividades</h1>
          <p className="text-green-600">Revisa y aprueba las actividades registradas por los docentes</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow-lg rounded-lg">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar por docente o actividad..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  >
                    <option value="all">Todas las categorías</option>
                    <option value="Docencia">Docencia</option>
                    <option value="Investigación">Investigación</option>
                    <option value="Tutoría">Tutoría</option>
                    <option value="Capacitación">Capacitación</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-lg border-l-4 border-l-orange-500">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-3xl font-bold text-orange-600">{getActivitiesByStatus("Pendiente").length}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg border-l-4 border-l-green-500">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aprobadas</p>
                  <p className="text-3xl font-bold text-green-600">{getActivitiesByStatus("Aprobada").length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg border-l-4 border-l-red-500">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Devueltas</p>
                  <p className="text-3xl font-bold text-red-600">{getActivitiesByStatus("Devuelta").length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-lg rounded-lg">
          <div className="p-0">
            <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
              <div className="border-b border-gray-200 px-6 pt-6">
                <TabsList className="grid grid-cols-3 bg-green-50 rounded-md p-1">
                  <TabsTrigger
                    value="pendientes"
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    className="rounded-md"
                  >
                    Pendientes ({getActivitiesByStatus("pendiente").length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="aprobadas"
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    className="rounded-md"
                  >
                    Aprobadas ({getActivitiesByStatus("aprobada").length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="devueltas"
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    className="rounded-md"
                  >
                    Devueltas ({getActivitiesByStatus("devuelta").length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="pendientes" activeTab={activeTab}>
                <ActivityTable activities={getActivitiesByStatus("pendiente")} />
              </TabsContent>

              <TabsContent value="aprobadas" activeTab={activeTab}>
                <ActivityTable activities={getActivitiesByStatus("aprobada")} />
              </TabsContent>

              <TabsContent value="devueltas" activeTab={activeTab}>
                <ActivityTable activities={getActivitiesByStatus("devuelta")} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <button
            onClick={() => setIsNotificationDialogOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
          >
            <Send className="w-4 h-4 mr-2" />
            Enviar Notificación
          </button>

          <button className="inline-flex items-center px-4 py-2 border border-green-200 text-sm font-medium rounded-md text-green-600 bg-transparent hover:bg-green-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Exportar Reporte
          </button>
        </div>

        {/* View Activity Modal */}
        <Modal isOpen={isViewDialogOpen} onClose={() => setIsViewDialogOpen(false)}>
          <div className="p-6">
            <div className="border-b border-green-200 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-green-800">Reporte del Docente</h2>
              <p className="text-green-600">Revisión y gestión del reporte de actividades</p>
            </div>

            {selectedActivity && (
              <div className="space-y-6">
                {/* Teacher Profile Section */}
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-green-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{selectedActivity?.docente || 'N/A'}</h3>
                      <p className="text-gray-600">Facultad de Ciencias</p>
                      <p className="text-sm text-gray-500">
                        {selectedActivity?.docente
                          ?.toLowerCase()
                          ?.replace(/\s+/g, ".")
                          ?.replace(/dr\.|dra\.|mtro\./g, "") || 'usuario'}
                        @uabc.edu.mx
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        En progreso
                      </span>
                    </div>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Tasa de Cumplimiento</p>
                      <p className="text-3xl font-bold text-green-600">75%</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Última Actualización</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedActivity.fecha}</p>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Actividades Totales</p>
                      <p className="text-3xl font-bold text-gray-900">4</p>
                    </div>
                  </div>
                </div>

                {/* Tabs Section */}
                <Tabs activeTab={activeDetailTab} onTabChange={setActiveDetailTab}>
                  <TabsList className="grid grid-cols-2 bg-gray-100 rounded-md p-1">
                    <TabsTrigger
                      value="activities"
                      activeTab={activeDetailTab}
                      onTabChange={setActiveDetailTab}
                      className="rounded-md data-[state=active]:bg-white data-[state=active]:text-green-700"
                    >
                      Actividades
                    </TabsTrigger>
                    <TabsTrigger
                      value="comments"
                      activeTab={activeDetailTab}
                      onTabChange={setActiveDetailTab}
                      className="rounded-md data-[state=active]:bg-white data-[state=active]:text-green-700"
                    >
                      Comentarios
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="activities" activeTab={activeDetailTab}>
                    <div className="bg-white border border-gray-200 rounded-lg mt-4">
                      <div className="border-b border-gray-200 p-4">
                        <h3 className="text-lg font-semibold text-gray-900">Actividades Registradas</h3>
                      </div>
                      <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-l-green-500">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-gray-900">Preparación de material didáctico</span>
                          </div>
                          <span className="text-sm text-gray-500">2023-05-10</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-l-green-500">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-gray-900">Asesoría a estudiantes</span>
                          </div>
                          <span className="text-sm text-gray-500">2023-05-12</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-l-4 border-l-yellow-500">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            <span className="font-medium text-gray-900">Actualización de syllabus</span>
                          </div>
                          <span className="text-sm text-gray-500">2023-05-15</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-l-red-500">
                          <div className="flex items-center gap-3">
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="font-medium text-gray-900">Participación en comité académico</span>
                          </div>
                          <span className="text-sm text-gray-500">2023-05-20</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="comments" activeTab={activeDetailTab}>
                    <div className="bg-white border border-gray-200 rounded-lg mt-4">
                      <div className="border-b border-gray-200 p-4">
                        <h3 className="text-lg font-semibold text-gray-900">Comentarios y Observaciones</h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-4">
                          {selectedActivity.comentarios ? (
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-gray-700">{selectedActivity.comentarios}</p>
                              <p className="text-xs text-gray-500 mt-2">Comentario del administrador</p>
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">
                              No hay comentarios disponibles para esta actividad.
                            </p>
                          )}

                          <div className="border-t pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Agregar nuevo comentario
                            </label>
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Escribe un comentario sobre esta actividad..."
                              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              rows={4}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aprobar Reporte
                  </button>

                  <button className="inline-flex items-center px-4 py-2 border border-orange-200 text-sm font-medium rounded-md text-orange-600 bg-transparent hover:bg-orange-50 transition-colors">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Solicitar Revisión
                  </button>

                  <button className="inline-flex items-center px-4 py-2 border border-blue-200 text-sm font-medium rounded-md text-blue-600 bg-transparent hover:bg-blue-50 transition-colors">
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Recordatorio
                  </button>

                  <button className="inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-md text-gray-600 bg-transparent hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar Reporte
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>

        {/* Review Activity Modal */}
        <Modal isOpen={isReviewDialogOpen} onClose={() => setIsReviewDialogOpen(false)}>
          <div className="p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-bold text-green-800">Revisar Actividad</h2>
              <p className="text-gray-600">
                Revisa y proporciona comentarios sobre la actividad de {selectedActivity?.usuario?.nombre || 'N/A'}
              </p>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comentarios</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Escribe tus comentarios sobre la actividad..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => selectedActivity && handleReviewActivity(selectedActivity, "devuelta")}
                className="inline-flex items-center px-4 py-2 border border-red-200 text-sm font-medium rounded-md text-red-600 bg-transparent hover:bg-red-50 transition-colors"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Devolver
              </button>
              <button
                onClick={() => selectedActivity && handleReviewActivity(selectedActivity, "aprobada")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Aprobar
              </button>
            </div>
          </div>
        </Modal>

        {/* Notification Modal */}
        <Modal isOpen={isNotificationDialogOpen} onClose={() => setIsNotificationDialogOpen(false)}>
          <div className="p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-bold text-green-800">Enviar Notificación</h2>
              <p className="text-gray-600">
                Envía una notificación a los docentes sobre el estado de sus actividades
              </p>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destinatarios</label>
                <select
                  value={notificationRecipients}
                  onChange={(e) => setNotificationRecipients(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="">Seleccionar destinatarios</option>
                  <option value="pending">Docentes con actividades pendientes</option>
                  <option value="all">Todos los docentes</option>
                  <option value="returned">Docentes con actividades devueltas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                <textarea
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  placeholder="Escribe el mensaje de la notificación..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors">
                <Send className="w-4 h-4 mr-2" />
                Enviar Notificación
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}