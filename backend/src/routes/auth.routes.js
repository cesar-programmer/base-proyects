import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { validatorHandler } from '../middleware/validation_handler.js';
import { loginSchema, registerSchema, changePasswordSchema } from '../schemas/auth.schema.js';

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

export default router;