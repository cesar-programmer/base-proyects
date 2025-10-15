import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a la página de login correspondiente
  if (!isAuthenticated) {
    if (requiredRole === 'ADMINISTRADOR') {
      return <Navigate to="/admin/login" replace />;
    } else if (requiredRole === 'DOCENTE') {
      return <Navigate to="/docente/login" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Si se requiere un rol específico, verificarlo
  if (requiredRole) {
    const roleName = user?.rol?.nombre;
    const isAdminEquivalent = roleName === 'ADMINISTRADOR' || roleName === 'COORDINADOR';

    // Para rutas de administrador, permitir también coordinadores
    if (requiredRole === 'ADMINISTRADOR' && !isAdminEquivalent) {
      return <Navigate to="/admin/login" replace />;
    }

    // Para rutas de docente, verificar rol docente
    if (requiredRole === 'DOCENTE' && roleName !== 'DOCENTE') {
      return <Navigate to="/docente/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;