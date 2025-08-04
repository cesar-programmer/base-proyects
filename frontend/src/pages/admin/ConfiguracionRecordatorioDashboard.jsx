/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react"
import { Clock, Users, Mail, Bell, Save, Eye } from "lucide-react"

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

// Componente de toggle switch
const ToggleSwitch = ({ checked, onChange, label }) => (
  <div className="flex items-center space-x-2">
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
    </label>
    <span className="text-sm font-medium">{label}</span>
  </div>
);

// Componente de pestañas
const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`py-2 px-1 border-b-2 font-medium text-sm ${
      active
        ? "border-green-500 text-green-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`}
  >
    {children}
  </button>
);

// Componente de opción de radio
const RadioOption = ({ id, name, value, checked, onChange, label, className }) => (
  <div className={`flex items-center space-x-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200 ${className}`}>
    <input
      type="radio"
      id={id}
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500"
    />
    <label htmlFor={id} className="text-sm">{label}</label>
  </div>
);

// Componente de encabezado
const DashboardHeader = ({ isActive, setIsActive }) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold text-green-700">Configuración de Recordatorios</h1>
      <p className="text-gray-600">
        Configure recordatorios automáticos para mantener a los docentes informados
      </p>
    </div>
    <ToggleSwitch 
      checked={isActive} 
      onChange={(e) => setIsActive(e.target.checked)}
      label={isActive ? "Activo" : "Inactivo"}
    />
  </div>
);

// Componente de navegación de pestañas
const TabNavigation = ({ activeTab, setActiveTab }) => (
  <div className="border-b border-gray-200">
    <nav className="flex space-x-8">
      <TabButton 
        active={activeTab === "configuracion"} 
        onClick={() => setActiveTab("configuracion")}
      >
        Configuración
      </TabButton>
      <TabButton 
        active={activeTab === "historial"} 
        onClick={() => setActiveTab("historial")}
      >
        Historial
      </TabButton>
    </nav>
  </div>
);

// Componente de sección de programación
const SchedulingSection = ({ frequency, setFrequency, dayOfWeek, setDayOfWeek, time, setTime }) => (
  <Card>
    <div className="p-6 pb-4">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Programación</h3>
      </div>
      <p className="text-gray-600 text-sm">Configure cuándo y con qué frecuencia se enviarán los recordatorios</p>
    </div>
    <div className="p-6 pt-0 space-y-4">
      <div className="space-y-3">
        <Label>Frecuencia de los recordatorios</Label>
        <div className="space-y-2">
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
        <div className="space-y-2">
          <Label>Día de la semana</Label>
          <Select
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
          >
            <option value="lunes">Lunes</option>
            <option value="martes">Martes</option>
            <option value="miercoles">Miércoles</option>
            <option value="jueves">Jueves</option>
            <option value="viernes">Viernes</option>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label>Hora del recordatorio</Label>
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
    </div>
  </Card>
);

// Componente de sección de destinatarios
const RecipientsSection = ({ selectedRecipients, setSelectedRecipients }) => (
  <Card>
    <div className="p-6 pb-4">
      <div className="flex items-center gap-2 mb-2">
        <Users className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Destinatarios</h3>
      </div>
      <p className="text-gray-600 text-sm">Seleccione quién recibirá los recordatorios</p>
    </div>
    <div className="p-6 pt-0 space-y-4">
      <div className="space-y-3">
        <Label>Enviar recordatorios a:</Label>
        <div className="space-y-2">
          <RadioOption
            id="todos"
            name="recipients"
            value="todos"
            checked={selectedRecipients === "todos"}
            onChange={(e) => setSelectedRecipients(e.target.value)}
            label="Todos los docentes"
            className="bg-white border-gray-200"
          />
          <RadioOption
            id="pendientes"
            name="recipients"
            value="pendientes"
            checked={selectedRecipients === "pendientes"}
            onChange={(e) => setSelectedRecipients(e.target.value)}
            label="Solo docentes con reportes pendientes"
            className="bg-white border-gray-200"
          />
        </div>
      </div>
    </div>
  </Card>
);

// Componente de sección de mensaje
const MessageSection = ({ message, setMessage, handlePreview, handleSaveConfiguration }) => (
  <Card>
    <div className="p-6 pb-4">
      <div className="flex items-center gap-2 mb-2">
        <Mail className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Mensaje del Recordatorio</h3>
      </div>
      <p className="text-gray-600 text-sm">Personalice el mensaje que se enviará a los docentes</p>
    </div>
    <div className="p-6 pt-0 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="message">Contenido del mensaje</Label>
        <Textarea
          id="message"
          placeholder="Escriba aquí el mensaje que se enviará en el recordatorio..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />
      </div>
      <div className="flex gap-2">
        <Button
          onClick={handlePreview}
          className="flex items-center text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
        >
          <Eye className="mr-2 h-4 w-4" />
          Vista Previa
        </Button>
        <Button
          onClick={handleSaveConfiguration}
          className="flex items-center text-white bg-green-700 hover:bg-green-800"
        >
          <Save className="mr-2 h-4 w-4" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  </Card>
);

// Componente de historial
const HistorySection = () => (
  <div className="space-y-4">
    <Card>
      <div className="p-6 pb-4">
        <h3 className="text-lg font-semibold">Historial de Recordatorios</h3>
        <p className="text-gray-600 text-sm">Revise los recordatorios enviados recientemente</p>
      </div>
      <div className="p-6 pt-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Recordatorio semanal - Entrega de reportes</p>
              <p className="text-sm text-gray-600">Enviado el 15 de marzo, 2024 a las 09:00 AM</p>
            </div>
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Enviado a 45 docentes</span>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Recordatorio de actividades pendientes</p>
              <p className="text-sm text-gray-600">Enviado el 10 de marzo, 2024 a las 09:00 AM</p>
            </div>
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Enviado a 12 docentes</span>
          </div>
        </div>
      </div>
    </Card>
  </div>
);

// Componente de modal de vista previa
const PreviewModal = ({ previewOpen, setPreviewOpen, message }) => (
  previewOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Vista Previa del Recordatorio</h3>
          <p className="text-gray-600 text-sm">Así se verá el recordatorio que recibirán los docentes</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-4 w-4 text-green-700" />
            <span className="font-medium">Recordatorio UABC</span>
          </div>
          <p className="text-sm">{message || "No hay mensaje configurado"}</p>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => setPreviewOpen(false)}
            className="text-white bg-green-700 hover:bg-green-800"
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
  const [frequency, setFrequency] = useState("semanal");
  const [dayOfWeek, setDayOfWeek] = useState("lunes");
  const [time, setTime] = useState("09:00");
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedRecipients, setSelectedRecipients] = useState("todos");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("configuracion");

  const handleSaveConfiguration = () => {
    alert("Configuración guardada exitosamente!");
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <DashboardHeader isActive={isActive} setIsActive={setIsActive} />

      <div className="space-y-4">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "configuracion" && (
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
            />
          </div>
        )}

        {activeTab === "historial" && (
          <HistorySection />
        )}
      </div>

      <PreviewModal 
        previewOpen={previewOpen}
        setPreviewOpen={setPreviewOpen}
        message={message}
      />
    </div>
  );
}