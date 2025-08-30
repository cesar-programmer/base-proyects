'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        id_rol: 1,
        nombre: 'ADMINISTRADOR',
        descripcion: 'Administrador del sistema con acceso completo a todas las funcionalidades',
        activo: true,
        fecha_creacion: new Date()
      },
      {
        id_rol: 2,
        nombre: 'COORDINADOR',
        descripcion: 'Coordinador académico con permisos de supervisión y gestión de reportes',
        activo: true,
        fecha_creacion: new Date()
      },
      {
        id_rol: 3,
        nombre: 'DOCENTE',
        descripcion: 'Docente con permisos para crear y gestionar sus propios reportes académicos',
        activo: true,
        fecha_creacion: new Date()
      }
    ], {
      ignoreDuplicates: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};