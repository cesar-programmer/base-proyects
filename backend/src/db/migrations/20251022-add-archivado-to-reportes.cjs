'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Reportes', 'archivado', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.addColumn('Reportes', 'archivadoAt', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Reportes', 'archivadoPorId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Usuarios',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Reportes', 'archivadoPorId');
    await queryInterface.removeColumn('Reportes', 'archivadoAt');
    await queryInterface.removeColumn('Reportes', 'archivado');
  }
};