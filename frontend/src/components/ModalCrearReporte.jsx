/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { X, FileText, Calendar, MapPin, Upload, Users, Target, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import activityService from '../services/activityService';
import reportService from '../services/reportService';
import { toast } from 'react-hot-toast';

const ModalCrearReporte = ({ open, onClose, onReporteCreado }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [actividades, setActividades] = useState([]);
  const [actividadesSeleccionadas, setActividadesSeleccionadas] = useState([]);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'ACTIVIDADES_PLANIFICADAS',
    semestre: '',
    ubicacion: '',
    presupuesto: '',
    participantesEsperados: '',
    objetivos: '',
    recursos: '',
    fechaRealizacion: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (open && user) {
      cargarActividades();
    }
  }, [open, user]);

  const cargarActividades = async () => {
    console.log('🔍 Iniciando carga de actividades...');
    try {
      setLoading(true);
      
      // Verificar token de autenticación
      const token = localStorage.getItem('authToken');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('🔑 Token presente:', !!token);
      console.log('👤 Usuario logueado:', userData);
      console.log('👤 Usuario del contexto:', user);
      
      // Usar el nuevo método que filtra por período académico actual
      const response = await activityService.getActivitiesByUserCurrentPeriod(user.id, { limit: 100 });
      console.log('📊 Respuesta del servicio:', response);
      console.log('🔍 Tipo de respuesta:', typeof response);
      console.log('🔍 Es array la respuesta:', Array.isArray(response));
      console.log('🔍 Tiene propiedad data:', response && response.hasOwnProperty('data'));
      console.log('🔍 Es array response.data:', response && Array.isArray(response.data));
      console.log('🔍 response.data:', response.data);
      console.log('🔍 Claves de response:', Object.keys(response));
      console.log('🔍 Tipo de response.data:', typeof response.data);
      console.log('🔍 response.data es array:', Array.isArray(response.data));
      
      // Intentar diferentes estructuras de respuesta
      let actividades = [];
      
      if (response && Array.isArray(response.data)) {
        console.log('✅ Estructura: response.data es array');
        actividades = response.data;
      } else if (response && response.data && Array.isArray(response.data.data)) {
        console.log('✅ Estructura: response.data.data es array');
        actividades = response.data.data;
      } else if (response && Array.isArray(response)) {
        console.log('✅ Estructura: response es array');
        actividades = response;
      } else {
        console.log('❌ No se pudo determinar la estructura de actividades');
        console.log('🔍 response:', response);
        setActividades([]);
        return;
      }
      
      console.log('📋 Actividades encontradas:', actividades);
      console.log('📋 Cantidad de actividades:', actividades.length);
      
      if (actividades.length > 0) {
        // Filtrar actividades que no estén rechazadas
        console.log('🔍 Analizando filtros para cada actividad:');
        actividades.forEach((actividad, index) => {
          const estadoNoRechazado = actividad.estado_planificacion !== 'rechazada';
          
          console.log(`📋 Actividad ${index + 1}:`, {
            id: actividad.id,
            titulo: actividad.titulo,
            estado_planificacion: actividad.estado_planificacion,
            'estadoNoRechazado': estadoNoRechazado,
            'PASA_FILTRO': estadoNoRechazado
          });
        });
        
        const actividadesDisponibles = actividades.filter(actividad => {
          const estadoNoRechazado = actividad.estado_planificacion !== 'rechazada';
          return estadoNoRechazado;
        });
        
        console.log('✅ Actividades disponibles después del filtro:', actividadesDisponibles);
        console.log(`📊 Resumen: ${actividades.length} recibidas, ${actividadesDisponibles.length} disponibles`);
        console.log('🔄 Estableciendo actividades en el estado...');
        setActividades(actividadesDisponibles);
        
        // Verificar el estado después de un pequeño delay
        setTimeout(() => {
          console.log('🔍 Estado de actividades después de setActividades:', actividadesDisponibles);
          console.log('🔍 Longitud del array de actividades:', actividadesDisponibles.length);
        }, 100);
        
        // Si hay información del período, mostrarla en consola para debug
        if (response.periodoActivo) {
          console.log('📅 Período académico activo:', response.periodoActivo.nombre);
        }
      } else {
        console.log('⚠️ No hay actividades para mostrar');
        setActividades([]);
      }
    } catch (error) {
      console.error('💥 Error al cargar actividades:', error);
      console.error('💥 Detalles del error:', error.response?.data || error.message);
      setActividades([]);
      
      // Si no hay período activo, mostrar mensaje específico
      if (error.message.includes('período académico activo')) {
        toast.error('No hay período académico activo configurado');
      } else {
        toast.error('Error al cargar las actividades');
      }
    } finally {
      setLoading(false);
      console.log('🏁 Carga de actividades finalizada');
    }
  };

  const handleSelectActividad = (actividadId) => {
    setActividadesSeleccionadas(prev => {
      if (prev.includes(actividadId)) {
        return prev.filter(id => id !== actividadId);
      } else {
        return [...prev, actividadId];
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (actividadesSeleccionadas.length === 0) {
      toast.error('Debe seleccionar al menos una actividad');
      return;
    }

    if (!formData.titulo.trim()) {
      toast.error('El título es requerido');
      return;
    }

    try {
      setLoading(true);
      
      // Crear el reporte
      const reporteData = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        fechaRealizacion: formData.fechaRealizacion,
        estado: 'borrador',
        actividades: actividadesSeleccionadas
      };

      await reportService.createReport(reporteData);
      
      toast.success('Reporte creado exitosamente');
      onReporteCreado();
    } catch (error) {
      console.error('Error al crear reporte:', error);
      toast.error('Error al crear el reporte');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Reporte</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Información básica del reporte */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Título del Reporte *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: Reporte de Actividades Primer Semestre 2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Reporte
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="ACTIVIDADES_PLANIFICADAS">Actividades Planificadas</option>
                  <option value="ACTIVIDADES_REALIZADAS">Actividades Realizadas</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Semestre
                </label>
                <input
                  type="text"
                  name="semestre"
                  value={formData.semestre}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: 2024-1"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de Realización
                </label>
                <input
                  type="date"
                  name="fechaRealizacion"
                  value={formData.fechaRealizacion}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Ubicación
                </label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: Aula 101, Campus Principal"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Presupuesto
                </label>
                <input
                  type="number"
                  name="presupuesto"
                  value={formData.presupuesto}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Users className="w-4 h-4 inline mr-1" />
                  Participantes Esperados
                </label>
                <input
                  type="number"
                  name="participantesEsperados"
                  value={formData.participantesEsperados}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe el propósito y contenido del reporte..."
              />
            </div>

            {/* Objetivos */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Target className="w-4 h-4 inline mr-1" />
                Objetivos
              </label>
              <textarea
                name="objetivos"
                value={formData.objetivos}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe los objetivos del reporte..."
              />
            </div>

            {/* Recursos */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Recursos Necesarios
              </label>
              <textarea
                name="recursos"
                value={formData.recursos}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe los recursos necesarios..."
              />
            </div>

            {/* Selección de actividades */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Seleccionar Actividades ({actividadesSeleccionadas.length} seleccionadas)
              </h3>
              
              {/* Debug logs para renderizado */}
              {console.log('🎨 RENDERIZADO - Estado actual:')}
              {console.log('🎨 loading:', loading)}
              {console.log('🎨 actividades:', actividades)}
              {console.log('🎨 actividades.length:', actividades.length)}
              {console.log('🎨 Array.isArray(actividades):', Array.isArray(actividades))}
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Cargando actividades...</p>
                </div>
              ) : actividades.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No hay actividades disponibles para incluir en el reporte del período académico actual.</p>
                  <p className="text-sm">Las actividades no deben estar rechazadas.</p>
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                  {actividades.map((actividad) => (
                    <div
                      key={actividad.id}
                      className={`p-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                        actividadesSeleccionadas.includes(actividad.id) ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                      }`}
                      onClick={() => handleSelectActividad(actividad.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={actividadesSeleccionadas.includes(actividad.id)}
                              onChange={() => handleSelectActividad(actividad.id)}
                              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <h4 className="font-medium text-gray-900">{actividad.titulo || actividad.nombre}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{actividad.descripcion}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded">{actividad.categoria}</span>
                            {actividad.horas_estimadas && (
                              <span>{actividad.horas_estimadas} horas</span>
                            )}
                            {actividad.fecha_inicio && (
                              <span>{new Date(actividad.fecha_inicio).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subir archivos */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Upload className="w-4 h-4 inline mr-1" />
                Archivos de Evidencia (opcional)
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500">
                Formatos permitidos: PDF, Word, Excel, imágenes (JPG, PNG)
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors border border-gray-300"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || actividadesSeleccionadas.length === 0 || !formData.titulo.trim()}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando...' : 'Crear Reporte'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCrearReporte;