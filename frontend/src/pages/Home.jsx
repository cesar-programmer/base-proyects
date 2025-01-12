/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { BookOpen, ClipboardCheck, BarChart, Clock, UserCircle, ShieldCheck } from 'lucide-react';

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
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-green-800">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-green-900 to-green-800 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-center">
            Sistema de Reportes para Docentes UABC
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-green-100 text-center">
            Gestiona tus actividades académicas de manera eficiente y mantén un registro detallado de tu desempeño docente.
          </p>
        </div>
      </div>

      {/* Login Options Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Docente Login Card */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <UserCircle className="h-16 w-16 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
                  Acceso Docente
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  Para profesores y personal académico de la institución
                </p>
                <div className="flex justify-center">
                  <a href="/docente/login">
                    <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3">
                      Iniciar Sesión como Docente
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Admin Login Card */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <ShieldCheck className="h-16 w-16 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
                  Acceso Administrativo
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  Para administradores y personal de gestión del sistema
                </p>
                <div className="flex justify-center">
                  <a href="/admin/login">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3">
                      Iniciar Sesión como Administrador
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Características Principales
            </h2>
          </div>

          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index}>
                <div className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      {feature.icon}
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-base text-gray-600 text-center">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-green-700 rounded-lg shadow-xl overflow-hidden">
            <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  <span className="block">Docentes</span>
                  <span className="block">¿Listo para comenzar?</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-green-100">
                  Accede al sistema y comienza a gestionar tus actividades académicas como docente.
                </p>
                <a href="/login" className="mt-8 inline-block">
                  <Button className=" bg-white  hover:bg-green-50 font-semibold px-6 py-5 text-green-700">
                    Acceder al Sistema por priemra vez
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-gray-500">
              &copy; {new Date().getFullYear()} Universidad Autónoma de Baja California. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <ClipboardCheck className="h-8 w-8 text-green-600" />,
    title: "Registro de Actividades",
    description: "Documenta fácilmente tus actividades académicas y de investigación"
  },
  {
    icon: <BarChart className="h-8 w-8 text-green-600" />,
    title: "Reportes y Estadísticas",
    description: "Visualiza tu progreso y genera informes detallados"
  },
  {
    icon: <Clock className="h-8 w-8 text-green-600" />,
    title: "Recordatorios",
    description: "Mantente al día con recordatorios automáticos"
  },
  {
    icon: <BookOpen className="h-8 w-8 text-green-600" />,
    title: "Gestión Académica",
    description: "Administra tu información académica de forma eficiente"
  }
];