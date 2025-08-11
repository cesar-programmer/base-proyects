const { Model, DataTypes } = require('sequelize');
const { REPORTES_TABLE } = require('./reporte.model');
const { USUARIOS_TABLE } = require('./user.model');

const HISTORIAL_CAMBIOS_TABLE = 'historial_cambios';

const HistorialCambioSchema = {
  id_historial: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field: 'id_historial'
  },
  id_reporte: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'id_reporte',
    references: {
      model: REPORTES_TABLE,
      key: 'id_reporte'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  id_usuario_modificador: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'id_usuario_modificador',
    references: {
      model: USUARIOS_TABLE,
      key: 'id_usuario'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },
  descripcion_cambio: {
    allowNull: false,
    type: DataTypes.TEXT,
    comment: 'Ej: "Se agregó la actividad X", "Se cambió el estado a APROBADO"'
  },
  fecha_cambio: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'fecha_cambio'
  }
};

class HistorialCambio extends Model {
  static associate(models) {
    // Un cambio en el historial pertenece a un reporte
    this.belongsTo(models.Reporte, {
      as: 'reporte',
      foreignKey: 'id_reporte'
    });
    
    // Un cambio en el historial fue hecho por un usuario
    this.belongsTo(models.User, {
      as: 'usuario_modificador',
      foreignKey: 'id_usuario_modificador'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: HISTORIAL_CAMBIOS_TABLE,
      modelName: 'HistorialCambio',
      timestamps: false,
      comment: 'Tabla de auditoría para rastrear cambios en los reportes.'
    };
  }
}

module.exports = { HISTORIAL_CAMBIOS_TABLE, HistorialCambioSchema, HistorialCambio };
