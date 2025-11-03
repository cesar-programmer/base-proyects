import boom from '@hapi/boom';
import bcrypt from 'bcryptjs';
import { models } from '../db/models/index.js';

class UserService {
  // Obtener todos los usuarios
  async find() {
    try {
      console.log('🔍 UserService.find() - Consultando todos los usuarios...');
      const users = await models.User.findAll({
        include: [
          {
            model: models.Role,
            as: 'rol',
            attributes: ['id', 'nombre', 'descripcion']
          }
        ],
        attributes: { exclude: ['password'] }
      });
      console.log(`✅ UserService.find() - Encontrados ${users.length} usuarios en BD`);
      console.log('📋 Usuarios con roles:', users.map(u => ({
        id: u.id,
        email: u.email,
        nombre: u.nombre,
        rolId: u.rolId,
        rolData: u.rol
      })));
      return users;
    } catch (error) {
      console.error('❌ Error en UserService.find():', error);
      throw boom.internal('Error al obtener los usuarios');
    }
  }

  // Obtener un usuario por ID
  async findOne(id) {
    try {
      const user = await models.User.findByPk(id, {
        include: [
          {
            model: models.Role,
            as: 'rol',
            attributes: ['id', 'nombre', 'descripcion']
          }
        ],
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        throw boom.notFound('Usuario no encontrado');
      }

      return user;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al obtener el usuario');
    }
  }

  // Obtener usuario por email
  async findByEmail(email) {
    try {
      const user = await models.User.findOne({
        where: { email },
        include: [
          {
            model: models.Role,
            as: 'rol',
            attributes: ['id', 'nombre', 'descripcion']
          }
        ]
      });

      if (!user) {
        throw boom.notFound('Usuario no encontrado');
      }

      return user;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al buscar usuario por email');
    }
  }

  // Crear un nuevo usuario
  async create(userData) {
    try {
      // Verificar si el email ya existe
      const existingUser = await models.User.findOne({
        where: { email: userData.email }
      });

      if (existingUser) {
        throw boom.conflict('Ya existe un usuario con ese email');
      }

      // Hashear la contraseña antes de crear el usuario
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }
      
      console.log('Datos del usuario antes de crear:', userData);
      const newUser = await models.User.create(userData);

      // Retornar usuario sin contraseña
      const { password, ...userWithoutPassword } = newUser.toJSON();
      return userWithoutPassword;
    } catch (error) {
      console.log('Error específico en create:', error);
      console.log('Error name:', error.name);
      console.log('Error message:', error.message);
      if (boom.isBoom(error)) throw error;
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        if (error.fields && error.fields.email) {
          throw boom.conflict('Ya existe un usuario con ese email');
        }
        if (error.fields && error.fields.cedula) {
          throw boom.conflict('Ya existe un usuario con esa cédula');
        }
        throw boom.conflict('Ya existe un usuario con esos datos');
      }
      
      throw boom.internal('Error al crear el usuario');
    }
  }

  // Actualizar un usuario
  async update(id, userData) {
    try {
      const user = await this.findOne(id);

      // Si se está actualizando el email, verificar que no exista
      if (userData.email && userData.email !== user.email) {
        const existingUser = await models.User.findOne({
          where: { email: userData.email }
        });

        if (existingUser) {
          throw boom.conflict('Ya existe un usuario con ese email');
        }
      }

      // Si se está actualizando la contraseña, hashearla
      if (userData.password) {
        const saltRounds = 10;
        userData.password = await bcrypt.hash(userData.password, saltRounds);
      }

      const updatedUser = await user.update(userData);
      
      // Retornar usuario sin contraseña
      const { password, ...userWithoutPassword } = updatedUser.toJSON();
      return userWithoutPassword;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al actualizar el usuario');
    }
  }

  // Eliminar un usuario
  async delete(id) {
    try {
      const user = await this.findOne(id);
      await user.destroy();
      return { message: 'Usuario eliminado correctamente' };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al eliminar el usuario');
    }
  }

  // Cambiar estado activo/inactivo
  async toggleStatus(id) {
    try {
      const user = await this.findOne(id);
      const newStatus = !user.activo;
      await user.update({ activo: newStatus });
      
      return { 
        message: `Usuario ${newStatus ? 'activado' : 'desactivado'} correctamente`,
        activo: newStatus
      };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al cambiar el estado del usuario');
    }
  }

  // Actualizar último login
  async updateLastLogin(id) {
    try {
      const user = await this.findOne(id);
      await user.update({ ultimoAcceso: new Date() });
      return { message: 'Último login actualizado' };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al actualizar último login');
    }
  }

  // Verificar contraseña
  async verifyPassword(userId, password) {
    try {
      const user = await models.User.findByPk(userId);
      if (!user) {
        throw boom.notFound('Usuario no encontrado');
      }

      const isValid = await bcrypt.compare(password, user.password);
      return isValid;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al verificar contraseña');
    }
  }

  // Cambiar contraseña
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await models.User.findByPk(userId);
      if (!user) {
        throw boom.notFound('Usuario no encontrado');
      }

      // Verificar contraseña actual
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw boom.unauthorized('Contraseña actual incorrecta');
      }

      // Hashear nueva contraseña
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Actualizar contraseña
      await user.update({ password: hashedNewPassword });

      return { message: 'Contraseña cambiada correctamente' };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al cambiar la contraseña');
    }
  }

  // Obtener usuarios por rol
  async findByRole(roleId, activo = undefined) {
    try {
      const where = { rolId: parseInt(roleId) };
      if (activo !== undefined) {
        where.activo = !!activo;
      }

      const users = await models.User.findAll({
        where,
        include: [
          {
            model: models.Role,
            as: 'rol',
            attributes: ['id', 'nombre', 'descripcion']
          }
        ],
        attributes: { exclude: ['password'] },
        order: [['nombre', 'ASC']]
      });

      return users;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al obtener usuarios por rol');
    }
  }
}

export default UserService;
