import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada exitosamente');
    navigate('/');
  };

  return (
    <nav className="bg-green-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          
          <div className="flex-shrink-0">
            <NavLink 
              to="/admin/dashboard" 
              className="text-xl font-bold hover:underline"
            >
              UABC Administración
            </NavLink>
          </div>

          {/* Menú de navegación en pantallas grandes */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/admin/estadisticas"
              className={({ isActive }) =>
                `hover:underline text-sm font-medium ${
                  isActive ? "underline" : ""
                }`
              }
            >
              Estadísticas
            </NavLink>
            <NavLink
              to="/admin/gestion-usuarios"
              className={({ isActive }) =>
                `hover:underline text-sm font-medium ${
                  isActive ? "underline" : ""
                }`
              }
            >
              Usuarios
            </NavLink>
            <NavLink
              to="/admin/configuracion-fechas"
              className={({ isActive }) =>
                `hover:underline text-sm font-medium ${
                  isActive ? "underline" : ""
                }`
              }
            >
              Configuración Fechas
            </NavLink>
            <NavLink
              to="/admin/correcciones"
              className={({ isActive }) =>
                `hover:underline text-sm font-medium ${
                  isActive ? "underline" : ""
                }`
              }
            >
              Correcciones
            </NavLink>
            <div className="flex items-center space-x-2 text-sm font-medium">
              <User className="w-4 h-4" />
              <span>{user?.nombre || 'Administrador'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-sm font-medium hover:underline transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>

          {/* Botón hamburguesa (solo visible en mobile) */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="focus:outline-none">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú desplegable en mobile */}
        {isOpen && (
          <div className="md:hidden pb-6 space-y-2">
            <NavLink
              to="/admin/estadisticas"
              onClick={() => setIsOpen(false)}
              className="block px-2 py-1 text-sm font-medium hover:underline"
            >
              Estadísticas
            </NavLink>
            <NavLink
              to="/admin/gestion-usuarios"
              onClick={() => setIsOpen(false)}
              className="block px-2 py-1 text-sm font-medium hover:underline"
            >
              Usuarios
            </NavLink>
            <NavLink
              to="/admin/configuracion-fechas"
              onClick={() => setIsOpen(false)}
              className="block px-2 py-1 text-sm font-medium hover:underline"
            >
              Configuración Fechas
            </NavLink>
            <NavLink
              to="/admin/correcciones"
              onClick={() => setIsOpen(false)}
              className="block px-2 py-1 text-sm font-medium hover:underline"
            >
              Correcciones
            </NavLink>
            <div className="flex items-center space-x-2 px-2 py-1 text-sm font-medium border-t border-green-700 mt-2 pt-2">
              <User className="w-4 h-4" />
              <span>{user?.nombre || 'Administrador'}</span>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="flex items-center space-x-1 px-2 py-1 text-sm font-medium hover:underline w-full text-left transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}