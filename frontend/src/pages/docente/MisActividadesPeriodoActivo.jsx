import { useEffect, useMemo, useState } from 'react';
import activityService from '../../services/activityService';
import { Search, Calendar, Users, Clock, Tag, CheckCircle2, AlertCircle, MapPin, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

// Hoist Modal component to top-level to avoid re-mounting on every keystroke
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-green-800">{title}</h2>
          <button onClick={onClose} className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded">×</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default function MisActividadesPeriodoActivo() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ 
    nombre: '', 
    descripcion: '', 
    fecha_inicio: '', 
    fecha_fin: '',
    categoria: '',
    horas_dedicadas: '',
    ubicacion: '',
    objetivos: '',
    recursos: '',
    participantes: ''
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [canModifyActivities, setCanModifyActivities] = useState(true);
  const [fechaLimiteMessage, setFechaLimiteMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        if (!user?.id) {
          setError('No se encontró el usuario en sesión');
          setData(null);
          return;
        }
        // Reutilizar la lógica del formulario de crear reporte: obtener actividades del usuario filtradas por período activo
        const response = await activityService.getActivitiesByUserCurrentPeriod(user.id, { limit: 100 });

        let actividadesResp = [];
        if (response && Array.isArray(response?.data)) {
          actividadesResp = response.data;
        } else if (response && response.data && Array.isArray(response.data?.data)) {
          actividadesResp = response.data.data;
        } else if (Array.isArray(response)) {
          actividadesResp = response;
        }

        // Excluir actividades rechazadas, siguiendo la lógica del modal de reportes
        const actividadesFiltradas = (actividadesResp || []).filter(
          (a) => (a?.estado || '').toLowerCase() !== 'rechazado'
        );

        setData({
          actividades: actividadesFiltradas,
          periodoAcademico: response?.periodoActivo || null,
        });

        // Verificar si se pueden modificar actividades (fecha límite de registro)
        if (response?.periodoActivo?.id) {
          await checkCanModifyActivities(response.periodoActivo.id);
        }
      } catch (err) {
        setError(err.message || 'Error al cargar mis actividades');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  // Función para verificar si se pueden modificar actividades
  const checkCanModifyActivities = async (periodoId) => {
    try {
      // Hacer una petición al backend para verificar fechas límite
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}/fechas-limite?periodoId=${periodoId}&categoria=REGISTRO`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const fechasLimite = data.data || [];
        
        if (fechasLimite.length > 0) {
          const fechaLimite = fechasLimite[0];
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          
          const fechaLimiteDate = new Date(fechaLimite.fecha_limite);
          fechaLimiteDate.setHours(23, 59, 59, 999);
          
          if (hoy > fechaLimiteDate || !fechaLimite.activo) {
            setCanModifyActivities(false);
            setFechaLimiteMessage(`La fecha límite de registro (${new Date(fechaLimite.fecha_limite).toLocaleDateString('es-ES')}) ha expirado. No puedes modificar ni eliminar actividades.`);
          } else {
            setCanModifyActivities(true);
            setFechaLimiteMessage(`Puedes modificar actividades hasta el ${new Date(fechaLimite.fecha_limite).toLocaleDateString('es-ES')}`);
          }
        }
      }
    } catch (error) {
      console.error('Error al verificar fecha límite:', error);
      // Por defecto, permitir modificaciones si hay error
      setCanModifyActivities(true);
    }
  };

  // Derivar datos de forma segura para mantener el orden de hooks estable en todos los renders
  const actividades = data?.actividades || [];
  const periodoAcademico = data?.periodoAcademico || null;

  // Resumen calculado (solo total)
  const resumen = useMemo(() => ({ total: actividades.length }), [actividades]);

  // Búsqueda simple (sin estados)
  const actividadesFiltradas = useMemo(() => {
    return actividades.filter((act) => {
      const byQuery = query
        ? (
            (act.titulo?.toLowerCase().includes(query.toLowerCase())) ||
            (act.nombre?.toLowerCase().includes(query.toLowerCase())) ||
            (act.descripcion?.toLowerCase().includes(query.toLowerCase()))
          )
        : true;
      return byQuery;
    });
  }, [actividades, query]);

  // Edición inline
  const startEdit = (act) => {
    setEditingId(act.id);
    setForm({
      nombre: act.nombre || act.titulo || '',
      descripcion: act.descripcion || '',
      fecha_inicio: (act.fecha_inicio || act.fechaInicio || '').slice(0,10),
      fecha_fin: (act.fecha_fin || act.fechaFin || '').slice(0,10),
      categoria: act.categoria || act.tipo || '',
      horas_dedicadas: String(act.horas_dedicadas ?? act.horas_estimadas ?? act.horas ?? ''),
      ubicacion: act.ubicacion || '',
      objetivos: act.objetivos || '',
      recursos: act.recursos || '',
      participantes: String(act.participantes ?? act.num_participantes ?? ''),
    });
    setIsEditModalOpen(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ nombre: '', descripcion: '', fecha_inicio: '', fecha_fin: '' });
    setIsEditModalOpen(false);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    
    if (!canModifyActivities) {
      toast.error('No puedes modificar actividades: la fecha límite de registro ha expirado');
      return;
    }
    
    try {
      const payload = {
        nombre: form.nombre?.trim() || '',
        descripcion: form.descripcion?.trim() || '',
        fecha_inicio: form.fecha_inicio || undefined,
        fecha_fin: form.fecha_fin || undefined,
        categoria: form.categoria || undefined,
        horas_dedicadas: form.horas_dedicadas ? Number(form.horas_dedicadas) : undefined,
        ubicacion: form.ubicacion || undefined,
        objetivos: form.objetivos || undefined,
        recursos: form.recursos || undefined,
        participantes: form.participantes ? Number(form.participantes) : undefined,
      };
      const res = await activityService.updateActivity(editingId, payload);
      const updated = res ?? payload;
      setData(prev => ({
        ...prev,
        actividades: prev.actividades.map(a =>
          a.id === editingId
            ? { 
                ...a, 
                ...updated, 
                nombre: updated.nombre ?? a.nombre, 
                titulo: updated.nombre ?? a.titulo,
                categoria: updated.categoria ?? a.categoria,
                horas_dedicadas: updated.horas_dedicadas ?? a.horas_dedicadas ?? a.horas,
                ubicacion: updated.ubicacion ?? a.ubicacion,
                objetivos: updated.objetivos ?? a.objetivos,
                recursos: updated.recursos ?? a.recursos,
                participantes: updated.participantes ?? a.participantes ?? a.num_participantes
              }
            : a
        )
      }));
      // Notificar éxito usando el estándar del proyecto y recargar la página
      toast.success('Actividad actualizada exitosamente');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      cancelEdit();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al guardar cambios de la actividad';
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  const deleteActivity = async (actId, titulo) => {
    if (!canModifyActivities) {
      toast.error('No puedes eliminar actividades: la fecha límite de registro ha expirado');
      return;
    }
    
    if (!window.confirm(`¿Estás seguro de eliminar la actividad "${titulo}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }
    try {
      await activityService.deleteActivity(actId);
      setData(prev => ({
        ...prev,
        actividades: prev.actividades.filter(a => a.id !== actId)
      }));
      toast.success('Actividad eliminada exitosamente');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar la actividad';
      toast.error(errorMessage);
    }
  };

  // Modal simple local (hoisted arriba)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando actividades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-red-200 p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 rounded-full p-4">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-red-800 text-center mb-4">Error al cargar</h2>
          <p className="text-red-600 text-center mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Si no hay datos (no hay período activo), mostrar mensaje mejorado
  if (!data || !periodoAcademico) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-yellow-300 p-8 max-w-2xl w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-100 rounded-full p-6 animate-pulse">
              <Calendar className="w-16 h-16 text-yellow-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-yellow-800 text-center mb-4">
            No hay período académico activo
          </h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
            <p className="text-yellow-800 text-center leading-relaxed">
              Actualmente no hay un período académico activo configurado en el sistema.
              Las actividades solo pueden visualizarse cuando existe un período académico en curso.
            </p>
          </div>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">¿Qué significa esto?</h3>
                <p className="text-sm text-gray-600">
                  El administrador del sistema debe activar un período académico para que puedas registrar y visualizar tus actividades.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">¿Qué puedo hacer?</h3>
                <p className="text-sm text-gray-600">
                  Por favor, contacta al administrador del sistema para que active el período académico correspondiente.
                  Una vez activado, tus actividades aparecerán aquí automáticamente.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar página
            </button>
            <button
              onClick={() => window.history.back()}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Volver atrás
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 tracking-tight mb-3 text-center">Mis actividades del período activo</h1>
      {periodoAcademico && (
        <div className="text-base text-green-600 mb-6 text-center">
          {periodoAcademico.nombre} • {periodoAcademico.fechaInicio ? new Date(periodoAcademico.fechaInicio).toLocaleDateString('es-ES') : '—'} — {periodoAcademico.fechaFin ? new Date(periodoAcademico.fechaFin).toLocaleDateString('es-ES') : '—'}
        </div>
      )}
      {/* Resumen (solo total) */}
      <div className="flex justify-center mb-8">
        <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-5 shadow-sm text-center">
          <div className="text-4xl md:text-5xl font-extrabold text-green-700 leading-none">{resumen.total}</div>
          <div className="mt-2 text-sm font-medium text-green-600">Actividades totales</div>
        </div>
      </div>

      {/* Mensaje de fecha límite */}
      {fechaLimiteMessage && (
        <div className={`mb-6 p-4 rounded-lg border-2 ${canModifyActivities ? 'bg-blue-50 border-blue-300' : 'bg-red-50 border-red-300'}`}>
          <div className="flex items-center gap-3">
            {canModifyActivities ? (
              <Clock className="w-6 h-6 text-blue-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            )}
            <p className={`text-sm font-medium ${canModifyActivities ? 'text-blue-800' : 'text-red-800'}`}>
              {fechaLimiteMessage}
            </p>
          </div>
        </div>
      )}

      {/* Barra de búsqueda eliminada para una interfaz más limpia */}

      {actividadesFiltradas.length === 0 ? (
        <div className="text-gray-600">No tienes actividades registradas en el período activo.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {actividadesFiltradas.map((act) => {
            const titulo = act.titulo || act.nombre || 'Actividad sin título';
            const categoria = act.categoria || act.tipo || 'Sin categoría';
            const fechaInicio = act.fecha_inicio || act.fechaInicio || '';
            const fechaFin = act.fecha_fin || act.fechaFin || '';
            const horas = act.horas_dedicadas ?? act.horas_estimadas ?? act.horas ?? null;
            const participantes = act.participantes ?? act.num_participantes ?? null;
            const ubicacion = act.ubicacion || '';
            const objetivos = act.objetivos || '';
            const recursos = act.recursos || '';
            const createdAt = act.createdAt || act.fecha_creacion || '';
            const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('es-ES') : '—');
            return (
              <div
                key={act.id}
                className="bg-white rounded-xl border border-green-100/70 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-4 border-b border-green-100 text-center">
                  <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>
                  <p className="text-sm text-gray-600 mt-1">{act.descripcion || 'Sin descripción'}</p>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-700">
                    <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                      <Tag className="w-4 h-4 text-green-600" />{categoria}
                    </span>
                    {horas !== null && (
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                        <Clock className="w-4 h-4 text-green-600" />{horas} h dedicadas
                      </span>
                    )}
                    {participantes !== null && (
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                        <Users className="w-4 h-4 text-green-600" />{participantes} participantes
                      </span>
                    )}
                    {ubicacion && (
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                        <MapPin className="w-4 h-4 text-green-600" />{ubicacion}
                      </span>
                    )}
                  </div>
                  {(fechaInicio || fechaFin) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                      <div className="bg-green-50 border border-green-100 rounded p-3 text-center">
                        <p className="text-xs font-medium text-gray-500">Inicio</p>
                        <p className="font-semibold text-gray-900">{fmtDate(fechaInicio)}</p>
                      </div>
                      <div className="bg-green-50 border border-green-100 rounded p-3 text-center">
                        <p className="text-xs font-medium text-gray-500">Fin</p>
                        <p className="font-semibold text-gray-900">{fmtDate(fechaFin)}</p>
                      </div>
                    </div>
                  )}
                  {(objetivos || recursos) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
                      {objetivos && (
                        <div>
                          <p className="text-xs font-medium text-green-700">Objetivos</p>
                          <p className="text-sm text-gray-800 whitespace-pre-wrap">{objetivos}</p>
                        </div>
                      )}
                      {recursos && (
                        <div>
                          <p className="text-xs font-medium text-green-700">Recursos</p>
                          <p className="text-sm text-gray-800 whitespace-pre-wrap">{recursos}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {createdAt && (
                    <div className="flex items-center justify-center gap-2 text-xs text-green-700">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span className="">Creada: {fmtDate(createdAt)}</span>
                    </div>
                  )}
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      className={`inline-flex items-center px-3 py-2 text-sm rounded-md ${
                        canModifyActivities 
                          ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      onClick={() => canModifyActivities && startEdit(act)}
                      disabled={!canModifyActivities}
                      title={!canModifyActivities ? 'No se puede editar: fecha límite de registro expirada' : 'Editar actividad'}
                    >
                      Editar
                    </button>
                    <button
                      className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md ${
                        canModifyActivities 
                          ? 'bg-red-600 text-white hover:bg-red-700 cursor-pointer' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      onClick={() => canModifyActivities && deleteActivity(act.id, titulo)}
                      disabled={!canModifyActivities}
                      title={!canModifyActivities ? 'No se puede eliminar: fecha límite de registro expirada' : 'Eliminar actividad'}
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de edición */}
      <Modal isOpen={isEditModalOpen} onClose={cancelEdit} title="Editar actividad">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
            <input
              type="date"
              value={form.fecha_inicio}
              onChange={(e) => setForm(f => ({ ...f, fecha_inicio: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <input
              type="text"
              value={form.categoria}
              onChange={(e) => setForm(f => ({ ...f, categoria: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="p.ej., Docencia, Investigación"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horas dedicadas</label>
            <input
              type="number"
              min="0"
              value={form.horas_dedicadas}
              onChange={(e) => setForm(f => ({ ...f, horas_dedicadas: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <input
              type="text"
              value={form.ubicacion}
              onChange={(e) => setForm(f => ({ ...f, ubicacion: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Campus, Aula, Online..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm(f => ({ ...f, descripcion: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Objetivos</label>
            <textarea
              value={form.objetivos}
              onChange={(e) => setForm(f => ({ ...f, objetivos: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Recursos necesarios</label>
            <textarea
              value={form.recursos}
              onChange={(e) => setForm(f => ({ ...f, recursos: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
            <input
              type="date"
              value={form.fecha_fin}
              onChange={(e) => setForm(f => ({ ...f, fecha_fin: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Participantes</label>
            <input
              type="number"
              min="0"
              value={form.participantes}
              onChange={(e) => setForm(f => ({ ...f, participantes: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            onClick={cancelEdit}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
            onClick={saveEdit}
          >
            Guardar cambios
          </button>
        </div>
      </Modal>
    </div>
  );
}