'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Asegurar que la columna id_actividad permita NULL en MySQL
    await queryInterface.sequelize.query(
      'ALTER TABLE `archivos` MODIFY COLUMN `id_actividad` INT NULL;'
    );
  },

  async down(queryInterface, Sequelize) {
    // Revertir: volver a NOT NULL
    await queryInterface.sequelize.query(
      'ALTER TABLE `archivos` MODIFY COLUMN `id_actividad` INT NOT NULL;'
    );
  }
};