import { models } from '../db/models/index.js';
import Boom from '@hapi/boom';
import { Op } from 'sequelize';

class ConfiguracionService {
  constructor() {
    this.model = models.Configuracion;
  }

  async findAll(filters = {}) {
    try {
      const where = {};
      
      if (filters.categoria) {
        where.categoria = filters.categoria;
      }
      
      if (filters.editable !== undefined) {
        where.editable = filters.editable;
      }

      const configuraciones = await this.model.findAll({
        where,
        order: [['categoria', 'ASC'], ['clave', 'ASC']]
      });
      return configuraciones;
    } catch (error) {
      throw Boom.internal('Error al obtener configuraciones', error);
    }
  }

  async findByKey(clave) {
    try {
      const configuracion = await this.model.findOne({
        where: { clave }
      });
      if (!configuracion) {
        throw Boom.notFound('Configuración no encontrada');
      }
      return configuracion;
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al obtener configuración', error);
    }
  }

  async getValue(clave) {
    try {
      const configuracion = await this.findByKey(clave);
      return this.parseValue(configuracion.valor, configuracion.tipo);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al obtener valor de configuración', error);
    }
  }

  async getSystemConfigurations() {
    try {
      const configuraciones = await this.model.findAll({
        where: { categoria: 'SISTEMA' },
        order: [['clave', 'ASC']]
      });
      return configuraciones;
    } catch (error) {
      throw Boom.internal('Error al obtener configuraciones del sistema', error);
    }
  }

  async create(data) {
    try {
      // Verificar si ya existe una configuración con la misma clave
      const existingConfig = await this.model.findOne({
        where: { clave: data.clave }
      });
      
      if (existingConfig) {
        throw Boom.conflict('Ya existe una configuración con esa clave');
      }

      // Validar el valor según el tipo
      this.validateValue(data.valor, data.tipo);

      const configuracion = await this.model.create(data);
      return configuracion;
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al crear configuración', error);
    }
  }

  async update(clave, data) {
    try {
      const configuracion = await this.findByKey(clave);
      
      // Verificar si la configuración es editable
      if (!configuracion.editable) {
        throw Boom.forbidden('Esta configuración no es editable');
      }

      // Si se está actualizando el valor, validarlo según el tipo
      if (data.valor !== undefined) {
        const tipo = data.tipo || configuracion.tipo;
        this.validateValue(data.valor, tipo);
      }

      const updatedConfiguracion = await configuracion.update(data);
      return updatedConfiguracion;
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al actualizar configuración', error);
    }
  }

  async updateValue(clave, valor) {
    try {
      const configuracion = await this.findByKey(clave);
      
      // Verificar si la configuración es editable
      if (!configuracion.editable) {
        throw Boom.forbidden('Esta configuración no es editable');
      }

      // Validar el valor según el tipo
      this.validateValue(valor, configuracion.tipo);

      const updatedConfiguracion = await configuracion.update({ valor });
      return updatedConfiguracion;
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al actualizar valor de configuración', error);
    }
  }

  async updateMultiple(configuraciones) {
    try {
      const results = [];
      
      for (const config of configuraciones) {
        try {
          const updated = await this.updateValue(config.clave, config.valor);
          results.push({ clave: config.clave, success: true, data: updated });
        } catch (error) {
          results.push({ 
            clave: config.clave, 
            success: false, 
            error: error.message 
          });
        }
      }
      
      return results;
    } catch (error) {
      throw Boom.internal('Error al actualizar múltiples configuraciones', error);
    }
  }

  async delete(clave) {
    try {
      const configuracion = await this.findByKey(clave);
      
      // Verificar si la configuración es editable
      if (!configuracion.editable) {
        throw Boom.forbidden('Esta configuración no se puede eliminar');
      }

      await configuracion.destroy();
      return { message: 'Configuración eliminada exitosamente' };
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al eliminar configuración', error);
    }
  }

  async resetToDefaults() {
    try {
      const defaultConfigs = this.getDefaultConfigurations();
      const results = [];
      
      for (const config of defaultConfigs) {
        try {
          const existing = await this.model.findOne({
            where: { clave: config.clave }
          });
          
          if (existing && existing.editable) {
            await existing.update({ valor: config.valor });
            results.push({ clave: config.clave, action: 'updated' });
          } else if (!existing) {
            await this.model.create(config);
            results.push({ clave: config.clave, action: 'created' });
          } else {
            results.push({ clave: config.clave, action: 'skipped', reason: 'not editable' });
          }
        } catch (error) {
          results.push({ 
            clave: config.clave, 
            action: 'error', 
            error: error.message 
          });
        }
      }
      
      return results;
    } catch (error) {
      throw Boom.internal('Error al resetear configuraciones', error);
    }
  }

  validateValue(valor, tipo) {
    switch (tipo) {
      case 'NUMBER':
        if (isNaN(Number(valor))) {
          throw Boom.badRequest('El valor debe ser un número válido');
        }
        break;
      case 'BOOLEAN':
        if (!['true', 'false', '1', '0'].includes(valor.toLowerCase())) {
          throw Boom.badRequest('El valor debe ser un booleano válido (true/false)');
        }
        break;
      case 'JSON':
        try {
          JSON.parse(valor);
        } catch {
          throw Boom.badRequest('El valor debe ser un JSON válido');
        }
        break;
      case 'DATE':
        if (isNaN(Date.parse(valor))) {
          throw Boom.badRequest('El valor debe ser una fecha válida');
        }
        break;
      case 'STRING':
      default:
        // No validation needed for strings
        break;
    }
  }

  parseValue(valor, tipo) {
    switch (tipo) {
      case 'NUMBER':
        return Number(valor);
      case 'BOOLEAN':
        return ['true', '1'].includes(valor.toLowerCase());
      case 'JSON':
        return JSON.parse(valor);
      case 'DATE':
        return new Date(valor);
      case 'STRING':
      default:
        return valor;
    }
  }

  getDefaultConfigurations() {
    return [
      {
        clave: 'SISTEMA_NOMBRE',
        valor: 'Sistema de Gestión de Reportes Académicos',
        descripcion: 'Nombre del sistema',
        tipo: 'STRING',
        categoria: 'SISTEMA',
        editable: true
      },
      {
        clave: 'NOTIFICACIONES_EMAIL_HABILITADO',
        valor: 'true',
        descripcion: 'Habilitar notificaciones por email',
        tipo: 'BOOLEAN',
        categoria: 'NOTIFICACIONES',
        editable: true
      },
      {
        clave: 'REPORTES_DIAS_LIMITE_ENTREGA',
        valor: '30',
        descripcion: 'Días límite para entrega de reportes',
        tipo: 'NUMBER',
        categoria: 'REPORTES',
        editable: true
      },
      {
        clave: 'USUARIOS_MAX_INTENTOS_LOGIN',
        valor: '5',
        descripcion: 'Máximo número de intentos de login',
        tipo: 'NUMBER',
        categoria: 'USUARIOS',
        editable: true
      }
    ];
  }
}

export default ConfiguracionService;