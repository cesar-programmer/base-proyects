import { models } from '../db/models/index.js';
import Boom from '@hapi/boom';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ArchivoService {
  constructor() {
    this.model = models.Archivo;
    this.uploadsPath = path.join(__dirname, '../../uploads');
  }

  async findAll(filters = {}) {
    try {
      const where = {};
      
      if (filters.actividadId) {
        where.actividadId = filters.actividadId;
      }
      
      if (filters.reporteId) {
        where.reporteId = filters.reporteId;
      }
      
      if (filters.categoria) {
        where.categoria = filters.categoria;
      }

      const archivos = await this.model.findAll({
        where,
        include: [
          {
            association: 'actividad',
            attributes: ['id', 'titulo']
          },
          {
            association: 'reporte',
            attributes: ['id', 'titulo']
          },
          {
            association: 'usuarioQueSubio',
            attributes: ['id', 'nombre', 'email']
          }
        ],
        order: [['fecha_subida', 'DESC']]
      });
      return archivos;
    } catch (error) {
      throw Boom.internal('Error al obtener archivos', error);
    }
  }

  async findById(id) {
    try {
      const archivo = await this.model.findByPk(id, {
        include: [
          {
            association: 'actividad',
            attributes: ['id', 'titulo']
          },
          {
            association: 'reporte',
            attributes: ['id', 'titulo']
          },
          {
            association: 'usuarioQueSubio',
            attributes: ['id', 'nombre', 'email']
          }
        ]
      });
      if (!archivo) {
        throw Boom.notFound('Archivo no encontrado');
      }
      return archivo;
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al obtener archivo', error);
    }
  }

  async findByActivity(actividadId) {
    try {
      const archivos = await this.model.findAll({
        where: { actividadId },
        include: [
          {
            association: 'actividad',
            attributes: ['id', 'titulo']
          },
          {
            association: 'usuarioQueSubio',
            attributes: ['id', 'nombre', 'email']
          }
        ],
        order: [['fecha_subida', 'DESC']]
      });
      return archivos;
    } catch (error) {
      throw Boom.internal('Error al obtener archivos por actividad', error);
    }
  }

  async findByReporte(reporteId) {
    try {
      const archivos = await this.model.findAll({
        where: { reporteId },
        include: [
          {
            association: 'reporte',
            attributes: ['id', 'titulo']
          },
          {
            association: 'usuarioQueSubio',
            attributes: ['id', 'nombre', 'email']
          }
        ],
        order: [['fecha_subida', 'DESC']]
      });
      return archivos;
    } catch (error) {
      throw Boom.internal('Error al obtener archivos por reporte', error);
    }
  }

  async create(data, file, options = {}) {
    try {
      // Validar que al menos uno de actividadId o reporteId esté presente
      if (!data.actividadId && !data.reporteId) {
        throw Boom.badRequest('El archivo debe estar asociado a una actividad o a un reporte');
      }

      let targetDir;
      let entityId;

      // Verificar que la entidad existe y determinar el directorio
      if (data.actividadId) {
        const actividad = await models.Actividad.findByPk(data.actividadId, options);
        if (!actividad) {
          throw Boom.notFound('Actividad no encontrada');
        }
        targetDir = path.join(this.uploadsPath, 'actividades', data.actividadId.toString());
        entityId = data.actividadId;
      } else if (data.reporteId) {
        const reporte = await models.Reporte.findByPk(data.reporteId, options);
        if (!reporte) {
          throw Boom.notFound('Reporte no encontrado');
        }
        targetDir = path.join(this.uploadsPath, 'reportes', data.reporteId.toString());
        entityId = data.reporteId;
      }

      // Crear directorio si no existe
      await fs.mkdir(targetDir, { recursive: true });

      // Generar nombre único para el archivo
      const timestamp = Date.now();
      const extension = path.extname(file.originalname);
      const filename = `${timestamp}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filepath = path.join(targetDir, filename);

      // Guardar archivo en el sistema de archivos
      await fs.writeFile(filepath, file.buffer);

      // Crear registro en la base de datos
      const archivoData = {
        actividadId: data.actividadId || null,
        reporteId: data.reporteId || null,
        nombre_original: file.originalname,
        nombre_almacenado: filename,
        ruta_almacenamiento: filepath,
        tipo_mime: file.mimetype,
        tamano_bytes: file.size,
        descripcion: data.descripcion || null,
        categoria: data.categoria || 'evidencia',
        usuarioSubida: data.usuarioSubida
      };

      const archivo = await this.model.create(archivoData, options);
      return archivo;
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al crear archivo', error);
    }
  }

  async getFileInfo(id) {
    try {
      const archivo = await this.findById(id);
      const fullPath = archivo.ruta_almacenamiento;
      
      // Verificar que el archivo existe en el sistema de archivos
      try {
        await fs.access(fullPath);
      } catch {
        throw Boom.notFound('Archivo no encontrado en el sistema de archivos');
      }

      return {
        archivo,
        fullPath,
        filename: archivo.nombre_original
      };
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al obtener información del archivo', error);
    }
  }

  async downloadFile(id) {
    try {
      const { archivo, fullPath, filename } = await this.getFileInfo(id);
      
      const fileBuffer = await fs.readFile(fullPath);
      
      return {
        buffer: fileBuffer,
        filename,
        mimetype: archivo.tipo_mime,
        size: archivo.tamano_bytes
      };
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al descargar archivo', error);
    }
  }

  async delete(id) {
    try {
      const archivo = await this.findById(id);
      const fullPath = archivo.ruta_almacenamiento;
      
      // Eliminar archivo del sistema de archivos
      try {
        await fs.unlink(fullPath);
      } catch (error) {
        console.warn('No se pudo eliminar el archivo del sistema de archivos:', error.message);
      }

      // Eliminar registro de la base de datos
      await archivo.destroy();
      
      return { message: 'Archivo eliminado exitosamente' };
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al eliminar archivo', error);
    }
  }

  async update(id, data) {
    try {
      const archivo = await this.findById(id);
      const updatedArchivo = await archivo.update(data);
      return updatedArchivo;
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al actualizar archivo', error);
    }
  }

  async getStorageStats() {
    try {
      const stats = await this.model.findAll({
        attributes: [
          [models.sequelize.fn('COUNT', models.sequelize.col('id')), 'total_archivos'],
          [models.sequelize.fn('SUM', models.sequelize.col('tamano_bytes')), 'tamaño_total'],
          [models.sequelize.fn('AVG', models.sequelize.col('tamano_bytes')), 'tamaño_promedio']
        ],
        raw: true
      });
      
      return stats[0];
    } catch (error) {
      throw Boom.internal('Error al obtener estadísticas de almacenamiento', error);
    }
  }

  /**
   * Procesar múltiples archivos subidos
   * @param {Array} files - Array de archivos de multer
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Array>} Archivos procesados
   */
  async createMultiple(files, data = {}, options = {}) {
    try {
      const archivosCreados = [];

      for (const file of files) {
        const archivo = await this.create(data, file, options);
        archivosCreados.push(archivo);
      }

      return archivosCreados;
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al procesar archivos múltiples', error);
    }
  }

  /**
   * Validar acceso a un archivo basado en el usuario y rol
   * @param {number} archivoId - ID del archivo
   * @param {number} usuarioId - ID del usuario
   * @param {string} rolUsuario - Rol del usuario
   * @returns {Promise<boolean>} True si puede acceder
   */
  async validarAcceso(archivoId, usuarioId, rolUsuario) {
    try {
      const archivo = await this.findById(archivoId);
      
      // Los administradores pueden acceder a cualquier archivo
      if (rolUsuario === 'admin') {
        return true;
      }

      // Si el archivo pertenece a un reporte, verificar acceso al reporte
      if (archivo.reporteId) {
        const reporte = await models.Reporte.findByPk(archivo.reporteId);
        if (!reporte) return false;
        
        // El usuario puede acceder si es el autor del reporte
        return reporte.usuarioId === usuarioId;
      }

      // Si el archivo pertenece a una actividad, verificar acceso
      if (archivo.actividadId) {
        // Por ahora, permitir acceso si es el usuario que subió el archivo
        return archivo.usuarioSubida === usuarioId;
      }

      return false;
    } catch (error) {
      console.error('Error al validar acceso a archivo:', error);
      return false;
    }
  }
}

export default ArchivoService;