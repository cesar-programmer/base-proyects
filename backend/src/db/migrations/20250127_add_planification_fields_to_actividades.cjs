const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
  await queryInterface.addColumn('Actividades', 'estado_planificacion', {
    type: DataTypes.ENUM('borrador', 'enviada', 'aprobada', 'rechazada'),
    allowNull: true,
    defaultValue: 'borrador',
    after: 'fecha_revision'
  });

  await queryInterface.addColumn('Actividades', 'periodo_planificacion', {
    type: DataTypes.STRING(50),
    allowNull: true,
    after: 'estado_planificacion'
  });

  await queryInterface.addColumn('Actividades', 'observaciones_planificacion', {
    type: DataTypes.TEXT,
    allowNull: true,
    after: 'periodo_planificacion'
  });

  await queryInterface.addColumn('Actividades', 'fecha_envio_planificacion', {
    type: DataTypes.DATE,
    allowNull: true,
    after: 'observaciones_planificacion'
  });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Actividades', 'fecha_envio_planificacion');
    await queryInterface.removeColumn('Actividades', 'observaciones_planificacion');
    await queryInterface.removeColumn('Actividades', 'periodo_planificacion');
    await queryInterface.removeColumn('Actividades', 'estado_planificacion');
  }
};