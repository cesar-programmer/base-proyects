'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Permisos', [
      // Permisos de Usuarios
      {
        nombre: 'usuarios.crear',
        descripcion: 'Crear nuevos usuarios',
        modulo: 'usuarios',
        accion: 'crear',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'usuarios.leer',
        descripcion: 'Ver información de usuarios',
        modulo: 'usuarios',
        accion: 'leer',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'usuarios.actualizar',
        descripcion: 'Actualizar información de usuarios',
        modulo: 'usuarios',
        accion: 'actualizar',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'usuarios.eliminar',
        descripcion: 'Eliminar usuarios',
        modulo: 'usuarios',
        accion: 'eliminar',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Permisos de Reportes
      {
        nombre: 'reportes.crear',
        descripcion: 'Crear nuevos reportes',
        modulo: 'reportes',
        accion: 'crear',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'reportes.leer',
        descripcion: 'Ver reportes',
        modulo: 'reportes',
        accion: 'leer',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'reportes.actualizar',
        descripcion: 'Actualizar reportes',
        modulo: 'reportes',
        accion: 'actualizar',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'reportes.eliminar',
        descripcion: 'Eliminar reportes',
        modulo: 'reportes',
        accion: 'eliminar',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'reportes.aprobar',
        descripcion: 'Aprobar reportes',
        modulo: 'reportes',
        accion: 'aprobar',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Permisos de Actividades
      {
        nombre: 'actividades.crear',
        descripcion: 'Crear nuevas actividades',
        modulo: 'actividades',
        accion: 'crear',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'actividades.leer',
        descripcion: 'Ver actividades',
        modulo: 'actividades',
        accion: 'leer',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'actividades.actualizar',
        descripcion: 'Actualizar actividades',
        modulo: 'actividades',
        accion: 'actualizar',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'actividades.eliminar',
        descripcion: 'Eliminar actividades',
        modulo: 'actividades',
        accion: 'eliminar',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Permisos de Configuración
      {
        nombre: 'configuracion.leer',
        descripcion: 'Ver configuración del sistema',
        modulo: 'configuracion',
        accion: 'leer',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'configuracion.actualizar',
        descripcion: 'Actualizar configuración del sistema',
        modulo: 'configuracion',
        accion: 'actualizar',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Permisos', null, {});
  }
};