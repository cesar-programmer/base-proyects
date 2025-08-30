const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { validatorHandler } = require('../middleware/validation_handler');
const { loginSchema, registerSchema, changePasswordSchema } = require('../schemas/auth.schema');

const router = express.Router();
const authController = new AuthController();

// Rutas públicas
router.post('/login', 
  validatorHandler(loginSchema, 'body'),
  authController.login.bind(authController)
);

router.post('/register',
  validatorHandler(registerSchema, 'body'),
  authController.register.bind(authController)
);

router.post('/verify-token',
  authController.verifyToken.bind(authController)
);

// Rutas protegidas
router.post('/change-password',
  verifyToken,
  validatorHandler(changePasswordSchema, 'body'),
  authController.changePassword.bind(authController)
);

router.post('/logout',
  verifyToken,
  authController.logout.bind(authController)
);

module.exports = router;