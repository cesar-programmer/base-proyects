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
  Eye
} from "lucide-react"
import { useAuth } from '../../context/AuthContext'
import activityService from '../../services/activityService';
import { toast } from 'react-hot-toast'

const CATEGORIAS = [
  { label: "Docencia", icon: BookOpen },
  { label: "Investigación", icon: FlaskConical },
  { label: "Gestión", icon: ClipboardList },
  { label: "Tutoría", icon: Users2 },
  { label: "Extensión", icon: Megaphone },
  { label: "Capacitación", icon: GraduationCap },
]

const CATALOGO = {
  Docencia: [
    { id: "doc-1", titulo: "Preparación de clases", horas: 8, descripcion: "Diseño y actualización de materiales" },
    { id: "doc-2", titulo: "Aplicación de exámenes", horas: 6 },
    { id: "doc-3", titulo: "Evaluación de trabajos", horas: 10 },
  ],
  Investigación: [
    { id: "inv-1", titulo: "Revisión bibliográfica", horas: 12 },
    { id: "inv-2", titulo: "Diseño metodológico", horas: 10 },
    { id: "inv-3", titulo: "Redacción de artículo", horas: 16 },
  ],
  Gestión: [
    { id: "ges-1", titulo: "Coordinación de programa", horas: 10 },
    { id: "ges-2", titulo: "Comité académico", horas: 6 },
  ],
  Tutoría: [
    { id: "tut-1", titulo: "Asesoría a estudiantes", horas: 8 },
    { id: "tut-2", titulo: "Seguimiento de casos", horas: 6 },
  ],
  Extensión: [
    { id: "ext-1", titulo: "Vinculación con empresas", horas: 6 },
    { id: "ext-2", titulo: "Organización de evento", horas: 8 },
  ],
  Capacitación: [
    { id: "cap-1", titulo: "Curso de actualización docente", horas: 12 },
    { id: "cap-2", titulo: "Taller de tecnologías educativas", horas: 8 },
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

export default function PlannedActivities() {
  const { user } = useAuth();
  const semestre = useMemo(() => currentSemesterFor(), [])
  const [actividades, setActividades] = useState([])
  const [lastSavedAt, setLastSavedAt] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showNewActivityDialog, setShowNewActivityDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [editingActivity, setEditingActivity] = useState(null)

  useEffect(() => {
    loadActivities();
  }, [user]);

  const loadActivities = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const response = await activityService.getActivitiesByTeacher(user.id);
      setActividades(response.data || []);
    } catch (error) {
      toast.error('Error al cargar actividades: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const totalActividades = actividades.length
  const totalHoras = actividades.reduce((sum, a) => sum + (Number(a.horas) || 0), 0)

  const alreadyAdded = (cat, titulo) =>
    actividades.some((a) => a.titulo === titulo && a.categoria === cat)

  const addFromCatalog = (cat, presetId) => {
    const preset = CATALOGO[cat].find((p) => p.id === presetId)
    if (!preset || alreadyAdded(cat, preset.titulo)) return
    setActividades((prev) => [
      ...prev,
      {
        id: `${cat}-${preset.id}`,
        titulo: preset.titulo,
        categoria: cat,
        descripcion: preset.descripcion ?? "",
        horas: preset.horas ?? 4,
      },
    ])
  }

  const addEmptyActivity = () => {
    setActividades((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        titulo: "",
        categoria: "Docencia",
        descripcion: "",
        horas: 2,
      },
    ])
  }

  const updateActivity = (id, key, value) => {
    setActividades((prev) => prev.map((a) => (a.id === id ? { ...a, [key]: value } : a)))
  }

  const saveActivity = async (id) => {
    try {
      const activity = actividades.find(a => a.id === id);
      if (!activity) return;
      
      const activityData = {
        ...activity,
        teacherId: user.id,
        semester: semestre
      };
      
      if (activity.isNew) {
        await activityService.createActivity(activityData);
        toast.success('Actividad creada exitosamente');
      } else {
        await activityService.updateActivity(id, activityData);
        toast.success('Actividad actualizada exitosamente');
      }
      
      setActividades((prev) => prev.map((a) => (a.id === id ? { ...a, guardada: true, isNew: false } : a)))
      setLastSavedAt(new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }))
      await loadActivities();
    } catch (error) {
      toast.error('Error al guardar actividad: ' + error.message);
    }
  }

  const deleteActivity = async (id) => {
    try {
      const activity = actividades.find(a => a.id === id);
      if (!activity?.isNew) {
        await activityService.deleteActivity(id);
        toast.success('Actividad eliminada exitosamente');
      }
      setActividades((prev) => prev.filter((a) => a.id !== id))
    } catch (error) {
      toast.error('Error al eliminar actividad: ' + error.message);
    }
  }

  const guardarBorrador = async () => {
    try {
      for (const activity of actividades) {
        if (!activity.guardada) {
          await saveActivity(activity.id);
        }
      }
      setLastSavedAt(new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }))
      toast.success('Borrador guardado exitosamente');
    } catch (error) {
      toast.error('Error al guardar borrador: ' + error.message);
    }
  }

  const enviarPlan = () => {
    setConfirmOpen(true)
  }

  const confirmarEnvio = async () => {
    try {
      await activityService.submitPlan(user.id, semestre);
      setSubmitted(true)
      setConfirmOpen(false)
      toast.success('Plan enviado exitosamente');
    } catch (error) {
      toast.error('Error al enviar plan: ' + error.message);
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
              {actividades.map((a) => (
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
                          onClick={() => saveActivity(a.id)}
                          disabled={disabled}
                        >
                          <Save className="w-4 h-4" />
                          Guardar
                        </Button>
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
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays className="w-4 h-4 text-gray-500" />
            <span>
              {lastSavedAt ? `Borrador guardado por última vez a las ${lastSavedAt}` : "Borrador no guardado"}
            </span>
            {submitted && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 ml-2">
                Enviado
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={guardarBorrador} disabled={submitted}>
              <Save className="w-4 h-4" />
              Guardar Borrador
            </Button>
            <Button onClick={enviarPlan} disabled={submitted}>
              <Send className="w-4 h-4" />
              Enviar Planificación
            </Button>
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