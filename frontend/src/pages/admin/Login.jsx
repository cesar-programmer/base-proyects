/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import  { useState } from 'react';
import { AlertCircle } from 'lucide-react';

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
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Si hay error, ejecutar:
      // setError(true);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex justify-center mb-6">
          <img
            src="/placeholder.svg"
            alt="UABC Logo"
            className="w-[200px] h-[100px]"
          />
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center text-green-800">
          Iniciar Sesión
        </h1>
        <h1 className="text-xl font-bold mb-6 text-center text-green-800">
          Administrador
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="correo@uabc.edu.mx" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                type="password" 
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
          <div className="mt-4 p-4 bg-red-100 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-sm text-red-600">
                Credenciales incorrectas. Por favor, inténtalo de nuevo.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

