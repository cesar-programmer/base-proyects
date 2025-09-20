import { createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { notificacionService } from '../services/notificacionService';
import { toast } from 'react-toastify';

const NotificacionesContext = createContext();

export const useNotificacionesContext = () => {
  const context = useContext(NotificacionesContext);
  if (!context) {
    throw new Error('useNotificacionesContext debe usarse dentro de NotificacionesProvider');
  }
  return context;
};

export const NotificacionesProvider = ({ children }) => {
  const { user } = useAuth();

  // Función para notificar cambios en fechas límite
  const notificarCambioFechaLimite = async (fechaLimiteId, mensaje, usuariosDestino = []) => {
    try {
      await notificacionService.notificarCambioFechaLimite(fechaLimiteId, mensaje, usuariosDestino);
      
      // Mostrar toast de confirmación
      toast.success('Notificación enviada a los usuarios correspondientes', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error al enviar notificación:', error);
      toast.error('Error al enviar la notificación', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Función para crear recordatorios automáticos
  const crearRecordatorioFechaLimite = async (fechaLimiteId, usuarioId) => {
    try {
      await notificacionService.crearRecordatorioFechaLimite(fechaLimiteId, usuarioId);
    } catch (error) {
      console.error('Error al crear recordatorio:', error);
    }
  };

  // Función para notificar cuando se crea una nueva fecha límite
  const notificarNuevaFechaLimite = async (fechaLimite, usuariosDestino = []) => {
    const mensaje = `Se ha creado una nueva fecha límite: "${fechaLimite.descripcion}" con vencimiento el ${new Date(fechaLimite.fecha_limite).toLocaleDateString('es-ES')}`;
    
    await notificarCambioFechaLimite(fechaLimite.id_fecha_limite, mensaje, usuariosDestino);
  };

  // Función para notificar cuando se modifica una fecha límite
  const notificarModificacionFechaLimite = async (fechaLimite, cambios, usuariosDestino = []) => {
    let mensaje = `Se ha modificado la fecha límite "${fechaLimite.descripcion}".`;
    
    if (cambios.fecha_limite) {
      mensaje += ` Nueva fecha: ${new Date(cambios.fecha_limite).toLocaleDateString('es-ES')}.`;
    }
    
    if (cambios.descripcion) {
      mensaje += ` Nueva descripción: "${cambios.descripcion}".`;
    }

    await notificarCambioFechaLimite(fechaLimite.id_fecha_limite, mensaje, usuariosDestino);
  };

  // Función para notificar cuando se elimina una fecha límite
  const notificarEliminacionFechaLimite = async (fechaLimite, usuariosDestino = []) => {
    const mensaje = `Se ha eliminado la fecha límite: "${fechaLimite.descripcion}"`;
    
    await notificarCambioFechaLimite(fechaLimite.id_fecha_limite, mensaje, usuariosDestino);
  };

  // Función para verificar fechas límite próximas a vencer
  const verificarFechasProximasVencer = async () => {
    if (!user?.id_usuario) return;

    try {
      // Esta función se podría llamar periódicamente o cuando el usuario inicie sesión
      // Por ahora, la implementamos como placeholder
      console.log('Verificando fechas próximas a vencer...');
    } catch (error) {
      console.error('Error al verificar fechas próximas:', error);
    }
  };

  // Verificar fechas próximas cuando el usuario inicie sesión
  useEffect(() => {
    if (user?.id_usuario) {
      verificarFechasProximasVencer();
    }
  }, [user?.id_usuario]);

  const value = {
    notificarCambioFechaLimite,
    crearRecordatorioFechaLimite,
    notificarNuevaFechaLimite,
    notificarModificacionFechaLimite,
    notificarEliminacionFechaLimite,
    verificarFechasProximasVencer
  };

  return (
    <NotificacionesContext.Provider value={value}>
      {children}
    </NotificacionesContext.Provider>
  );
};