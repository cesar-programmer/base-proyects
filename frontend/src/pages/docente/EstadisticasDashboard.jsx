import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-lg border shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`p-6 pb-4 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "", ...props }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`} {...props}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export default function EstadisticasDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState({
    totalActividades: 0,
    actividadesCompletadas: 0,
    reportesPendientes: 0,
    horasTotales: 0,
    promedioHorasPorActividad: 0,
    actividadesPorCategoria: {}
  });

  useEffect(() => {
    loadEstadisticas();
  }, [user]);

  const loadEstadisticas = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      // Aquí se cargarían las estadísticas reales desde la API
      // Por ahora usamos datos mock
      setEstadisticas({
        totalActividades: 24,
        actividadesCompletadas: 18,
        reportesPendientes: 3,
        horasTotales: 156,
        promedioHorasPorActividad: 6.5,
        actividadesPorCategoria: {
          'DOCENCIA': 8,
          'INVESTIGACION': 6,
          'GESTION_ACADEMICA': 4,
          'TUTORIAS': 3,
          'EXTENSION': 2,
          'CAPACITACION': 1
        }
      });
    } catch (error) {
      toast.error('Error al cargar estadísticas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const porcentajeCompletado = estadisticas.totalActividades > 0 
    ? Math.round((estadisticas.actividadesCompletadas / estadisticas.totalActividades) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-8 w-8 text-green-600" />
        <h1 className="text-2xl font-bold text-gray-900">Estadísticas</h1>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Actividades</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalActividades}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-green-600">{estadisticas.actividadesCompletadas}</p>
                <p className="text-xs text-gray-500">{porcentajeCompletado}% del total</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reportes Pendientes</p>
                <p className="text-2xl font-bold text-orange-600">{estadisticas.reportesPendientes}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Horas Totales</p>
                <p className="text-2xl font-bold text-purple-600">{estadisticas.horasTotales}</p>
                <p className="text-xs text-gray-500">Promedio: {estadisticas.promedioHorasPorActividad}h</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actividades por categoría */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Actividades por Categoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(estadisticas.actividadesPorCategoria).map(([categoria, cantidad]) => {
              const porcentaje = estadisticas.totalActividades > 0 
                ? Math.round((cantidad / estadisticas.totalActividades) * 100)
                : 0;
              
              return (
                <div key={categoria} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">{categoria}</span>
                    <span className="text-xs text-gray-500">({cantidad} actividades)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${porcentaje}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 w-8">{porcentaje}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Progreso general */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso General del Semestre</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Actividades completadas</span>
              <span>{estadisticas.actividadesCompletadas} de {estadisticas.totalActividades}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${porcentajeCompletado}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600">
              {porcentajeCompletado}% completado - {estadisticas.totalActividades - estadisticas.actividadesCompletadas} actividades restantes
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}