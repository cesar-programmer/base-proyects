/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
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
} from "lucide-react"

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

const Textarea = ({ className, ...props }) => (
  <textarea 
    className={`w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 ${className}`}
    {...props}
  />
);

// Componente de modal
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <div>{children}</div>
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
        <div key={toast.id} className={`p-4 rounded-lg shadow-lg max-w-sm ${
          toast.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' :
          toast.type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' :
          'bg-blue-100 border border-blue-400 text-blue-700'
        }`}>
          <div className="font-semibold">{toast.title}</div>
          <div className="text-sm">{toast.description}</div>
        </div>
      ))}
    </div>
  );

  return { toast, ToastContainer };
};

// Componente de encabezado
const DashboardHeader = () => (
  <div className="space-y-2">
    <h1 className="text-3xl font-bold text-green-700">Correcciones Pendientes</h1>
    <p className="text-gray-600">
      Consulta formularios devueltos para seguimiento y control
    </p>
  </div>
);

// Componente de skeleton de carga
const LoadingSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-36"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-72"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
        <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
      </div>
    ))}
  </div>
);

// Componente de estado vacío
const EmptyState = ({ onRefresh }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <FileX className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay correcciones pendientes</h3>
    <p className="text-gray-500 text-center mb-4">
      Todos los formularios están en orden o no hay reportes devueltos en este momento.
    </p>
    <Button
      onClick={onRefresh}
      className="flex items-center text-gray-700 border border-gray-300 hover:bg-gray-50"
    >
      <RefreshCw className="w-4 h-4 mr-2" />
      Refrescar
    </Button>
  </div>
);

// Componente de filtros
const FiltersSection = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedPeriod, 
  setSelectedPeriod, 
  dateFrom, 
  setDateFrom, 
  dateTo, 
  setDateTo, 
  onApplyFilters, 
  onClearFilters 
}) => (
  <Card>
    <div className="p-6 pb-4 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Filtros</h2>
      </div>
    </div>
    <div className="p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label className="text-gray-700">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre o correo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700">Periodo</Label>
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="all">Todos los periodos</option>
            <option value="2024-1">2024-1</option>
            <option value="2023-2">2023-2</option>
            <option value="2023-1">2023-1</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700">Desde</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700">Hasta</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          onClick={onApplyFilters}
          className="bg-green-600 text-white hover:bg-green-700 font-medium"
        >
          Aplicar filtros
        </Button>
        <Button
          onClick={onClearFilters}
          className="border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Limpiar
        </Button>
      </div>
    </div>
  </Card>
);

// Componente de tabla de correcciones
const CorrectionsTable = ({ data, onReviewClick, formatDate, truncateText }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Docente
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Correo
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Periodo
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Observaciones
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Devuelto
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((record) => (
          <tr key={record.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {record.teacherName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {record.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                {record.period}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
              <span title={record.observations}>
                {truncateText(record.observations)}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {formatDate(record.returnedDate)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
              <Button
                onClick={() => onReviewClick(record)}
                className="flex items-center bg-green-600 text-white hover:bg-green-700 text-sm font-medium"
              >
                <Eye className="w-4 h-4 mr-1" />
                Revisar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Componente de paginación
const PaginationSection = ({ 
  currentPage, 
  totalPages, 
  pageSize, 
  setPageSize, 
  filteredDataLength, 
  onPrevPage, 
  onNextPage 
}) => (
  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
    <div className="flex items-center gap-2">
      <Label className="text-gray-700">Mostrar:</Label>
      <Select
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
        className="px-2 py-1 border border-gray-300 rounded text-sm"
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
      </Select>
      <span className="text-sm text-gray-600">de {filteredDataLength} resultados</span>
    </div>

    <div className="flex items-center gap-2">
      <Button
        onClick={onPrevPage}
        disabled={currentPage === 1}
        className="flex items-center border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
      >
        <ChevronLeft className="w-4 h-4" />
        Anterior
      </Button>
      <span className="text-sm text-gray-600">
        Página {currentPage} de {totalPages}
      </span>
      <Button
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        className="flex items-center border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
      >
        Siguiente
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  </div>
);
// Componente de modal de revisión
const ReviewModal = ({ 
  isOpen, 
  selectedRecord, 
  reviewAction, 
  setReviewAction, 
  reviewComments, 
  setReviewComments, 
  onClose, 
  onApprove, 
  onReturn, 
  formatDate 
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={`Revisar Reporte - ${selectedRecord?.teacherName}`}>
    {selectedRecord && (
      <>
        <div className="p-6 space-y-6">
          <p className="text-gray-600">
            Revise los detalles del reporte y tome una decisión sobre su aprobación
          </p>
          
          {/* Report Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Información del Reporte</h3>
            <div className="grid gap-2 text-sm">
              <div><strong>Título:</strong> {selectedRecord.reportDetails.title}</div>
              <div><strong>Docente:</strong> {selectedRecord.teacherName}</div>
              <div><strong>Correo:</strong> {selectedRecord.email}</div>
              <div><strong>Periodo:</strong> {selectedRecord.period}</div>
              <div><strong>Fecha de envío:</strong> {formatDate(selectedRecord.reportDetails.submittedDate)}</div>
              <div><strong>Fecha de devolución:</strong> {formatDate(selectedRecord.returnedDate)}</div>
            </div>
          </div>

          {/* Original Observations */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Observaciones Originales</h3>
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm">
              {selectedRecord.reportDetails.originalObservations}
            </div>
          </div>

          {/* Activities */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Actividades Reportadas</h3>
            <div className="space-y-3">
              {selectedRecord.reportDetails.activities.map((activity) => (
                <div key={activity.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{activity.name}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      activity.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {activity.status === 'completed' ? 'Completada' : 'Incompleta'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                  {activity.evidence && (
                    <div className="bg-blue-50 border border-blue-200 p-2 rounded text-sm">
                      <strong>Evidencia:</strong> {activity.evidence}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Review Actions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Decisión de Revisión</h3>

            <div className="flex gap-4">
              <Button
                onClick={() => setReviewAction("approve")}
                className={`flex items-center font-medium ${
                  reviewAction === "approve"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Aprobar Reporte
              </Button>
              <Button
                onClick={() => setReviewAction("return")}
                className={`flex items-center font-medium ${
                  reviewAction === "return"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Devolver con Observaciones
              </Button>
            </div>

            {reviewAction === "return" && (
              <div className="space-y-2">
                <Label className="text-gray-700">Nuevas Observaciones</Label>
                <Textarea
                  placeholder="Escriba las observaciones y correcciones necesarias..."
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            )}

            {reviewAction === "approve" && (
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">
                    El reporte será aprobado y marcado como completado
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            onClick={onClose}
            className="border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Button>
          {reviewAction === "approve" && (
            <Button
              onClick={onApprove}
              className="flex items-center bg-green-600 text-white hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirmar Aprobación
            </Button>
          )}
          {reviewAction === "return" && (
            <Button
              onClick={onReturn}
              disabled={!reviewComments.trim()}
              className="flex items-center bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Devolver con Observaciones
            </Button>
          )}
        </div>
      </>
    )}
  </Modal>
);

// Datos estáticos
const mockData = [
  {
    id: "1",
    teacherName: "Dr. Juan Pérez",
    email: "juan.perez@uabc.edu.mx",
    period: "2024-1",
    observations: "Faltan evidencias de las actividades de investigación realizadas en el primer trimestre",
    returnedDate: new Date(2024, 2, 15),
    status: "devuelto",
    reportDetails: {
      title: "Reporte de Actividades Académicas - Primer Semestre 2024",
      submittedDate: new Date(2024, 2, 10),
      activities: [
        {
          id: "1",
          name: "Investigación en Inteligencia Artificial",
          description: "Desarrollo de algoritmos de machine learning para análisis de datos educativos",
          status: "completed",
          evidence: "Artículo publicado en revista indexada",
        },
        {
          id: "2",
          name: "Tutoría de Estudiantes",
          description: "Asesoría académica a 15 estudiantes de licenciatura",
          status: "incomplete",
        },
        {
          id: "3",
          name: "Participación en Comité Académico",
          description: "Miembro del comité de evaluación curricular",
          status: "completed",
          evidence: "Actas de reuniones y propuestas presentadas",
        },
      ],
      originalObservations:
        "Faltan evidencias de las actividades de investigación realizadas en el primer trimestre. Específicamente se requiere documentación que respalde las horas dedicadas a tutoría y los resultados obtenidos.",
    },
  },
  {
    id: "2",
    teacherName: "Dra. María González",
    email: "maria.gonzalez@uabc.edu.mx",
    period: "2024-1",
    observations: "Completar información sobre horas dedicadas a tutoría",
    returnedDate: new Date(2024, 2, 12),
    status: "devuelto",
    reportDetails: {
      title: "Reporte de Actividades Docentes - 2024-1",
      submittedDate: new Date(2024, 2, 8),
      activities: [
        {
          id: "1",
          name: "Docencia en Química Orgánica",
          description: "Impartición de clases teóricas y prácticas",
          status: "completed",
          evidence: "Planes de clase y evaluaciones aplicadas",
        },
        {
          id: "2",
          name: "Tutoría Académica",
          description: "Asesoría a estudiantes en proyectos de investigación",
          status: "incomplete",
        },
      ],
      originalObservations:
        "Completar información sobre horas dedicadas a tutoría y proporcionar evidencias de las sesiones realizadas.",
    },
  },
  {
    id: "3",
    teacherName: "Mtro. Carlos Rodríguez",
    email: "carlos.rodriguez@uabc.edu.mx",
    period: "2024-1",
    observations: "Revisar fechas de actividades académicas reportadas",
    returnedDate: new Date(2024, 2, 10),
    status: "devuelto",
    reportDetails: {
      title: "Informe de Actividades Humanidades - 2024-1",
      submittedDate: new Date(2024, 2, 5),
      activities: [
        {
          id: "1",
          name: "Curso de Literatura Contemporánea",
          description: "Desarrollo e impartición del curso",
          status: "completed",
          evidence: "Programa académico y materiales didácticos",
        },
        {
          id: "2",
          name: "Organización de Evento Cultural",
          description: "Coordinación del Festival de Letras UABC",
          status: "completed",
          evidence: "Programa del evento y registro fotográfico",
        },
      ],
      originalObservations:
        "Revisar fechas de actividades académicas reportadas. Algunas fechas no coinciden con el calendario académico oficial.",
    },
  },
];

// Componente principal
export default function CorreccionesDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Review modal state
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState(null);
  const [reviewComments, setReviewComments] = useState("");

  const { toast, ToastContainer } = useToast();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setData(mockData);
      setFilteredData(mockData);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 60) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const handleApplyFilters = () => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedPeriod !== "all") {
      filtered = filtered.filter((item) => item.period === selectedPeriod);
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter((item) => item.returnedDate >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      filtered = filtered.filter((item) => item.returnedDate <= toDate);
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedPeriod("all");
    setDateFrom("");
    setDateTo("");
    setFilteredData(data);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setData(mockData);
      setFilteredData(mockData);
      setIsLoading(false);
    }, 1000);
  };

  const handleReviewClick = (record) => {
    setSelectedRecord(record);
    setIsReviewModalOpen(true);
    setReviewAction(null);
    setReviewComments("");
  };

  const handleApproveReport = () => {
    if (!selectedRecord) return;

    const updatedData = data.filter((item) => item.id !== selectedRecord.id);
    setData(updatedData);
    setFilteredData(filteredData.filter((item) => item.id !== selectedRecord.id));

    setIsReviewModalOpen(false);
    setSelectedRecord(null);
    setReviewComments("");

    toast({
      title: "Reporte aprobado",
      description: `El reporte de ${selectedRecord.teacherName} ha sido aprobado exitosamente.`,
      type: "success"
    });
  };

  const handleReturnReport = () => {
    if (!selectedRecord || !reviewComments.trim()) {
      toast({
        title: "Error",
        description: "Debe proporcionar comentarios para devolver el reporte.",
        type: "error"
      });
      return;
    }

    const updatedData = data.map((item) =>
      item.id === selectedRecord.id
        ? { ...item, observations: reviewComments, returnedDate: new Date() }
        : item,
    );
    setData(updatedData);
    setFilteredData(
      filteredData.map((item) =>
        item.id === selectedRecord.id
          ? { ...item, observations: reviewComments, returnedDate: new Date() }
          : item,
      ),
    );

    setIsReviewModalOpen(false);
    setSelectedRecord(null);
    setReviewComments("");

    toast({
      title: "Reporte devuelto",
      description: `El reporte de ${selectedRecord.teacherName} ha sido devuelto con nuevas observaciones.`,
      type: "info"
    });
  };

  const handleModalClose = () => {
    setIsReviewModalOpen(false);
    setReviewAction(null);
    setReviewComments("");
  };

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <ToastContainer />
      
      <DashboardHeader />

      <FiltersSection 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      <Card>
        {isLoading ? (
          <div className="p-6">
            <LoadingSkeleton />
          </div>
        ) : filteredData.length === 0 ? (
          <EmptyState onRefresh={handleRefresh} />
        ) : (
          <>
            <CorrectionsTable 
              data={currentData}
              onReviewClick={handleReviewClick}
              formatDate={formatDate}
              truncateText={truncateText}
            />
            
            <PaginationSection 
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              setPageSize={setPageSize}
              filteredDataLength={filteredData.length}
              onPrevPage={() => setCurrentPage(Math.max(1, currentPage - 1))}
              onNextPage={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            />
          </>
        )}
      </Card>

      <ReviewModal 
        isOpen={isReviewModalOpen}
        selectedRecord={selectedRecord}
        reviewAction={reviewAction}
        setReviewAction={setReviewAction}
        reviewComments={reviewComments}
        setReviewComments={setReviewComments}
        onClose={handleModalClose}
        onApprove={handleApproveReport}
        onReturn={handleReturnReport}
        formatDate={formatDate}
      />
    </div>
  );
}