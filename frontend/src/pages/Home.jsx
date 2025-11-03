/* eslint-disable react/prop-types */
import { useState } from 'react';
import { BookOpen, ClipboardCheck, BarChart, Clock, UserCircle, ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';

const Button = ({ children, className, ...props }) => (
  <button 
    className={`px-4 py-2 rounded-md ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ children, className, ...props }) => (
  <div 
    className={`bg-white rounded-lg shadow-md ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default function Home() {
  const [role, setRole] = useState('docente'); // 'docente' | 'admin'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="min-h-screen grid md:grid-cols-2 gap-0">
        {/* Lado izquierdo: identidad institucional */}
        <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-600 text-white flex items-center overflow-hidden">
          {/* Patrones decorativos */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-900 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative w-full max-w-lg mx-auto px-8 py-16 md:py-20 z-10">
            {/* Logo con mejor diseño */}
            <div className="flex justify-center mb-10">
              <div className="relative">
                <div className="absolute inset-0 bg-white opacity-20 rounded-3xl blur-2xl"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-5 md:p-6 transform hover:scale-105 transition-transform duration-300">
                  <img
                    src="/01_ESCUDO-UABC-COLOR-ORIGINAL.png"
                    alt="Escudo de la Universidad Autónoma de Baja California"
                    className="w-32 sm:w-40 md:w-48"
                    loading="eager"
                  />
                </div>
              </div>
            </div>

            {/* Título mejorado */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-center leading-tight">
                Sistema de Reportes<br />
                <span className="text-green-200">Académicos</span>
              </h1>
              <div className="flex items-center justify-center gap-2 text-green-100">
                <div className="h-px w-12 bg-green-300"></div>
                <p className="text-base sm:text-lg font-medium">
                  UABC
                </p>
                <div className="h-px w-12 bg-green-300"></div>
              </div>
            </div>

            {/* Descripción con mejor espaciado */}
            <p className="mt-8 text-base sm:text-lg text-green-50 text-center leading-relaxed">
              Plataforma integral para la gestión y seguimiento de actividades académicas
            </p>

            {/* Características con mejor diseño */}
            <div className="mt-10 space-y-3">
              <div className="flex items-center gap-3 text-green-50 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">Registro rápido y sencillo de actividades</span>
              </div>
              <div className="flex items-center gap-3 text-green-50 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">Reportes detallados en tiempo real</span>
              </div>
              <div className="flex items-center gap-3 text-green-50 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">Recordatorios automáticos personalizados</span>
              </div>
            </div>
          </div>
        </section>

        {/* Lado derecho: acceso mejorado */}
        <section className="flex items-center justify-center p-6 md:p-8">
          <div className="w-full max-w-md">
            {/* Card principal con mejor diseño */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Header del card */}
              <div className="bg-gradient-to-r from-gray-50 to-white px-8 pt-8 pb-6">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-gray-900">Bienvenido</h2>
                  <p className="text-gray-500">Selecciona tu rol para acceder al sistema</p>
                </div>
              </div>

              {/* Contenido del card */}
              <div className="px-8 pb-8">
                {/* Switch mejorado */}
                <div className="relative bg-gray-100 rounded-2xl p-1.5 shadow-inner">
                  <button
                    onClick={() => setRole('docente')}
                    className={`relative w-1/2 px-5 py-3.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                      role === 'docente' 
                        ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/50 scale-105' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <UserCircle className="w-5 h-5" />
                      Docente
                    </span>
                  </button>
                  <button
                    onClick={() => setRole('admin')}
                    className={`absolute top-1.5 right-1.5 w-[calc(50%-0.375rem)] px-5 py-3.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                      role === 'admin' 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50 scale-105' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <ShieldCheck className="w-5 h-5" />
                      Admin
                    </span>
                  </button>
                </div>

                {/* Contenido dinámico mejorado */}
                <div className="mt-8 space-y-6">
                  {role === 'docente' ? (
                    <>
                      <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-2xl">
                          <UserCircle className="w-7 h-7 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Portal Docente</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Acceso para profesores y personal académico
                          </p>
                        </div>
                      </div>

                      <a 
                        href="/docente/login" 
                        className="group relative w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        Iniciar Sesión
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </a>

                      <div className="grid grid-cols-3 gap-3 pt-4">
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-10 h-10 bg-green-50 rounded-xl mb-2">
                            <ClipboardCheck className="w-5 h-5 text-green-600" />
                          </div>
                          <p className="text-xs text-gray-600 font-medium">Registro</p>
                        </div>
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-10 h-10 bg-green-50 rounded-xl mb-2">
                            <BarChart className="w-5 h-5 text-green-600" />
                          </div>
                          <p className="text-xs text-gray-600 font-medium">Reportes</p>
                        </div>
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-10 h-10 bg-green-50 rounded-xl mb-2">
                            <Clock className="w-5 h-5 text-green-600" />
                          </div>
                          <p className="text-xs text-gray-600 font-medium">Alertas</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-2xl">
                          <ShieldCheck className="w-7 h-7 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Panel Administrativo</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Acceso para administradores y coordinadores
                          </p>
                        </div>
                      </div>

                      <a 
                        href="/admin/login" 
                        className="group relative w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        Iniciar Sesión
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </a>

                      <div className="grid grid-cols-3 gap-3 pt-4">
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-50 rounded-xl mb-2">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                          </div>
                          <p className="text-xs text-gray-600 font-medium">Gestión</p>
                        </div>
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-50 rounded-xl mb-2">
                            <BarChart className="w-5 h-5 text-blue-600" />
                          </div>
                          <p className="text-xs text-gray-600 font-medium">Análisis</p>
                        </div>
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-50 rounded-xl mb-2">
                            <ShieldCheck className="w-5 h-5 text-blue-600" />
                          </div>
                          <p className="text-xs text-gray-600 font-medium">Control</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Nota de seguridad */}
            <p className="text-center text-xs text-gray-500 mt-6">
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
              Conexión segura y protegida
            </p>
          </div>
        </section>
      </div>

      {/* Footer mejorado */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Universidad Autónoma de Baja California. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Se removió la grilla extensa de características para mantener una portada más limpia
