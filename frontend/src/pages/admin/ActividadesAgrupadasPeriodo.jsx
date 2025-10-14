import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import activityService from '../../services/activityService';

export default function ActividadesAgrupadasPeriodo() {
  const { usuarioId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await activityService.getActivitiesGroupedByPeriodo(usuarioId);
        setGrupos(res.data || []);
      } catch (err) {
        setError(err.message || 'Error al cargar actividades agrupadas');
      } finally {
        setLoading(false);
      }
    };
    if (usuarioId) fetchData();
  }, [usuarioId]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">{error}</div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Actividades agrupadas por período</h1>
      {grupos.length === 0 ? (
        <div className="text-gray-600">No hay actividades para este docente.</div>
      ) : (
        <div className="space-y-6">
          {grupos.map((grupo, idx) => (
            <div key={idx} className="border rounded-lg shadow-sm">
              <div className="px-4 py-3 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">{grupo.periodoNombre}</h2>
                  <div className="text-sm text-gray-600">
                    {grupo.fechaInicio ? new Date(grupo.fechaInicio).toLocaleDateString('es-ES') : '—'}
                    {' — '}
                    {grupo.fechaFin ? new Date(grupo.fechaFin).toLocaleDateString('es-ES') : '—'}
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-700">
                  Total: {grupo.resumen?.total || 0} • Aprobadas: {grupo.resumen?.aprobadas || 0} • Devueltas: {grupo.resumen?.devueltas || 0} • Pendientes: {grupo.resumen?.pendientes || 0}
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {grupo.actividades.map((act) => (
                    <div key={act.id} className="border rounded p-3">
                      <div className="font-medium text-gray-800">{act.titulo}</div>
                      <div className="text-sm text-gray-600">{act.descripcion}</div>
                      <div className="mt-2 text-xs text-gray-500">
                        Estado: {(act.estado_realizado || act.estado_planificacion || 'pendiente')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}