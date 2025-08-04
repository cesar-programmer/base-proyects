/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react"
import { User, Search, Filter, CheckSquare, AlertTriangle, Users, Activity, Shield } from "lucide-react"

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

// Componente de badge de estado
const StatusBadge = ({ status }) => {
  switch (status) {
    case "asignado":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckSquare className="w-3 h-3 mr-1" />
          Asignado
        </span>
      );
    case "pendiente":
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Pendiente
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Sin asignar
        </span>
      );
  }
};

// Componente de encabezado
const DashboardHeader = ({ teachersCount, activitiesCount }) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold text-green-700">Configuración de Permisos Adicionales</h1>
      <p className="text-gray-600">
        Asigne permisos adicionales a los docentes para actividades específicas
      </p>
    </div>
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border">
        <Users className="w-4 h-4 mr-1" />
        {teachersCount} Docentes
      </span>
      <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border">
        <Activity className="w-4 h-4 mr-1" />
        {activitiesCount} Actividades
      </span>
    </div>
  </div>
);

// Componente de navegación de pestañas
const TabNavigation = ({ activeTab, setActiveTab }) => (
  <div className="border-b border-gray-200">
    <nav className="flex space-x-8">
      <TabButton 
        active={activeTab === "asignacion"} 
        onClick={() => setActiveTab("asignacion")}
      >
        Asignación de Permisos
      </TabButton>
      <TabButton 
        active={activeTab === "resumen"} 
        onClick={() => setActiveTab("resumen")}
      >
        Resumen
      </TabButton>
    </nav>
  </div>
);

// Componente de filtros y búsqueda
const FiltersSection = ({ 
  searchTerm, 
  setSearchTerm, 
  categoryFilter, 
  setCategoryFilter, 
  handleBulkPermissionChange 
}) => (
  <Card>
    <div className="p-6 pb-4">
      <div className="flex items-center gap-2 mb-2">
        <Filter className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Filtros y Búsqueda</h3>
      </div>
      <p className="text-gray-600 text-sm">Filtre docentes y actividades para una asignación más eficiente</p>
    </div>
    <div className="p-6 pt-0">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Buscar docente</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Nombre o departamento"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Categoría de actividad</Label>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            <option value="Académica">Académica</option>
            <option value="Investigación">Investigación</option>
            <option value="Administrativa">Administrativa</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Acciones masivas</Label>
          <div className="flex gap-1">
            <Button
              onClick={() => handleBulkPermissionChange("ver", true)}
              className="text-xs px-3 py-1 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            >
              Ver a todos
            </Button>
          </div>
        </div>
      </div>
    </div>
  </Card>
);

// Componente de matriz de permisos
const PermissionsMatrix = ({ 
  filteredCombinations, 
  getPermissionAssignment, 
  handlePermissionChange 
}) => (
  <Card>
    <div className="p-6 pb-4">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Matriz de Permisos</h3>
      </div>
      <p className="text-gray-600 text-sm">Seleccione los permisos para cada combinación de docente y actividad</p>
    </div>
    <div className="p-6 pt-0">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                Docente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                Actividad
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Ver
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Editar
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Aprobar
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCombinations.map(({ teacher, activity }) => {
              const assignment = getPermissionAssignment(teacher.id, activity.id);
              return (
                <tr key={`${teacher.id}-${activity.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{activity.name}</div>
                      <div className="text-sm text-gray-500">{activity.description}</div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border mt-1">
                        {activity.category}
                      </span>
                    </div>
                  </td>
                  {["ver", "editar", "aprobar"].map((permission) => (
                    <td key={permission} className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="checkbox"
                        checked={assignment.permissions.includes(permission)}
                        onChange={() => handlePermissionChange(teacher.id, activity.id, permission)}
                        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                      />
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <StatusBadge status={assignment.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </Card>
);

// Componente de resumen
const SummarySection = ({ permissionAssignments, teachersCount, activitiesCount }) => (
  <div className="space-y-4">
    <Card>
      <div className="p-6 pb-4">
        <h3 className="text-lg font-semibold">Resumen de Permisos</h3>
        <p className="text-gray-600 text-sm">Vista general de los permisos asignados</p>
      </div>
      <div className="p-6 pt-0">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-700">
              {permissionAssignments.filter((a) => a.status === "asignado").length}
            </div>
            <div className="text-sm text-gray-600">Permisos Asignados</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {permissionAssignments.filter((a) => a.status === "pendiente").length}
            </div>
            <div className="text-sm text-gray-600">Permisos Pendientes</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              {teachersCount * activitiesCount - permissionAssignments.length}
            </div>
            <div className="text-sm text-gray-600">Sin Asignar</div>
          </div>
        </div>
      </div>
    </Card>
  </div>
);

// Datos estáticos
const teachers = [
  { id: "1", name: "Dr. Juan Pérez", department: "Ingeniería", email: "juan.perez@uabc.edu.mx" },
  { id: "2", name: "Dra. María González", department: "Ciencias", email: "maria.gonzalez@uabc.edu.mx" },
  { id: "3", name: "Mtro. Carlos Rodríguez", department: "Humanidades", email: "carlos.rodriguez@uabc.edu.mx" },
];

const activities = [
  { id: "1", name: "Revisión de Tesis", description: "Revisar y aprobar tesis de estudiantes", category: "Académica" },
  { id: "2", name: "Evaluación de Proyectos", description: "Evaluar proyectos de investigación", category: "Investigación" },
  { id: "3", name: "Gestión de Convenios", description: "Gestionar convenios con otras instituciones", category: "Administrativa" },
];

// Componente principal
export default function GestionUsuariosDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("asignacion");
  const [permissionAssignments, setPermissionAssignments] = useState([
    { teacherId: "1", activityId: "1", permissions: ["ver", "editar"], status: "asignado" },
    { teacherId: "1", activityId: "2", permissions: [], status: "pendiente" },
    { teacherId: "2", activityId: "1", permissions: ["ver"], status: "pendiente" },
  ]);

  const handlePermissionChange = (teacherId, activityId, permission) => {
    setPermissionAssignments((prev) => {
      const existingAssignment = prev.find((a) => a.teacherId === teacherId && a.activityId === activityId);

      if (existingAssignment) {
        const updatedPermissions = existingAssignment.permissions.includes(permission)
          ? existingAssignment.permissions.filter((p) => p !== permission)
          : [...existingAssignment.permissions, permission];

        return prev.map((a) =>
          a.teacherId === teacherId && a.activityId === activityId
            ? {
                ...a,
                permissions: updatedPermissions,
                status: updatedPermissions.length > 0 ? "pendiente" : "sin_asignar",
              }
            : a,
        );
      } else {
        return [...prev, { teacherId, activityId, permissions: [permission], status: "pendiente" }];
      }
    });
  };

  const handleBulkPermissionChange = (permission, checked) => {
    const filteredCombinations = getFilteredCombinations();

    filteredCombinations.forEach(({ teacher, activity }) => {
      if (checked) {
        handlePermissionChange(teacher.id, activity.id, permission);
      } else {
        setPermissionAssignments((prev) =>
          prev.map((a) =>
            a.teacherId === teacher.id && a.activityId === activity.id
              ? { ...a, permissions: a.permissions.filter((p) => p !== permission) }
              : a,
          ),
        );
      }
    });
  };

  const handleConfirmAssignments = () => {
    setPermissionAssignments((prev) =>
      prev.map((a) => ({ ...a, status: a.permissions.length > 0 ? "asignado" : "sin_asignar" })),
    );

    alert("Permisos asignados exitosamente");
  };

  const getPermissionAssignment = (teacherId, activityId) => {
    return (
      permissionAssignments.find((a) => a.teacherId === teacherId && a.activityId === activityId) || {
        teacherId,
        activityId,
        permissions: [],
        status: "sin_asignar",
      }
    );
  };

  const getFilteredCombinations = () => {
    const filteredTeachers = teachers.filter(
      (teacher) =>
        (teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.department.toLowerCase().includes(searchTerm.toLowerCase())),
    );

    const filteredActivities = activities.filter(
      (activity) => categoryFilter === "all" || activity.category === categoryFilter,
    );

    return filteredTeachers.flatMap((teacher) => filteredActivities.map((activity) => ({ teacher, activity })));
  };

  const filteredCombinations = getFilteredCombinations();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <DashboardHeader teachersCount={teachers.length} activitiesCount={activities.length} />

      <div className="space-y-4">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "asignacion" && (
          <div className="space-y-4">
            <FiltersSection 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              handleBulkPermissionChange={handleBulkPermissionChange}
            />

            <PermissionsMatrix 
              filteredCombinations={filteredCombinations}
              getPermissionAssignment={getPermissionAssignment}
              handlePermissionChange={handlePermissionChange}
            />

            <div className="flex justify-end">
              <Button
                onClick={handleConfirmAssignments}
                className="flex items-center text-white bg-green-700 hover:bg-green-800"
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                Confirmar Asignación de Permisos
              </Button>
            </div>
          </div>
        )}

        {activeTab === "resumen" && (
          <SummarySection 
            permissionAssignments={permissionAssignments}
            teachersCount={teachers.length}
            activitiesCount={activities.length}
          />
        )}
      </div>
    </div>
  );
}