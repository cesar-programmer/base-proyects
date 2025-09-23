module.exports = {
  async up(queryInterface, Sequelize) {
    // Primero, hacer que actividadId sea nullable (para permitir archivos sin actividad asociada)
    await queryInterface.changeColumn('archivos', 'id_actividad', {
      allowNull: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'Actividades',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Agregar la columna reporteId (nullable)
    await queryInterface.addColumn('archivos', 'reporteId', {
      allowNull: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'Reportes',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      comment: 'ID del reporte al que pertenece el archivo (nullable para archivos de actividades)'
    });

    // Agregar campos adicionales útiles para archivos de reportes
    await queryInterface.addColumn('archivos', 'descripcion', {
      allowNull: true,
      type: Sequelize.TEXT,
      comment: 'Descripción opcional del archivo'
    });

    await queryInterface.addColumn('archivos', 'categoria', {
      allowNull: false,
      type: Sequelize.ENUM('evidencia', 'documento', 'imagen', 'otro'),
      defaultValue: 'evidencia',
      comment: 'Categoría del archivo para organización'
    });

    await queryInterface.addColumn('archivos', 'usuarioSubida', {
      allowNull: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'Usuarios',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'Usuario que subió el archivo'
    });

    // Crear índices para mejorar el rendimiento
    await queryInterface.addIndex('archivos', ['reporteId'], {
      name: 'idx_archivos_reporte_id'
    });

    await queryInterface.addIndex('archivos', ['categoria'], {
      name: 'idx_archivos_categoria'
    });

    await queryInterface.addIndex('archivos', ['usuarioSubida'], {
      name: 'idx_archivos_usuario_subida'
    });

    // Nota: No agregamos constraint CHECK porque MySQL no permite usar columnas con foreign keys
    // La validación de que un archivo pertenezca a una actividad O a un reporte se hará a nivel de aplicación
  },

  async down(queryInterface, Sequelize) {
    // Eliminar índices
    await queryInterface.removeIndex('archivos', 'idx_archivos_reporte_id');
    await queryInterface.removeIndex('archivos', 'idx_archivos_categoria');
    await queryInterface.removeIndex('archivos', 'idx_archivos_usuario_subida');

    // Eliminar columnas agregadas
    await queryInterface.removeColumn('archivos', 'usuarioSubida');
    await queryInterface.removeColumn('archivos', 'categoria');
    await queryInterface.removeColumn('archivos', 'descripcion');
    await queryInterface.removeColumn('archivos', 'reporteId');

    // Revertir actividadId a NOT NULL
    await queryInterface.changeColumn('archivos', 'id_actividad', {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Actividades',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
};