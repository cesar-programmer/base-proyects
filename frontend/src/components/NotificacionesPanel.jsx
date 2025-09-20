import React, { useState } from 'react';
import { Bell, X, Check, CheckCheck, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { useNotificaciones } from '../hooks/useNotificaciones';
import { useAuth } from '../context/AuthContext';

const NotificacionesPanel = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const {
    notificaciones,
    notificacionesNoLeidas,
    loading,
    error,
    cantidadNoLeidas,
    marcarComoLeida,
    marcarTodasComoLeidas,
    eliminarNotificacion
  } = useNotificaciones(user?.id_usuario);

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Botón de notificaciones */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {notificacionesNoLeidas.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notificacionesNoLeidas.length > 99 ? '99+' : notificacionesNoLeidas.length}
          </span>
        )}
      </button>

      {/* Panel de notificaciones */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Notificaciones
              {cantidadNoLeidas > 0 && (
                <span className="ml-2 text-sm text-red-500">
                  ({cantidadNoLeidas} nuevas)
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2">
              {notificacionesNoLeidas.length > 0 && (
                <button
                  onClick={() => marcarTodasComoLeidas(user?.id_usuario)}
                  className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-700 transition-colors"
                  title="Marcar todas como leídas"
                >
                  <CheckCheck size={16} />
                  <span>Marcar todas</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
                <p>Cargando notificaciones...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>Error al cargar notificaciones</p>
              </div>
            ) : notificaciones.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell size={48} className="mx-auto mb-2 opacity-50" />
                <p>No tienes notificaciones</p>
              </div>
            ) : (
              notificaciones.map((notificacion) => (
                <div
                  key={notificacion.id_notificacion}
                  className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    !notificacion.leido ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">
                          {notificacion.tipo === 'fecha_limite' ? '📅' : 
                           notificacion.tipo === 'recordatorio' ? '⏰' : 
                           notificacion.tipo === 'sistema' ? '🔔' : '📢'}
                        </span>
                        <h4 className="font-medium text-gray-900">{notificacion.titulo}</h4>
                        {!notificacion.leido && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notificacion.mensaje}</p>
                      <p className="text-xs text-gray-400">
                        {formatearFecha(notificacion.fecha_creacion)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-2">
                      {!notificacion.leido && (
                        <button
                          onClick={() => marcarComoLeida(notificacion.id_notificacion)}
                          className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                          title="Marcar como leída"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => eliminarNotificacion(notificacion.id_notificacion)}
                        className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notificaciones.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Ver todas las notificaciones
              </button>
            </div>
          )}
        </div>
      )}

      {/* Overlay para cerrar el panel */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificacionesPanel;