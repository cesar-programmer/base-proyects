import boom from '@hapi/boom';
import bcrypt from 'bcryptjs';
import { models } from '../db/models/index.js';

class UserService {
  // Obtener todos los usuarios
  async find() {
    try {
      const users = await models.User.findAll({
        include: [
          {
            model: models.Role,
            as: 'rol',
            attributes: ['id_rol', 'nombre', 'descripcion']
          }
        ],
        attributes: { exclude: ['password_hash'] }
      });
      return users;
    } catch (error) {
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
            attributes: ['id_rol', 'nombre', 'descripcion']
          }
        ],
        attributes: { exclude: ['password_hash'] }
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
            attributes: ['id_rol', 'nombre', 'descripcion']
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

      // Hashear la contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password_hash, saltRounds);

      const newUser = await models.User.create({
        ...userData,
        password_hash: hashedPassword
      });

      // Retornar usuario sin contraseña
      const { password_hash, ...userWithoutPassword } = newUser.toJSON();
      return userWithoutPassword;
    } catch (error) {
      if (boom.isBoom(error)) throw error;
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
      if (userData.password_hash) {
        const saltRounds = 10;
        userData.password_hash = await bcrypt.hash(userData.password_hash, saltRounds);
      }

      const updatedUser = await user.update(userData);
      
      // Retornar usuario sin contraseña
      const { password_hash, ...userWithoutPassword } = updatedUser.toJSON();
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
      await user.update({ ultimo_login: new Date() });
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

      const isValid = await bcrypt.compare(password, user.password_hash);
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
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isCurrentPasswordValid) {
        throw boom.unauthorized('Contraseña actual incorrecta');
      }

      // Hashear nueva contraseña
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Actualizar contraseña
      await user.update({ password_hash: hashedNewPassword });

      return { message: 'Contraseña cambiada correctamente' };
    } catch (error) {
      if (boom.isBoom(error)) throw error;
      throw boom.internal('Error al cambiar la contraseña');
    }
  }
}

export default UserService;
