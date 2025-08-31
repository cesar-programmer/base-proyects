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
      
      if (filters.id_actividad) {
        where.id_actividad = filters.id_actividad;
      }
      
      if (filters.tipo) {
        where.tipo = filters.tipo;
      }

      const archivos = await this.model.findAll({
        where,
        include: [
          {
            model: models.Actividad,
            as: 'actividad',
            attributes: ['id', 'nombre']
          }
        ],
        order: [['created_at', 'DESC']]
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
            model: models.Actividad,
            as: 'actividad',
            attributes: ['id', 'nombre']
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

  async findByActivity(idActividad) {
    try {
      const archivos = await this.model.findAll({
        where: { id_actividad: idActividad },
        include: [
          {
            model: models.Actividad,
            as: 'actividad',
            attributes: ['id', 'nombre']
          }
        ],
        order: [['created_at', 'DESC']]
      });
      return archivos;
    } catch (error) {
      throw Boom.internal('Error al obtener archivos por actividad', error);
    }
  }

  async create(data, file) {
    try {
      // Verificar que la actividad existe
      const actividad = await models.Actividad.findByPk(data.id_actividad);
      if (!actividad) {
        throw Boom.notFound('Actividad no encontrada');
      }

      // Crear directorio si no existe
      const actividadDir = path.join(this.uploadsPath, 'actividades', data.id_actividad.toString());
      await fs.mkdir(actividadDir, { recursive: true });

      // Generar nombre único para el archivo
      const timestamp = Date.now();
      const extension = path.extname(file.originalname);
      const filename = `${timestamp}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filepath = path.join(actividadDir, filename);

      // Guardar archivo en el sistema de archivos
      await fs.writeFile(filepath, file.buffer);

      // Crear registro en la base de datos
      const archivoData = {
        ...data,
        nombre_original: file.originalname,
        nombre_archivo: filename,
        ruta_archivo: path.relative(this.uploadsPath, filepath),
        tipo_mime: file.mimetype,
        tamaño: file.size
      };

      const archivo = await this.model.create(archivoData);
      return archivo;
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al crear archivo', error);
    }
  }

  async getFileInfo(id) {
    try {
      const archivo = await this.findById(id);
      const fullPath = path.join(this.uploadsPath, archivo.ruta_archivo);
      
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
      
      // Leer el archivo
      const fileBuffer = await fs.readFile(fullPath);
      
      return {
        buffer: fileBuffer,
        filename,
        mimetype: archivo.tipo_mime,
        size: archivo.tamaño
      };
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al descargar archivo', error);
    }
  }

  async delete(id) {
    try {
      const archivo = await this.findById(id);
      const fullPath = path.join(this.uploadsPath, archivo.ruta_archivo);
      
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
          [models.sequelize.fn('SUM', models.sequelize.col('tamaño')), 'tamaño_total'],
          [models.sequelize.fn('AVG', models.sequelize.col('tamaño')), 'tamaño_promedio']
        ],
        raw: true
      });
      
      return stats[0];
    } catch (error) {
      throw Boom.internal('Error al obtener estadísticas de almacenamiento', error);
    }
  }
}

export default ArchivoService;