'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('PeriodosAcademicos', [
      {
        nombre: '2024-1',
        descripcion: 'Primer semestre académico 2024',
        fechaInicio: '2024-02-01',
        fechaFin: '2024-06-30',
        activo: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: '2024-2',
        descripcion: 'Segundo semestre académico 2024',
        fechaInicio: '2024-08-01',
        fechaFin: '2024-12-15',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: '2025-1',
        descripcion: 'Primer semestre académico 2025',
        fechaInicio: '2025-02-01',
        fechaFin: '2025-06-30',
        activo: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Intersemestral 2024-2025',
        descripcion: 'Período intersemestral diciembre 2024 - enero 2025',
        fechaInicio: '2024-12-16',
        fechaFin: '2025-01-31',
        activo: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PeriodosAcademicos', null, {});
  }
};