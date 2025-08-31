'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener los IDs de los roles
    const roles = await queryInterface.sequelize.query(
      "SELECT id, nombre FROM Roles ORDER BY id",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    // Obtener los IDs de los permisos
    const permisos = await queryInterface.sequelize.query(
      "SELECT id, nombre FROM Permisos ORDER BY id",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    // Crear mapas para facilitar la búsqueda
    const rolMap = {};
    roles.forEach(rol => {
      rolMap[rol.nombre] = rol.id;
    });
    
    const permisoMap = {};
    permisos.forEach(permiso => {
      permisoMap[permiso.nombre] = permiso.id;
    });
    
    const rolPermisos = [];
    
    // ADMINISTRADOR - Todos los permisos
    const adminId = rolMap['ADMINISTRADOR'];
    permisos.forEach(permiso => {
      rolPermisos.push({
        rolId: adminId,
        permisoId: permiso.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    
    // COORDINADOR - Permisos de gestión sin eliminar usuarios
    const coordinadorId = rolMap['COORDINADOR'];
    const coordinadorPermisos = [
      'usuarios.crear', 'usuarios.leer', 'usuarios.actualizar',
      'reportes.crear', 'reportes.leer', 'reportes.actualizar', 'reportes.aprobar',
      'actividades.crear', 'actividades.leer', 'actividades.actualizar',
      'configuracion.leer'
    ];
    
    coordinadorPermisos.forEach(nombrePermiso => {
      if (permisoMap[nombrePermiso]) {
        rolPermisos.push({
          rolId: coordinadorId,
          permisoId: permisoMap[nombrePermiso],
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    });
    
    // DOCENTE - Permisos básicos
    const docenteId = rolMap['DOCENTE'];
    const docentePermisos = [
      'usuarios.leer', 'reportes.crear', 'reportes.leer', 'reportes.actualizar',
      'actividades.crear', 'actividades.leer', 'actividades.actualizar'
    ];
    
    docentePermisos.forEach(nombrePermiso => {
      if (permisoMap[nombrePermiso]) {
        rolPermisos.push({
          rolId: docenteId,
          permisoId: permisoMap[nombrePermiso],
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    });
    
    await queryInterface.bulkInsert('RolPermisos', rolPermisos, { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RolPermisos', null, {});
  }
};