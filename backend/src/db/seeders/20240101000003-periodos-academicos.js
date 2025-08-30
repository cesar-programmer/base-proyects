'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('periodos_academicos', [
      {
        id_periodo: 1,
        nombre: '2024-1',
        fecha_inicio: '2024-01-15',
        fecha_fin: '2024-06-30',
        activo: false,
        fecha_creacion: new Date()
      },
      {
        id_periodo: 2,
        nombre: '2024-2',
        fecha_inicio: '2024-07-01',
        fecha_fin: '2024-12-15',
        activo: true,
        fecha_creacion: new Date()
      },
      {
        id_periodo: 3,
        nombre: '2025-1',
        fecha_inicio: '2025-01-15',
        fecha_fin: '2025-06-30',
        activo: false,
        fecha_creacion: new Date()
      }
    ], {
      ignoreDuplicates: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('periodos_academicos', null, {});
  }
};