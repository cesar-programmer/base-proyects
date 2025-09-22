/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react"
import {
  CalendarDays,
  ListTodo,
  Clock,
  Flag,
  Plus,
  Save,
  Trash2,
  CheckCircle2,
  BookOpen,
  FlaskConical,
  ClipboardList,
  Users2,
  Megaphone,
  GraduationCap,
  Send,
  ChevronDown,
  Edit,
  Eye,
  Download,
  Upload,
  HardDrive
} from "lucide-react"
import { useAuth } from '../../context/AuthContext'
import activityService from '../../services/activityService';
import reportService from '../../services/reportService';
import { toast } from 'react-toastify'

const CATEGORIAS = [
  { label: "DOCENCIA", icon: BookOpen },
  { label: "INVESTIGACION", icon: FlaskConical },
  { label: "GESTION_ACADEMICA", icon: ClipboardList },
  { label: "TUTORIAS", icon: Users2 },
  { label: "EXTENSION", icon: Megaphone },
  { label: "CAPACITACION", icon: GraduationCap },
  { label: "ADMINISTRATIVA", icon: ClipboardList },
  { label: "POSGRADO", icon: GraduationCap },
  { label: "OTRA", icon: ClipboardList },
]

const CATALOGO = {
  DOCENCIA: [
    { id: "doc-1", titulo: "Preparación de clases", horas: 8, descripcion: "Diseño y actualización de materiales" },
    { id: "doc-2", titulo: "Aplicación de exámenes", horas: 6 },
    { id: "doc-3", titulo: "Evaluación de trabajos", horas: 10 },
  ],
  INVESTIGACION: [
    { id: "inv-1", titulo: "Revisión bibliográfica", horas: 12 },
    { id: "inv-2", titulo: "Diseño metodológico", horas: 10 },
    { id: "inv-3", titulo: "Redacción de artículo", horas: 16 },
  ],
  GESTION_ACADEMICA: [
    { id: "ges-1", titulo: "Coordinación de programa", horas: 10 },
    { id: "ges-2", titulo: "Comité académico", horas: 6 },
  ],
  TUTORIAS: [
    { id: "tut-1", titulo: "Asesoría a estudiantes", horas: 8 },
    { id: "tut-2", titulo: "Seguimiento de casos", horas: 6 },
  ],
  EXTENSION: [
    { id: "ext-1", titulo: "Vinculación con empresas", horas: 6 },
    { id: "ext-2", titulo: "Organización de evento", horas: 8 },
  ],
  CAPACITACION: [
    { id: "cap-1", titulo: "Curso de actualización docente", horas: 12 },
    { id: "cap-2", titulo: "Taller de tecnologías educativas", horas: 8 },
  ],
  ADMINISTRATIVA: [
    { id: "adm-1", titulo: "Gestión administrativa", horas: 6 },
    { id: "adm-2", titulo: "Coordinación institucional", horas: 8 },
  ],
  POSGRADO: [
    { id: "pos-1", titulo: "Dirección de tesis de posgrado", horas: 10 },
    { id: "pos-2", titulo: "Docencia en posgrado", horas: 8 },
  ],
  OTRA: [
    { id: "otr-1", titulo: "Actividad especial", horas: 4 },
    { id: "otr-2", titulo: "Proyecto específico", horas: 6 },
  ],
}

// Componente Badge
const Badge = ({ children, className = "", variant = "default" }) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    outline: "border bg-transparent",
  }
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}

// Componente Card
const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border shadow-sm ${className}`}>
    {children}
  </div>
)

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
)

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
)

// Componente Button
const Button = ({ children, onClick, disabled = false, variant = "default", size = "default", className = "", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap"
  const variants = {
    default: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-300",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-300"
  }
  
  const sizeClasses = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-9 px-3 py-2 text-xs",
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// Componente Input
const Input = ({ type = "text", value, onChange, disabled = false, placeholder = "", className = "", min, ...props }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    disabled={disabled}
    placeholder={placeholder}
    min={min}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

// Componente Textarea
const Textarea = ({ value, onChange, disabled = false, placeholder = "", className = "" }) => (
  <textarea
    value={value}
    onChange={onChange}
    disabled={disabled}
    placeholder={placeholder}
    className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  />
)

// Componente Select
const Select = ({ value, onChange, disabled = false, children, placeholder = "Seleccionar..." }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedOption = React.Children.toArray(children).find(child => 
    child.props.value === value
  )
  
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>{selectedOption ? selectedOption.props.children : placeholder}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {isOpen && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {React.Children.map(children, (child) => (
            <button
              key={child.props.value}
              type="button"
              onClick={() => {
                onChange(child.props.value)
                setIsOpen(false)
              }}
              className="flex w-full items-center px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              {child.props.children}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const SelectItem = ({ value, children }) => null // Este componente es solo para estructura

// Componente Accordion
const Accordion = ({ children, type = "single" }) => {
  const [openItems, setOpenItems] = useState(new Set())
  
  const toggleItem = (value) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(value)) {
      newOpenItems.delete(value)
    } else {
      if (type === "single") {
        newOpenItems.clear()
      }
      newOpenItems.add(value)
    }
    setOpenItems(newOpenItems)
  }
  
  return (
    <div className="w-full">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { 
          isOpen: openItems.has(child.props.value),
          onToggle: () => toggleItem(child.props.value)
        })
      )}
    </div>
  )
}

const AccordionItem = ({ value, children, isOpen, onToggle }) => (
  <div className="border-b border-gray-200">
    {React.Children.map(children, (child) =>
      React.cloneElement(child, { isOpen, onToggle })
    )}
  </div>
)

const AccordionTrigger = ({ children, isOpen, onToggle, className = "" }) => (
  <button
    onClick={onToggle}
    className={`flex w-full items-center justify-between py-4 font-medium text-left hover:text-gray-600 ${className}`}
  >
    {children}
    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
  </button>
)

const AccordionContent = ({ children, isOpen, className = "" }) => (
  <div className={`overflow-hidden transition-all ${isOpen ? 'pb-4' : 'h-0'} ${className}`}>
    {isOpen && children}
  </div>
)

// Componente Dialog/Modal
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  )
}

const DialogContent = ({ children }) => (
  <div className="p-6">
    {children}
  </div>
)

const DialogHeader = ({ children }) => (
  <div className="mb-4">
    {children}
  </div>
)

const DialogTitle = ({ children, className = "" }) => (
  <h2 className={`text-lg font-semibold ${className}`}>
    {children}
  </h2>
)

const DialogDescription = ({ children }) => (
  <p className="text-sm text-gray-600 mt-2">
    {children}
  </p>
)

const DialogFooter = ({ children, className = "" }) => (
  <div className={`flex justify-end gap-2 mt-4 ${className}`}>
    {children}
  </div>
)

// Componente Label
const Label = ({ children, className = "" }) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
)

function currentSemesterFor(date = new Date()) {
  const y = date.getFullYear()
  const half = date.getMonth() + 1 <= 6 ? 1 : 2
  return `${y}-${half}`
}

function getCurrentSemesterNumber(date = new Date()) {
  return date.getMonth() + 1 <= 6 ? 1 : 2
}

export default function PlannedActivities() {
  const { user } = useAuth();
  const semestre = useMemo(() => currentSemesterFor(), [])
  const [actividades, setActividades] = useState([])
  const [lastSavedAt, setLastSavedAt] = useState(null)
  const [autoSaveTimeouts, setAutoSaveTimeouts] = useState({})
  const [draftSavedAt, setDraftSavedAt] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showNewActivityDialog, setShowNewActivityDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [editingActivity, setEditingActivity] = useState(null)


  // Funciones para manejar borradores en localStorage
  const getDraftKey = () => `actividades_borrador_${user?.id}_${semestre}`
  
  const saveDraftToLocalStorage = () => {
    try {
      const draftKey = getDraftKey();
      const draftData = {
        actividades: actividadesArray,
        timestamp: new Date().toISOString(),
        semestre: semestre
      };
      localStorage.setItem(draftKey, JSON.stringify(draftData));
      setDraftSavedAt(new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }));
      toast.success('Borrador guardado en el dispositivo');
    } catch (error) {
      console.error('Error al guardar borrador:', error);
      toast.error('Error al guardar borrador');
    }
  }
  
  const loadDraftFromLocalStorage = () => {
    try {
      const draftKey = getDraftKey();
      const draftData = localStorage.getItem(draftKey);
      if (draftData) {
        const parsed = JSON.parse(draftData);
        if (parsed.actividades && Array.isArray(parsed.actividades)) {
          setActividades(parsed.actividades);
          setDraftSavedAt(new Date(parsed.timestamp).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }));
          toast.success('Borrador cargado desde el dispositivo');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error al cargar borrador:', error);
      toast.error('Error al cargar borrador');
      return false;
    }
  }
  
  const clearDraftFromLocalStorage = () => {
    try {
      const draftKey = getDraftKey();
      localStorage.removeItem(draftKey);
      setDraftSavedAt(null);
      toast.success('Borrador eliminado del dispositivo');
    } catch (error) {
      console.error('Error al eliminar borrador:', error);
      toast.error('Error al eliminar borrador');
    }
  }
  
  const hasDraftInLocalStorage = () => {
    try {
      const draftKey = getDraftKey();
      return localStorage.getItem(draftKey) !== null;
    } catch (error) {
      return false;
    }
  }

  useEffect(() => {
    loadActivities();
  }, [user]);

  const loadActivities = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      const response = await activityService.getActivitiesByTeacher(user.id);
      // Asegurar que siempre sea un array
      const activitiesData = response?.data || response || [];
      setActividades(Array.isArray(activitiesData) ? activitiesData : []);
    } catch (error) {
      console.error('Error al cargar actividades:', error);
      toast.error('Error al cargar actividades: ' + error.message);
      setActividades([]); // Asegurar que sea un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const actividadesArray = Array.isArray(actividades) ? actividades : []
  const totalActividades = actividadesArray.length
  const totalHoras = actividadesArray.reduce((sum, a) => sum + (Number(a.horas) || 0), 0)

  // Función para limpiar localStorage
  const clearLocalStorage = () => {
    try {
      // Limpiar todos los datos relacionados con actividades
      localStorage.removeItem('actividades_draft');
      localStorage.removeItem('actividades_planificadas');
      localStorage.removeItem('last_saved_at');
      localStorage.removeItem('current_semester');
      localStorage.removeItem('submitted_plan');
      
      // Recargar la página para empezar de cero
      toast.success('Datos locales limpiados exitosamente');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
      toast.error('Error al limpiar datos locales');
    }
  };

  const alreadyAdded = (cat, titulo) =>
    actividadesArray.some((a) => a.titulo === titulo && a.categoria === cat)

  const addFromCatalog = (cat, presetId) => {
    const preset = CATALOGO[cat].find((p) => p.id === presetId)
    if (!preset || alreadyAdded(cat, preset.titulo)) return
    setActividades((prev) => {
      const currentActivities = Array.isArray(prev) ? prev : [];
      return [
        ...currentActivities,
        {
          id: `${cat}-${preset.id}`,
          titulo: preset.titulo,
          categoria: cat,
          descripcion: preset.descripcion ?? "",
          horas: preset.horas ?? 4,
        },
      ];
    })
  }

  const addEmptyActivity = () => {
    setActividades((prev) => {
      const currentActivities = Array.isArray(prev) ? prev : [];
      return [
        ...currentActivities,
        {
          id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          titulo: "",
          categoria: "DOCENCIA",
          descripcion: "",
          fechaInicio: "",
          fechaFin: "",
          
          ubicacion: "",
          objetivos: "",
          recursos: "",
          presupuesto: 0,
          participantesEsperados: 0,
          archivoAdjunto: "",
          horas: 2,
  
          periodo_planificacion: "",
        },
      ];
    })
  }

  const autoSaveActivity = async (id) => {
    try {
      const activity = actividadesArray.find(a => a.id === id);
      if (!activity) return;
      
      // Mapear campos según el esquema del backend (incluir todos los campos del formulario)
      const activityData = {
        nombre: activity.titulo || '',
        descripcion: activity.descripcion || '',
        categoria: activity.categoria?.toUpperCase() || 'DOCENCIA',
        fecha_inicio: activity.fechaInicio || new Date().toISOString().split('T')[0],
        fecha_fin: activity.fechaFin || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        horas_dedicadas: activity.horas || 0,
        ubicacion: activity.ubicacion || '',
        presupuesto: activity.presupuesto || 0,
        participantesEsperados: activity.participantesEsperados || 0,
        objetivos: activity.objetivos || '',
        recursos: activity.recursos || '',
        observaciones: activity.observaciones || `Actividad planificada para el semestre ${semestre}`
      };
      
      if (activity.isNew) {
        await activityService.createPlannedActivity(activityData);
        // Marcar como no nueva después de crear
        setActividades((prev) => {
          const currentActivities = Array.isArray(prev) ? prev : [];
          return currentActivities.map((a) => 
            a.id === id ? { ...a, isNew: false, guardada: true } : a
          );
        });
      } else {
        // Para actualizar, enviar todos los campos del formulario
        const updateData = {
          nombre: activity.titulo || '',
          descripcion: activity.descripcion || '',
          categoria: activity.categoria?.toUpperCase() || 'DOCENCIA',
          fecha_inicio: activity.fechaInicio || new Date().toISOString().split('T')[0],
          fecha_fin: activity.fechaFin || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          horas_dedicadas: activity.horas || 0,
          ubicacion: activity.ubicacion || '',
          presupuesto: activity.presupuesto || 0,
          participantesEsperados: activity.participantesEsperados || 0,
          objetivos: activity.objetivos || '',
          recursos: activity.recursos || '',
          observaciones: activity.observaciones || `Actividad planificada para el semestre ${semestre}`
        };
        await activityService.updateActivity(id, updateData);
        // Marcar como guardada
        setActividades((prev) => {
          const currentActivities = Array.isArray(prev) ? prev : [];
          return currentActivities.map((a) => 
            a.id === id ? { ...a, guardada: true } : a
          );
        });
      }
      
      setLastSavedAt(new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }))
    } catch (error) {
      console.error('Error en guardado automático:', error);
      // No mostrar toast para errores de guardado automático para no molestar al usuario
    }
  }

  const updateActivity = (id, key, value) => {
    setActividades((prev) => {
      const currentActivities = Array.isArray(prev) ? prev : [];
      return currentActivities.map((a) => (a.id === id ? { ...a, [key]: value, guardada: false } : a));
    })
    
    // Limpiar timeout anterior si existe
    if (autoSaveTimeouts[id]) {
      clearTimeout(autoSaveTimeouts[id]);
    }
    
    // Configurar nuevo timeout para guardado automático (2 segundos después del último cambio)
    const timeoutId = setTimeout(() => {
      autoSaveActivity(id);
      setAutoSaveTimeouts(prev => {
        const newTimeouts = { ...prev };
        delete newTimeouts[id];
        return newTimeouts;
      });
    }, 2000);
    
    setAutoSaveTimeouts(prev => ({
      ...prev,
      [id]: timeoutId
    }));
  }

  const saveActivity = async (id) => {
    try {
      const activity = actividadesArray.find(a => a.id === id);
      if (!activity) return;
      
      if (activity.isNew) {
        // Mapear campos según el esquema del backend para crear (incluir todos los campos del formulario)
        const activityData = {
          nombre: activity.titulo || '',
          descripcion: activity.descripcion || '',
          categoria: activity.categoria?.toUpperCase() || 'DOCENCIA',
          fecha_inicio: activity.fechaInicio || new Date().toISOString().split('T')[0],
          fecha_fin: activity.fechaFin || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          horas_dedicadas: activity.horas || 0,
          ubicacion: activity.ubicacion || '',
          presupuesto: activity.presupuesto || 0,
          participantesEsperados: activity.participantesEsperados || 0,
          objetivos: activity.objetivos || '',
          recursos: activity.recursos || '',
          observaciones: activity.observaciones || `Actividad planificada para el semestre ${semestre}`
        };
        await activityService.createPlannedActivity(activityData);
        toast.success('Actividad creada exitosamente');
      } else {
        // Para actualizar, enviar todos los campos del formulario
        const updateData = {
          nombre: activity.titulo || '',
          descripcion: activity.descripcion || '',
          categoria: activity.categoria?.toUpperCase() || 'DOCENCIA',
          fecha_inicio: activity.fechaInicio || new Date().toISOString().split('T')[0],
          fecha_fin: activity.fechaFin || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          horas_dedicadas: activity.horas || 0,
          ubicacion: activity.ubicacion || '',
          presupuesto: activity.presupuesto || 0,
          participantesEsperados: activity.participantesEsperados || 0,
          objetivos: activity.objetivos || '',
          recursos: activity.recursos || '',
          observaciones: activity.observaciones || `Actividad planificada para el semestre ${semestre}`
        };
        await activityService.updateActivity(id, updateData);
        toast.success('Actividad actualizada exitosamente');
      }
      
      setActividades((prev) => {
        const currentActivities = Array.isArray(prev) ? prev : [];
        return currentActivities.map((a) => (a.id === id ? { ...a, guardada: true, isNew: false } : a));
      })
      setLastSavedAt(new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }))
      await loadActivities();
    } catch (error) {
      toast.error('Error al guardar actividad: ' + error.message);
    }
  }

  const deleteActivity = async (id) => {
    try {
      const activity = actividadesArray.find(a => a.id === id);
      if (!activity?.isNew) {
        await activityService.deleteActivity(id);
        toast.success('Actividad eliminada exitosamente', {
          position: "top-right",
          autoClose: 3000,
        });
      }
      setActividades((prev) => {
        const currentActivities = Array.isArray(prev) ? prev : [];
        return currentActivities.filter((a) => a.id !== id);
      })
    } catch (error) {
      toast.error(`Error al eliminar actividad: ${error.message || 'Error desconocido'}`, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  }

  const guardarBorrador = async () => {
    try {
      const currentActivities = Array.isArray(actividades) ? actividades : [];
      const actividadesAGuardar = currentActivities.filter(activity => !activity.guardada);
      
      if (actividadesAGuardar.length === 0) {
        toast.info('No hay cambios para guardar', {
          position: "top-right",
          autoClose: 2000,
        });
        return;
      }

      for (const activity of actividadesAGuardar) {
        await saveActivity(activity.id);
      }
      
      setLastSavedAt(new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }))
      toast.success(`Borrador guardado exitosamente (${actividadesAGuardar.length} actividades)`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(`Error al guardar borrador: ${error.message || 'Error desconocido'}`, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  }

  const enviarPlan = () => {
    setConfirmOpen(true)
  }

  const confirmarEnvio = async () => {
    try {
      const currentActivities = Array.isArray(actividades) ? actividades : [];
      
      if (currentActivities.length === 0) {
        toast.error('No hay actividades para enviar', {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // Mostrar toast de inicio del proceso
      toast.info(`Procesando ${currentActivities.length} actividades...`, {
        position: "top-right",
        autoClose: 2000,
      });

      // Crear todas las actividades en la base de datos
      const actividadesCreadas = [];
      const actividadesError = [];
      
      for (const actividad of currentActivities) {
        try {
          // Preparar los datos de la actividad según el esquema del backend (incluir todos los campos del formulario)
          const actividadData = {
            nombre: actividad.titulo || '',
            descripcion: actividad.descripcion || '',
            categoria: actividad.categoria?.toUpperCase() || 'DOCENCIA',
            fecha_inicio: actividad.fechaInicio || new Date().toISOString().split('T')[0],
            fecha_fin: actividad.fechaFin || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            horas_dedicadas: actividad.horas || 0,
            ubicacion: actividad.ubicacion || '',
            presupuesto: actividad.presupuesto || 0,
            participantesEsperados: actividad.participantesEsperados || 0,
            objetivos: actividad.objetivos || '',
            recursos: actividad.recursos || '',
            observaciones: `Actividad planificada para el semestre ${semestre}`
          };

          // Si la actividad ya tiene un ID numérico, significa que ya existe en la BD
          if (actividad.id && !isNaN(actividad.id)) {
            actividadesCreadas.push(actividad.id);
          } else {
            // Crear la actividad en la base de datos
            const response = await activityService.createPlannedActivity(actividadData);
            const actividadCreada = response.data || response;
            actividadesCreadas.push(actividadCreada.id);
          }
        } catch (error) {
          console.error('Error al crear actividad:', actividad.titulo, error);
          actividadesError.push(actividad.titulo);
          toast.error(`Error al crear la actividad: ${actividad.titulo}`, {
            position: "top-right",
            autoClose: 4000,
          });
        }
      }

      // Mostrar resultados del proceso
      if (actividadesError.length > 0) {
        toast.warning(`Se crearon ${actividadesCreadas.length} actividades. ${actividadesError.length} actividades tuvieron errores.`, {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        toast.success(`¡Excelente! Se crearon ${actividadesCreadas.length} actividades exitosamente`, {
          position: "top-right",
          autoClose: 4000,
        });
      }

      setSubmitted(true);
      setConfirmOpen(false);
      
      // Recargar las actividades para mostrar los datos actualizados
      await loadActivities();
    } catch (error) {
      console.error('Error al enviar plan:', error);
      toast.error(`Error al enviar plan: ${error.message || 'Error desconocido'}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }

  const disabled = submitted

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 pb-28">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-green-800">Actividades Planificadas</h1>
          <p className="text-gray-600">Organiza y registra tus actividades para el semestre {semestre}.</p>
        </header>

        {/* Resumen */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Actividades Registradas</p>
                <p className="text-3xl font-bold text-green-600">{totalActividades}</p>
                <p className="text-xs text-gray-500">Actividades registradas en el plan</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <ListTodo className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Horas Planificadas</p>
                <p className="text-3xl font-bold text-blue-600">{totalHoras}</p>
                <p className="text-xs text-gray-500">Horas académicas totales</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fecha Límite</p>
                <p className="text-3xl font-bold text-red-600">30</p>
                <p className="text-xs text-gray-500">de Agosto</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Flag className="w-6 h-6 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Catálogo */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Catálogo de Actividades</h2>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Selección rápida
            </Badge>
          </div>
          <Accordion type="multiple">
            {CATEGORIAS.map(({ label, icon: Icon }) => (
              <AccordionItem key={label} value={label}>
                <AccordionTrigger className="px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-green-700" />
                    </div>
                    <span className="font-medium">{label}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {CATALOGO[label].map((item) => {
                      const added = alreadyAdded(label, item.titulo);
                      return (
                        <label
                          key={item.id}
                          className={`flex items-center justify-between gap-3 rounded-lg border p-3 cursor-pointer ${
                            added ? "bg-green-50 border-green-200" : "bg-white border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              className="h-4 w-4"
                              checked={added}
                              onChange={() => addFromCatalog(label, item.id)}
                              disabled={added || disabled}
                              aria-label={`Agregar ${item.titulo}`}
                            />
                            <div>
                              <p className="font-medium text-gray-900">{item.titulo}</p>
                              {item.horas ? (
                                <p className="text-xs text-gray-500">{item.horas} h sugeridas</p>
                              ) : (
                                <p className="text-xs text-gray-500">Configurable</p>
                              )}
                            </div>
                          </div>
                          {added && (
                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                              Añadida
                            </Badge>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Mi Plan */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Mi Plan de Actividades</h2>
            <div className="flex items-center gap-2">
              <Button onClick={addEmptyActivity} disabled={disabled}>
                <Plus className="w-4 h-4" />
                Agregar Actividad
              </Button>
            </div>
          </div>

          {loading ? (
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-8 text-center text-gray-600">
                Cargando actividades...
              </CardContent>
            </Card>
          ) : actividades.length === 0 ? (
            <Card className="bg-white border border-dashed border-gray-300">
              <CardContent className="p-8 text-center text-gray-600">
                Aún no has agregado actividades. Usa el Catálogo de Actividades o el botón &quot;Agregar Actividad&quot;.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {actividadesArray.map((a) => (
                <Card
                  key={a.id}
                  className={`bg-white shadow-sm border ${a.guardada ? "border-green-200" : "border-gray-200"}`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <CardTitle className="text-lg text-gray-900">
                          {a.titulo || <span className="text-gray-400">Nueva actividad</span>}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {a.categoria}
                          </Badge>
                          {a.guardada && (
                            <div className="flex items-center text-green-700 text-xs gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Guardada
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteActivity(a.id)}
                          disabled={disabled}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Título de la Actividad</Label>
                        <Input
                          value={a.titulo}
                          onChange={(e) => updateActivity(a.id, "titulo", e.target.value)}
                          disabled={disabled}
                          placeholder="p.ej., Preparación de material didáctico"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Tipo/Categoría</Label>
                        <Select
                          value={a.categoria}
                          onChange={(v) => updateActivity(a.id, "categoria", v)}
                          disabled={disabled}
                        >
                          {CATEGORIAS.map((c) => (
                            <SelectItem key={c.label} value={c.label}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label>Descripción Breve</Label>
                        <Textarea
                          value={a.descripcion}
                          onChange={(e) => updateActivity(a.id, "descripcion", e.target.value)}
                          disabled={disabled}
                          placeholder="Explica el objetivo o alcance de la actividad..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Fecha de Inicio</Label>
                        <Input
                          type="date"
                          value={a.fechaInicio ?? ""}
                          onChange={(e) => updateActivity(a.id, "fechaInicio", e.target.value)}
                          disabled={disabled}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Fecha de Fin</Label>
                        <Input
                          type="date"
                          value={a.fechaFin ?? ""}
                          onChange={(e) => updateActivity(a.id, "fechaFin", e.target.value)}
                          disabled={disabled}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Horas Dedicadas</Label>
                        <Input
                          type="number"
                          min={0}
                          value={a.horas}
                          onChange={(e) => updateActivity(a.id, "horas", Number(e.target.value || 0))}
                          disabled={disabled}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Ubicación</Label>
                        <Input
                          value={a.ubicacion || ""}
                          onChange={(e) => updateActivity(a.id, "ubicacion", e.target.value)}
                          disabled={disabled}
                          placeholder="p.ej., Aula 101, Laboratorio de Informática"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Presupuesto <span className="text-gray-500 text-sm">(opcional)</span></Label>
                        <Input
                          type="number"
                          min={0}
                          value={a.presupuesto || ""}
                          onChange={(e) => updateActivity(a.id, "presupuesto", Number(e.target.value || 0))}
                          disabled={disabled}
                          placeholder="Ingrese el presupuesto si aplica"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Participantes Esperados</Label>
                        <Input
                          type="number"
                          min={0}
                          value={a.participantesEsperados || 0}
                          onChange={(e) => updateActivity(a.id, "participantesEsperados", Number(e.target.value || 0))}
                          disabled={disabled}
                          placeholder="0"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label>Objetivos</Label>
                        <Textarea
                          value={a.objetivos || ""}
                          onChange={(e) => updateActivity(a.id, "objetivos", e.target.value)}
                          disabled={disabled}
                          placeholder="Describe los objetivos específicos de la actividad..."
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label>Recursos Necesarios</Label>
                        <Textarea
                          value={a.recursos || ""}
                          onChange={(e) => updateActivity(a.id, "recursos", e.target.value)}
                          disabled={disabled}
                          placeholder="Lista los recursos materiales, tecnológicos o humanos necesarios..."
                        />
                      </div>


                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Barra de acciones (sticky) */}
      <div className="fixed bottom-0 inset-x-0 border-t bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="space-y-3">
            {/* Información de guardado automático */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <CalendarDays className="w-4 h-4 text-gray-500" />
                <span>
                  {lastSavedAt ? `Guardado automático a las ${lastSavedAt}` : "Sin guardado automático"}
                </span>
                {submitted && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 ml-2">
                    Enviado
                  </Badge>
                )}
              </div>
              <Button onClick={enviarPlan} disabled={submitted}>
                <Send className="w-4 h-4" />
                Enviar Planificación
              </Button>
            </div>

            {/* Sección de borradores en dispositivo */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-blue-700">
                <HardDrive className="w-4 h-4" />
                <span>
                  {draftSavedAt ? `Borrador en dispositivo guardado a las ${draftSavedAt}` : "Sin borrador en dispositivo"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={saveDraftToLocalStorage} 
                  disabled={submitted}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <Download className="w-4 h-4" />
                  Guardar en Dispositivo
                </Button>
                {hasDraftInLocalStorage() && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={loadDraftFromLocalStorage} 
                    disabled={submitted}
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    <Upload className="w-4 h-4" />
                    Cargar desde Dispositivo
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearLocalStorage}
                  className="border-red-300 text-red-700 hover:bg-red-100"
                  title="Limpiar todos los datos guardados localmente"
                >
                  <Trash2 className="w-4 h-4" />
                  Limpiar Datos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmación de envío */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-800">Enviar planificación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres enviar tu plan de actividades? Una vez enviado, no podrás editarlo hasta que
              sea revisado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmarEnvio} className="bg-green-600 hover:bg-green-700 text-white">
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}