/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Mail, Lock, Info, ShieldCheck, Eye, EyeOff } from 'lucide-react';
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

export default function LoginPageAdmin() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        // Verificar que el usuario sea administrador o coordinador
        const roleName = result.user.rol?.nombre;
        if (roleName === 'ADMINISTRADOR' || roleName === 'COORDINADOR') {
          const rolDisplay = roleName === 'COORDINADOR' ? 'Coordinador' : 'Administrador';
          toast.success(`¡Bienvenido, ${rolDisplay}!`);
          navigate('/admin/dashboard');
        } else {
          setError('No tienes permisos de administrador');
          toast.error('Acceso denegado: Se requieren permisos de administrador');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Botón de regreso flotante */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300 border border-blue-100 z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-semibold">Volver</span>
      </button>

      <div className="w-full max-w-md">
        {/* Card principal */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header con logo */}
          <div className="relative bg-gradient-to-br from-blue-600 to-blue-500 px-8 pt-12 pb-20">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative flex flex-col items-center">
              {/* Logo */}
              <div className="bg-white rounded-2xl shadow-xl p-4 mb-6">
                <img
                  src="/01_ESCUDO-UABC-COLOR-ORIGINAL.png"
                  alt="Universidad Autónoma de Baja California"
                  className="w-20 h-20 object-contain"
                />
              </div>
              
              {/* Título */}
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white mb-2">Panel Administrativo</h1>
                <p className="text-blue-100 text-sm">Sistema de Reportes Académicos</p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="px-8 -mt-8 pb-8">
            {/* Badge de rol */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Acceso para Administradores</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo de email */}
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium mb-2">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@universidad.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Campo de contraseña */}
              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium mb-2">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>


              {/* Mensaje de error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Botón de envío */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Universidad Autónoma de Baja California
        </p>
      </div>
    </div>
  );
};

