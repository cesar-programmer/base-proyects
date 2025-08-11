const boom = require('@hapi/boom');
const { models } = require('../db/models');

class RoleService {
  // Obtener todos los roles
  async find() {
    try {
      const roles = await models.Role.findAll({
        include: [
          {
            model: models.Permiso,
            as: 'permisos',
            attributes: ['id_permiso', 'nombre', 'descripcion']
          }
        ]
      });
      return roles;
    } catch (error) {
      throw boom.internal('Error al obtener los roles');
    }
  }

  // Obtener un rol por ID
  async findOne(id) {
    try {
      const role = await models.Role.findByPk(id, {
        include: [
          {
            model: models.Permiso,
            as: 'permisos',
            attributes: ['id_permiso', 'nombre', 'descripcion']
          },
          {
            model: models.User,
            as: 'usuarios',
            attributes: ['id_usuario', 'nombre_completo', 'email', 'activo']
          }
        ]
      });

      if (!role) {
        throw boom.notFound('Rol no encontrado');
      }

      return role;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al obtener el rol');
    }
  }

  // Crear un nuevo rol
  async create(roleData) {
    try {
      const newRole = await models.Role.create(roleData);
      return newRole;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw boom.conflict('Ya existe un rol con ese nombre');
      }
      throw boom.internal('Error al crear el rol');
    }
  }

  // Actualizar un rol
  async update(id, roleData) {
    try {
      const role = await this.findOne(id);
      const updatedRole = await role.update(roleData);
      return updatedRole;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al actualizar el rol');
    }
  }

  // Eliminar un rol
  async delete(id) {
    try {
      const role = await this.findOne(id);
      
      // Verificar si hay usuarios usando este rol
      const usersWithRole = await models.User.count({
        where: { id_rol: id }
      });

      if (usersWithRole > 0) {
        throw boom.conflict('No se puede eliminar el rol porque hay usuarios asignados');
      }

      await role.destroy();
      return { message: 'Rol eliminado correctamente' };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al eliminar el rol');
    }
  }

  // Asignar permisos a un rol
  async assignPermissions(roleId, permissionIds) {
    try {
      const role = await this.findOne(roleId);
      await role.setPermisos(permissionIds);
      
      const updatedRole = await this.findOne(roleId);
      return updatedRole;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al asignar permisos al rol');
    }
  }

  // Obtener permisos de un rol
  async getPermissions(roleId) {
    try {
      const role = await this.findOne(roleId);
      return role.permisos;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al obtener los permisos del rol');
    }
  }
}

module.exports = RoleService;
