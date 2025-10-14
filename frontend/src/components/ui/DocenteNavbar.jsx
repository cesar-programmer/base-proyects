import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function DocenteNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleLogout = () => {
    logout();
    navigate('/docente/login');
  };

  return (
    <nav className="bg-green-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          
          <div className="flex-shrink-0">
            <NavLink 
              to="/docente/dashboard" 
              className="text-xl font-bold hover:underline"
            >
              UABC Docentes
            </NavLink>
          </div>

          {/* Menú de navegación en pantallas grandes */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/docente/actividades-planificadas"
              className={({ isActive }) =>
                `hover:underline text-sm font-medium ${
                  isActive ? "underline" : ""
                }`
              }
            >
              Actividades Planificadas
            </NavLink>
            <NavLink
              to="/docente/mis-actividades-periodo"
              className={({ isActive }) =>
                `hover:underline text-sm font-medium ${
                  isActive ? "underline" : ""
                }`
              }
            >
              Mis Actividades (Período Activo)
            </NavLink>
            <NavLink
              to="/docente/reportes-pendientes"
              className={({ isActive }) =>
                `hover:underline text-sm font-medium ${
                  isActive ? "underline" : ""
                }`
              }
            >
              Reportes Pendientes
            </NavLink>
            <NavLink
              to="/docente/historial-reportes"
              className={({ isActive }) =>
                `hover:underline text-sm font-medium ${
                  isActive ? "underline" : ""
                }`
              }
            >
              Historial de Reportes
            </NavLink>
            {/* Estadísticas removidas del menú del docente */}
            <button
              onClick={handleLogout}
              className="text-sm font-medium hover:underline flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
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
          <div className="md:hidden pb-6 space-y-2 ">
            <NavLink
              to="/docente/dashboard"
              onClick={() => setIsOpen(false)}
              className="block px-2 py-1 text-sm font-medium hover:underline"
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/docente/actividades-planificadas"
              onClick={() => setIsOpen(false)}
              className="block px-2 py-1 text-sm font-medium hover:underline"
            >
              Actividades Planificadas
            </NavLink>
            <NavLink
              to="/docente/mis-actividades-periodo"
              onClick={() => setIsOpen(false)}
              className="block px-2 py-1 text-sm font-medium hover:underline"
            >
              Mis Actividades (Período Activo)
            </NavLink>
            <NavLink
              to="/docente/reportes-pendientes"
              onClick={() => setIsOpen(false)}
              className="block px-2 py-1 text-sm font-medium hover:underline"
            >
              Reportes Pendientes
            </NavLink>
            <NavLink
              to="/docente/historial-reportes"
              onClick={() => setIsOpen(false)}
              className="block px-2 py-1 text-sm font-medium hover:underline"
            >
              Historial de Reportes
            </NavLink>
            {/* Estadísticas removidas del menú móvil del docente */}
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="block px-2 py-1 text-sm font-medium hover:underline flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
