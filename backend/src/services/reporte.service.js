import boom from '@hapi/boom';
import { models } from '../db/models/index.js';
import { Op } from 'sequelize';
import PeriodoAcademicoService from './periodoAcademico.service.js';
import FechaLimiteService from './fechaLimite.service.js';

class ReporteService {

  // Obtener todos los reportes con filtros y paginación
  async find(options = {}) {
    try {
      const { page = 1, limit = 10, estado, actividadId, usuarioId, onlySubmitted = false, includeArchivados = false } = options;
      const offset = (page - 1) * limit;
      
      const whereClause = {};
      if (estado) whereClause.estado = estado;
      if (actividadId) whereClause.actividadId = actividadId;
      if (usuarioId) whereClause.usuarioId = usuarioId;
      if (!includeArchivados) whereClause.archivado = false;
      
      // Filtrar solo reportes que han sido enviados (tienen fechaEnvio)
      if (onlySubmitted) {
        whereClause.fechaEnvio = {
          [Op.ne]: null
        };
      }

      const reportes = await models.Reporte.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: models.User,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email'],
            where: { activo: true }
          },
          {
            model: models.User,
            as: 'revisadoPor',
            attributes: ['id', 'nombre', 'email'],
            required: false
          },
          {
            model: models.Actividad,
            as: 'actividades',
            attributes: ['id', 'titulo', 'descripcion', 'fechaInicio', 'fechaFin', 'estado_realizado', 'categoria', 'horas_dedicadas'],
            required: false,
            through: { attributes: [] }
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return {
        reportes: reportes.rows,
        total: reportes.count,
        totalPages: Math.ceil(reportes.count / limit),
        currentPage: parseInt(page)
      };
    } catch (error) {
      throw boom.internal('Error al obtener los reportes');
    }
  }

  // Obtener un reporte por ID
  async findOne(id) {
    try {
      console.log('=== DEBUG: Buscando reporte con ID:', id);
      
      const reporte = await models.Reporte.findByPk(id, {
        include: [
          {
            model: models.User,
            as: 'usuario',
            attributes: ['id', 'nombre', 'apellido', 'email'],
            where: { activo: true },
            required: false
          },
          {
            model: models.User,
            as: 'revisadoPor',
            attributes: ['id', 'nombre', 'apellido', 'email'],
            required: false
          },
          {
            model: models.Actividad,
            as: 'actividades',
            attributes: ['id', 'titulo', 'descripcion', 'fechaInicio', 'fechaFin', 'estado_realizado', 'categoria', 'horas_dedicadas'],
            required: false,
            through: { attributes: [] } // Excluir atributos de la tabla intermedia
          },
          {
            model: models.Archivo,
            as: 'archivos',
            attributes: ['id', 'nombre_original', 'nombre_almacenado', 'ruta_almacenamiento', 'tipo_mime'],
            required: false,
            where: { reporteId: id }
          }
        ]
      });

      if (!reporte) {
        throw boom.notFound('Reporte no encontrado');
      }

      console.log('=== DEBUG: Reporte encontrado ===');
      console.log('ID del reporte:', reporte.id);
      console.log('Título:', reporte.titulo);
      console.log('Actividades encontradas:', reporte.actividades ? reporte.actividades.length : 0);
      console.log('Archivos encontrados:', reporte.archivos ? reporte.archivos.length : 0);
      
      if (reporte.actividades && reporte.actividades.length > 0) {
        console.log('Detalles de actividades:');
        reporte.actividades.forEach((act, index) => {
          console.log(`  Actividad ${index + 1}: ID=${act.id}, Título=${act.titulo}`);
        });
      }

      return reporte;
    } catch (error) {
      console.log('Error específico en findOne:', error);
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al obtener el reporte');
    }
  }

  // Crear un nuevo reporte
  async create(reporteData, archivos = []) {
    try {
      console.log('Datos del reporte antes de crear:', reporteData);
      
      // Extraer las actividades del reporteData antes de crear el reporte
      const { actividades, ...reporteDataSinActividades } = reporteData;
      
      const newReporte = await models.Reporte.create(reporteDataSinActividades);

      // Si hay actividades, asociarlas al reporte
      if (actividades && actividades.length > 0) {
        console.log('Asociando actividades al reporte:', actividades);
        for (let i = 0; i < actividades.length; i++) {
          const actividadId = actividades[i];
          await models.ReporteActividad.create({
            reporteId: newReporte.id,
            actividadId: actividadId,
            orden: i + 1
          });
        }

        // Calcular total_horas automáticamente a partir de horas_dedicadas de actividades
        try {
          const actividadesData = await models.Actividad.findAll({
            where: { id: actividades },
            attributes: ['horas_dedicadas']
          });
          const totalHoras = actividadesData.reduce((sum, act) => {
            const val = act.horas_dedicadas != null ? parseFloat(act.horas_dedicadas) : 0;
            return sum + (isNaN(val) ? 0 : val);
          }, 0);
          await newReporte.update({ total_horas: totalHoras });
        } catch (calcErr) {
          console.warn('No se pudo calcular total_horas automáticamente:', calcErr);
        }
      }

      // Si hay archivos, asociarlos al reporte
      if (archivos && archivos.length > 0) {
        for (const archivo of archivos) {
          await models.Archivo.create({
            ...archivo,
            reporteId: newReporte.id
          });
        }
      }

      // Retornar el reporte con sus relaciones
      return await this.findOne(newReporte.id);
    } catch (error) {
      console.log('Error específico en create reporte:', error);
      console.log('Error name:', error.name);
      console.log('Error message:', error.message);
      if (boom.isBoom(error)) throw error;
      
      if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(err => err.message).join(', ');
        throw boom.badRequest(`Error de validación: ${messages}`);
      }
      
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw boom.badRequest('Error de referencia: Verifique que los IDs de usuario y actividad sean válidos');
      }
      
      throw boom.internal(`Error al crear el reporte: ${error.message}`);
    }
  }

  // Actualizar un reporte
  async update(id, reporteData, archivos = []) {
    try {
      const reporte = await this.findOne(id);
      
      // Extraer actividades si se envían para actualizar vínculos
      const { actividades, ...reporteDataSinActividades } = reporteData || {};
      await reporte.update(reporteDataSinActividades || {});

      // Actualizar asociaciones de actividades si se proporcionan
      if (Array.isArray(actividades)) {
        // Reemplazar asociaciones existentes
        await models.ReporteActividad.destroy({ where: { reporteId: id } });
        for (let i = 0; i < actividades.length; i++) {
          const actividadId = actividades[i];
          await models.ReporteActividad.create({
            reporteId: id,
            actividadId,
            orden: i + 1
          });
        }
      }

      // Recalcular total_horas basado en actividades asociadas actuales
      try {
        const links = await models.ReporteActividad.findAll({
          where: { reporteId: id },
          attributes: ['actividadId']
        });
        const actividadIds = links.map(l => l.actividadId);
        if (actividadIds.length > 0) {
          const actividadesData = await models.Actividad.findAll({
            where: { id: actividadIds },
            attributes: ['horas_dedicadas']
          });
          const totalHoras = actividadesData.reduce((sum, act) => {
            const val = act.horas_dedicadas != null ? parseFloat(act.horas_dedicadas) : 0;
            return sum + (isNaN(val) ? 0 : val);
          }, 0);
          await reporte.update({ total_horas: totalHoras });
        } else {
          // Sin actividades asociadas
          await reporte.update({ total_horas: 0 });
        }
      } catch (calcErr) {
        console.warn('No se pudo recalcular total_horas automáticamente:', calcErr);
      }

      // Si hay archivos nuevos, agregarlos
      if (archivos && archivos.length > 0) {
        for (const archivo of archivos) {
          await models.Archivo.create({
            ...archivo,
            reporteId: id
          });
        }
      }

      // Retornar el reporte actualizado
      return await this.findOne(id);
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al actualizar el reporte');
    }
  }

  // Eliminar un reporte
  async delete(id) {
    try {
      const reporte = await this.findOne(id);
      
      // Eliminar archivos asociados primero
      await models.Archivo.destroy({
        where: { reporteId: id }
      });
      
      await reporte.destroy();
      
      return { message: 'Reporte eliminado exitosamente' };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al eliminar el reporte');
    }
  }

  // Eliminar archivo de un reporte
  async removeArchivo(reporteId, archivoId, usuarioId) {
    try {
      const archivo = await models.Archivo.findOne({
        where: {
          id: archivoId,
          reporteId: reporteId
        }
      });

      if (!archivo) {
        throw boom.notFound('Archivo no encontrado');
      }

      await archivo.destroy();
      
      return { message: 'Archivo eliminado exitosamente' };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al eliminar el archivo');
    }
  }

  // Obtener reportes por docente
  async findByDocente(docenteId, filters = {}) {
    try {
      const whereClause = { usuarioId: parseInt(docenteId) };
      
      if (filters.estado) whereClause.estado = filters.estado;
      if (filters.actividadId) whereClause.actividadId = filters.actividadId;
      if (filters.excludeArchivados) whereClause.archivado = false;

      const reportes = await models.Reporte.findAll({
        where: whereClause,
        include: [
          {
            model: models.User,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email'],
            where: { activo: true }
          },
          {
            model: models.Actividad,
            as: 'actividades',
            attributes: ['id', 'titulo', 'descripcion', 'periodoAcademicoId'],
            required: !!filters.periodoAcademicoId,
            where: filters.periodoAcademicoId ? { periodoAcademicoId: parseInt(filters.periodoAcademicoId) } : undefined,
            through: { attributes: [] }
          },
          {
            model: models.Actividad,
            as: 'actividad',
            attributes: ['id', 'titulo', 'descripcion'],
            required: false
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return reportes;
    } catch (error) {
      throw boom.internal('Error al obtener reportes por docente');
    }
  }

  // Obtener reportes por actividad/período
  async findByActividad(actividadId, filters = {}) {
    try {
      const whereClause = { actividadId: parseInt(actividadId) };
      
      if (filters.estado) whereClause.estado = filters.estado;

      const reportes = await models.Reporte.findAll({
        where: whereClause,
        include: [
          {
            model: models.User,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email'],
            where: { activo: true }
          },
          {
            model: models.Actividad,
            as: 'actividad',
            attributes: ['id', 'titulo', 'descripcion']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return reportes;
    } catch (error) {
      throw boom.internal('Error al obtener reportes por actividad');
    }
  }

  // Cambiar estado del reporte
  async changeStatus(id, estado, comentariosRevision = null, options = {}) {
    try {
      const reporte = await this.findOne(id);
      
      // Validar ventana de ENTREGA al intentar enviar el reporte
      if (estado === 'enviado' && !options.bypassDeadline) {
        try {
          const periodoService = new PeriodoAcademicoService();
          const fechaLimiteService = new FechaLimiteService();
          const periodoActivo = await periodoService.findActive();
          
          if (!periodoActivo) {
            throw boom.badRequest('No hay período académico activo para enviar reportes');
          }
          
          const fechasEntrega = await fechaLimiteService.findByCategory('ENTREGA');
          const fechasDelPeriodo = (fechasEntrega || []).filter(f => f.periodo && f.periodo.id === periodoActivo.id);
          
          if (!fechasDelPeriodo || fechasDelPeriodo.length === 0) {
            throw boom.badRequest('No hay fecha límite activa de ENTREGA para el período académico actual');
          }
          
          // Tomar la fecha de cierre más tardía dentro del período
          const cierreEntrega = fechasDelPeriodo
            .map(f => new Date(f.fecha_limite))
            .reduce((max, cur) => (cur > max ? cur : max), new Date(fechasDelPeriodo[0].fecha_limite));
          
          const ahora = new Date();
          if (ahora > cierreEntrega) {
            throw boom.badRequest('La ventana de entrega de reportes ha cerrado');
          }
        } catch (e) {
          if (boom.isBoom(e)) throw e;
          throw boom.internal('Error al validar fecha límite de entrega');
        }
      }
      
      const updateData = { 
        estado,
        fechaRevision: new Date()
      };
      
      // Si el estado cambia a 'enviado', establecer la fecha de envío
      if (estado === 'enviado') {
        updateData.fechaEnvio = new Date();
      }
      
      if (comentariosRevision) {
        updateData.comentariosRevision = comentariosRevision;
      }
      
      await reporte.update(updateData);
      
      return await this.findOne(id);
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al cambiar el estado del reporte');
    }
  }

  // Obtener información de fecha límite y semestre para reportes
  async getReportDeadlineInfo() {
    try {
      const periodoService = new PeriodoAcademicoService();
      const fechaLimiteService = new FechaLimiteService();

      // Obtener el período académico activo
      const periodoActivo = await periodoService.findActive();
      
      if (!periodoActivo) {
        return {
          semestre: "N/A",
          fechaLimite: "N/A",
          periodoActivo: null
        };
      }

      // Extraer el semestre del nombre del período (ej: "2024-2" -> "2024-2")
      const semestre = periodoActivo.nombre;

      // Obtener las fechas límite de categoría 'ENTREGA' para el período activo
       const fechasLimite = await fechaLimiteService.findByCategory('ENTREGA');
      
      if (!fechasLimite || fechasLimite.length === 0) {
        return {
          semestre: semestre,
          fechaLimite: "N/A",
          periodoActivo: periodoActivo.nombre,
          periodoActivoId: periodoActivo.id
        };
      }

      // Filtrar solo las fechas del período activo
      const fechasDelPeriodoActivo = fechasLimite.filter(fecha => 
        fecha.periodo && fecha.periodo.id === periodoActivo.id
      );

      if (fechasDelPeriodoActivo.length === 0) {
        return {
          semestre: semestre,
          fechaLimite: "N/A",
          periodoActivo: periodoActivo.nombre,
          periodoActivoId: periodoActivo.id
        };
      }

      // Encontrar la fecha límite más próxima (futura o pasada)
      const now = new Date();
      const fechaLimiteProxima = fechasDelPeriodoActivo.reduce((closest, current) => {
        const currentDate = new Date(current.fecha_limite);
        const closestDate = new Date(closest.fecha_limite);
        
        // Si ambas son futuras, tomar la más cercana
        if (currentDate >= now && closestDate >= now) {
          return currentDate < closestDate ? current : closest;
        }
        
        // Si una es futura y otra pasada, tomar la futura
        if (currentDate >= now && closestDate < now) {
          return current;
        }
        if (currentDate < now && closestDate >= now) {
          return closest;
        }
        
        // Si ambas son pasadas, tomar la más reciente
        return currentDate > closestDate ? current : closest;
      });

      return {
        semestre: semestre,
        fechaLimite: fechaLimiteProxima ? fechaLimiteProxima.fecha_limite : "N/A",
        periodoActivo: periodoActivo.nombre,
        periodoActivoId: periodoActivo.id
      };
    } catch (error) {
      console.error('Error al obtener información de fecha límite:', error);
      return {
        semestre: "N/A",
        fechaLimite: "N/A",
        periodoActivo: null
      };
    }
  }

  // Obtener información de fecha límite para REGISTRO de actividades
  async getRegistroDeadlineInfo() {
    try {
      const periodoService = new PeriodoAcademicoService();
      const fechaLimiteService = new FechaLimiteService();

      // Obtener el período académico activo
      const periodoActivo = await periodoService.findActive();
      
      if (!periodoActivo) {
        return {
          semestre: "N/A",
          fechaLimite: "N/A",
          periodoActivo: null
        };
      }

      // Extraer el semestre del nombre del período
      const semestre = periodoActivo.nombre;

      // Obtener las fechas límite de categoría 'REGISTRO' para el período activo
      const fechasLimite = await fechaLimiteService.findByCategory('REGISTRO');
      
      if (!fechasLimite || fechasLimite.length === 0) {
        return {
          semestre: semestre,
          fechaLimite: "N/A",
          periodoActivo: periodoActivo.nombre,
          periodoActivoId: periodoActivo.id
        };
      }

      // Filtrar solo las fechas del período activo
      const fechasDelPeriodoActivo = fechasLimite.filter(fecha => 
        fecha.periodo && fecha.periodo.id === periodoActivo.id
      );

      if (fechasDelPeriodoActivo.length === 0) {
        return {
          semestre: semestre,
          fechaLimite: "N/A",
          periodoActivo: periodoActivo.nombre,
          periodoActivoId: periodoActivo.id
        };
      }

      // Encontrar la fecha límite más próxima
      const now = new Date();
      const fechaLimiteProxima = fechasDelPeriodoActivo.reduce((closest, current) => {
        const currentDate = new Date(current.fecha_limite);
        const closestDate = new Date(closest.fecha_limite);
        
        // Si ambas son futuras, tomar la más cercana
        if (currentDate >= now && closestDate >= now) {
          return currentDate < closestDate ? current : closest;
        }
        
        // Si una es futura y otra pasada, tomar la futura
        if (currentDate >= now && closestDate < now) {
          return current;
        }
        if (currentDate < now && closestDate >= now) {
          return closest;
        }
        
        // Si ambas son pasadas, tomar la más reciente
        return currentDate > closestDate ? current : closest;
      });

      return {
        semestre: semestre,
        fechaLimite: fechaLimiteProxima ? fechaLimiteProxima.fecha_limite : "N/A",
        periodoActivo: periodoActivo.nombre,
        periodoActivoId: periodoActivo.id
      };
    } catch (error) {
      console.error('Error al obtener información de fecha límite de registro:', error);
      return {
        semestre: "N/A",
        fechaLimite: "N/A",
        periodoActivo: null
      };
    }
  }

  // Aprobar reporte
  async approve(id, comentarios = '', revisadoPorId) {
    try {
      const reporte = await this.findOne(id);
      
      await reporte.update({ 
        estado: 'aprobado',
        comentariosRevision: comentarios,
        fechaRevision: new Date(),
        revisadoPorId: revisadoPorId
      });
      
      return {
        message: 'Reporte aprobado exitosamente',
        data: reporte
      };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al aprobar el reporte');
    }
  }

  // Rechazar reporte
  async reject(id, razon, revisadoPorId) {
    try {
      console.log('=== DEBUG REJECT SERVICE ===');
      console.log('ID:', id);
      console.log('Razón:', razon);
      console.log('revisadoPorId:', revisadoPorId);

      if (!razon || !razon.trim()) {
        throw boom.badRequest('La razón del rechazo es requerida');
      }
      
      console.log('Buscando reporte...');
      const reporte = await this.findOne(id);
      console.log('Reporte encontrado:', reporte.id);
      
      console.log('Actualizando reporte...');
      await reporte.update({ 
        estado: 'devuelto',
        comentariosRevision: razon,
        fechaRevision: new Date(),
        revisadoPorId: revisadoPorId
      });
      console.log('Reporte actualizado exitosamente');
      
      return {
        message: 'Reporte devuelto exitosamente',
        data: reporte
      };
    } catch (error) {
      console.log('Error en reject service:', error);
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al rechazar el reporte');
    }
  }

  // Aprobar reporte rápidamente (sin comentarios)
  async quickApprove(id, revisadoPorId) {
    try {
      const reporte = await this.findOne(id);
      
      await reporte.update({ 
        estado: 'aprobado',
        comentariosRevision: 'Aprobado rápidamente',
        fechaRevision: new Date(),
        revisadoPorId: revisadoPorId
      });
      
      return {
        message: 'Reporte aprobado rápidamente',
        data: reporte
      };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al aprobar rápidamente el reporte');
    }
  }

  // Devolver reporte a pendiente
  async returnToPending(id, razon, revisadoPorId) {
    try {
      console.log('=== DEBUG returnToPending ===');
      console.log('ID:', id);
      console.log('Razón:', razon);
      console.log('revisadoPorId:', revisadoPorId);
      
      if (!razon || !razon.trim()) {
        throw boom.badRequest('La razón para devolver a pendiente es requerida');
      }
      
      console.log('Buscando reporte...');
      const reporte = await this.findOne(id);
      console.log('Reporte encontrado, estado actual:', reporte.estado);
      
      console.log('Intentando actualizar reporte...');
      const updateData = { 
        estado: 'borrador',
        comentariosRevision: razon,
        fechaRevision: new Date(),
        revisadoPorId: revisadoPorId
      };
      console.log('Datos de actualización:', updateData);
      
      await reporte.update(updateData);
      console.log('Reporte actualizado exitosamente');
      
      return {
        message: 'Reporte devuelto a borrador exitosamente',
        data: reporte
      };
    } catch (error) {
      console.log('Error específico en returnToPending:', error);
      console.log('Error name:', error.name);
      console.log('Error message:', error.message);
      console.log('Error stack:', error.stack);
      if (boom.isBoom(error)) throw error;
      throw boom.internal(`Error al devolver el reporte a borrador: ${error.message}`);
    }
  }

  // Devolver reporte a revisión
  async returnToReview(id, razon, revisadoPorId) {
    try {
      if (!razon || !razon.trim()) {
        throw boom.badRequest('La razón para devolver a revisión es requerida');
      }
      
      const reporte = await this.findOne(id);
      
      await reporte.update({ 
        estado: 'en_revision',
        comentariosRevision: razon,
        fechaRevision: new Date(),
        revisadoPorId: revisadoPorId
      });
      
      return {
        message: 'Reporte devuelto a revisión exitosamente',
        data: reporte
      };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al devolver el reporte a revisión');
    }
  }

  // Actualizar estado del reporte
  async updateStatus(id, estado, comentarios = '', revisadoPorId = null) {
    try {
      const reporte = await this.findOne(id);
      
      const updateData = { 
        estado: estado,
        fechaRevision: new Date()
      };
      
      if (comentarios) {
        updateData.comentariosRevision = comentarios;
      }
      
      if (revisadoPorId) {
        updateData.revisadoPorId = revisadoPorId;
      }
      
      await reporte.update(updateData);
      
      return {
        message: `Estado del reporte actualizado a ${estado}`,
        data: reporte
      };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al actualizar el estado del reporte');
    }
  }

  // Obtener estadísticas de reportes
  async getStats(filters = {}) {
    try {
      const whereClause = {};
      
      if (filters.actividadId) whereClause.actividadId = filters.actividadId;
      if (filters.usuarioId) whereClause.usuarioId = filters.usuarioId;
      
      // SIEMPRE excluir archivados de las estadísticas de pendientes
      // Los archivados son reportes ya completados y aprobados
      whereClause.archivado = false;

      // 1. Verificar si hay fecha límite de ENTREGA configurada (categoría ENTREGA)
      const fechaLimiteEntrega = await models.FechaLimite.findOne({
        where: { 
          categoria: 'ENTREGA',
          activo: true
        },
        include: [{
          model: models.PeriodoAcademico,
          as: 'periodo', // Usar el alias correcto definido en la asociación
          where: { activo: true },
          required: true
        }]
      });

      // Si NO hay fecha límite de ENTREGA activa, usar lógica antigua
      if (!fechaLimiteEntrega) {
        console.log('ℹ️ No hay fecha límite de ENTREGA activa, usando lógica antigua');
        const totalReportes = await models.Reporte.count({ where: whereClause });
        const reportes = await models.Reporte.findAll({
          attributes: ['estado'],
          where: whereClause
        });

        const estadoCount = {};
        reportes.forEach(reporte => {
          const estado = reporte.estado || 'Sin estado';
          estadoCount[estado] = (estadoCount[estado] || 0) + 1;
        });

        const completados = estadoCount['aprobado'] || 0;
        const pendientes = estadoCount['borrador'] || 0;
        const enRevision = estadoCount['enviado'] || 0;
        const devueltos = estadoCount['devuelto'] || 0;

        const calcularPorcentaje = (cantidad) => {
          return totalReportes > 0 ? Math.round((cantidad / totalReportes) * 100) : 0;
        };

        return {
          total: totalReportes,
          completados,
          pendientes,
          enRevision,
          devueltos,
          porcentajes: {
            completados: calcularPorcentaje(completados),
            pendientes: calcularPorcentaje(pendientes),
            enRevision: calcularPorcentaje(enRevision),
            devueltos: calcularPorcentaje(devueltos)
          },
          detalle: {
            mensaje: 'Sin fecha límite de ENTREGA activa'
          }
        };
      }

      const periodoActivo = fechaLimiteEntrega.periodo; // Usar el alias correcto
      console.log('✅ Fecha límite de ENTREGA activa encontrada para período:', periodoActivo.nombre);

      // 2. NUEVA LÓGICA: Contar TODOS los docentes que DEBEN entregar reporte
      // Son los docentes que tienen actividades en el período actual
      let docentesConActividades = [];
      
      try {
        // Obtener todas las actividades y extraer usuarios únicos manualmente
        const actividades = await models.Actividad.findAll({
          where: {
            periodoAcademicoId: periodoActivo.id,
            estado_planificacion: { [Op.ne]: 'rechazada' } // No rechazadas
          },
          attributes: ['usuarioId'],
          raw: true
        });
        
        // Extraer IDs únicos de usuarios
        const usuariosUnicos = [...new Set(actividades.map(a => a.usuarioId))];
        docentesConActividades = usuariosUnicos.map(id => ({ usuarioId: id }));
        
        console.log(`📊 Docentes con actividades no rechazadas: ${docentesConActividades.length}`);
        
      } catch (actividadError) {
        // Si hay error (ej: campo no existe), intentar sin filtro de estado
        console.warn('⚠️ Error al consultar actividades con filtros avanzados, usando filtro básico:', actividadError.message);
        try {
          const actividades = await models.Actividad.findAll({
            where: {
              periodoAcademicoId: periodoActivo.id
            },
            attributes: ['usuarioId'],
            raw: true
          });
          
          // Extraer IDs únicos de usuarios
          const usuariosUnicos = [...new Set(actividades.map(a => a.usuarioId))];
          docentesConActividades = usuariosUnicos.map(id => ({ usuarioId: id }));
          
          console.log(`📊 Docentes con actividades (sin filtro): ${docentesConActividades.length}`);
          
        } catch (basicError) {
          // Si aún falla, usar lógica antigua
          console.error('❌ Error al consultar actividades, usando lógica antigua:', basicError.message);
          docentesConActividades = [];
        }
      }

      const totalDocentesDebenEntregar = docentesConActividades.length;

      // Si no hay docentes con actividades, usar lógica antigua para evitar división por 0
      if (totalDocentesDebenEntregar === 0) {
        console.warn('⚠️ No hay docentes con actividades en el período activo, usando lógica antigua');
        const totalReportes = await models.Reporte.count({ where: whereClause });
        const reportes = await models.Reporte.findAll({
          attributes: ['estado'],
          where: whereClause
        });

        const estadoCount = {};
        reportes.forEach(reporte => {
          const estado = reporte.estado || 'Sin estado';
          estadoCount[estado] = (estadoCount[estado] || 0) + 1;
        });

        const completados = estadoCount['aprobado'] || 0;
        const pendientes = estadoCount['borrador'] || 0;
        const enRevision = estadoCount['enviado'] || 0;
        const devueltos = estadoCount['devuelto'] || 0;

        const calcularPorcentaje = (cantidad) => {
          return totalReportes > 0 ? Math.round((cantidad / totalReportes) * 100) : 0;
        };

        return {
          total: totalReportes,
          completados,
          pendientes,
          enRevision,
          devueltos,
          porcentajes: {
            completados: calcularPorcentaje(completados),
            pendientes: calcularPorcentaje(pendientes),
            enRevision: calcularPorcentaje(enRevision),
            devueltos: calcularPorcentaje(devueltos)
          },
          detalle: {
            mensaje: 'Sin docentes con actividades en período activo, mostrando estadísticas de reportes existentes'
          }
        };
      }

      // 3. Obtener reportes del período actual (SOLO NO archivados)
      // Los archivados son del ciclo pasado, no deben aparecer en estadísticas
      const reportesPeriodo = await models.Reporte.findAll({
        where: whereClause, // Ya tiene archivado: false
        include: [{
          model: models.Actividad,
          as: 'actividades',
          where: {
            periodoAcademicoId: periodoActivo.id
          },
          attributes: [],
          required: true, // INNER JOIN - solo reportes con actividades del período
          through: { attributes: [] } // No incluir atributos de la tabla intermedia
        }],
        attributes: ['usuarioId', 'estado']
      });

      // Convertir a objetos simples
      const reportesData = reportesPeriodo.map(r => ({
        usuarioId: r.usuarioId,
        estado: r.estado
      }));

      // 4. Agrupar reportes por docente (cada docente solo debe tener 1 reporte por período)
      // SOLO reportes NO archivados (los archivados son del ciclo pasado)
      const reportesPorDocente = {};
      reportesData.forEach(reporte => {
        // Si un docente tiene múltiples reportes, tomar el de mayor prioridad:
        // aprobado > enviado > devuelto > borrador
        const estadoActual = reportesPorDocente[reporte.usuarioId];
        const prioridad = { 'aprobado': 4, 'enviado': 3, 'devuelto': 2, 'borrador': 1 };
        
        if (!estadoActual || (prioridad[reporte.estado] || 0) > (prioridad[estadoActual] || 0)) {
          reportesPorDocente[reporte.usuarioId] = reporte.estado;
        }
      });

      // 5. Contar por estado
      const completados = Object.values(reportesPorDocente).filter(estado => estado === 'aprobado').length;
      const enRevision = Object.values(reportesPorDocente).filter(estado => estado === 'enviado' || estado === 'revisado').length;
      const devueltos = Object.values(reportesPorDocente).filter(estado => estado === 'devuelto').length;
      const borradores = Object.values(reportesPorDocente).filter(estado => estado === 'borrador').length;
      
      // 6. Calcular pendientes = Docentes que NO tienen reporte o tienen borrador
      const docentesConReporte = Object.keys(reportesPorDocente).length;
      const docentesSinReporte = totalDocentesDebenEntregar - docentesConReporte;
      const pendientes = docentesSinReporte + borradores;

      console.log(`📊 Estadísticas del período ${periodoActivo.nombre}:`);
      console.log(`   - Total docentes que deben entregar: ${totalDocentesDebenEntregar}`);
      console.log(`   - Reportes activos (NO archivados): ${reportesPeriodo.length}`);
      console.log(`   - Completados (aprobados activos): ${completados}`);
      console.log(`   - En revisión: ${enRevision}`);
      console.log(`   - Devueltos: ${devueltos}`);
      console.log(`   - Borradores: ${borradores}`);
      console.log(`   - Sin reporte: ${docentesSinReporte}`);
      console.log(`   - PENDIENTES (sin reporte + borradores): ${pendientes}`);
      console.log(`   ℹ️  Nota: Los reportes archivados NO se cuentan (son del ciclo pasado)`);

      // 7. Calcular porcentajes sobre el TOTAL DE DOCENTES
      const calcularPorcentaje = (cantidad) => {
        return totalDocentesDebenEntregar > 0 ? Math.round((cantidad / totalDocentesDebenEntregar) * 100) : 0;
      };

      return {
        total: totalDocentesDebenEntregar, // Total de docentes que DEBEN entregar
        completados,
        pendientes,
        enRevision,
        devueltos,
        porcentajes: {
          completados: calcularPorcentaje(completados),
          pendientes: calcularPorcentaje(pendientes),
          enRevision: calcularPorcentaje(enRevision),
          devueltos: calcularPorcentaje(devueltos)
        },
        detalle: {
          docentesConActividades: totalDocentesDebenEntregar,
          docentesSinReporte: docentesSinReporte,
          docentesConBorrador: borradores,
          periodoActivo: periodoActivo.nombre
        }
      };
    } catch (error) {
      console.error('Error en getStats:', error);
      throw boom.internal('Error al obtener estadísticas de reportes');
    }
  }

  // Obtener reportes pendientes para el dashboard
  async getPendingForDashboard() {
    try {
      const reportesPendientes = await models.Reporte.findAll({
        where: {
          estado: {
            [Op.in]: ['enviado', 'pendiente']
          },
          fechaEnvio: {
            [Op.ne]: null
          },
          archivado: false
        },
        include: [
          {
            model: models.User,
            as: 'usuario',
            attributes: ['id', 'nombre', 'apellido', 'email'],
            where: { activo: true }
          }
        ],
        order: [['updatedAt', 'DESC']],
        limit: 10
      });

      const totalPendientes = await models.Reporte.count({
        where: {
          estado: {
            [Op.in]: ['enviado', 'pendiente']
          },
          fechaEnvio: {
            [Op.ne]: null
          },
          archivado: false
        }
      });

      return {
        reportes: reportesPendientes,
        total: totalPendientes
      };
    } catch (error) {
      console.error('Error en getPendingForDashboard:', error);
      throw boom.internal('Error al obtener reportes pendientes para el dashboard');
    }
  }

  async archive(id, archivar = true, usuarioId) {
    const reporte = await this.findOne(id);
    if (!reporte) throw boom.notFound('Reporte no encontrado');
    const payload = archivar
      ? { archivado: true, archivadoAt: new Date(), archivadoPorId: usuarioId }
      : { archivado: false, archivadoAt: null, archivadoPorId: null };
    await reporte.update(payload);
    return reporte;
  }
}

export default ReporteService;