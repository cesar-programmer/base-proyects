/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { User, Search, Plus, Edit, Trash2, Users, Eye, EyeOff, Upload, Download, FileSpreadsheet } from "lucide-react";
import userService from '../../services/userService';
import { toast } from 'react-toastify';

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



// Componente principal
export default function GestionUsuariosDashboard() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [bulkFile, setBulkFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    cedula: '',
    telefono: '',
    rolId: ''
  });

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('🔄 Iniciando carga de usuarios...');
      // Agregar timestamp para evitar caché
      const response = await userService.getAllUsers();
      console.log('📦 Respuesta completa del servidor:', response);
      console.log('👥 Total de usuarios recibidos:', response.data?.length || 0);
      console.log('📋 Lista de usuarios:', response.data);
      
      // Verificar estructura de cada usuario
      if (response.data && response.data.length > 0) {
        console.log('🔍 Primer usuario (estructura):', response.data[0]);
        console.log('🔍 Roles de cada usuario:', response.data.map(u => ({
          nombre: u.nombre,
          email: u.email,
          rol: u.rol,
          rolNombre: u.rol?.nombre
        })));
      }
      
      setUsers(response.data || []);
      console.log('✅ Estado actualizado con', response.data?.length || 0, 'usuarios');
    } catch (error) {
      toast.error('Error al cargar usuarios: ' + error.message);
      console.error('❌ Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await userService.getRoles();
      setRoles(response.data || []);
    } catch (error) {
      toast.error('Error al cargar roles: ' + error.message);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await userService.createUser(formData);
      toast.success('Usuario creado exitosamente');
      setShowCreateModal(false);
      setFormData({ nombre: '', apellido: '', email: '', password: '', cedula: '', telefono: '', rolId: '' });
      loadUsers();
    } catch (error) {
      toast.error('Error al crear usuario: ' + error.message);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }
      await userService.updateUser(editingUser.id, updateData);
      toast.success('Usuario actualizado exitosamente');
      setEditingUser(null);
      setFormData({ nombre: '', apellido: '', email: '', password: '', cedula: '', telefono: '', rolId: '' });
      loadUsers();
    } catch (error) {
      toast.error('Error al actualizar usuario: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await userService.deleteUser(userId);
        toast.success('Usuario eliminado exitosamente');
        loadUsers();
      } catch (error) {
        toast.error('Error al eliminar usuario: ' + error.message);
      }
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await userService.toggleUserStatus(userId);
      toast.success('Estado del usuario actualizado');
      loadUsers();
    } catch (error) {
      toast.error('Error al cambiar estado: ' + error.message);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.cedula?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.rol?.id?.toString() === roleFilter;
    const isNotCoordinator = user.rol?.nombre !== 'COORDINADOR'; // Ocultar coordinadores
    
    console.log(`🔍 Filtrado usuario ${user.email}:`, {
      matchesSearch,
      matchesRole,
      isNotCoordinator,
      rolNombre: user.rol?.nombre,
      incluido: matchesSearch && matchesRole && isNotCoordinator
    });
    
    return matchesSearch && matchesRole && isNotCoordinator;
  });
  
  console.log('📊 Resultado del filtrado:');
  console.log('  - Total usuarios:', users.length);
  console.log('  - Usuarios filtrados:', filteredUsers.length);
  console.log('  - Búsqueda:', searchTerm || '(vacío)');
  console.log('  - Filtro rol:', roleFilter);

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      email: user.email || '',
      password: '',
      cedula: user.cedula || '',
      telefono: user.telefono || '',
      rolId: user.rol?.id?.toString() || ''
    });
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowBulkUploadModal(false);
    setEditingUser(null);
    setBulkFile(null);
    setUploadProgress(0);
    setFormData({ nombre: '', apellido: '', email: '', password: '', cedula: '', telefono: '', rolId: '' });
  };

  // Función para descargar plantilla CSV
  const downloadTemplate = () => {
    // rolId: 1=ADMINISTRADOR, 3=DOCENTE (2=COORDINADOR está oculto)
    const csvContent = "nombre,apellido,email,cedula,telefono,rolId,password\nJuan,Pérez,juan.perez@universidad.edu,12345678,555-1234,3,Password123\nMaría,González,maria.gonzalez@universidad.edu,87654321,555-5678,1,Password123";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'plantilla_usuarios.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Plantilla descargada exitosamente');
  };

  // Función para manejar la carga del archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toast.error('Por favor, selecciona un archivo CSV válido');
        return;
      }
      setBulkFile(file);
    }
  };

  // Función para procesar y cargar usuarios masivamente
  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!bulkFile) {
      toast.error('Por favor, selecciona un archivo CSV');
      return;
    }

    try {
      setUploadProgress(10);
      const text = await bulkFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error('El archivo CSV está vacío o no tiene datos');
        return;
      }

      setUploadProgress(30);
      
      // Procesar el CSV
      const headers = lines[0].split(',').map(h => h.trim());
      const users = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length === headers.length) {
          const user = {};
          headers.forEach((header, index) => {
            user[header] = values[index];
          });
          
          // Validar campos requeridos
          if (user.nombre && user.apellido && user.email && user.cedula && user.rolId && user.password) {
            users.push(user);
          }
        }
      }

      if (users.length === 0) {
        toast.error('No se encontraron usuarios válidos en el archivo');
        return;
      }

      console.log(`Procesando ${users.length} usuarios para crear...`);
      setUploadProgress(50);

      // Crear usuarios uno por uno
      let successCount = 0;
      let errorCount = 0;
      const errors = [];
      
      for (let i = 0; i < users.length; i++) {
        try {
          console.log(`Creando usuario ${i + 1}/${users.length}: ${users[i].email}`);
          await userService.createUser(users[i]);
          successCount++;
          setUploadProgress(50 + (50 * (i + 1) / users.length));
        } catch (error) {
          errorCount++;
          const errorMsg = error.message || 'Error desconocido';
          console.error(`Error al crear usuario ${users[i].email}:`, errorMsg);
          errors.push(`${users[i].email}: ${errorMsg}`);
        }
      }

      console.log(`Carga masiva completada: ${successCount} exitosos, ${errorCount} errores`);
      setUploadProgress(100);
      
      // Cerrar modal y limpiar
      setShowBulkUploadModal(false);
      setBulkFile(null);
      
      // Recargar usuarios con un pequeño delay para asegurar que se actualice
      setTimeout(async () => {
        console.log('Recargando lista de usuarios...');
        await loadUsers();
        setUploadProgress(0);
        
        if (successCount > 0) {
          toast.success(`✅ ${successCount} usuarios creados exitosamente`);
        }
        if (errorCount > 0) {
          toast.warning(`⚠️ ${errorCount} usuarios no pudieron ser creados`, {
            duration: 6000
          });
          // Mostrar detalles de errores en consola
          console.log('Errores detallados:', errors);
        }
      }, 500);
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
      toast.error('Error al procesar el archivo: ' + error.message);
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-700 mb-2">Gestión de Usuarios</h1>
        <p className="text-gray-600">Administra usuarios del sistema</p>
      </div>

      {/* Filtros y acciones */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Todos los roles</option>
              {roles.filter(role => role.nombre !== 'COORDINADOR').map(role => (
                <option key={role.id} value={role.id.toString()}>{role.nombre}</option>
              ))}
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowBulkUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Carga Masiva
            </Button>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Usuario
            </Button>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900">{user.nombre} {user.apellido}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user.rol?.nombre || 'Sin rol'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.activo ? (
                        <><Eye className="w-3 h-3 mr-1" /> Activo</>
                      ) : (
                        <><EyeOff className="w-3 h-3 mr-1" /> Inactivo</>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => openEditModal(user)}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-green-700">No hay usuarios</h3>
            <p className="mt-1 text-sm text-gray-500">No se encontraron usuarios con los filtros aplicados.</p>
          </div>
        )}
      </div>

      {/* Modal de crear usuario */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-green-700 mb-4">Crear Nuevo Usuario</h3>
            <form onSubmit={handleCreateUser}>
              <div className="mb-4">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="cedula">Matricula</Label>
                <Input
                  id="cedula"
                  type="text"
                  value={formData.cedula}
                  onChange={(e) => setFormData({...formData, cedula: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="telefono">Teléfono (opcional)</Label>
                <Input
                  id="telefono"
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  placeholder="Mín. 8 caracteres, 1 mayúscula, 1 minúscula, 1 número"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="rolId">Rol</Label>
                <Select
                  id="rolId"
                  value={formData.rolId}
                  onChange={(e) => setFormData({...formData, rolId: e.target.value})}
                  required
                >
                  <option value="">Seleccionar rol</option>
                  {roles.filter(role => role.nombre !== 'COORDINADOR').map(role => (
                    <option key={role.id} value={role.id.toString()}>{role.nombre}</option>
                  ))}
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white flex-1">
                  Crear Usuario
                </Button>
                <Button type="button" onClick={closeModals} className="bg-gray-600 hover:bg-gray-700 text-white flex-1">
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de editar usuario */}
      {editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-green-700 mb-4">Editar Usuario</h3>
            <form onSubmit={handleUpdateUser}>
              <div className="mb-4">
                <Label htmlFor="edit-nombre">Nombre</Label>
                <Input
                  id="edit-nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="edit-apellido">Apellido</Label>
                <Input
                  id="edit-apellido"
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="edit-cedula">Matricula</Label>
                <Input
                  id="edit-cedula"
                  type="text"
                  value={formData.cedula}
                  onChange={(e) => setFormData({...formData, cedula: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="edit-telefono">Teléfono (opcional)</Label>
                <Input
                  id="edit-telefono"
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="edit-password">Nueva Contraseña (opcional)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Dejar vacío para mantener la actual"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="edit-rolId">Rol</Label>
                <Select
                  id="edit-rolId"
                  value={formData.rolId}
                  onChange={(e) => setFormData({...formData, rolId: e.target.value})}
                  required
                >
                  <option value="">Seleccionar rol</option>
                  {roles.filter(role => role.nombre !== 'COORDINADOR').map(role => (
                    <option key={role.id} value={role.id.toString()}>{role.nombre}</option>
                  ))}
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                  Actualizar Usuario
                </Button>
                <Button type="button" onClick={closeModals} className="bg-gray-600 hover:bg-gray-700 text-white flex-1">
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de carga masiva */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              Carga Masiva de Usuarios
            </h3>
            
            {/* Instrucciones */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">📋 Instrucciones:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li>Descarga la plantilla CSV haciendo clic en el botón de abajo</li>
                <li>Completa el archivo con los datos de los usuarios</li>
                <li>Asegúrate de incluir todos los campos requeridos</li>
                <li>Los ID de roles son: <strong>1 = ADMINISTRADOR</strong>, <strong>3 = DOCENTE</strong></li>
                <li>Sube el archivo completado usando el botón de carga</li>
              </ol>
            </div>

            {/* Botón para descargar plantilla */}
            <div className="mb-4">
              <Button
                type="button"
                onClick={downloadTemplate}
                className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar Plantilla CSV
              </Button>
            </div>

            {/* Formulario de carga */}
            <form onSubmit={handleBulkUpload}>
              <div className="mb-4">
                <Label htmlFor="bulk-file">Seleccionar Archivo CSV</Label>
                <div className="mt-2 flex items-center gap-4">
                  <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      id="bulk-file"
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Upload className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {bulkFile ? bulkFile.name : 'Haz clic para seleccionar archivo'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Barra de progreso */}
              {uploadProgress > 0 && (
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 text-center">{uploadProgress}%</p>
                </div>
              )}

              {/* Formato esperado */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 mb-1">Formato CSV esperado:</p>
                <code className="text-xs text-gray-600 block">
                  nombre,apellido,email,cedula,telefono,rolId,password
                </code>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1 disabled:opacity-50"
                  disabled={!bulkFile || uploadProgress > 0}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Cargar Usuarios
                </Button>
                <Button 
                  type="button" 
                  onClick={closeModals} 
                  className="bg-gray-600 hover:bg-gray-700 text-white flex-1"
                  disabled={uploadProgress > 0}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}