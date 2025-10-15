import jwt from 'jsonwebtoken';
import boom from '@hapi/boom';
import config from '../config/config.js';
import { UserService } from '../services/index.js';

const userService = new UserService();

// Middleware para verificar JWT
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw boom.unauthorized('Token de acceso requerido');
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      throw boom.unauthorized('Formato de token inválido');
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Verificar que el usuario aún existe y está activo
    const user = await userService.findOne(decoded.id);
    
    if (!user) {
      throw boom.unauthorized('Usuario no encontrado');
    }
    
    if (!user.activo) {
      throw boom.unauthorized('Usuario inactivo');
    }

    // Agregar información del usuario al request
    req.user = {
      id: user.id,
      email: user.email,
      rol: user.rol.nombre,
      id_rol: user.rolId,
      nombre_completo: `${user.nombre} ${user.apellido}`
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(boom.unauthorized('Token inválido'));
    } else if (error.name === 'TokenExpiredError') {
      next(boom.unauthorized('Token expirado'));
    } else {
      next(error);
    }
  }
};

// Middleware para verificar roles específicos
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw boom.unauthorized('Usuario no autenticado');
      }

      const userRole = req.user.rol;
      
      if (!allowedRoles.includes(userRole)) {
        throw boom.forbidden(`Acceso denegado. Roles permitidos: ${allowedRoles.join(', ')}`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Middleware para verificar que es administrador (incluye coordinadores)
const checkAdmin = checkRole('ADMINISTRADOR', 'COORDINADOR');

// Middleware para verificar que es docente o administrador
const checkDocenteOrAdmin = checkRole('DOCENTE', 'ADMINISTRADOR');

// Middleware para verificar que es coordinador o administrador
const checkCoordinadorOrAdmin = checkRole('COORDINADOR', 'ADMINISTRADOR');

// Middleware para verificar que el usuario puede acceder a sus propios recursos
const checkOwnershipOrAdmin = (getResourceOwnerId) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw boom.unauthorized('Usuario no autenticado');
      }

      // Si es administrador o coordinador, permitir acceso
      if (req.user.rol === 'ADMINISTRADOR' || req.user.rol === 'COORDINADOR') {
        return next();
      }

      // Obtener el ID del propietario del recurso
      const resourceOwnerId = await getResourceOwnerId(req);
      
      if (req.user.id !== resourceOwnerId) {
        throw boom.forbidden('No tienes permisos para acceder a este recurso');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Middleware opcional de autenticación (no falla si no hay token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await userService.findOne(decoded.id);
      
      if (user && user.activo) {
        req.user = {
          id: user.id_usuario,
          email: user.email,
          rol: user.rol.nombre,
          id_rol: user.id_rol,
          nombre_completo: user.nombre_completo
        };
      }
    } catch (tokenError) {
      // Ignorar errores de token en autenticación opcional
    }

    next();
  } catch (error) {
    next(error);
  }
};

export {
  verifyToken,
  checkRole,
  checkAdmin,
  checkDocenteOrAdmin,
  checkCoordinadorOrAdmin,
  checkOwnershipOrAdmin,
  optionalAuth
};