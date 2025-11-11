/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"
import { useState, useEffect } from "react"
import {
  Search,
  Calendar,
  Filter,
  RefreshCw,
  FileX,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  User,
  Send,
  History,
  Users,
  Activity,
  ArrowLeft,
  Star,
  FileText,
  AlertTriangle,
  Download,
  Edit3,
  X
} from "lucide-react"
import userService from "../../services/userService"
import activityService from "../../services/activityService"

// Componentes reutilizables
const Button = ({ children, className, ...props }) => (
  <button 
    className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ children, className, ...props }) => (
  <div 
    className={`bg-white rounded-lg border shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

const Input = ({ className, ...props }) => (
  <input 
    className={`w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 ${className}`}
    {...props}
  />
);

const Select = ({ className, children, ...props }) => (
  <select 
    className={`w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 ${className}`}
    {...props}
  >
    {children}
  </select>
);

const Label = ({ children, htmlFor, className }) => (
  <label 
    htmlFor={htmlFor}
    className={`text-sm font-medium ${className}`}
  >
    {children}
  </label>
);

// Componente Modal
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Hook de toast
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, type = "success" }) => {
    const id = Date.now().toString();
    const newToast = { id, title, description, type };
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-lg max-w-sm ${
            toast.type === 'success' ? 'bg-green-500 text-white' :
            toast.type === 'error' ? 'bg-red-500 text-white' :
            toast.type === 'info' ? 'bg-blue-500 text-white' :
            'bg-gray-500 text-white'
          }`}
        >
          <div className="font-medium">{toast.title}</div>
          {toast.description && (
            <div className="text-sm opacity-90">{toast.description}</div>
          )}
        </div>
      ))}
    </div>
  );

  return { toast, ToastContainer };
};

const CorreccionesDashboard = () => {
  // Estados principales
  const [currentView, setCurrentView] = useState('users'); // 'users' o 'activities'
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados de filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // Estados del modal de revisión
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [reviewComment, setReviewComment] = useState("");
  
  const { toast, ToastContainer } = useToast();

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  // Función para cargar usuarios
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getAllUsers();
      
      if (response.data && Array.isArray(response.data)) {
        // Filtrar solo usuarios activos y que no sean administradores
        const filteredUsers = response.data.filter(user => 
          user.activo && user.rol?.nombre !== 'ADMINISTRADOR'
        );
        setUsers(filteredUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        type: "error"
      });
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cargar actividades de un usuario
  const loadUserActivities = async (userId, filters = {}) => {
    try {
      setIsLoading(true);
      console.log('🔍 [CorreccionesDashboard] Cargando actividades para usuario:', userId);
      const response = await activityService.getActivitiesByUserCurrentPeriod(userId, {
        page: currentPage,
        limit: pageSize,
        ...filters
      });

      console.log('📋 [CorreccionesDashboard] Respuesta completa:', response);
      console.log('📋 [CorreccionesDashboard] response.data:', response.data);
      console.log('📋 [CorreccionesDashboard] Es array response.data:', Array.isArray(response.data));

      // El servicio getActivitiesByUserCurrentPeriod retorna: { data: [], pagination: {}, periodoActivo: {} }
      // NO tiene un nivel extra de data.data
      if (response.data && Array.isArray(response.data)) {
        console.log('✅ [CorreccionesDashboard] Actividades encontradas:', response.data.length);
        setActivities(response.data);
        setTotalRecords(response.pagination?.total || response.data.length);
        
        // Solo mostrar toast informativo si no hay actividades y no es por un error
        if (response.data.length === 0) {
          toast({
            title: "Sin actividades",
            description: "Este usuario no ha registrado actividades en el período seleccionado",
            type: "info"
          });
        }
      } else {
        console.log('⚠️ [CorreccionesDashboard] No se encontraron actividades');
        setActivities([]);
        setTotalRecords(0);
        toast({
          title: "Sin actividades",
          description: "Este usuario no ha registrado actividades en el período seleccionado",
          type: "info"
        });
      }
    } catch (error) {
      console.error("Error loading user activities:", error);
      
      // Verificar si es un error 404 (no encontrado) o si no hay datos
      if (error.response && error.response.status === 404) {
        toast({
          title: "Sin actividades",
          description: "Este usuario no ha registrado actividades en el período seleccionado",
          type: "info"
        });
      } else {
        // Solo mostrar error si es un problema real del servidor
        toast({
          title: "Error",
          description: "Ocurrió un problema al cargar las actividades. Por favor, intente nuevamente.",
          type: "error"
        });
      }
      
      setActivities([]);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para seleccionar un usuario
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setCurrentView('activities');
    setCurrentPage(1);
    loadUserActivities(user.id);
  };

  // Función para volver a la lista de usuarios
  const handleBackToUsers = () => {
    setCurrentView('users');
    setSelectedUser(null);
    setActivities([]);
    setCurrentPage(1);
  };

  // Función para aplicar filtros
  const handleApplyFilters = () => {
    if (selectedUser) {
      setCurrentPage(1);
      loadUserActivities(selectedUser.id, {
        search: searchTerm,
        period: selectedPeriod !== "all" ? selectedPeriod : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
    }
  };

  // Función para limpiar filtros
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedPeriod("all");
    setDateFrom("");
    setDateTo("");
    if (selectedUser) {
      setCurrentPage(1);
      loadUserActivities(selectedUser.id);
    }
  };

  // Función para refrescar datos
  const handleRefresh = () => {
    if (currentView === 'users') {
      loadUsers();
    } else if (selectedUser) {
      loadUserActivities(selectedUser.id);
    }
  };

  // Función para cambiar página
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (selectedUser) {
      loadUserActivities(selectedUser.id);
    }
  };

  // Función para abrir modal de revisión
  const handleOpenReviewModal = (activity) => {
    setSelectedActivity(activity);
    setReviewComment("");
    setIsReviewModalOpen(true);
  };

  // Función para cerrar modal de revisión
  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedActivity(null);
    setReviewComment("");
  };

  // Función para enviar revisión
  const handleSubmitReview = async () => {
    if (!selectedActivity) {
      toast({
        title: "Error",
        description: "No hay actividad seleccionada",
        type: "error"
      });
      return;
    }

    try {
      // Aquí iría la llamada a la API para actualizar el estado de la actividad
      // await activityService.updateActivityStatus(selectedActivity.id, {
      //   comentarios: reviewComment
      // });

      toast({
        title: "Éxito",
        description: "La revisión se ha guardado correctamente",
        type: "success"
      });

      handleCloseReviewModal();
      
      // Recargar actividades
      if (selectedUser) {
        loadUserActivities(selectedUser.id);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la revisión",
        type: "error"
      });
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Función para obtener el color del estado
  const getStatusColor = () => '';

  // Función para obtener el icono del estado
  const getStatusIcon = () => null;

  // Función para obtener el texto del estado
  const getStatusText = () => '';

  // Calcular paginación
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Revisión de Actividades
              </h1>
              <p className="text-gray-600">
                {currentView === 'users' 
                  ? 'Selecciona un usuario para revisar sus actividades registradas'
                  : `Revisando actividades de ${selectedUser?.nombre || 'Usuario'}`
                }
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {currentView === 'activities' && (
                <Button
                  onClick={handleBackToUsers}
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a Usuarios
                </Button>
              )}
              <Button
                onClick={handleRefresh}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>
        </div>

        {/* Vista de usuarios */}
        {currentView === 'users' && (
          <div className="space-y-6">
            {/* Filtros de búsqueda */}
            <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center">
                  <Search className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Buscar Usuarios</h3>
                </div>
                <div className="flex-1 flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      id="search"
                      type="text"
                      placeholder="Buscar por nombre o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                     <Button
                       onClick={() => {
                         // Filtrar usuarios por término de búsqueda
                         loadUsers();
                       }}
                       className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 text-sm"
                     >
                       <Search className="w-3.5 h-3.5 mr-1" />
                       Buscar
                     </Button>
                     <Button
                       onClick={() => {
                         setSearchTerm("");
                         loadUsers();
                       }}
                       className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 text-sm"
                     >
                       <RefreshCw className="w-3.5 h-3.5 mr-1" />
                       Limpiar
                     </Button>
                   </div>
                </div>
              </div>
            </Card>

            {/* Lista de usuarios */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-green-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Usuarios Registrados
                  </h2>
                </div>
                <div className="text-sm text-gray-600">
                  {users.length} usuarios encontrados
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
                  <span className="ml-3 text-gray-600">Cargando usuarios...</span>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay usuarios registrados
                  </h3>
                  <p className="text-gray-600">
                    No se encontraron usuarios activos en el sistema.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users
                    .filter(user => 
                      !searchTerm || 
                      user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((user) => (
                    <div
                      key={user.id}
                      className="bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <User className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                            {user.nombre}
                          </h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <FileText className="w-4 h-4 mr-2" />
                          <span>Rol: {user.rol?.nombre || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Registro: {formatDate(user.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <Button 
                          onClick={() => {
                            setSelectedUser(user);
                            setCurrentView('activities');
                            loadUserActivities(user.id);
                          }}
                          className="w-full bg-green-600 hover:bg-green-700 text-white group-hover:bg-green-700 py-2 text-sm"
                        >
                          <Eye className="w-3.5 h-3.5 mr-2" />
                          Ver Actividades
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Vista de actividades */}
        {currentView === 'activities' && (
          <>
            {/* Información del usuario seleccionado - Compacta */}
            <Card className="p-4 mb-4 bg-white border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h2 className="text-lg font-semibold text-gray-900">{selectedUser?.nombre}</h2>
                    <p className="text-sm text-gray-600">{selectedUser?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Star className="w-3 h-3 mr-1" />
                    {selectedUser?.rol?.nombre || 'Usuario'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Filtros para actividades - Compactos */}
            <Card className="p-3 bg-gray-50 border border-gray-200 mb-4">
              <div className="space-y-3">
                {/* Header colapsible */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Filter className="w-4 h-4 text-gray-600 mr-2" />
                    <h3 className="text-sm font-medium text-gray-900">Filtros</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handleApplyFilters}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs"
                    >
                      <Filter className="w-3 h-3 mr-1" />
                      Aplicar
                    </Button>
                    <Button
                      onClick={handleClearFilters}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 text-xs"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                {/* Filtros en una sola fila */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <Input
                      type="text"
                      placeholder="Buscar actividad..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="text-xs h-8"
                    />
                  </div>
                  <div>
                    <Select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="text-xs h-8"
                    >
                      <option value="all">Todos los períodos</option>
                      <option value="current">Período actual</option>
                      <option value="previous">Período anterior</option>
                    </Select>
                  </div>
                  <div>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="text-xs h-8"
                      placeholder="Fecha desde"
                    />
                  </div>
                  <div>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="text-xs h-8"
                      placeholder="Fecha hasta"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Lista de actividades */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-green-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Actividades Registradas
                  </h2>
                </div>
                <div className="text-xs text-gray-600">
                  {totalRecords > 0 && (
                    `${startRecord}-${endRecord} de ${totalRecords}`
                  )}
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
                  <span className="ml-3 text-gray-600">Cargando actividades...</span>
                </div>
              ) : activities.length === 0 ? (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                  <div className="flex items-start">
                    <Activity className="w-12 h-12 text-blue-500 mr-4 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        Sin actividades en el período activo
                      </h3>
                      <p className="text-blue-800 mb-2">
                        <strong>{selectedUser?.nombre || 'Este usuario'}</strong> no tiene actividades registradas en el período académico actual.
                      </p>
                      <p className="text-sm text-blue-700">
                        💡 <strong>Nota:</strong> Solo se muestran actividades del semestre activo. Esto es normal si el docente aún no ha planificado o registrado actividades para este período.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Vista de cards para actividades - Información completa */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-shadow duration-200"
                      >
                        {/* Header con título y estados */}
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-3">
                            {activity.titulo}
                          </h3>
                          <div className="flex flex-col gap-1 shrink-0">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.estado_realizado)}`}>
                              {getStatusIcon(activity.estado_realizado)}
                              <span className="ml-1">{getStatusText(activity.estado_realizado)}</span>
                            </div>
                            {activity.estado_planificacion && (
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                activity.estado_planificacion === 'aprobada' ? 'bg-green-100 text-green-800' :
                                activity.estado_planificacion === 'enviada' ? 'bg-blue-100 text-blue-800' :
                                activity.estado_planificacion === 'rechazada' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                <span>{activity.estado_planificacion}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Información detallada */}
                        <div className="space-y-3 mb-4">
                          {/* Categoría, fechas y horas */}
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center text-gray-600">
                              <FileText className="w-4 h-4 mr-2" />
                              <span className="truncate">{activity.categoria || 'General'}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span className="text-xs">
                                {activity.fechaInicio ? new Date(activity.fechaInicio).toLocaleDateString('es-ES') : 'Sin fecha'}
                              </span>
                            </div>
                            <div>
                              <span className="inline-flex items-center text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                <Clock className="w-3 h-3 mr-1" /> {Number(activity.horas_dedicadas ?? activity.horas ?? 0)}h dedicadas
                              </span>
                            </div>
                          </div>

                          {/* Fechas de inicio y fin */}
                          {(activity.fechaInicio || activity.fechaFin) && (
                            <div className="bg-gray-50 p-3 rounded-md">
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                {activity.fechaInicio && (
                                  <div>
                                    <span className="font-medium text-gray-700">Inicio:</span>
                                    <div className="text-gray-600">{new Date(activity.fechaInicio).toLocaleDateString('es-ES')}</div>
                                  </div>
                                )}
                                {activity.fechaFin && (
                                  <div>
                                    <span className="font-medium text-gray-700">Fin:</span>
                                    <div className="text-gray-600">{new Date(activity.fechaFin).toLocaleDateString('es-ES')}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Ubicación y participantes */}
                          {(activity.ubicacion || activity.participantesEsperados) && (
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              {activity.ubicacion && (
                                <div className="flex items-center text-gray-600">
                                  <span className="w-4 h-4 mr-2 text-xs">📍</span>
                                  <span className="truncate text-xs">{activity.ubicacion}</span>
                                </div>
                              )}
                              {activity.participantesEsperados && (
                                <div className="flex items-center text-gray-600">
                                  <Users className="w-4 h-4 mr-2" />
                                  <span className="text-xs">{activity.participantesEsperados} participantes</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Presupuesto */}
                          {activity.presupuesto && (
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="w-4 h-4 mr-2 text-xs">💰</span>
                              <span className="text-xs">Presupuesto: ${parseFloat(activity.presupuesto).toLocaleString('es-ES')}</span>
                            </div>
                          )}

                          {/* Descripción */}
                          {activity.descripcion && (
                            <div className="border-t pt-3">
                              <p className="text-xs text-gray-600 line-clamp-3">
                                <span className="font-medium">Descripción:</span> {activity.descripcion}
                              </p>
                            </div>
                          )}

                          {/* Objetivos */}
                          {activity.objetivos && (
                            <div>
                              <p className="text-xs text-gray-600 line-clamp-2">
                                <span className="font-medium">Objetivos:</span> {activity.objetivos}
                              </p>
                            </div>
                          )}

                          {/* Período de planificación */}
                          {activity.periodo_planificacion && (
                            <div className="flex items-center text-xs text-gray-600">
                              <span className="font-medium mr-1">Período:</span>
                              <span>{activity.periodo_planificacion}</span>
                            </div>
                          )}

                          {/* Fecha de creación */}
                          <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-2">
                            <span>ID: {activity.id}</span>
                            <span>Creada: {new Date(activity.createdAt).toLocaleDateString('es-ES')}</span>
                          </div>
                        </div>
                        
                        {/* Botones de acción */}
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleOpenReviewModal(activity)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Revisar Actividad
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Paginación */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        Página {currentPage} de {totalPages}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="bg-gray-500 hover:bg-gray-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="bg-gray-500 hover:bg-gray-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Card>
          </>
        )}
      </div>

      {/* Modal de revisión - Información completa */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        title="Revisar Actividad Detallada"
      >
        {selectedActivity && (
          <div className="space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Header con título y estados */}
            <div className="flex items-start justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {selectedActivity.titulo}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="bg-white px-2 py-1 rounded-md">{selectedActivity.categoria || 'General'}</span>
                  <span className="bg-white px-2 py-1 rounded-md">ID: {selectedActivity.id}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0"></div>
            </div>

            {/* Información detallada de la actividad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fechas */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Fechas
                </h4>
                <div className="space-y-2 text-sm">
                  {selectedActivity.fechaInicio && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Inicio:</span>
                      <span className="font-medium">{new Date(selectedActivity.fechaInicio).toLocaleDateString('es-ES')}</span>
                    </div>
                  )}
                  {selectedActivity.fechaFin && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fin:</span>
                      <span className="font-medium">{new Date(selectedActivity.fechaFin).toLocaleDateString('es-ES')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Creada:</span>
                    <span className="font-medium">{new Date(selectedActivity.createdAt).toLocaleDateString('es-ES')}</span>
                  </div>
                  {selectedActivity.fecha_envio_planificacion && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Enviada:</span>
                      <span className="font-medium">{new Date(selectedActivity.fecha_envio_planificacion).toLocaleDateString('es-ES')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Detalles adicionales */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Detalles
                </h4>
                <div className="space-y-2 text-sm">
                   <div className="flex justify-between">
                     <span className="text-gray-600">Horas Dedicadas:</span>
                     <span className="font-medium">{Number(selectedActivity.horas_dedicadas ?? selectedActivity.horas ?? 0)}h</span>
                   </div>
                   {selectedActivity.ubicacion && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Ubicación:</span>
                       <span className="font-medium text-right">{selectedActivity.ubicacion}</span>
                     </div>
                   )}
                   {selectedActivity.participantesEsperados && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Participantes:</span>
                       <span className="font-medium">{selectedActivity.participantesEsperados}</span>
                     </div>
                   )}
                   {selectedActivity.presupuesto && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Presupuesto:</span>
                       <span className="font-medium">${parseFloat(selectedActivity.presupuesto).toLocaleString('es-ES')}</span>
                     </div>
                   )}
                   {selectedActivity.periodo_planificacion && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Período:</span>
                       <span className="font-medium">{selectedActivity.periodo_planificacion}</span>
                     </div>
                   )}
                 </div>
              </div>
            </div>

            {/* Descripción */}
            {selectedActivity.descripcion && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-2">Descripción</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedActivity.descripcion}</p>
              </div>
            )}

            {/* Objetivos */}
            {selectedActivity.objetivos && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-2">Objetivos</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedActivity.objetivos}</p>
              </div>
            )}

            {/* Recursos */}
            {selectedActivity.recursos && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-gray-900 mb-2">Recursos Necesarios</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedActivity.recursos}</p>
              </div>
            )}

            {/* Observaciones de planificación */}
            {selectedActivity.observaciones_planificacion && (
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-2">Observaciones de Planificación</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedActivity.observaciones_planificacion}</p>
              </div>
            )}

            {/* Comentarios de revisión anteriores */}
            {selectedActivity.comentarios_revision && (
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-gray-900 mb-2">Comentarios de Revisión Anteriores</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedActivity.comentarios_revision}</p>
                {selectedActivity.fecha_revision && (
                  <p className="text-xs text-gray-500 mt-2">
                    Revisado el: {new Date(selectedActivity.fecha_revision).toLocaleDateString('es-ES')}
                  </p>
                )}
              </div>
            )}


            {/* Botones de acción */}
            <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
              <Button
                onClick={handleCloseReviewModal}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 text-sm"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default CorreccionesDashboard;