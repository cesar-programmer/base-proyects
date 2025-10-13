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
import { useStats } from '../../context/StatsContext'
import activityService from '../../services/activityService'
import reportService from '../../services/reportService'
import { toast } from 'react-toastify'
import ListaArchivosReporte from '../../components/ListaArchivosReporte'

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

// Componente para mostrar las actividades registradas del profesor seleccionado
const TeacherActivitiesTab = ({ selectedActivity }) => {
  // Usar las actividades del reporte directamente
  const reportActivities = selectedActivity?.actividades || []
  const loadingActivities = false

  // Función para obtener el icono y estilo según el estado
  const getActivityStatusIcon = (estado) => {
    switch (estado) {
      case 'aprobada':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-l-green-500' }
      case 'pendiente':
        return { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-l-yellow-500' }
      case 'devuelto':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-l-red-500' }
      default:
        return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-l-gray-500' }
    }
  }

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha'
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    } catch {
      return 'Fecha inválida'
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg mt-4">
      <div className="border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900">Actividades del Período</h3>
        <p className="text-sm text-gray-600 mt-1">
          Actividades registradas en este reporte
        </p>
      </div>
      <div className="p-4">
        {loadingActivities ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Cargando actividades...</span>
          </div>
        ) : reportActivities.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No hay actividades registradas</h4>
            <p className="text-gray-500">
              No hay actividades registradas en este reporte.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reportActivities.map((activity) => {
              const statusConfig = getActivityStatusIcon(activity.estado_realizado || activity.estado)
              const StatusIcon = statusConfig.icon
              
              return (
                <div 
                  key={activity.id} 
                  className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${
                    activity.estado_realizado === "COMPLETADA" || activity.estado === "COMPLETADA"
                      ? "bg-green-50 border-l-green-500"
                      : activity.estado_realizado === "EN_PROGRESO" || activity.estado === "EN_PROGRESO"
                        ? "bg-yellow-50 border-l-yellow-500"
                        : "bg-blue-50 border-l-blue-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.estado_realizado === "COMPLETADA" || activity.estado === "COMPLETADA"
                          ? "bg-green-500"
                          : activity.estado_realizado === "EN_PROGRESO" || activity.estado === "EN_PROGRESO"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                      }`}
                    >
                      {activity.estado_realizado === "COMPLETADA" || activity.estado === "COMPLETADA" ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : activity.estado_realizado === "EN_PROGRESO" || activity.estado === "EN_PROGRESO" ? (
                        <Clock className="w-4 h-4 text-white" />
                      ) : (
                        <Calendar className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 block">{activity.titulo}</span>
                      {activity.descripcion && <span className="text-sm text-gray-600">{activity.descripcion}</span>}
                      {activity.categoria && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          {activity.categoria}
                        </span>
                      )}
                      <div className="mt-1">
                        <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                          <Clock className="w-3 h-3" /> {Number(activity.horas_dedicadas ?? activity.horas ?? 0)}h dedicadas
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm font-medium block ${
                        activity.estado_realizado === "COMPLETADA" || activity.estado === "COMPLETADA"
                          ? "text-green-600"
                          : activity.estado_realizado === "EN_PROGRESO" || activity.estado === "EN_PROGRESO"
                            ? "text-yellow-600"
                            : "text-blue-600"
                      }`}
                    >
                      {activity.estado_realizado === "COMPLETADA" || activity.estado === "COMPLETADA" ? "Completada" : 
                       activity.estado_realizado === "EN_PROGRESO" || activity.estado === "EN_PROGRESO" ? "En Progreso" : "Planificada"}
                    </span>
                    {activity.fechaInicio && (
                      <span className="text-xs text-gray-500 block mt-1">
                        {formatDate(activity.fechaInicio)}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
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
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false)
  const [returnComment, setReturnComment] = useState("")
  const dropdownRefs = useRef({})

  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [teachers, setTeachers] = useState([])
  const [stats, setStats] = useState({ pending: 0, approved: 0, returned: 0 })
  
  const { user } = useAuth()
  const { fetchStats } = useStats()

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

  // Función para cargar todos los reportes desde la API
  const loadActivities = async () => {
    try {
      setLoading(true)
      console.log('🔄 Cargando todos los reportes...')
      const response = await reportService.getAllReports()
      console.log('📊 Respuesta completa de la API:', response)
      
      // El backend retorna { message, data: { reportes: [], total, etc } }
      const reportesData = response.data?.reportes || []
      console.log('📋 Datos de reportes:', reportesData)
      
      if (!Array.isArray(reportesData)) {
        console.error('❌ Los datos de reportes no son un array:', reportesData)
        setActivities([])
        setCategories([])
        return
      }
      
      // Mapear usando las propiedades correctas que retorna el backend
      const reportsFormatted = reportesData.map((report) => {
        // Obtener la primera actividad si existe
        const primeraActividad = report.actividades && report.actividades.length > 0 ? report.actividades[0] : null
        
        // Debug específico para cada reporte
        const estadoMapeado = (() => {
          const estadoOriginal = report.estado
          let estadoFinal
          
          switch(estadoOriginal) {
            case 'enviado': estadoFinal = 'pendiente'; break
            case 'aprobado': estadoFinal = 'aprobado'; break
            case 'revisado': estadoFinal = 'pendiente'; break  // Los reportes revisados están pendientes de aprobación final
            case 'rechazado': estadoFinal = 'devuelto'; break  // Mantener consistencia con el backend
            case 'devuelto': estadoFinal = 'devuelto'; break   // Mantener consistencia con el backend
            case 'pendiente': estadoFinal = 'pendiente'; break
            case 'borrador': estadoFinal = 'pendiente'; break  // Los borradores se muestran como pendientes
            default: estadoFinal = 'pendiente'; break
          }
          
          // Log específico para reportes que deberían estar en pendiente
          if (estadoOriginal === 'pendiente' || estadoFinal === 'pendiente') {
            console.log(`🔍 MAPEO ESTADO - Reporte ID ${report.id}: "${estadoOriginal}" → "${estadoFinal}"`)
          }
          
          return estadoFinal
        })()
        
        console.log(`🔍 Reporte ID ${report.id}: "${report.titulo}" | Estado BD: "${report.estado}" → Estado Frontend: "${estadoMapeado}"`)
        
        // Debug del ID del reporte
        console.log('🔍 Debug ID del reporte:', { 
          reportId: report.id, 
          type: typeof report.id, 
          isNumber: typeof report.id === 'number',
          titulo: report.titulo 
        })
        
        return {
          id: Number(report.id), // Asegurar que sea un número
          titulo: report.titulo,
          usuario: {
            nombre: report.usuario?.nombre || 'N/A',
            apellido: report.usuario?.apellido || '',
            email: report.usuario?.email || 'Sin email'
          },
          reporteId: Number(report.id), // Asegurar que sea un número
          estado_realizado: estadoMapeado,
          categoria: primeraActividad?.categoria || 'GENERAL',
          fechaCreacion: report.createdAt,
          fechaEnvio: report.fechaEnvio,
          fechaActualizacion: report.updatedAt,
          actividadesCount: report.actividades ? report.actividades.length : 0,
          actividadPrincipal: primeraActividad,
          archivo: report.archivo,
          archivos: report.archivos || [],
          comentarios: report.comentariosRevision,
          resumenEjecutivo: report.resumenEjecutivo,
          actividades: report.actividades || [],
          // Mantener el objeto reporte completo para referencia
          reporte: report
        }
      })
      
      setActivities(reportsFormatted)
      
      // Extraer categorías únicas de los reportes
      const uniqueCategories = [...new Set(reportsFormatted
        .map(report => report.categoria)
        .filter(categoria => categoria && categoria.trim() !== '')
      )].sort()
      setCategories(uniqueCategories)
      
      console.log('✅ Reportes cargados correctamente:', reportesData.length)
       console.log('✅ Reportes formateados:', reportsFormatted.length)
       console.log('📂 Categorías encontradas:', uniqueCategories)
       
       // Debug: mostrar estados de los reportes
       const estadosOriginales = reportesData.map(r => r.estado)
       const estadosMapeados = reportsFormatted.map(r => r.estado_realizado)
       console.log('🔍 Estados originales del backend:', estadosOriginales)
       console.log('🔍 Estados mapeados para frontend:', estadosMapeados)
    } catch (error) {
      console.error('❌ Error al cargar reportes:', error)
      toast.error('Error al cargar reportes: ' + error.message)
      setActivities([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  // Cargar detalles completos del reporte (incluyendo archivos) al abrir "Ver detalles"
  const openReportDetails = async (activity) => {
    try {
      const reportId = Number(activity?.reporteId || activity?.id)
      if (!reportId || isNaN(reportId)) {
        setSelectedActivity(activity)
        setIsViewDialogOpen(true)
        return
      }

      const response = await reportService.getReportById(reportId)
      const reporte = response?.data || response

      const detalle = {
        ...activity,
        actividades: reporte?.actividades || activity?.actividades || [],
        resumenEjecutivo: reporte?.resumenEjecutivo ?? activity?.resumenEjecutivo,
        comentariosRevision: reporte?.comentariosRevision ?? activity?.comentariosRevision,
        archivos: reporte?.archivos || activity?.archivos || [],
        usuario: reporte?.usuario || activity?.usuario,
        titulo: reporte?.titulo || activity?.titulo,
        fechaEnvio: reporte?.fechaEnvio || activity?.fechaEnvio,
        updatedAt: reporte?.updatedAt || activity?.updatedAt,
        estado_realizado: activity?.estado_realizado
      }

      setSelectedActivity(detalle)
      setIsViewDialogOpen(true)
    } catch (error) {
      console.error('Error al cargar detalles del reporte:', error)
      toast.error('No se pudo cargar los detalles del reporte')
      setSelectedActivity(activity)
      setIsViewDialogOpen(true)
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

  // Temporalmente sin filtros para debug
  const filteredActivities = activities || []
  
  // const filteredActivities = (activities || []).filter((activity) => {
  //   const matchesSearch =
  //     (activity.usuario?.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
  //     (activity.titulo?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  //   const matchesCategory = filterCategory === "all" || activity.categoria?.toLowerCase() === filterCategory.toLowerCase()
  //   return matchesSearch && matchesCategory
  // })

  // Debug: logs para verificar el filtrado
  console.log('🔍 Debug filtrado:')
  console.log('📊 Total activities:', activities?.length || 0)
  console.log('🔍 SearchTerm:', searchTerm)
  console.log('📂 FilterCategory:', filterCategory)
  console.log('✅ Filtered activities:', filteredActivities?.length || 0)

  const getActivitiesByStatus = (status) => {
    // console.log(`🔍 Buscando reportes con estado: "${status}"`)
    // console.log('📋 filteredActivities:', filteredActivities?.length || 0, 'reportes')
    
    // Debug: mostrar todos los estados disponibles
    // const estadosDisponibles = filteredActivities.map(activity => activity.estado_realizado)
    // console.log('🎯 Estados disponibles:', estadosDisponibles)
    
    const result = filteredActivities.filter((activity) => activity.estado_realizado === status)
    console.log(`📋 Estado "${status}": ${result.length} reportes`)
    
    // Debug: mostrar los IDs de los reportes encontrados
    // if (result.length > 0) {
    //   console.log(`📝 Reportes con estado "${status}":`, result.map(r => `ID ${r.id}: "${r.titulo}"`))
    // }
    
    return result
  }

  // Función para aprobar reporte
  const handleApproveReport = async (reporteId = null, comentario = 'Reporte aprobado') => {
    try {
      const rawId = reporteId || selectedActivity?.id
      const reportId = Number(rawId)
      
      console.log('🔍 Debug handleApproveReport:', { 
        reporteId, 
        selectedActivityId: selectedActivity?.id, 
        rawId, 
        reportId, 
        selectedActivity 
      })
      
      if (!reportId || isNaN(reportId)) {
        console.error('❌ ID del reporte inválido:', { reporteId, selectedActivity, rawId, reportId })
        toast.error('ID del reporte inválido')
        return
      }
      
      // Llamada a la API para aprobar el reporte
      await reportService.approveReport(reportId, comentario)
      
      // Actualizar el estado local inmediatamente
      const updatedActivity = { ...selectedActivity, estado_realizado: 'aprobado' }
      
      setActivities(prev => prev.map(activity => 
        activity.id === reportId 
          ? updatedActivity
          : activity
      ))
      
      // Actualizar selectedActivity inmediatamente para reflejar el cambio en la UI
      setSelectedActivity(updatedActivity)
      
      toast.success('Reporte aprobado exitosamente')
      
      // Actualizar estadísticas del dashboard principal
      await fetchStats()
      
      // Recargar datos para obtener estado actualizado
      await loadActivities()
      
      // Cerrar modales después de un breve delay para mostrar el cambio
      setTimeout(() => {
        setIsApproveDialogOpen(false)
        setIsViewDialogOpen(false)
        setSelectedActivity(null)
      }, 1000)
    } catch (error) {
      console.error('Error al aprobar reporte:', error)
      toast.error('Error al aprobar el reporte: ' + error.message)
    }
  }

  // Función para aprobar reporte rápidamente
  const handleQuickApproveReport = async (reporteId = null) => {
    try {
      const rawId = reporteId || selectedActivity?.id
      const reportId = Number(rawId)
      
      if (!reportId || isNaN(reportId)) {
        console.error('❌ ID del reporte inválido:', { reporteId, selectedActivity, rawId, reportId })
        toast.error('ID del reporte inválido')
        return
      }
      
      // Llamada a la API para aprobar rápidamente el reporte
      await reportService.quickApproveReport(reportId)
      
      // Actualizar el estado local
      setActivities(prev => prev.map(activity => 
        activity.id === reportId 
          ? { ...activity, estado_realizado: 'aprobado' }
          : activity
      ))
      
      toast.success('Reporte aprobado rápidamente')
      
      // Actualizar estadísticas del dashboard principal
      await fetchStats()
      
      // Recargar datos para obtener estado actualizado
      await loadActivities()
    } catch (error) {
      console.error('Error al aprobar reporte rápidamente:', error)
      toast.error('Error al aprobar rápidamente el reporte: ' + error.message)
    }
  }



  // Función para devolver reporte a pendiente
  const handleReturnToPending = async (reporteId = null, comentario = 'Devuelto a pendiente') => {
    try {
      const rawId = reporteId || selectedActivity?.id
      const reportId = Number(rawId)
      
      if (!reportId || isNaN(reportId)) {
        console.error('❌ ID del reporte inválido:', { reporteId, selectedActivity, rawId, reportId })
        toast.error('ID del reporte inválido')
        return
      }
      
      console.log('🔄 ANTES - handleReturnToPending para reporte ID:', reportId)
      console.log('🔄 Estado actual del selectedActivity:', selectedActivity?.estado_realizado)
      
      // Llamada a la API para devolver el reporte a pendiente
      const response = await reportService.returnReportToPending(reportId, comentario)
      console.log('✅ RESPUESTA del backend (returnReportToPending):', response)
      
      // Actualizar el estado local inmediatamente
      const updatedActivity = { ...selectedActivity, estado_realizado: 'pendiente', comentarios: comentario }
      
      setActivities(prev => prev.map(activity => 
        activity.id === reportId 
          ? updatedActivity
          : activity
      ))
      
      // Actualizar selectedActivity inmediatamente para reflejar el cambio en la UI
      setSelectedActivity(updatedActivity)
      
      toast.success('Reporte devuelto a pendiente')
      
      // Actualizar estadísticas del dashboard principal
      await fetchStats()
      
      // Recargar datos para obtener estado actualizado
      console.log('🔄 Recargando actividades desde handleReturnToPending...')
      await loadActivities()
    } catch (error) {
      console.error('❌ Error al devolver reporte a pendiente (handleReturnToPending):', error)
      toast.error('Error al devolver reporte a pendiente: ' + error.message)
    }
  }

  // Función para devolver reporte a revisión
  const handleReturnToReview = async (reporteId = null, comentario = 'Devuelto a revisión') => {
    try {
      const rawId = reporteId || selectedActivity?.id
      const reportId = Number(rawId)
      
      if (!reportId || isNaN(reportId)) {
        console.error('❌ ID del reporte inválido:', { reporteId, selectedActivity, rawId, reportId })
        toast.error('ID del reporte inválido')
        return
      }
      
      // Llamada a la API para devolver el reporte a revisión
      await reportService.returnReportToReview(reportId, comentario)
      
      // Actualizar el estado local inmediatamente
      const updatedActivity = { ...selectedActivity, estado_realizado: 'enviado', comentarios: comentario }
      
      setActivities(prev => prev.map(activity => 
        activity.id === reportId 
          ? updatedActivity
          : activity
      ))
      
      // Actualizar selectedActivity inmediatamente para reflejar el cambio en la UI
      setSelectedActivity(updatedActivity)
      
      toast.success('Reporte devuelto a revisión')
      
      // Actualizar estadísticas del dashboard principal
      await fetchStats()
      
      // Recargar datos para obtener estado actualizado
      await loadActivities()
    } catch (error) {
      console.error('Error al devolver reporte a revisión:', error)
      toast.error('Error al devolver reporte a revisión: ' + error.message)
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
      
      const reportId = Number(selectedActivity.id)
      
      if (!reportId || isNaN(reportId)) {
        console.error('❌ ID del reporte inválido:', { selectedActivity, reportId })
        toast.error('ID del reporte inválido')
        return
      }
      
      // Debug logs
      console.log('selectedActivity:', selectedActivity)
      console.log('reportId:', reportId)
      console.log('returnComment:', returnComment)
      
      // Llamada a la API para devolver el reporte (rechazar reporte)
      await reportService.rejectReport(reportId, returnComment)
      
      // Actualizar el estado local inmediatamente
      const updatedActivity = { ...selectedActivity, estado_realizado: 'devuelto', comentarios: returnComment }
      
      setActivities(prev => prev.map(activity => 
        activity.id === reportId 
          ? updatedActivity
          : activity
      ))
      
      // Actualizar selectedActivity inmediatamente para reflejar el cambio en la UI
      setSelectedActivity(updatedActivity)
      
      toast.success('Reporte rechazado exitosamente')
      setReturnComment('')
      
      // Actualizar estadísticas del dashboard principal
      await fetchStats()
      
      // Recargar datos para obtener estado actualizado
      await loadActivities()
      
      // Cerrar modales después de un breve delay para mostrar el cambio
      setTimeout(() => {
        setIsReturnDialogOpen(false)
        setIsViewDialogOpen(false)
        setSelectedActivity(null)
      }, 1000)
    } catch (error) {
      console.error('Error al rechazar reporte:', error)
      toast.error('Error al rechazar reporte')
    }
  }

  const handleReviewActivity = async (activity, newStatus) => {
    try {
      if (!activity.reporteId) {
        toast.error('No se encontró el reporte asociado')
        return
      }
      
      if (newStatus === "aprobada") {
        await reportService.approveReport(activity.reporteId, reviewComment || 'Reporte aprobado')
        toast.success('Reporte aprobado exitosamente')
      } else if (newStatus === "devuelto") {
        if (!reviewComment.trim()) {
          toast.error('Debe proporcionar comentarios para devolver el reporte')
          return
        }
        await reportService.rejectReport(activity.reporteId, reviewComment)
        toast.success('Reporte devuelto exitosamente')
      }
      
      // Actualizar el estado local - todas las actividades del reporte
      setActivities((prev) =>
        prev.map((act) => 
          act.reporteId === activity.reporteId 
            ? { ...act, estado_realizado: newStatus, comentarios_revision: reviewComment } 
            : act
        )
      )
      
      setReviewComment("")
      
      // Cerrar modal después de mostrar el toast
      setTimeout(() => {
        setIsReviewDialogOpen(false)
        setSelectedActivity(null)
      }, 1500)
      
      // Recargar actividades para obtener datos actualizados
      await loadActivities()
      
      // Actualizar estadísticas del dashboard principal
      await fetchStats()
    } catch (error) {
      console.error('Error al revisar reporte:', error)
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
      aprobado: {  // Cambiado de 'aprobada' a 'aprobado'
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: CheckCircle,
        text: 'Aprobado',
        pulse: false
      },
      devuelto: {  // Estado correcto para actividades devueltas
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: AlertTriangle,
        text: 'Devuelto',
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
        <h3 className="text-lg font-semibold text-gray-900">Lista de Reportes</h3>
        <p className="text-sm text-gray-600 mt-1">Gestiona y revisa los reportes enviados por los docentes</p>
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
                  <FileText className="w-4 h-4" />
                  <span>Reporte</span>
                </div>
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Fecha</span>
                </div>
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]">Tipo</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]">Estado</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
             {activities.length === 0 ? (
               <tr>
                 <td colSpan="6" className="px-4 py-12 text-center">
                   <div className="flex flex-col items-center justify-center">
                     <FileText className="w-12 h-12 text-gray-400 mb-4" />
                     <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reportes</h3>
                     <p className="text-gray-500">No se encontraron reportes que coincidan con los filtros aplicados.</p>
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
                  <div className="text-sm text-gray-900 font-medium">{activity.titulo || `Reporte #${activity.id}`}</div>
                  <div className="text-xs text-gray-500 truncate max-w-xs">{activity.actividadesCount ? `${activity.actividadesCount} actividades` : 'Sin actividades'}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{activity.fechaEnvio ? new Date(activity.fechaEnvio).toLocaleDateString() : 'N/A'}</div>
                  <div className="text-xs text-gray-500">Enviado</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {activity.categoria || 'GENERAL'}
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
                              openReportDetails(activity)
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
                                Revisar reporte
                              </button>
                              
                              <button
                                onClick={async () => {
                                  try {
                                    await handleQuickApproveReport(activity.reporteId)
                                    setDropdownOpen(null)
                                  } catch (error) {
                                    toast.error('Error al aprobar reporte: ' + error.message)
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
                          
                          {activity.estado_realizado === "devuelto" && (
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

                            </>
                          )}
                          
                          {activity.estado_realizado === "revisada" && (
                            <button
                              onClick={async () => {
                                try {
                                  console.log('🔄 ANTES - Cambiando estado a pendiente para reporte ID:', activity.id)
                                  console.log('🔄 Estado actual del reporte:', activity.estado_realizado)
                                  
                                  const response = await reportService.updateReportStatus(activity.id, 'pendiente', 'Devuelto a pendiente desde revisión')
                                  console.log('✅ RESPUESTA del backend:', response)
                                  
                                  // Actualizar el estado local inmediatamente
                                  setActivities(prev => prev.map(act => 
                                    act.id === activity.id 
                                      ? { ...act, estado_realizado: 'pendiente' }
                                      : act
                                  ))
                                  
                                  toast.success('Reporte devuelto a pendiente exitosamente')
                                  console.log('🔄 Recargando actividades...')
                                  await loadActivities()
                                  setDropdownOpen(null)
                                } catch (error) {
                                  console.error('❌ Error al devolver reporte a pendiente:', error)
                                  toast.error('Error al devolver reporte a pendiente: ' + error.message)
                                }
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              <Clock className="mr-3 h-4 w-4 text-blue-500" />
                              Devolver a Pendiente
                            </button>
                          )}
                          
                          {activity.estado_realizado === "aprobado" && (
                            <>
                              <button
                                onClick={async () => {
                                  try {
                                    await handleReturnToPending(activity.reporteId)
                                    setDropdownOpen(null)
                                  } catch (error) {
                                    toast.error('Error al devolver reporte a pendiente: ' + error.message)
                                  }
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                <Clock className="mr-3 h-4 w-4 text-orange-500" />
                                Devolver a Pendiente
                              </button>

                            </>
                          )}
                          
                          {activity.estado_realizado === "devuelto" && (
                            <>
                              <button
                                onClick={async () => {
                                  try {
                                    await handleReturnToPending(activity.reporteId)
                                    setDropdownOpen(null)
                                  } catch (error) {
                                    toast.error('Error al devolver reporte a pendiente: ' + error.message)
                                  }
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                <Clock className="mr-3 h-4 w-4 text-orange-500" />
                                Devolver a Pendiente
                              </button>

                            </>
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
          <h1 className="text-3xl font-bold text-green-800 mb-2">Revisión y Aprobación de Reportes</h1>
          <p className="text-green-600">Revisa y aprueba los reportes enviados por los docentes</p>
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
              <span>Mostrando {filteredActivities.length} de {activities.length} reportes</span>
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
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Reportes</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{filteredActivities.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Todos los reportes</p>
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
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Aprobados</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{getActivitiesByStatus("aprobado").length}</p>
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
                  <p className="text-3xl font-bold text-red-600 mt-2">{getActivitiesByStatus("devuelto").length}</p>
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
                    Aprobadas ({getActivitiesByStatus("aprobado").length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="devueltas"
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    className="rounded-md"
                  >
                    Devueltas ({getActivitiesByStatus("devuelto").length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="pendientes" activeTab={activeTab}>
                <ActivityTable activities={getActivitiesByStatus("pendiente")} />
              </TabsContent>

              <TabsContent value="aprobadas" activeTab={activeTab}>
                    <ActivityTable activities={getActivitiesByStatus("aprobado")} />
                  </TabsContent>
                  <TabsContent value="devueltas" activeTab={activeTab}>
                    <ActivityTable activities={getActivitiesByStatus("devuelto")} />
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
              <p className="text-green-600">Revisión y gestión del reporte</p>
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
                      <p className="text-2xl font-bold text-gray-900">
                        {(() => {
                          // Priorizar fechaActualizacion, luego fechaEnvio, luego fechaCreacion
                          const fecha = selectedActivity.fechaActualizacion || 
                                       selectedActivity.fechaEnvio || 
                                       selectedActivity.fechaCreacion;
                          
                          if (fecha) {
                            return new Date(fecha).toLocaleString('es-ES', {
                              year: 'numeric',
                              month: '2-digit', 
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            });
                          }
                          return 'No disponible';
                        })()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Horas Registradas</p>
                      <p className="text-3xl font-bold text-purple-600">{Number(selectedActivity?.total_horas ?? selectedActivity?.totalHoras ?? (Array.isArray(selectedActivity?.actividades) ? selectedActivity.actividades.reduce((s,a)=> s + Number(a.horas_dedicadas ?? a.horas ?? 0), 0) : 0))}</p>
                      <p className="text-xs text-gray-500">Horas académicas</p>
                    </div>
                  </div>
                </div>

                {/* Tabs Section */}
                <Tabs activeTab={activeDetailTab} onTabChange={setActiveDetailTab}>
                  <TabsList className="grid grid-cols-4 bg-gray-100 rounded-md p-1">
                    <TabsTrigger
                      value="activities"
                      activeTab={activeDetailTab}
                      onTabChange={setActiveDetailTab}
                      className="rounded-md data-[state=active]:bg-white data-[state=active]:text-green-700"
                    >
                      Reportes
                    </TabsTrigger>
                    <TabsTrigger
                      value="summary"
                      activeTab={activeDetailTab}
                      onTabChange={setActiveDetailTab}
                      className="rounded-md data-[state=active]:bg-white data-[state=active]:text-green-700"
                    >
                      Resumen Ejecutivo
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
                      Observaciones
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="activities" activeTab={activeDetailTab}>
                    <TeacherActivitiesTab selectedActivity={selectedActivity} />
                  </TabsContent>

                  <TabsContent value="summary" activeTab={activeDetailTab}>
                    <div className="bg-white border border-gray-200 rounded-lg mt-4">
                      <div className="border-b border-gray-200 p-4">
                        <h3 className="text-lg font-semibold text-gray-900">Resumen Ejecutivo del Período</h3>
                      </div>
                      <div className="p-4">
                        {selectedActivity?.resumenEjecutivo ? (
                          <div className="prose max-w-none">
                            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                              {selectedActivity.resumenEjecutivo}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 italic">
                              No hay resumen ejecutivo disponible para este reporte.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" activeTab={activeDetailTab}>
                    <div className="bg-white border border-gray-200 rounded-lg mt-4">
                      <div className="border-b border-gray-200 p-4">
                        <h3 className="text-lg font-semibold text-gray-900">Documentos Adjuntos</h3>
                      </div>
                      <div className="p-4">
                        <ListaArchivosReporte 
                          archivos={selectedActivity?.archivos || []}
                          titulo="Archivos adjuntos"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="comments" activeTab={activeDetailTab}>
                    <div className="bg-white border border-gray-200 rounded-lg mt-4">
                      <div className="border-b border-gray-200 p-4">
                        <h3 className="text-lg font-semibold text-gray-900">Observaciones del Administrador</h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-4">
                          {selectedActivity?.comentarios || selectedActivity?.comentariosRevision ? (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                              <p className="text-sm text-red-800">
                                {selectedActivity.comentariosRevision || selectedActivity.comentarios}
                              </p>
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">
                              Sin observaciones del administrador.
                            </p>
                          )}

                          <div className="border-t pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Agregar observaciones
                            </label>
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Escribe observaciones sobre este reporte..."
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
                        onClick={() => {
                          console.log('🔍 Abriendo modal aprobación:', { selectedActivity });
                          setIsApproveDialogOpen(true);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aprobar Reporte
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
                            await reportService.updateReportStatus(selectedActivity.id, 'pendiente', 'Regresado a pendiente desde aprobado')
                            setActivities(prev => prev.map(activity => 
                              activity.id === selectedActivity.id 
                                ? { ...activity, estado_realizado: 'pendiente' }
                                : activity
                            ))
                            setSelectedActivity({ ...selectedActivity, estado_realizado: 'pendiente' })
                            toast.success('Reporte regresado a pendiente exitosamente')
                            setTimeout(() => {
                              setIsViewDialogOpen(false)
                            }, 1500)
                          } catch (error) {
                            toast.error('Error al regresar reporte a pendiente: ' + error.message)
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
                  {selectedActivity?.estado_realizado === "devuelto" && (
                    <>
                      <button 
                        onClick={() => {
                          console.log('🔍 Abriendo modal aprobación (devuelto):', { selectedActivity });
                          setIsApproveDialogOpen(true);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aprobar Reporte
                      </button>

                      <button 
                        onClick={async () => {
                          try {
                            await handleReturnToPending(selectedActivity.id, 'Regresado a pendiente desde devuelto')
                            setTimeout(() => {
                              setIsViewDialogOpen(false)
                            }, 1500)
                          } catch (error) {
                            console.error('❌ Error al regresar reporte a pendiente (desde devuelto):', error)
                            toast.error('Error al regresar reporte a pendiente: ' + error.message)
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
                onClick={() => selectedActivity && handleReviewActivity(selectedActivity, "devuelto")}
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
                Envía una notificación a los docentes sobre el estado de sus reportes
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
                  <option value="pending">Docentes con reportes pendientes</option>
                  <option value="all">Todos los docentes</option>
                  <option value="returned">Docentes con reportes devueltos</option>
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
                onClick={() => {
                  console.log('🔍 Botón aprobación clickeado:', { selectedActivity });
                  handleApproveReport(selectedActivity?.id);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Aprobar Reporte
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