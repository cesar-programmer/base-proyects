/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react"
import { Calendar, Plus, Edit, Trash2, Save, Clock, AlertTriangle, CheckCircle, Bell, X } from "lucide-react"

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
    className={`bg-white rounded-lg shadow border ${className}`}
    {...props}
  >
    {children}
  </div>
);

const Input = ({ className, ...props }) => (
  <input 
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
    {...props}
  />
);

const Select = ({ className, children, ...props }) => (
  <select 
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
    {...props}
  >
    {children}
  </select>
);

const Label = ({ children, htmlFor, className }) => (
  <label 
    htmlFor={htmlFor}
    className={`block text-sm font-medium mb-2 ${className}`}
  >
    {children}
  </label>
);

// Componente de pestañas
const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`py-4 px-1 border-b-2 font-medium text-sm ${
      active
        ? "border-green-500 text-green-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`}
  >
    {children}
  </button>
);

// Componente de badge
const Badge = ({ children, variant = "default", className = "" }) => {
  const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    secondary: "bg-gray-200 text-gray-700",
    outline: "border border-gray-300 text-gray-700"
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Componente de switch
const Switch = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      checked ? 'bg-green-600' : 'bg-gray-300'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

// Componente de modal
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

// Hook de toast
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description }) => {
    const id = Date.now().toString();
    const newToast = { id, title, description };
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const ToastContainer = () => (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div key={toast.id} className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
          <div className="font-medium">{toast.title}</div>
          <div className="text-sm text-gray-600">{toast.description}</div>
        </div>
      ))}
    </div>
  );

  return { toast, ToastContainer };
};

// Componente de encabezado
const DashboardHeader = ({ activeDeadlinesCount }) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold text-green-700">Configuración de Fechas Límite</h1>
      <p className="text-gray-600 mt-1">
        Establezca y modifique las fechas límite para el registro y envío de actividades
      </p>
    </div>
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="text-sm">
        <Calendar className="w-4 h-4 mr-1" />
        {activeDeadlinesCount} Activas
      </Badge>
    </div>
  </div>
);

// Componente de navegación de pestañas (simplificado solo para Fechas Límite)
const TabNavigation = ({ activeTab, setActiveTab }) => (
  <div className="border-b border-gray-200">
    <nav className="flex space-x-8">
      <TabButton
        active={true}
        onClick={() => setActiveTab("fechas")}
      >
        Fechas Límite
      </TabButton>
    </nav>
  </div>
);

// Componente de badge de categoría
const CategoryBadge = ({ category }) => {
  const categoryConfig = {
    registro: { label: "Registro", className: "bg-blue-100 text-blue-800" },
    entrega: { label: "Entrega", className: "bg-green-100 text-green-800" },
    revision: { label: "Revisión", className: "bg-yellow-100 text-yellow-800" },
    evaluacion: { label: "Evaluación", className: "bg-purple-100 text-purple-800" },
  };

  const config = categoryConfig[category];
  return <Badge className={config.className}>{config.label}</Badge>;
};

// Componente de badge de estado
const StatusBadge = ({ deadline }) => {
  const today = new Date();
  const daysUntil = Math.ceil((deadline.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (!deadline.isActive) {
    return <Badge variant="secondary">Inactivo</Badge>;
  }

  if (daysUntil < 0) {
    return (
      <Badge className="bg-red-100 text-red-800">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Vencido
      </Badge>
    );
  } else if (daysUntil <= 7) {
    return (
      <Badge className="bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" />
        Próximo
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Activo
      </Badge>
    );
  }
};

// Componente de tabla de fechas límite
const DeadlinesTable = ({ 
  deadlines, 
  formatDate, 
  handleEditDeadline, 
  handleDeleteDeadline, 
  handleToggleActive 
}) => (
  <Card>
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Fechas Límite Configuradas</h3>
          <p className="text-sm text-gray-500 mt-1">Gestione las fechas límite para diferentes actividades académicas</p>
        </div>
      </div>
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Límite</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recordatorio</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {deadlines.map((deadline) => (
            <tr key={deadline.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{deadline.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{deadline.description}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {formatDate(deadline.date)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <CategoryBadge category={deadline.category} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge deadline={deadline} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 text-sm">
                  <Bell className="h-4 w-4 text-gray-400" />
                  <span>{deadline.reminderDays} días antes</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-2">
                  <Switch
                    checked={deadline.isActive}
                    onChange={() => handleToggleActive(deadline.id)}
                  />
                  <button
                    onClick={() => handleEditDeadline(deadline)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDeadline(deadline.id)}
                    className="text-gray-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

// Componente de modal para agregar fecha límite
const AddDeadlineModal = ({ isOpen, onClose, newDeadline, setNewDeadline, handleAddDeadline }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Agregar Nueva Fecha Límite"
  >
    <div className="space-y-4">
      <div>
        <Label>Nombre de la fecha límite</Label>
        <Input
          type="text"
          placeholder="Ej: Entrega de reporte mensual"
          value={newDeadline.name}
          onChange={(e) => setNewDeadline({ ...newDeadline, name: e.target.value })}
        />
      </div>
      
      <div>
        <Label>Descripción</Label>
        <Input
          type="text"
          placeholder="Descripción detallada de la actividad"
          value={newDeadline.description}
          onChange={(e) => setNewDeadline({ ...newDeadline, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Categoría</Label>
          <Select
            value={newDeadline.category}
            onChange={(e) => setNewDeadline({ ...newDeadline, category: e.target.value })}
          >
            <option value="registro">Registro</option>
            <option value="entrega">Entrega</option>
            <option value="revision">Revisión</option>
            <option value="evaluacion">Evaluación</option>
          </Select>
        </div>
        
        <div>
          <Label>Días de recordatorio</Label>
          <Input
            type="number"
            min="1"
            max="30"
            value={newDeadline.reminderDays}
            onChange={(e) => setNewDeadline({ ...newDeadline, reminderDays: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div>
        <Label>Fecha límite</Label>
        <Input
          type="date"
          value={newDeadline.date}
          onChange={(e) => setNewDeadline({ ...newDeadline, date: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button
          onClick={onClose}
          className="text-gray-600 border border-gray-300 hover:bg-gray-50"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleAddDeadline}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          Agregar Fecha Límite
        </Button>
      </div>
    </div>
  </Modal>
);

// Componente de modal para editar fecha límite
const EditDeadlineModal = ({ editingDeadline, setEditingDeadline, handleUpdateDeadline }) => (
  <Modal
    isOpen={!!editingDeadline}
    onClose={() => setEditingDeadline(null)}
    title="Editar Fecha Límite"
  >
    {editingDeadline && (
      <div className="space-y-4">
        <div>
          <Label>Nombre</Label>
          <Input
            type="text"
            value={editingDeadline.name}
            onChange={(e) => setEditingDeadline({ ...editingDeadline, name: e.target.value })}
          />
        </div>
        
        <div>
          <Label>Descripción</Label>
          <Input
            type="text"
            value={editingDeadline.description}
            onChange={(e) => setEditingDeadline({ ...editingDeadline, description: e.target.value })}
          />
        </div>

        <div>
          <Label>Fecha límite</Label>
          <Input
            type="date"
            value={editingDeadline.date}
            onChange={(e) => setEditingDeadline({ ...editingDeadline, date: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            onClick={() => setEditingDeadline(null)}
            className="text-gray-600 border border-gray-300 hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleUpdateDeadline}
            className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </Button>
        </div>
      </div>
    )}
  </Modal>
);

// Datos estáticos
const initialDeadlines = [
  {
    id: "1",
    name: "Registro de actividades planificadas",
    description: "Fecha límite para registrar las actividades que se planean realizar durante el semestre",
    date: new Date(2024, 7, 15), // August 15, 2024
    category: "registro",
    isActive: true,
    reminderDays: 7,
    semester: "2024-2",
  },
  {
    id: "2",
    name: "Entrega de reporte parcial",
    description: "Fecha límite para entregar el reporte de actividades del primer período",
    date: new Date(2024, 9, 30), // October 30, 2024
    category: "entrega",
    isActive: true,
    reminderDays: 5,
    semester: "2024-2",
  },
  {
    id: "3",
    name: "Entrega de reporte final",
    description: "Fecha límite para entregar el reporte final de actividades del semestre",
    date: new Date(2024, 11, 15), // December 15, 2024
    category: "entrega",
    isActive: true,
    reminderDays: 10,
    semester: "2024-2",
  },
];

// Componente principal
export default function ConfiguracionFechasDashboard() {
  const [deadlines, setDeadlines] = useState(initialDeadlines);
  const [activeTab, setActiveTab] = useState("fechas");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState(null);
  const [newDeadline, setNewDeadline] = useState({
    name: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    category: "registro",
    isActive: true,
    reminderDays: 7,
    semester: "2024-2",
  });

  const { toast, ToastContainer } = useToast();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddDeadline = () => {
    if (newDeadline.name && newDeadline.date) {
      const deadline = {
        id: Date.now().toString(),
        name: newDeadline.name,
        description: newDeadline.description || "",
        date: new Date(newDeadline.date),
        category: newDeadline.category,
        isActive: newDeadline.isActive,
        reminderDays: parseInt(newDeadline.reminderDays) || 7,
        semester: newDeadline.semester || "2024-2",
      };
      setDeadlines([...deadlines, deadline]);
      setNewDeadline({
        name: "",
        description: "",
        date: new Date().toISOString().split('T')[0],
        category: "registro",
        isActive: true,
        reminderDays: 7,
        semester: "2024-2",
      });
      setIsAddModalOpen(false);
      toast({
        title: "Fecha límite agregada",
        description: "La nueva fecha límite ha sido configurada exitosamente.",
      });
    }
  };

  const handleEditDeadline = (deadline) => {
    setEditingDeadline({
      ...deadline,
      date: deadline.date.toISOString().split('T')[0]
    });
  };

  const handleUpdateDeadline = () => {
    if (editingDeadline) {
      const updatedDeadline = {
        ...editingDeadline,
        date: new Date(editingDeadline.date)
      };
      setDeadlines(deadlines.map((d) => (d.id === editingDeadline.id ? updatedDeadline : d)));
      setEditingDeadline(null);
      toast({
        title: "Fecha límite actualizada",
        description: "Los cambios han sido guardados exitosamente.",
      });
    }
  };

  const handleDeleteDeadline = (id) => {
    setDeadlines(deadlines.filter((d) => d.id !== id));
    toast({
      title: "Fecha límite eliminada",
      description: "La fecha límite ha sido eliminada del sistema.",
    });
  };

  const handleToggleActive = (id) => {
    setDeadlines(deadlines.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d)));
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <ToastContainer />
      
      <DashboardHeader activeDeadlinesCount={deadlines.filter((d) => d.isActive).length} />

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Agregar Fecha Límite
          </Button>
        </div>
        
        <DeadlinesTable 
          deadlines={deadlines}
          formatDate={formatDate}
          handleEditDeadline={handleEditDeadline}
          handleDeleteDeadline={handleDeleteDeadline}
          handleToggleActive={handleToggleActive}
        />
      </div>

      <AddDeadlineModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        newDeadline={newDeadline}
        setNewDeadline={setNewDeadline}
        handleAddDeadline={handleAddDeadline}
      />

      <EditDeadlineModal 
        editingDeadline={editingDeadline}
        setEditingDeadline={setEditingDeadline}
        handleUpdateDeadline={handleUpdateDeadline}
      />
    </div>
  );
}