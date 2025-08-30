const boom = require('@hapi/boom');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserService } = require('../services');
const config = require('../config/config');

const userService = new UserService();

class AuthController {
  // Login de usuario
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Buscar usuario por email
      const user = await userService.findByEmail(email);
      if (!user) {
        throw boom.unauthorized('Credenciales inválidas');
      }

      // Verificar si el usuario está activo
      if (!user.activo) {
        throw boom.unauthorized('Usuario inactivo');
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        throw boom.unauthorized('Credenciales inválidas');
      }

      // Actualizar último login
      await userService.updateLastLogin(user.id_usuario);

      // Generar token JWT
      const payload = {
        id: user.id_usuario,
        email: user.email,
        rol: user.rol.nombre,
        id_rol: user.id_rol
      };

      const token = jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn
      });

      // Respuesta sin password
      const { password_hash, ...userResponse } = user.toJSON();

      res.json({
        message: 'Login exitoso',
        user: userResponse,
        token
      });
    } catch (error) {
      next(error);
    }
  }

  // Registro de usuario (solo para administradores)
  async register(req, res, next) {
    try {
      const userData = req.body;
      
      // Hash de la contraseña
      const saltRounds = 10;
      userData.password_hash = await bcrypt.hash(userData.password, saltRounds);
      delete userData.password;

      const newUser = await userService.create(userData);
      
      // Respuesta sin password
      const { password_hash, ...userResponse } = newUser.toJSON();

      res.status(201).json({
        message: 'Usuario creado exitosamente',
        user: userResponse
      });
    } catch (error) {
      next(error);
    }
  }

  // Verificar token
  async verifyToken(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        throw boom.unauthorized('Token no proporcionado');
      }

      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await userService.findOne(decoded.id);

      if (!user || !user.activo) {
        throw boom.unauthorized('Token inválido');
      }

      const { password_hash, ...userResponse } = user.toJSON();

      res.json({
        valid: true,
        user: userResponse
      });
    } catch (error) {
      next(error);
    }
  }

  // Cambiar contraseña
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      await userService.changePassword(userId, currentPassword, newPassword);

      res.json({
        message: 'Contraseña actualizada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  // Logout (invalidar token del lado del cliente)
  async logout(req, res, next) {
    try {
      res.json({
        message: 'Logout exitoso'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;