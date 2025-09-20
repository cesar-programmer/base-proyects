import { useState, useEffect, useCallback } from 'react';
import { notificacionService } from '../services/notificacionService';

export const useNotificaciones = (userId) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar notificaciones del usuario
  const cargarNotificaciones = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const [todasNotificaciones, noLeidas] = await Promise.all([
        notificacionService.getByUsuario(userId, { limit: 50 }),
        notificacionService.getNoLeidasByUsuario(userId)
      ]);
      
      setNotificaciones(todasNotificaciones);
      setNotificacionesNoLeidas(noLeidas);
      setError(null);
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Marcar notificación como leída
  const marcarComoLeida = useCallback(async (notificacionId) => {
    try {
      await notificacionService.marcarComoLeida(notificacionId);
      
      // Actualizar estado local
      setNotificaciones(prev => 
        prev.map(notif => 
          notif.id_notificacion === notificacionId 
            ? { ...notif, leido: true }
            : notif
        )
      );
      
      setNotificacionesNoLeidas(prev => 
        prev.filter(notif => notif.id_notificacion !== notificacionId)
      );
      
      return true;
    } catch (err) {
      console.error('Error al marcar notificación como leída:', err);
      return false;
    }
  }, []);

  // Marcar todas las notificaciones como leídas
  const marcarTodasComoLeidas = useCallback(async () => {
    if (!userId) return false;
    
    try {
      await notificacionService.marcarTodasComoLeidas(userId);
      
      // Actualizar estado local
      setNotificaciones(prev => 
        prev.map(notif => ({ ...notif, leido: true }))
      );
      setNotificacionesNoLeidas([]);
      
      return true;
    } catch (err) {
      console.error('Error al marcar todas las notificaciones como leídas:', err);
      return false;
    }
  }, [userId]);

  // Eliminar notificación
  const eliminarNotificacion = useCallback(async (notificacionId) => {
    try {
      await notificacionService.delete(notificacionId);
      
      // Actualizar estado local
      setNotificaciones(prev => 
        prev.filter(notif => notif.id_notificacion !== notificacionId)
      );
      setNotificacionesNoLeidas(prev => 
        prev.filter(notif => notif.id_notificacion !== notificacionId)
      );
      
      return true;
    } catch (err) {
      console.error('Error al eliminar notificación:', err);
      return false;
    }
  }, []);

  // Obtener estadísticas
  const obtenerEstadisticas = useCallback(async () => {
    if (!userId) return null;
    
    try {
      const stats = await notificacionService.getEstadisticas(userId);
      return stats;
    } catch (err) {
      console.error('Error al obtener estadísticas:', err);
      return null;
    }
  }, [userId]);

  // Efecto para cargar notificaciones iniciales
  useEffect(() => {
    cargarNotificaciones();
  }, [cargarNotificaciones]);

  // Efecto para polling de notificaciones (cada 30 segundos)
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      cargarNotificaciones();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [userId, cargarNotificaciones]);

  return {
    notificaciones,
    notificacionesNoLeidas,
    loading,
    error,
    cantidadNoLeidas: notificacionesNoLeidas.length,
    cargarNotificaciones,
    marcarComoLeida,
    marcarTodasComoLeidas,
    eliminarNotificacion,
    obtenerEstadisticas
  };
};