/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
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
  BookOpen,
  ChevronDown,
  X,
  Bell,
} from "lucide-react"
import { useAuth } from '../../context/AuthContext'
import activityService from '../../services/activityService'
import { toast } from 'react-toastify'

// Simple Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
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
  return <div className={className}>{children}</div>;
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
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 })
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRequestRevisionDialogOpen, setIsRequestRevisionDialogOpen] = useState(false)
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false)
  const [revisionComment, setRevisionComment] = useState("")
  const [returnComment, setReturnComment] = useState("")
  const dropdownRefs = useRef({})

  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [teachers, setTeachers] = useState([])
  const [stats, setStats] = useState({ pending: 0, approved: 0, returned: 0 })
  
  const { user } = useAuth()

  // Función para calcular posición del dropdown
  const calculateDropdownPosition = (buttonElement) => {
    if (!buttonElement) return { top: 0, right: 0 }
    
    const rect = buttonElement.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    
    return {
      top: rect.bottom + scrollTop + 8,
      right: window.innerWidth - rect.right - scrollLeft
    }
  }

  // Función para manejar apertura/cierre del dropdown
  const handleDropdownToggle = (activityId, event) => {
    event.stopPropagation()
    if (dropdownOpen === activityId) {
      setDropdownOpen(null)
    } else {
      setDropdownOpen(activityId)
    }
  }

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
      
      // Extraer categorías únicas de las actividades
      const uniqueCategories = [...new Set(activitiesData
        .map(activity => activity.categoria)
        .filter(categoria => categoria && categoria.trim() !== '')
      )].sort()
      setCategories(uniqueCategories)
      
      console.log('✅ Actividades cargadas correctamente:', activitiesData?.length || 0)
      console.log('📂 Categorías encontradas:', uniqueCategories)
    } catch (error) {
      console.error('❌ Error al cargar actividades:', error)
      toast.error('Error al cargar actividades: ' + error.message)
      setActivities([])
      setCategories([])
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

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('[data-dropdown-container]')) {
        setDropdownOpen(null)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  const filteredActivities = (activities || []).filter((activity) => {
    const matchesSearch =
      (activity.usuario?.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (activity.titulo?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || activity.categoria?.toLowerCase() === filterCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const getActivitiesByStatus = (status) => {
    return filteredActivities.filter((activity) => activity.estado_realizado === status)
  }

  // Función para aprobar reporte
  const handleApproveReport = async () => {
    try {
      if (!selectedActivity) return
      
      // Aquí iría la llamada a la API para aprobar el reporte
      // await activityService.updateActivityStatus(selectedActivity.id, 'aprobada')
      
      // Actualizar el estado local
      setActivities(prev => prev.map(activity => 
        activity.id === selectedActivity.id 
          ? { ...activity, estado_realizado: 'aprobada' }
          : activity
      ))
      
      toast.success('Reporte aprobado exitosamente')
      
      // Cerrar modales después de mostrar el toast
      setTimeout(() => {
        setIsApproveDialogOpen(false)
        setIsViewDialogOpen(false)
        setSelectedActivity(null)
      }, 1500)
    } catch (error) {
      console.error('Error al aprobar reporte:', error)
      toast.error('Error al aprobar el reporte')
    }
  }

  // Función para solicitar revisión
  const handleRequestRevision = async () => {
    try {
      if (!selectedActivity || !revisionComment.trim()) {
        toast.error('Por favor, agrega un comentario para la revisión')
        return
      }
      
      // Aquí iría la llamada a la API para solicitar revisión
      // await activityService.requestRevision(selectedActivity.id, revisionComment)
      
      // Actualizar el estado local
      setActivities(prev => prev.map(activity => 
        activity.id === selectedActivity.id 
          ? { ...activity, estado_realizado: 'devuelta', comentarios: revisionComment }
          : activity
      ))
      
      toast.success('Solicitud de revisión enviada exitosamente')
      setRevisionComment('')
      
      // Cerrar modales después de mostrar el toast
      setTimeout(() => {
        setIsRequestRevisionDialogOpen(false)
        setIsViewDialogOpen(false)
        setSelectedActivity(null)
      }, 1500)
    } catch (error) {
      console.error('Error al solicitar revisión:', error)
      toast.error('Error al solicitar revisión')
    }
  }

  // Función para enviar recordatorio
  const handleSendReminder = async () => {
    try {
      if (!selectedActivity) return
      
      // Aquí iría la llamada a la API para enviar recordatorio
      // await activityService.sendReminder(selectedActivity.id)
      
      toast.success('Recordatorio enviado exitosamente')
    } catch (error) {
      console.error('Error al enviar recordatorio:', error)
      toast.error('Error al enviar recordatorio')
    }
  }

  // Función para descargar reporte
  const handleDownloadReport = async () => {
    try {
      if (!selectedActivity) return
      
      // Aquí iría la llamada a la API para generar y descargar PDF
      // const pdfBlob = await activityService.downloadReport(selectedActivity.id)
      // const url = window.URL.createObjectURL(pdfBlob)
      // const a = document.createElement('a')
      // a.href = url
      // a.download = `reporte-${selectedActivity.usuario?.nombre}-${selectedActivity.id}.pdf`
      // a.click()
      
      toast.success('Descarga iniciada')
    } catch (error) {
      console.error('Error al descargar reporte:', error)
      toast.error('Error al descargar reporte')
    }
  }

  // Función para devolver actividad
  const handleReturnActivity = async () => {
    try {
      if (!selectedActivity || !returnComment.trim()) {
        toast.error('Por favor, agrega un comentario para devolver la actividad')
        return
      }
      
      // Aquí iría la llamada a la API para devolver la actividad
      // await activityService.returnActivity(selectedActivity.id, returnComment)
      
      // Actualizar el estado local
      setActivities(prev => prev.map(activity => 
        activity.id === selectedActivity.id 
          ? { ...activity, estado_realizado: 'devuelta', comentarios: returnComment }
          : activity
      ))
      
      toast.success('Actividad devuelta exitosamente')
      setReturnComment('')
      
      // Cerrar modales después de mostrar el toast
      setTimeout(() => {
        setIsReturnDialogOpen(false)
        setIsViewDialogOpen(false)
        setSelectedActivity(null)
      }, 1500)
    } catch (error) {
      console.error('Error al devolver actividad:', error)
      toast.error('Error al devolver actividad')
    }
  }

  const handleReviewActivity = async (activity, newStatus) => {
    try {
      if (newStatus === "aprobada") {
        await activityService.approveActivity(activity.id, reviewComment)
        toast.success('Actividad aprobada exitosamente')
      } else if (newStatus === "devuelta") {
        if (!reviewComment.trim()) {
          toast.error('Debe proporcionar comentarios para devolver la actividad')
          return
        }
        await activityService.rejectActivity(activity.id, reviewComment)
        toast.success('Actividad devuelta exitosamente')
      }
      
      // Actualizar el estado local
      setActivities((prev) =>
        prev.map((act) => 
          act.id === activity.id 
            ? { ...act, estado_realizado: newStatus, comentarios_revision: reviewComment } 
            : act
        ),
      )
      
      setReviewComment("")
      
      // Cerrar modal después de mostrar el toast
      setTimeout(() => {
        setIsReviewDialogOpen(false)
        setSelectedActivity(null)
      }, 1500)
      
      // Recargar actividades para obtener datos actualizados
      await loadActivities()
    } catch (error) {
      console.error('Error al revisar actividad:', error)
      toast.error('Error al procesar la revisión: ' + error.message)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pendiente: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: Clock,
        text: 'Pendiente',
        pulse: true
      },
      aprobada: {
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: CheckCircle,
        text: 'Aprobada',
        pulse: false
      },
      devuelta: {
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: AlertTriangle,
        text: 'Devuelta',
        pulse: false
      }
    }

    const config = statusConfig[status] || statusConfig.pendiente
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border-2 ${config.color} ${config.pulse ? 'animate-pulse' : ''}`}>
        <Icon className="w-4 h-4 mr-1.5" />
        {config.text}
      </span>
    )
  }

  const ActivityTable = ({ activities }) => (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Lista de Actividades</h3>
        <p className="text-sm text-gray-600 mt-1">Gestiona y revisa las actividades enviadas por los docentes</p>
      </div>
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Docente</span>
                </div>
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px]">
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Actividad</span>
                </div>
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Fecha</span>
                </div>
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]">Categoría</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]">Estado</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
             {activities.length === 0 ? (
               <tr>
                 <td colSpan="6" className="px-4 py-12 text-center">
                   <div className="flex flex-col items-center justify-center">
                     <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
                     <h3 className="text-lg font-medium text-gray-900 mb-2">No hay actividades</h3>
                     <p className="text-gray-500">No se encontraron actividades que coincidan con los filtros aplicados.</p>
                   </div>
                 </td>
               </tr>
             ) : (
               activities.map((activity) => (
                 <tr key={activity.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{activity.usuario?.nombre || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{activity.usuario?.email || 'Sin email'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900 font-medium">{activity.titulo || 'N/A'}</div>
                  <div className="text-xs text-gray-500 truncate max-w-xs">{activity.descripcion || 'Sin descripción'}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{activity.fechaInicio ? new Date(activity.fechaInicio).toLocaleDateString() : 'N/A'}</div>
                  <div className="text-xs text-gray-500">{activity.fechaFin ? new Date(activity.fechaFin).toLocaleDateString() : ''}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {activity.categoria || 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(activity.estado_realizado)}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div data-dropdown-container className="relative">
                    <button
                      ref={(el) => dropdownRefs.current[activity.id] = el}
                      onClick={(e) => handleDropdownToggle(activity.id, e)}
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Acciones
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </button>
                    {dropdownOpen === activity.id && (
                      <div 
                        className="absolute z-[99999] w-48 max-h-64 overflow-y-auto rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 mt-2"
                        style={{
                          top: '100%',
                          right: '0'
                        }}
                      >
                        <div className="py-1" role="menu">
                          <button
                            onClick={() => {
                              setSelectedActivity(activity)
                              setIsViewDialogOpen(true)
                              setDropdownOpen(null)
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            <Eye className="mr-3 h-4 w-4 text-green-500" />
                            Ver detalles
                          </button>
                          
                          {activity.estado_realizado === "pendiente" && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedActivity(activity)
                                  setIsReviewDialogOpen(true)
                                  setDropdownOpen(null)
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                <CheckCircle className="mr-3 h-4 w-4 text-blue-500" />
                                Revisar actividad
                              </button>
                              
                              <button
                                onClick={async () => {
                                  try {
                                    await activityService.approveActivity(activity.id, 'Aprobación rápida')
                                    toast.success('Actividad aprobada exitosamente')
                                    await loadActivities()
                                    setDropdownOpen(null)
                                  } catch (error) {
                                    toast.error('Error al aprobar actividad: ' + error.message)
                                  }
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                <CheckCircle className="mr-3 h-4 w-4 text-green-500" />
                                Aprobar rápidamente
                              </button>
                            </>
                          )}
                          
                          {activity.estado_realizado === "devuelta" && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedActivity(activity)
                                  setIsViewDialogOpen(true)
                                  setDropdownOpen(null)
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                <AlertTriangle className="mr-3 h-4 w-4 text-orange-500" />
                                Ver comentarios
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    await activityService.updateActivityStatus(activity.id, 'pendiente')
                                    toast.success('Actividad devuelta a pendiente exitosamente')
                                    loadActivities()
                                    setDropdownOpen(null)
                                  } catch (error) {
                                    toast.error('Error al devolver actividad a pendiente: ' + error.message)
                                  }
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                <Clock className="mr-3 h-4 w-4 text-blue-500" />
                                Devolver a Pendiente
                              </button>
                            </>
                          )}
                          
                          {activity.estado_realizado === "revisada" && (
                            <button
                              onClick={async () => {
                                try {
                                  await activityService.updateActivityStatus(activity.id, 'pendiente')
                                  toast.success('Actividad devuelta a pendiente exitosamente')
                                  loadActivities()
                                  setDropdownOpen(null)
                                } catch (error) {
                                  toast.error('Error al devolver actividad a pendiente: ' + error.message)
                                }
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              <Clock className="mr-3 h-4 w-4 text-blue-500" />
                              Devolver a Pendiente
                            </button>
                          )}
                          
                          {activity.archivo && (
                            <button
                              onClick={() => {
                                window.open(`http://localhost:3000/uploads/${activity.archivo}`, '_blank')
                                setDropdownOpen(null)
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              <FileText className="mr-3 h-4 w-4 text-blue-500" />
                              Ver documento
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </td>
               </tr>
                ))
              )}
           </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Revisión y Aprobación de Actividades</h1>
          <p className="text-green-600">Revisa y aprueba las actividades registradas por los docentes</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow-lg rounded-lg border border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h3>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterCategory('all')
                }}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar por docente o actividad..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white transition-colors"
                  >
                    <option value="all">Todas las categorías</option>
                    {categories.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>Mostrando {filteredActivities.length} de {activities.length} actividades</span>
              <div className="flex items-center space-x-4">
                <span>Última actualización: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white shadow-lg rounded-lg border-l-4 border-l-blue-500">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Actividades</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{filteredActivities.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Todas las actividades</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <BookOpen className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg border-l-4 border-l-orange-500">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pendientes</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{getActivitiesByStatus("pendiente").length}</p>
                  <p className="text-xs text-gray-500 mt-1">Por revisar</p>
                </div>
                <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                  <Clock className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg border-l-4 border-l-green-500">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Aprobadas</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{getActivitiesByStatus("aprobada").length}</p>
                  <p className="text-xs text-gray-500 mt-1">Completadas</p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <CheckCircle className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg border-l-4 border-l-red-500">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Devueltas</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{getActivitiesByStatus("devuelta").length}</p>
                  <p className="text-xs text-gray-500 mt-1">Requieren corrección</p>
                </div>
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <AlertTriangle className="w-8 h-8" />
                </div>
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
                      <h3 className="text-xl font-bold text-gray-900">{selectedActivity?.usuario?.nombre || 'N/A'}</h3>
                      <p className="text-gray-600">{selectedActivity?.usuario?.facultad || 'Facultad de Ciencias'}</p>
                      <p className="text-sm text-gray-500">
                        {selectedActivity?.usuario?.email || 
                          (selectedActivity?.usuario?.nombre
                            ?.toLowerCase()
                            ?.replace(/\s+/g, ".")
                            ?.replace(/dr\.|dra\.|mtro\./g, "") + '@uabc.edu.mx') || 'usuario@uabc.edu.mx'}
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
                  <TabsList className="grid grid-cols-3 bg-gray-100 rounded-md p-1">
                    <TabsTrigger
                      value="activities"
                      activeTab={activeDetailTab}
                      onTabChange={setActiveDetailTab}
                      className="rounded-md data-[state=active]:bg-white data-[state=active]:text-green-700"
                    >
                      Actividades
                    </TabsTrigger>
                    <TabsTrigger
                      value="documents"
                      activeTab={activeDetailTab}
                      onTabChange={setActiveDetailTab}
                      className="rounded-md data-[state=active]:bg-white data-[state=active]:text-green-700"
                    >
                      Documentos
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

                  <TabsContent value="documents" activeTab={activeDetailTab}>
                    <div className="bg-white border border-gray-200 rounded-lg mt-4">
                      <div className="border-b border-gray-200 p-4">
                        <h3 className="text-lg font-semibold text-gray-900">Documentos Adjuntos</h3>
                      </div>
                      <div className="p-4 space-y-4">
                        {selectedActivity?.archivo ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-3">
                                <FileText className="w-6 h-6 text-blue-600" />
                                <div>
                                  <p className="font-medium text-gray-900">Reporte de Actividades</p>
                                  <p className="text-sm text-gray-500">Documento PDF - {selectedActivity.fecha}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => window.open(`http://localhost:3000/uploads/${selectedActivity.archivo}`, '_blank')}
                                  className="inline-flex items-center px-3 py-2 border border-blue-200 text-sm font-medium rounded-md text-blue-600 bg-transparent hover:bg-blue-100 transition-colors"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Ver
                                </button>
                                <button 
                                  onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = `http://localhost:3000/uploads/${selectedActivity.archivo}`;
                                    link.download = selectedActivity.archivo;
                                    link.click();
                                  }}
                                  className="inline-flex items-center px-3 py-2 border border-gray-200 text-sm font-medium rounded-md text-gray-600 bg-transparent hover:bg-gray-100 transition-colors"
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  Descargar
                                </button>
                              </div>
                            </div>
                            
                            {/* PDF Viewer */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                              <div className="bg-gray-50 p-3 border-b border-gray-200">
                                <h4 className="text-sm font-medium text-gray-700">Vista Previa del Documento</h4>
                              </div>
                              <div className="p-4">
                                <iframe
                                  src={`http://localhost:3000/uploads/${selectedActivity.archivo}`}
                                  className="w-full h-96 border border-gray-300 rounded"
                                  title="Vista previa del PDF"
                                >
                                  <p>Su navegador no soporta la visualización de PDFs. 
                                    <a href={`http://localhost:3000/uploads/${selectedActivity.archivo}`} target="_blank" rel="noopener noreferrer">
                                      Haga clic aquí para descargar el archivo.
                                    </a>
                                  </p>
                                </iframe>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 italic">
                              No hay documentos adjuntos para esta actividad.
                            </p>
                          </div>
                        )}
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
                  {/* Botones para actividades PENDIENTES */}
                  {selectedActivity?.estado_realizado === "pendiente" && (
                    <>
                      <button 
                        onClick={() => setIsApproveDialogOpen(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aprobar Reporte
                      </button>

                      <button 
                        onClick={() => setIsRequestRevisionDialogOpen(true)}
                        className="inline-flex items-center px-4 py-2 border border-orange-200 text-sm font-medium rounded-md text-orange-600 bg-transparent hover:bg-orange-50 transition-colors"
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Solicitar Revisión
                      </button>

                      <button 
                        onClick={() => setIsReturnDialogOpen(true)}
                        className="inline-flex items-center px-4 py-2 border border-red-200 text-sm font-medium rounded-md text-red-600 bg-transparent hover:bg-red-50 transition-colors"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Devolver Actividad
                      </button>
                    </>
                  )}

                  {/* Botones para actividades APROBADAS */}
                  {selectedActivity?.estado_realizado === "aprobada" && (
                    <>
                      <button 
                        onClick={async () => {
                          try {
                            await activityService.updateActivityStatus(selectedActivity.id, 'pendiente')
                            setActivities(prev => prev.map(activity => 
                              activity.id === selectedActivity.id 
                                ? { ...activity, estado_realizado: 'pendiente' }
                                : activity
                            ))
                            setSelectedActivity({ ...selectedActivity, estado_realizado: 'pendiente' })
                            toast.success('Actividad regresada a pendiente exitosamente')
                            setTimeout(() => {
                              setIsViewDialogOpen(false)
                            }, 1500)
                          } catch (error) {
                            toast.error('Error al regresar actividad a pendiente: ' + error.message)
                          }
                        }}
                        className="inline-flex items-center px-4 py-2 border border-blue-200 text-sm font-medium rounded-md text-blue-600 bg-transparent hover:bg-blue-50 transition-colors"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Regresar a Pendiente
                      </button>
                    </>
                  )}

                  {/* Botones para actividades DEVUELTAS */}
                  {selectedActivity?.estado_realizado === "devuelta" && (
                    <>
                      <button 
                        onClick={() => setIsApproveDialogOpen(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aprobar Reporte
                      </button>

                      <button 
                        onClick={async () => {
                          try {
                            await activityService.updateActivityStatus(selectedActivity.id, 'pendiente')
                            setActivities(prev => prev.map(activity => 
                              activity.id === selectedActivity.id 
                                ? { ...activity, estado_realizado: 'pendiente' }
                                : activity
                            ))
                            setSelectedActivity({ ...selectedActivity, estado_realizado: 'pendiente' })
                            toast.success('Actividad regresada a pendiente exitosamente')
                            setTimeout(() => {
                              setIsViewDialogOpen(false)
                            }, 1500)
                          } catch (error) {
                            toast.error('Error al regresar actividad a pendiente: ' + error.message)
                          }
                        }}
                        className="inline-flex items-center px-4 py-2 border border-blue-200 text-sm font-medium rounded-md text-blue-600 bg-transparent hover:bg-blue-50 transition-colors"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Regresar a Pendiente
                      </button>
                    </>
                  )}

                  {/* Botones comunes para todos los estados */}
                  <button 
                    onClick={handleSendReminder}
                    className="inline-flex items-center px-4 py-2 border border-blue-200 text-sm font-medium rounded-md text-blue-600 bg-transparent hover:bg-blue-50 transition-colors"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Recordatorio
                  </button>

                  <button 
                    onClick={handleDownloadReport}
                    className="inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-md text-gray-600 bg-transparent hover:bg-gray-50 transition-colors"
                  >
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

        {/* Approve Report Confirmation Modal */}
        <Modal isOpen={isApproveDialogOpen} onClose={() => setIsApproveDialogOpen(false)}>
          <div className="p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-bold text-green-800">Confirmar Aprobación</h2>
              <p className="text-gray-600">
                ¿Estás seguro de que deseas aprobar el reporte de {selectedActivity?.usuario?.nombre}?
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Importante</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Una vez aprobado, el reporte será marcado como completado y el docente será notificado.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsApproveDialogOpen(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleApproveReport}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Aprobar Reporte
              </button>
            </div>
          </div>
        </Modal>

        {/* Request Revision Modal */}
        <Modal isOpen={isRequestRevisionDialogOpen} onClose={() => setIsRequestRevisionDialogOpen(false)}>
          <div className="p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-bold text-orange-800">Solicitar Revisión</h2>
              <p className="text-gray-600">
                Solicita cambios en el reporte de {selectedActivity?.usuario?.nombre}
              </p>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentarios para la revisión *
                </label>
                <textarea
                  value={revisionComment}
                  onChange={(e) => setRevisionComment(e.target.value)}
                  placeholder="Describe los cambios necesarios o aspectos que requieren revisión..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={4}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsRequestRevisionDialogOpen(false)
                  setRevisionComment('')
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleRequestRevision}
                disabled={!revisionComment.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Enviar Solicitud
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal para Devolver Actividad */}
        <Modal isOpen={isReturnDialogOpen} onClose={() => setIsReturnDialogOpen(false)}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Devolver Actividad</h3>
                <p className="text-sm text-gray-600">Esta acción devolverá la actividad al docente para correcciones</p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">
                  <p className="font-medium mb-1">Importante:</p>
                  <p>Al devolver esta actividad, el docente deberá realizar las correcciones necesarias y volver a enviarla para revisión.</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentario sobre las correcciones necesarias *
              </label>
              <textarea
                value={returnComment}
                onChange={(e) => setReturnComment(e.target.value)}
                placeholder="Describe las correcciones que debe realizar el docente..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                rows={4}
                required
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsReturnDialogOpen(false)
                  setReturnComment('')
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleReturnActivity}
                disabled={!returnComment.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Devolver Actividad
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}