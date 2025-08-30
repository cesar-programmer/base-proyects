const express = require('express');
const UserController = require('../controllers/user.controller');
const { verifyToken, checkAdmin, checkDocenteOrAdmin } = require('../middleware/auth.middleware');
const { validatorHandler } = require('../middleware/validation_handler');
const { 
  createUserSchema, 
  updateUserSchema, 
  getUserSchema,
  updateProfileSchema,
  getUsersByRoleSchema
} = require('../schemas/user.schema');

const router = express.Router();
const userController = new UserController();

// Rutas protegidas para todos los usuarios autenticados
router.get('/profile',
  verifyToken,
  userController.getProfile.bind(userController)
);

router.put('/profile',
  verifyToken,
  validatorHandler(updateProfileSchema, 'body'),
  userController.updateProfile.bind(userController)
);

// Rutas para docentes y administradores
router.get('/by-role/:roleId',
  verifyToken,
  checkDocenteOrAdmin,
  validatorHandler(getUsersByRoleSchema, 'params'),
  userController.getUsersByRole.bind(userController)
);

// Rutas solo para administradores
router.get('/',
  verifyToken,
  checkAdmin,
  userController.getUsers.bind(userController)
);

router.get('/stats',
  verifyToken,
  checkAdmin,
  userController.getUserStats.bind(userController)
);

router.get('/:id',
  verifyToken,
  checkAdmin,
  validatorHandler(getUserSchema, 'params'),
  userController.getUser.bind(userController)
);

router.post('/',
  verifyToken,
  checkAdmin,
  validatorHandler(createUserSchema, 'body'),
  userController.createUser.bind(userController)
);

router.put('/:id',
  verifyToken,
  checkAdmin,
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  userController.updateUser.bind(userController)
);

router.delete('/:id',
  verifyToken,
  checkAdmin,
  validatorHandler(getUserSchema, 'params'),
  userController.deleteUser.bind(userController)
);

router.patch('/:id/toggle-status',
  verifyToken,
  checkAdmin,
  validatorHandler(getUserSchema, 'params'),
  userController.toggleUserStatus.bind(userController)
);

module.exports = router;