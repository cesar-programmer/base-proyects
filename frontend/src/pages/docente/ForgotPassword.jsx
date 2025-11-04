/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Lock, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

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

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
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
    
    // Validar que las contraseñas nuevas coincidan
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('Las contraseñas nuevas no coinciden');
      toast.error('Las contraseñas nuevas no coinciden');
      setLoading(false);
      return;
    }
    
    try {
      // Primero hacer login para verificar la contraseña actual
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.currentPassword
      });

      if (!loginResponse.data.token) {
        throw new Error('Credenciales inválidas');
      }

      const token = loginResponse.data.token;

      // Ahora cambiar la contraseña
      await axios.post(
        `${API_URL}/auth/change-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmNewPassword: formData.confirmNewPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast.success('Contraseña actualizada correctamente');
      setTimeout(() => navigate('/docente/login'), 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error al cambiar la contraseña. Verifica tus credenciales.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      {/* Botón de regreso flotante */}
      <button
        onClick={() => navigate('/docente/login')}
        className="fixed top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white text-green-700 rounded-xl shadow-lg hover:shadow-xl hover:bg-green-50 transition-all duration-300 border border-green-100 z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-semibold">Volver al Login</span>
      </button>

      <div className="w-full max-w-md">
        {/* Card principal */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header con logo */}
          <div className="relative bg-gradient-to-br from-green-600 to-green-500 px-8 pt-12 pb-20">
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
                <h1 className="text-2xl font-bold text-white mb-2">Cambiar Contraseña</h1>
                <p className="text-green-100 text-sm">Sistema de Reportes Académicos</p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="px-8 -mt-8 pb-8">
            {/* Info badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                <Lock className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-700">Actualizar Contraseña</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative mt-2">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu.correo@universidad.edu"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Contraseña actual */}
              <div>
                <Label htmlFor="currentPassword">Contraseña actual</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              {/* Nueva contraseña */}
              <div>
                <Label htmlFor="newPassword">Nueva contraseña</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 8 caracteres, una mayúscula, una minúscula y un número
                </p>
              </div>

              {/* Confirmar nueva contraseña */}
              <div>
                <Label htmlFor="confirmNewPassword">Confirmar nueva contraseña</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
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
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Actualizando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    Cambiar Contraseña
                  </span>
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
}
