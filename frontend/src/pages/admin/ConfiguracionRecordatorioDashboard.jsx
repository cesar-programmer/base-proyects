/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { Clock, Users, Mail, Bell, Save, Eye, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { toast } from 'react-toastify'
import { recordatorioService } from "../../services/recordatorioService"

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

const Textarea = ({ className, ...props }) => (
  <textarea 
    className={`w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 ${className}`}
    {...props}
  />
);

const Label = ({ children, htmlFor, className }) => (
  <label 
    htmlFor={htmlFor}
    className={`text-sm font-medium ${className}`}
  >
    {children}
  </label>
);

// Componente de toggle switch mejorado y más grande
const ToggleSwitch = ({ checked, onChange, label }) => (
  <div className="flex items-center space-x-4">
    <label className="relative inline-flex items-center cursor-pointer group">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-20 h-10 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-8 after:w-8 after:transition-all peer-checked:bg-green-600 group-hover:shadow-lg transition-shadow"></div>
      
      {/* Texto ON cuando está activado */}
      <span className={`absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-200 ${
        checked 
          ? 'text-white font-bold text-sm opacity-100 translate-x-0' 
          : 'text-transparent opacity-0 translate-x-2'
      }`}>
        ON
      </span>
      
      {/* Texto OFF cuando está desactivado */}
      <span className={`absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-200 ${
        !checked 
          ? 'text-gray-600 font-bold text-sm opacity-100 translate-x-0' 
          : 'text-transparent opacity-0 -translate-x-2'
      }`}>
        OFF
      </span>
    </label>
    <span className={`text-base font-bold transition-colors ${checked ? 'text-green-700' : 'text-gray-600'}`}>
      {label}
    </span>
  </div>
);



// Componente de opción de radio
const RadioOption = ({ id, name, value, checked, onChange, label, className }) => (
  <div className={`flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200 ${
    checked 
      ? 'bg-green-50 border-green-200 ring-2 ring-green-500 ring-opacity-20' 
      : 'bg-white border-gray-200 hover:border-green-300 hover:bg-green-50'
  } ${className}`}>
    <input
      type="radio"
      id={id}
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500"
    />
    <label htmlFor={id} className="text-sm font-medium text-gray-700 cursor-pointer flex-1">{label}</label>
  </div>
);



// Componente de encabezado
const DashboardHeader = ({ isActive, setIsActive, saving, lastSaved }) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold text-green-700">Configuración de Recordatorios</h1>
      <p className="text-gray-600">
        Configure recordatorios automáticos para mantener a los docentes informados
      </p>
      {lastSaved && (
        <p className="text-xs text-gray-500 mt-1">
          Última actualización: {new Date(lastSaved).toLocaleString('es-ES')}
        </p>
      )}
    </div>
    <div className="flex items-center gap-4">
      {saving && (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">Guardando...</span>
        </div>
      )}
      <div className="flex flex-col items-end">
        <div className={`px-4 py-2 rounded-lg border-2 transition-all ${
          isActive 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-gray-50 border-gray-200 text-gray-600'
        }`}>
          <ToggleSwitch 
            checked={isActive} 
            onChange={(e) => setIsActive(e.target.checked)}
            label={isActive ? "Activo" : "Inactivo"}
          />
          <div className={`text-xs mt-1 font-medium flex items-center gap-1 ${
            isActive ? 'text-green-600' : 'text-gray-500'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`}></div>
            {isActive ? 'Recordatorios habilitados' : 'Recordatorios deshabilitados'}
          </div>
        </div>
      </div>
    </div>
  </div>
);



// Componente de sección de programación
const SchedulingSection = ({ frequency, setFrequency, dayOfWeek, setDayOfWeek, time, setTime }) => (
  <Card className="h-fit">
    <div className="p-6 pb-4 border-b border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <Clock className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Programación</h3>
          <p className="text-gray-600 text-sm">Configure cuándo y con qué frecuencia se enviarán los recordatorios</p>
        </div>
      </div>
    </div>
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <Label className="text-gray-900 font-medium">Frecuencia de los recordatorios</Label>
        <div className="space-y-3">
          <RadioOption
            id="diario"
            name="frequency"
            value="diario"
            checked={frequency === "diario"}
            onChange={(e) => setFrequency(e.target.value)}
            label="Diario"
          />
          <RadioOption
            id="semanal"
            name="frequency"
            value="semanal"
            checked={frequency === "semanal"}
            onChange={(e) => setFrequency(e.target.value)}
            label="Semanal"
          />
          <RadioOption
            id="mensual"
            name="frequency"
            value="mensual"
            checked={frequency === "mensual"}
            onChange={(e) => setFrequency(e.target.value)}
            label="Mensual"
          />
        </div>
      </div>

      {frequency === "semanal" && (
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <Label className="text-gray-900 font-medium">Día de la semana</Label>
          <Select
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            className="bg-white"
          >
            <option value="lunes">Lunes</option>
            <option value="martes">Martes</option>
            <option value="miercoles">Miércoles</option>
            <option value="jueves">Jueves</option>
            <option value="viernes">Viernes</option>
          </Select>
        </div>
      )}

      <div className="space-y-3">
        <Label className="text-gray-900 font-medium">Hora del recordatorio</Label>
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="bg-white"
        />
      </div>
    </div>
  </Card>
);

// Componente de sección de destinatarios
const RecipientsSection = ({ selectedRecipients, setSelectedRecipients }) => (
  <Card className="h-fit">
    <div className="p-6 pb-4 border-b border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Users className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Destinatarios</h3>
          <p className="text-gray-600 text-sm">Seleccione quién recibirá los recordatorios</p>
        </div>
      </div>
    </div>
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <Label className="text-gray-900 font-medium">Enviar recordatorios a:</Label>
        <div className="space-y-3">
          <RadioOption
            id="todos"
            name="recipients"
            value="todos"
            checked={selectedRecipients === "todos"}
            onChange={(e) => setSelectedRecipients(e.target.value)}
            label="Todos los docentes"
          />
          <RadioOption
            id="pendientes"
            name="recipients"
            value="pendientes"
            checked={selectedRecipients === "pendientes"}
            onChange={(e) => setSelectedRecipients(e.target.value)}
            label="Solo docentes con reportes pendientes"
          />
        </div>
      </div>
    </div>
  </Card>
);

// Componente de sección de mensaje
const MessageSection = ({ message, setMessage, handlePreview, handleSaveConfiguration, saving, hasUnsavedChanges }) => (
  <Card>
    <div className="p-6 pb-4 border-b border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Mail className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Mensaje del Recordatorio</h3>
          <p className="text-gray-600 text-sm">Personalice el mensaje que recibirán los docentes</p>
        </div>
      </div>
    </div>
    <div className="p-6 space-y-6">
      <div className="space-y-3">
        <Label className="text-gray-900 font-medium">Contenido del mensaje</Label>
        <Textarea
          placeholder="Escriba aquí el mensaje que se enviará a los docentes..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="bg-white resize-none"
        />
        <p className="text-xs text-gray-500">
          Tip: Use un mensaje claro y profesional. El sistema agregará automáticamente información específica sobre las tareas pendientes.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
        <Button
          onClick={handlePreview}
          disabled={saving}
          className="flex items-center justify-center text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <Eye className="mr-2 h-4 w-4" />
          Vista Previa
        </Button>
        <Button
          onClick={handleSaveConfiguration}
          disabled={saving}
          className={`flex items-center justify-center text-white transition-colors disabled:opacity-50 ${
            hasUnsavedChanges 
              ? 'bg-orange-600 hover:bg-orange-700 ring-2 ring-orange-300' 
              : 'bg-green-700 hover:bg-green-800'
          }`}
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {hasUnsavedChanges ? 'Guardar Cambios' : 'Guardar Configuración'}
              {hasUnsavedChanges && <span className="ml-1 text-xs">●</span>}
            </>
          )}
        </Button>
      </div>
    </div>
  </Card>
);



// Componente de modal de vista previa actualizado
const PreviewModal = ({ previewOpen, setPreviewOpen, previewData }) => (
  previewOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-96 overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Vista Previa del Recordatorio</h3>
          <p className="text-gray-600 text-sm">Así se verá el recordatorio que recibirán los docentes</p>
        </div>
        
        {previewData && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="h-4 w-4 text-green-700" />
                <span className="font-medium text-gray-900">Recordatorio UABC</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">{previewData.mensaje || "No hay mensaje configurado"}</p>
                <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                  <p>Destinatarios: {previewData.destinatarios_count} docentes</p>
                  <p>Próximo envío: {new Date(previewData.fecha_programada).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end mt-6">
          <Button
            onClick={() => setPreviewOpen(false)}
            className="text-white bg-green-700 hover:bg-green-800 transition-colors"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
);

// Componente principal
export default function ConfiguracionRecordatorioDashboard() {
  // Estados para la configuración
  const [frequency, setFrequency] = useState("semanal");
  const [dayOfWeek, setDayOfWeek] = useState("lunes");
  const [time, setTime] = useState("09:00");
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedRecipients, setSelectedRecipients] = useState("todos");
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // Estados para la funcionalidad
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [previewData, setPreviewData] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Cargar configuración al montar el componente
  useEffect(() => {
    cargarConfiguracion();
  }, []);

  // Detectar cambios no guardados
  useEffect(() => {
    if (lastSaved) {
      setHasUnsavedChanges(true);
    }
  }, [frequency, dayOfWeek, time, message, selectedRecipients]);

  const cargarConfiguracion = async () => {
    try {
      setLoading(true);
      const config = await recordatorioService.getConfiguracion();
      
      setIsActive(config.activo);
      setFrequency(config.frecuencia);
      setDayOfWeek(config.dia_semana);
      setTime(config.hora);
      setSelectedRecipients(config.destinatarios);
      setMessage(config.mensaje);
      
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      toast.error('Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };



  const handleSaveConfiguration = async () => {
    try {
      setSaving(true);
      
      const configuracion = {
        activo: isActive,
        frecuencia: frequency,
        dia_semana: dayOfWeek,
        hora: time,
        destinatarios: selectedRecipients,
        mensaje: message
      };

      await recordatorioService.actualizarConfiguracion(configuracion);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      const statusMessage = isActive 
        ? '✅ Configuración guardada y recordatorios activados' 
        : '✅ Configuración guardada - Recordatorios desactivados';
      toast.success(statusMessage);
      
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      toast.error('❌ Error al guardar la configuración. Inténtelo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    try {
      const configuracion = {
        frecuencia: frequency,
        dia_semana: dayOfWeek,
        hora: time,
        destinatarios: selectedRecipients,
        mensaje: message
      };

      const preview = await recordatorioService.previsualizarRecordatorio(configuracion);
      setPreviewData(preview);
      setPreviewOpen(true);
      
    } catch (error) {
      console.error('Error al generar vista previa:', error);
      toast.error('Error al generar vista previa');
    }
  };

  const handleToggleActive = async (newValue) => {
    try {
      setSaving(true);
      await recordatorioService.toggleRecordatorios(newValue);
      setIsActive(newValue);
      setLastSaved(new Date());
      toast.success(
        newValue ? '🔔 Recordatorios activados correctamente' : '🔕 Recordatorios desactivados correctamente'
      );
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      toast.error('❌ Error al cambiar el estado. Inténtelo de nuevo.');
      // Revertir el cambio en caso de error
      setIsActive(!newValue);
    } finally {
      setSaving(false);
    }
  };



  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-96">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-green-600" />
          <span className="text-gray-600">Cargando configuración...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <DashboardHeader 
        isActive={isActive} 
        setIsActive={handleToggleActive}
        saving={saving}
        lastSaved={lastSaved}
      />

      <div className="space-y-4">
        <div className="grid gap-6 md:grid-cols-2">
          <SchedulingSection 
            frequency={frequency}
            setFrequency={setFrequency}
            dayOfWeek={dayOfWeek}
            setDayOfWeek={setDayOfWeek}
            time={time}
            setTime={setTime}
          />
          
          <RecipientsSection 
            selectedRecipients={selectedRecipients}
            setSelectedRecipients={setSelectedRecipients}
          />
        </div>

        <MessageSection 
          message={message}
          setMessage={setMessage}
          handlePreview={handlePreview}
          handleSaveConfiguration={handleSaveConfiguration}
          saving={saving}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      </div>

      <PreviewModal 
        previewOpen={previewOpen}
        setPreviewOpen={setPreviewOpen}
        previewData={previewData}
      />
    </div>
  );
}