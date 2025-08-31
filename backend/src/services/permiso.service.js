import { models } from '../db/models/index.js';
import Boom from '@hapi/boom';

class PermisoService {
  constructor() {
    this.model = models.Permiso;
  }

  async findAll() {
    try {
      const permisos = await this.model.findAll({
        order: [['nombre', 'ASC']]
      });
      return permisos;
    } catch (error) {
      throw Boom.internal('Error al obtener permisos', error);
    }
  }

  async findById(id) {
    try {
      const permiso = await this.model.findByPk(id);
      if (!permiso) {
        throw Boom.notFound('Permiso no encontrado');
      }
      return permiso;
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al obtener permiso', error);
    }
  }

  async findByName(nombre) {
    try {
      const permiso = await this.model.findOne({
        where: { nombre }
      });
      return permiso;
    } catch (error) {
      throw Boom.internal('Error al buscar permiso por nombre', error);
    }
  }

  async findActive() {
    try {
      const permisos = await this.model.findAll({
        where: { activo: true },
        order: [['nombre', 'ASC']]
      });
      return permisos;
    } catch (error) {
      throw Boom.internal('Error al obtener permisos activos', error);
    }
  }

  async create(data) {
    try {
      // Verificar si ya existe un permiso con el mismo nombre
      const existingPermiso = await this.findByName(data.nombre);
      if (existingPermiso) {
        throw Boom.conflict('Ya existe un permiso con ese nombre');
      }

      const permiso = await this.model.create(data);
      return permiso;
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al crear permiso', error);
    }
  }

  async update(id, data) {
    try {
      const permiso = await this.findById(id);
      
      // Si se está actualizando el nombre, verificar que no exista otro con el mismo nombre
      if (data.nombre && data.nombre !== permiso.nombre) {
        const existingPermiso = await this.findByName(data.nombre);
        if (existingPermiso) {
          throw Boom.conflict('Ya existe un permiso con ese nombre');
        }
      }

      const updatedPermiso = await permiso.update(data);
      return updatedPermiso;
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al actualizar permiso', error);
    }
  }

  async delete(id) {
    try {
      const permiso = await this.findById(id);
      
      // Verificar si el permiso está siendo usado por algún rol
      const rolesCount = await models.RolePermiso.count({
        where: { id_permiso: id }
      });
      
      if (rolesCount > 0) {
        throw Boom.conflict('No se puede eliminar el permiso porque está siendo usado por uno o más roles');
      }

      await permiso.destroy();
      return { message: 'Permiso eliminado exitosamente' };
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al eliminar permiso', error);
    }
  }

  async toggleActive(id) {
    try {
      const permiso = await this.findById(id);
      const updatedPermiso = await permiso.update({ activo: !permiso.activo });
      return updatedPermiso;
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Error al cambiar estado del permiso', error);
    }
  }
}

export default PermisoService;