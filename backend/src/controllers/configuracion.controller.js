import { Configuracion } from '../models/index.js';
import { handleError } from '../utils/errorHandler.js';

// Obtener todas las configuraciones
export const getConfiguraciones = async (req, res) => {
  try {
    const configuraciones = await Configuracion.findAll({
      order: [['clave', 'ASC']]
    });
    
    res.json(configuraciones);
  } catch (error) {
    handleError(res, error, 'Error al obtener configuraciones');
  }
};

// Obtener una configuración por clave
export const getConfiguracionByClave = async (req, res) => {
  try {
    const { clave } = req.params;
    const configuracion = await Configuracion.findByPk(clave);
    
    if (!configuracion) {
      return res.status(404).json({ message: 'Configuración no encontrada' });
    }
    
    res.json(configuracion);
  } catch (error) {
    handleError(res, error, 'Error al obtener configuración');
  }
};

// Obtener el valor de una configuración
export const getValorConfiguracion = async (req, res) => {
  try {
    const { clave } = req.params;
    const configuracion = await Configuracion.findByPk(clave);
    
    if (!configuracion) {
      return res.status(404).json({ message: 'Configuración no encontrada' });
    }
    
    res.json({ 
      clave: configuracion.clave,
      valor: configuracion.valor 
    });
  } catch (error) {
    handleError(res, error, 'Error al obtener valor de configuración');
  }
};

// Crear una nueva configuración
export const createConfiguracion = async (req, res) => {
  try {
    const { clave, valor, descripcion } = req.body;
    
    // Verificar que la clave no existe
    const configuracionExistente = await Configuracion.findByPk(clave);
    if (configuracionExistente) {
      return res.status(400).json({ message: 'La configuración ya existe' });
    }
    
    const configuracion = await Configuracion.create({
      clave,
      valor,
      descripcion
    });
    
    res.status(201).json(configuracion);
  } catch (error) {
    handleError(res, error, 'Error al crear configuración');
  }
};

// Actualizar una configuración
export const updateConfiguracion = async (req, res) => {
  try {
    const { clave } = req.params;
    const { valor, descripcion } = req.body;
    
    const configuracion = await Configuracion.findByPk(clave);
    
    if (!configuracion) {
      return res.status(404).json({ message: 'Configuración no encontrada' });
    }
    
    await configuracion.update({
      valor,
      descripcion,
      fecha_modificacion: new Date()
    });
    
    res.json(configuracion);
  } catch (error) {
    handleError(res, error, 'Error al actualizar configuración');
  }
};

// Actualizar solo el valor de una configuración
export const updateValorConfiguracion = async (req, res) => {
  try {
    const { clave } = req.params;
    const { valor } = req.body;
    
    const configuracion = await Configuracion.findByPk(clave);
    
    if (!configuracion) {
      return res.status(404).json({ message: 'Configuración no encontrada' });
    }
    
    await configuracion.update({
      valor,
      fecha_modificacion: new Date()
    });
    
    res.json({
      message: 'Valor de configuración actualizado correctamente',
      clave: configuracion.clave,
      valor: configuracion.valor
    });
  } catch (error) {
    handleError(res, error, 'Error al actualizar valor de configuración');
  }
};

// Eliminar una configuración
export const deleteConfiguracion = async (req, res) => {
  try {
    const { clave } = req.params;
    
    const configuracion = await Configuracion.findByPk(clave);
    
    if (!configuracion) {
      return res.status(404).json({ message: 'Configuración no encontrada' });
    }
    
    await configuracion.destroy();
    
    res.json({ message: 'Configuración eliminada correctamente' });
  } catch (error) {
    handleError(res, error, 'Error al eliminar configuración');
  }
};

// Obtener configuraciones del sistema (predefinidas)
export const getConfiguracionesSistema = async (req, res) => {
  try {
    const configuracionesSistema = [
      'min_actividades',
      'max_actividades',
      'email_admin',
      'nombre_sistema',
      'version_sistema',
      'dias_recordatorio_default',
      'puntos_minimos_aprobacion'
    ];
    
    const configuraciones = await Configuracion.findAll({
      where: {
        clave: configuracionesSistema
      },
      order: [['clave', 'ASC']]
    });
    
    res.json(configuraciones);
  } catch (error) {
    handleError(res, error, 'Error al obtener configuraciones del sistema');
  }
};

// Actualizar múltiples configuraciones
export const updateMultiplesConfiguraciones = async (req, res) => {
  try {
    const { configuraciones } = req.body;
    
    if (!Array.isArray(configuraciones)) {
      return res.status(400).json({ message: 'Se esperaba un array de configuraciones' });
    }
    
    const resultados = [];
    
    for (const config of configuraciones) {
      const { clave, valor, descripcion } = config;
      
      try {
        const configuracion = await Configuracion.findByPk(clave);
        
        if (configuracion) {
          await configuracion.update({
            valor,
            descripcion: descripcion || configuracion.descripcion,
            fecha_modificacion: new Date()
          });
          resultados.push({ clave, estado: 'actualizada' });
        } else {
          await Configuracion.create({ clave, valor, descripcion });
          resultados.push({ clave, estado: 'creada' });
        }
      } catch (error) {
        resultados.push({ clave, estado: 'error', error: error.message });
      }
    }
    
    res.json({
      message: 'Proceso de actualización completado',
      resultados
    });
  } catch (error) {
    handleError(res, error, 'Error al actualizar múltiples configuraciones');
  }
};

// Resetear configuraciones a valores por defecto
export const resetConfiguracionesDefault = async (req, res) => {
  try {
    const configuracionesDefault = [
      { clave: 'min_actividades', valor: '5', descripcion: 'Número mínimo de actividades requeridas' },
      { clave: 'max_actividades', valor: '20', descripcion: 'Número máximo de actividades permitidas' },
      { clave: 'dias_recordatorio_default', valor: '3', descripcion: 'Días por defecto para recordatorios' },
      { clave: 'puntos_minimos_aprobacion', valor: '100', descripcion: 'Puntos mínimos requeridos para aprobación' },
      { clave: 'nombre_sistema', valor: 'Sistema de Reportes', descripcion: 'Nombre del sistema' },
      { clave: 'version_sistema', valor: '1.0.0', descripcion: 'Versión actual del sistema' }
    ];
    
    const resultados = [];
    
    for (const config of configuracionesDefault) {
      try {
        const [configuracion, created] = await Configuracion.findOrCreate({
          where: { clave: config.clave },
          defaults: config
        });
        
        if (!created) {
          await configuracion.update({
            valor: config.valor,
            descripcion: config.descripcion,
            fecha_modificacion: new Date()
          });
        }
        
        resultados.push({ 
          clave: config.clave, 
          estado: created ? 'creada' : 'reseteada' 
        });
      } catch (error) {
        resultados.push({ 
          clave: config.clave, 
          estado: 'error', 
          error: error.message 
        });
      }
    }
    
    res.json({
      message: 'Configuraciones reseteadas a valores por defecto',
      resultados
    });
  } catch (error) {
    handleError(res, error, 'Error al resetear configuraciones');
  }
};