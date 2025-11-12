import boom from '@hapi/boom';
import { UserService } from '../services/index.js';

const userService = new UserService();

class UserController {
  // Obtener todos los usuarios
  async getUsers(req, res, next) {
    try {
      console.log('🔍 GET /users - Query params:', req.query);
      const { page = 1, limit = 10, activo, id_rol } = req.query;
      const filters = {};
      
      if (activo !== undefined) filters.activo = activo === 'true';
      if (id_rol) filters.id_rol = parseInt(id_rol);

      console.log('📋 Filtros aplicados:', filters);
      const users = await userService.find({
        page: parseInt(page),
        limit: parseInt(limit),
        ...filters
      });

      console.log('✅ Usuarios encontrados:', users.length);
      console.log('👥 Lista de usuarios:', users.map(u => ({
        id: u.id,
        email: u.email,
        rolId: u.rol?.id,
        rolNombre: u.rol?.nombre
      })));

      res.json({
        message: 'Usuarios obtenidos exitosamente',
        data: users
      });
    } catch (error) {
      console.error('❌ Error en getUsers:', error);
      next(error);
    }
  }

  // Obtener usuario por ID
  async getUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.findOne(id);
      
      res.json({
        message: 'Usuario obtenido exitosamente',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  // Crear nuevo usuario
  async createUser(req, res, next) {
    try {
      const userData = req.body;
      console.log('📝 Datos recibidos para crear usuario:', JSON.stringify(userData, null, 2));
      const newUser = await userService.create(userData);
      
      res.status(201).json({
        message: 'Usuario creado exitosamente',
        data: newUser
      });
    } catch (error) {
      console.error('❌ Error al crear usuario:', error.message);
      next(error);
    }
  }

  // Actualizar usuario
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const userData = req.body;
      
      const updatedUser = await userService.update(id, userData);
      
      res.json({
        message: 'Usuario actualizado exitosamente',
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }

  // Eliminar usuario (soft delete)
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      await userService.delete(id);
      
      res.json({
        message: 'Usuario eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  // Activar/Desactivar usuario
  async toggleUserStatus(req, res, next) {
    try {
      const { id } = req.params;
      const updatedUser = await userService.toggleStatus(id);
      
      res.json({
        message: `Usuario ${updatedUser.activo ? 'activado' : 'desactivado'} exitosamente`,
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener perfil del usuario autenticado
  async getProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await userService.findOne(userId);
      
      res.json({
        message: 'Perfil obtenido exitosamente',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  // Actualizar perfil del usuario autenticado
  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const userData = req.body;
      
      // Remover campos que no se pueden actualizar desde el perfil
      delete userData.id_rol;
      delete userData.activo;
      delete userData.password_hash;
      
      const updatedUser = await userService.update(userId, userData);
      
      res.json({
        message: 'Perfil actualizado exitosamente',
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener usuarios por rol
  async getUsersByRole(req, res, next) {
    try {
      const { roleId } = req.params;
      const { activo = true } = req.query;
      
      const users = await userService.findByRole(roleId, activo === 'true');
      
      res.json({
        message: 'Usuarios obtenidos exitosamente',
        data: users
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener estadísticas de usuarios
  async getUserStats(req, res, next) {
    try {
      const stats = await userService.getStats();
      
      res.json({
        message: 'Estadísticas obtenidas exitosamente',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;