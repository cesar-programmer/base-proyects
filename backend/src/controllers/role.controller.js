import { RoleService } from '../services/index.js';

// Small change to trigger nodemon restart
class RoleController {
  constructor() {
    this.roleService = new RoleService();
  }

  // Obtener todos los roles
  async getRoles(req, res, next) {
    try {
      const roles = await this.roleService.find();
      res.json({
        message: 'Roles obtenidos exitosamente',
        data: roles
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener un rol por ID
  async getRoleById(req, res, next) {
    try {
      const { id } = req.params;
      const role = await this.roleService.findOne(id);
      res.json({
        message: 'Rol obtenido exitosamente',
        data: role
      });
    } catch (error) {
      next(error);
    }
  }

  // Crear un nuevo rol
  async createRole(req, res, next) {
    try {
      const roleData = req.body;
      const newRole = await this.roleService.create(roleData);
      res.status(201).json({
        message: 'Rol creado exitosamente',
        data: newRole
      });
    } catch (error) {
      next(error);
    }
  }

  // Actualizar un rol
  async updateRole(req, res, next) {
    try {
      const { id } = req.params;
      const roleData = req.body;
      const updatedRole = await this.roleService.update(id, roleData);
      res.json({
        message: 'Rol actualizado exitosamente',
        data: updatedRole
      });
    } catch (error) {
      next(error);
    }
  }

  // Eliminar un rol
  async deleteRole(req, res, next) {
    try {
      const { id } = req.params;
      await this.roleService.delete(id);
      res.json({
        message: 'Rol eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  // Asignar permisos a un rol
  async assignPermissions(req, res, next) {
    try {
      const { id } = req.params;
      const { permissionIds } = req.body;
      const updatedRole = await this.roleService.assignPermissions(id, permissionIds);
      res.json({
        message: 'Permisos asignados exitosamente',
        data: updatedRole
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener permisos de un rol
  async getRolePermissions(req, res, next) {
    try {
      const { id } = req.params;
      const permissions = await this.roleService.getPermissions(id);
      res.json({
        message: 'Permisos del rol obtenidos exitosamente',
        data: permissions
      });
    } catch (error) {
      next(error);
    }
  }
}

export default RoleController;