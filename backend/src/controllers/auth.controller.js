import boom from '@hapi/boom';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/index.js';
import config from '../config/config.js';

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
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw boom.unauthorized('Credenciales inválidas');
      }

      // Actualizar último login
      await userService.updateLastLogin(user.id);

      // Generar token JWT
      const payload = {
        id: user.id,
        email: user.email,
        rol: user.rol.nombre,
        rolId: user.rolId
      };

      const token = jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn
      });

      // Respuesta sin password
      const { password: userPassword, ...userResponse } = user.toJSON();

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
      userData.password = await bcrypt.hash(userData.password, saltRounds);

      const newUser = await userService.create(userData);
      
      // El servicio ya devuelve el usuario sin password
      const userResponse = newUser;

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

      const { password: userPassword, ...userResponse } = user.toJSON();

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

  // Solicitar recuperación de contraseña
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      // Buscar usuario por email
      const user = await userService.findByEmail(email);
      
      // Por seguridad, siempre responder éxito aunque el usuario no exista
      if (!user) {
        return res.json({
          message: 'Si el correo existe, recibirás un código de recuperación',
          // En un entorno real, aquí se enviaría un email
        });
      }

      // Generar código de 6 dígitos
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Token con expiración de 1 hora
      const resetToken = jwt.sign(
        { email: user.email, code: resetCode },
        config.jwt.secret,
        { expiresIn: '1h' }
      );

      // Guardar token en el usuario
      await userService.saveResetToken(user.id, resetToken, resetCode);

      // En producción, aquí se enviaría un email con el código
      // Por ahora, lo retornamos en la respuesta (solo para desarrollo)
      res.json({
        message: 'Código de recuperación generado',
        // REMOVER EN PRODUCCIÓN - Solo para desarrollo
        resetCode,
        resetToken,
        email: user.email
      });
    } catch (error) {
      next(error);
    }
  }

  // Resetear contraseña con token
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;

      // Verificar token
      let decoded;
      try {
        decoded = jwt.verify(token, config.jwt.secret);
      } catch (error) {
        throw boom.unauthorized('Token inválido o expirado');
      }

      // Buscar usuario por email del token
      const user = await userService.findByEmail(decoded.email);
      
      if (!user) {
        throw boom.notFound('Usuario no encontrado');
      }

      // Verificar que el token coincida con el guardado
      const isValidToken = await userService.verifyResetToken(user.id, token);
      if (!isValidToken) {
        throw boom.unauthorized('Token inválido o ya utilizado');
      }

      // Actualizar contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      await userService.update(user.id, { password: hashedPassword });

      // Limpiar token de reseteo
      await userService.clearResetToken(user.id);

      res.json({
        message: 'Contraseña actualizada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  // Verificar código de recuperación
  async verifyResetCode(req, res, next) {
    try {
      const { email, code } = req.body;

      const user = await userService.findByEmail(email);
      
      if (!user) {
        throw boom.unauthorized('Código inválido');
      }

      const isValid = await userService.verifyResetCode(user.id, code);
      
      if (!isValid) {
        throw boom.unauthorized('Código inválido o expirado');
      }

      // Retornar el token para usar en el reseteo
      res.json({
        message: 'Código válido',
        token: user.resetToken
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;