import boom from '@hapi/boom';
import { models, sequelize } from '../db/models/index.js';

class ActividadService {
  // Obtener todas las actividades
  async find() {
    try {
      const actividades = await models.Actividad.findAll({
        include: [
          {
            association: 'usuario',
            attributes: ['id', 'nombre', 'email']
          },
          {
            association: 'periodoAcademico',
            attributes: ['id', 'nombre', 'fechaInicio', 'fechaFin']
          }
        ]
      });
      return actividades;
    } catch (error) {
      throw boom.badImplementation('Error al obtener las actividades', error);
    }
  }

  // Obtener actividades por reporte
  async findByReporte(reporteId) {
    try {
      const actividades = await models.Actividad.findAll({
        where: { reporteId: reporteId },
        include: [
          {
            model: models.CatalogoActividad,
            as: 'catalogo',
            attributes: ['id', 'titulo', 'descripcion', 'horas_estimadas']
          },
          {
            model: models.Archivo,
            as: 'archivos',
            attributes: ['id', 'nombre_original', 'tipo_mime', 'fecha_subida']
          }
        ],
        order: [['categoria', 'ASC'], ['titulo', 'ASC']]
      });
      return actividades;
    } catch (error) {
      throw boom.internal('Error al obtener las actividades del reporte');
    }
  }

  // Obtener actividades por categoría
  async findByCategory(categoria) {
    try {
      const actividades = await models.Actividad.findAll({
        where: { categoria },
        include: [
          {
            model: models.Reporte,
            as: 'reporte',
            attributes: ['id', 'tipo', 'estado', 'semestre']
          }
        ],
        order: [['fecha_creacion', 'DESC']]
      });
      return actividades;
    } catch (error) {
      throw boom.internal('Error al obtener las actividades por categoría');
    }
  }

  // Obtener una actividad por ID
  async findOne(id) {
    try {
      const actividad = await models.Actividad.findByPk(id, {
        include: [
          {
            association: 'usuario',
            attributes: ['id', 'nombre', 'email']
          },
          {
            association: 'periodoAcademico',
            attributes: ['id', 'nombre', 'fechaInicio', 'fechaFin']
          }
        ]
      });
      if (!actividad) {
        throw boom.notFound('Actividad no encontrada');
      }
      return actividad;
    } catch (error) {
      if (error.isBoom) {
        throw error;
      }
      throw boom.badImplementation('Error al obtener la actividad', error);
    }
  }

  // Obtener actividades por usuario
  async findByUsuario(usuarioId, options = {}) {
    try {
      const { page = 1, limit = 10 } = options;
      const offset = (page - 1) * limit;

      const actividades = await models.Actividad.findAndCountAll({
        where: { usuarioId: usuarioId },
        include: [
          {
            model: models.User,
            as: 'usuario',
            attributes: ['id', 'nombre', 'apellido', 'email']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        data: actividades.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: actividades.count,
          pages: Math.ceil(actividades.count / limit)
        }
      };
    } catch (error) {
      throw boom.internal('Error al obtener las actividades del usuario');
    }
  }

  // Crear una nueva actividad
  async create(actividadData) {
    try {
      // Verificar que el usuario existe
      const usuario = await models.User.findByPk(actividadData.usuarioId);
      if (!usuario) {
        throw boom.notFound('Usuario no encontrado');
      }

      // Verificar que el periodo académico existe
      const periodo = await models.PeriodoAcademico.findByPk(actividadData.periodoAcademicoId);
      if (!periodo) {
        throw boom.notFound('Periodo académico no encontrado');
      }

      const newActividad = await models.Actividad.create(actividadData);
      
      // Retornar con relaciones incluidas
      const actividadWithRelations = await this.findOne(newActividad.id);
      return actividadWithRelations;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al crear la actividad');
    }
  }

  // Actualizar una actividad
  async update(id, actividadData) {
    try {
      const actividad = await this.findOne(id);

      // Si se está cambiando el usuario, verificar que existe
      if (actividadData.usuarioId && actividadData.usuarioId !== actividad.usuarioId) {
        const usuario = await models.User.findByPk(actividadData.usuarioId);
        if (!usuario) {
          throw boom.notFound('Usuario no encontrado');
        }
      }

      // Si se está cambiando el periodo académico, verificar que existe
      if (actividadData.periodoAcademicoId && actividadData.periodoAcademicoId !== actividad.periodoAcademicoId) {
        const periodo = await models.PeriodoAcademico.findByPk(actividadData.periodoAcademicoId);
        if (!periodo) {
          throw boom.notFound('Periodo académico no encontrado');
        }
      }

      const updatedActividad = await actividad.update(actividadData);
      
      // Retornar con relaciones incluidas
      const actividadWithRelations = await this.findOne(id);
      return actividadWithRelations;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al actualizar la actividad');
    }
  }

  // Eliminar una actividad
  async delete(id) {
    try {
      const actividad = await this.findOne(id);
      await actividad.destroy();
      return { message: 'Actividad eliminada correctamente' };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al eliminar la actividad');
    }
  }



  // Obtener estadísticas de actividades por categoría
  async getStatsByCategory() {
    try {
      const stats = await models.Actividad.findAll({
        attributes: [
          'categoria',
          [models.sequelize.fn('COUNT', models.sequelize.col('categoria')), 'count'],
          [models.sequelize.fn('SUM', models.sequelize.col('horas_estimadas')), 'total_horas']
        ],
        group: ['categoria']
      });

      return stats;
    } catch (error) {
      throw boom.internal('Error al obtener estadísticas por categoría');
    }
  }

  // Obtener actividades por estado de realización
  async findByRealizationStatus(estado) {
    try {
      const actividades = await models.Actividad.findAll({
        where: { estado_realizado: estado },
        include: [
          {
            model: models.Reporte,
            as: 'reporte',
            attributes: ['id_reporte', 'tipo', 'estado', 'semestre']
          }
        ],
        order: [['fecha_creacion', 'DESC']]
      });
      return actividades;
    } catch (error) {
      throw boom.internal('Error al obtener actividades por estado de realización');
    }
  }

  // Actualizar estado de realización
  async updateRealizationStatus(id, estado) {
    try {
      const actividad = await this.findOne(id);
      await actividad.update({ estado_realizado: estado });
      
      return { 
        message: `Estado de realización actualizado a ${estado}`,
        estado_realizado: estado
      };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al actualizar estado de realización');
    }
  }

  // Aprobar actividad
  async approve(id, comentarios = '') {
    try {
      const actividad = await this.findOne(id);
      await actividad.update({ 
        estado_realizado: 'aprobada',
        comentarios_revision: comentarios,
        fecha_revision: new Date()
      });
      
      return {
        message: 'Actividad aprobada exitosamente',
        data: actividad
      };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al aprobar la actividad');
    }
  }

  // Rechazar actividad
  async reject(id, razon) {
    try {
      if (!razon || !razon.trim()) {
        throw boom.badRequest('La razón del rechazo es requerida');
      }
      
      const actividad = await this.findOne(id);
      await actividad.update({ 
        estado_realizado: 'devuelta',
        comentarios_revision: razon,
        fecha_revision: new Date()
      });
      
      // Crear notificación automática de devolución
      try {
        const mensaje = `Su actividad "${actividad.nombre}" ha sido devuelta para correcciones. Observaciones: ${razon}`;
          
        await this.notificacionService.create({
          id_usuario_destino: actividad.id_usuario,
          mensaje: mensaje,
          tipo: 'DEVOLUCION'
        });
      } catch (notifError) {
        console.error('Error al crear notificación de devolución:', notifError);
        // No fallar la operación principal si falla la notificación
      }
      
      return {
        message: 'Actividad devuelta exitosamente',
        data: actividad
      };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al devolver la actividad');
    }
  }

  // Actualizar estado de actividad
  async updateStatus(id, nuevoEstado) {
    try {
      const actividad = await this.findOne(id);
      
      const updatedActividad = await actividad.update({ estado: nuevoEstado });
      
      return updatedActividad;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al actualizar el estado de la actividad');
    }
  }

  // Obtener estadísticas de actividades por estado
  async getActivityStatsByStatus() {
    try {
      console.log('=== getActivityStatsByStatus - Obteniendo datos reales de actividades ===');
      
      // Obtener estadísticas de actividades por estado_realizado
      const actividadesAprobadas = await models.Actividad.count({
        where: { estado_realizado: 'aprobada' }
      });
      
      const actividadesPendientes = await models.Actividad.count({
        where: { estado_realizado: 'pendiente' }
      });
      
      const actividadesDevueltas = await models.Actividad.count({
        where: { estado_realizado: 'devuelta' }
      });
      
      const totalActividades = await models.Actividad.count();
      
      // Calcular porcentajes
      const porcentajeCompletadas = totalActividades > 0 ? Math.round((actividadesAprobadas / totalActividades) * 100) : 0;
      const porcentajePendientes = totalActividades > 0 ? Math.round((actividadesPendientes / totalActividades) * 100) : 0;
      const porcentajeAtrasadas = totalActividades > 0 ? Math.round((actividadesDevueltas / totalActividades) * 100) : 0;
      
      const estadisticas = {
        total: totalActividades,
        completadas: actividadesAprobadas,
        pendientes: actividadesPendientes,
        atrasadas: actividadesDevueltas,
        pendientesRevision: actividadesPendientes, // Los pendientes de revisión son los pendientes
        porcentajes: {
          completadas: porcentajeCompletadas,
          pendientes: porcentajePendientes,
          atrasadas: porcentajeAtrasadas
        }
      };

      console.log('Estadísticas reales de actividades obtenidas:', estadisticas);
      return estadisticas;
    } catch (error) {
      console.error('Error en getActivityStatsByStatus:', error);
      throw boom.internal('Error al obtener estadísticas de actividades por estado');
    }
  }

  // Obtener actividades pendientes de revisión para el dashboard
  async getPendingActivitiesForDashboard(limit = 5) {
    try {
      const actividadesPendientes = await models.Actividad.findAll({
        where: { estado_realizado: 'pendiente' },
        include: [
          {
            model: models.User,
            as: 'usuario',
            attributes: ['id', 'nombre', 'apellido']
          }
        ],
        order: [['createdAt', 'ASC']],
        limit: parseInt(limit)
      });

      return actividadesPendientes.map(actividad => ({
        name: `${actividad.usuario.nombre} ${actividad.usuario.apellido}`,
        activity: actividad.titulo,
        categoria: actividad.categoria || 'GENERAL',
        fechaEnvio: actividad.createdAt,
        actividadId: actividad.id
      }));
    } catch (error) {
      throw boom.internal('Error al obtener actividades pendientes para el dashboard');
    }
  }

  // Obtener actividades devueltas para correcciones pendientes
  async getReturnedActivities(filters = {}) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        searchTerm = '', 
        period = '', 
        dateFrom = '', 
        dateTo = '' 
      } = filters;

      const whereConditions = {
        estado_realizado: 'devuelta'
      };

      // Construir condiciones de búsqueda
      const includeConditions = [
        {
          model: models.User,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido', 'email'],
          where: searchTerm ? {
            [models.Sequelize.Op.or]: [
              { nombre: { [models.Sequelize.Op.like]: `%${searchTerm}%` } },
              { apellido: { [models.Sequelize.Op.like]: `%${searchTerm}%` } },
              { email: { [models.Sequelize.Op.like]: `%${searchTerm}%` } }
            ]
          } : {}
        },
        {
          model: models.Reporte,
          as: 'reportes',
          attributes: ['id', 'titulo', 'estado', 'fechaEnvio', 'fechaRevision'],
          required: false // LEFT JOIN para incluir actividades sin reportes
        }
      ];

      // Filtros de fecha
      if (dateFrom || dateTo) {
        const dateConditions = {};
        if (dateFrom) dateConditions[models.Sequelize.Op.gte] = new Date(dateFrom);
        if (dateTo) dateConditions[models.Sequelize.Op.lte] = new Date(dateTo + ' 23:59:59');
        
        if (Object.keys(dateConditions).length > 0) {
          whereConditions.fecha_revision = dateConditions;
        }
      }

      // Calcular offset para paginación
      const offset = (parseInt(page) - 1) * parseInt(limit);

      // Obtener actividades devueltas
      const { count, rows: actividades } = await models.Actividad.findAndCountAll({
        where: whereConditions,
        include: includeConditions,
        order: [['fecha_revision', 'DESC']],
        limit: parseInt(limit),
        offset: offset,
        distinct: true
      });

      // Formatear datos para el frontend
      const formattedActivities = actividades.map(actividad => {
        const primerReporte = actividad.reportes && actividad.reportes.length > 0 ? actividad.reportes[0] : null;
        
        return {
          id: actividad.id,
          teacherName: `${actividad.usuario.nombre} ${actividad.usuario.apellido}`,
          email: actividad.usuario.email,
          period: 'N/A', // No hay campo semestre en el modelo actual
          observations: actividad.comentarios_revision || 'Sin observaciones',
          returnedDate: actividad.fecha_revision,
          status: 'devuelto',
          reportDetails: {
            title: actividad.titulo,
            submittedDate: primerReporte?.fechaEnvio || actividad.createdAt,
            activities: [{
              id: actividad.id,
              name: actividad.titulo,
              description: actividad.descripcion || 'Sin descripción',
              status: actividad.estado_realizado === 'aprobada' ? 'completed' : 'incomplete',
              evidence: actividad.evidencias || null
            }],
            originalObservations: actividad.comentarios_revision || 'Sin observaciones'
          }
        };
      });

      return {
        data: formattedActivities,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / parseInt(limit)),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      };
    } catch (error) {
      console.error('Error en getReturnedActivities:', error);
      throw boom.internal('Error al obtener actividades devueltas');
    }
  }

  // Enviar planificación de actividades
  async submitPlanification({ usuarioId, actividades, periodo, observaciones }) {
    console.log('🔍 [submitPlanification] Iniciando función con parámetros:', {
      usuarioId,
      actividades,
      periodo,
      observaciones
    });

    const transaction = await sequelize.transaction();
    
    try {
      console.log('🔍 [submitPlanification] Transacción creada exitosamente');

      // Verificar que el usuario existe
      console.log('🔍 [submitPlanification] Verificando usuario con ID:', usuarioId);
      const usuario = await models.User.findByPk(usuarioId);
      if (!usuario) {
        console.log('❌ [submitPlanification] Usuario no encontrado:', usuarioId);
        throw boom.notFound('Usuario no encontrado');
      }
      console.log('✅ [submitPlanification] Usuario encontrado:', usuario.nombre);

      // Verificar que todas las actividades existen y pertenecen al usuario
    const actividadesExistentes = await models.Actividad.findAll({
      where: {
        id: actividades,
        usuarioId: usuarioId
      },
      transaction
    });

      if (actividadesExistentes.length !== actividades.length) {
        console.log('❌ [submitPlanification] Mismatch en cantidad de actividades');
        throw boom.badRequest('Algunas actividades no existen o no pertenecen al usuario');
      }

      // Actualizar el estado de las actividades a "enviada" y agregar información de planificación
      console.log('🔍 [submitPlanification] Actualizando actividades con datos:', {
        estado_planificacion: 'enviada',
        periodo_planificacion: periodo,
        observaciones_planificacion: observaciones,
        fecha_envio_planificacion: new Date()
      });

      const updateResult = await models.Actividad.update(
        {
          estado_planificacion: 'enviada',
          periodo_planificacion: periodo,
          observaciones_planificacion: observaciones,
          fecha_envio_planificacion: new Date()
        },
        {
          where: {
            id: actividades,
            usuarioId: usuarioId
          },
          transaction
        }
      );

      console.log('✅ [submitPlanification] Actividades actualizadas:', updateResult);

      console.log('🔍 [submitPlanification] Haciendo commit de la transacción...');
      await transaction.commit();
      console.log('✅ [submitPlanification] Transacción confirmada exitosamente');

      const response = {
        message: 'Planificación enviada exitosamente',
        actividades_enviadas: actividades.length,
        periodo: periodo,
        fecha_envio: new Date()
      };

      console.log('✅ [submitPlanification] Función completada exitosamente:', response);
      return response;
    } catch (error) {
      console.log('❌ [submitPlanification] Error capturado, haciendo rollback...');
      await transaction.rollback();
      console.log('✅ [submitPlanification] Rollback completado');
      
      console.error('❌ [submitPlanification] Error completo:', error);
      console.error('❌ [submitPlanification] Error message:', error.message);
      console.error('❌ [submitPlanification] Error stack:', error.stack);
      console.error('❌ [submitPlanification] Error isBoom:', error.isBoom);
      
      if (error.isBoom) {
        console.log('❌ [submitPlanification] Relanzando error Boom:', error.output);
        throw error;
      }
      
      console.log('❌ [submitPlanification] Lanzando error interno genérico');
      throw boom.internal('Error al enviar la planificación');
    }
  }
}

export default ActividadService;
