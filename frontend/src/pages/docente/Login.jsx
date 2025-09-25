/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Button = ({ children, className, ...props }) => (
  <button 
    className={`px-4 py-2 rounded-md text-white ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ ...props }) => (
  <input 
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
    {...props}
  />
);

const Label = ({ children, htmlFor }) => (
  <label 
    htmlFor={htmlFor}
    className="block text-sm font-medium text-gray-700"
  >
    {children}
  </label>
);

export default function LoginPageDocente() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Verificar que el usuario sea docente o coordinador (temporalmente)
        if (result.user.rol?.nombre === 'DOCENTE' || result.user.rol?.nombre === 'COORDINADOR') {
          const rolDisplay = result.user.rol?.nombre === 'COORDINADOR' ? 'Coordinador' : 'Docente';
          toast.success(`¡Bienvenido, ${rolDisplay}!`);
          navigate('/docente/dashboard');
        } else {
          setError('No tienes permisos de docente o coordinador');
          toast.error('Acceso denegado: Se requieren permisos de docente o coordinador');
        }
      } else {
        setError(result.error);
        toast.error(result.error);
      }
    } catch (error) {
      const errorMessage = 'Error de conexión. Verifica que el servidor esté funcionando.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 relative">
        {/* Botón de regreso */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 flex items-center text-green-600 hover:text-green-800 transition-colors duration-200"
          title="Regresar a página de inicio"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span className="text-sm font-medium">Inicio</span>
        </button>
        
        <div className="flex justify-center mb-6 mt-8">
          <img
            src="/placeholder.svg"
            alt="UABC Logo"
            className="w-[200px] h-[100px]"
          />
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center text-green-800">
          Iniciar Sesión
        </h1>
        <h2 className="text-xl font-bold mb-6 text-center text-green-700">
          Docentes
        </h2>
        
        {/* Anuncio de datos de prueba */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Datos de Prueba Disponibles
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                  <p className="mb-2">Puedes usar estas credenciales para probar el sistema:</p>
                  <div className="space-y-1">
                    <p><strong>Docente:</strong> carlos.rodriguez@universidad.edu / docente123</p>
                    <p><strong>Coordinador:</strong> maria.gonzalez@universidad.edu / coord123</p>
                  </div>
                  <p className="mt-2 text-xs">
                    * Los coordinadores tienen acceso temporal al portal docente
                  </p>
                </div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                placeholder="docente@universidad.edu" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                name="password"
                type="password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-green-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded text-sm">
          <strong>Credenciales de prueba:</strong><br />
          Email: docente@universidad.edu<br />
          Contraseña: docente123
        </div>
      </div>
    </div>
  );
};

