import { Router } from 'express';
import RoleController from '../controllers/role.controller.js';
import { verifyToken, checkAdmin } from '../middleware/auth.middleware.js';

const router = Router();
const roleController = new RoleController();

// Aplicar autenticación a todas las rutas
router.use(verifyToken);

// Rutas para roles (solo administradores pueden gestionar roles)
router.get('/', roleController.getRoles.bind(roleController));
router.get('/:id', roleController.getRoleById.bind(roleController));
router.post('/', checkAdmin, roleController.createRole.bind(roleController));
router.put('/:id', checkAdmin, roleController.updateRole.bind(roleController));
router.delete('/:id', checkAdmin, roleController.deleteRole.bind(roleController));

// Rutas para gestión de permisos de roles
router.post('/:id/permissions', checkAdmin, roleController.assignPermissions.bind(roleController));
router.get('/:id/permissions', roleController.getRolePermissions.bind(roleController));

export default router;