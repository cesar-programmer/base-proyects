import { Model, DataTypes, Sequelize } from 'sequelize';

const REPORTE_ACTIVIDADES_TABLE = 'ReporteActividades';

const ReporteActividadSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  reporteId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'reporteId'
  },
  actividadId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'actividadId'
  },
  orden: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'orden',
    comment: 'Orden de la actividad dentro del reporte'
  },
  observaciones: {
    allowNull: true,
    type: DataTypes.TEXT,
    field: 'observaciones',
    comment: 'Observaciones específicas de la actividad en este reporte'
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'createdAt'
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updatedAt'
  }
};

class ReporteActividad extends Model {
  static associate(models) {
    // Una entrada de ReporteActividad pertenece a un reporte
    this.belongsTo(models.Reporte, {
      as: 'reporte',
      foreignKey: 'reporteId'
    });
    
    // Una entrada de ReporteActividad pertenece a una actividad
    this.belongsTo(models.Actividad, {
      as: 'actividad',
      foreignKey: 'actividadId'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: REPORTE_ACTIVIDADES_TABLE,
      modelName: 'ReporteActividad',
      timestamps: true,
      comment: 'Tabla intermedia para la relación muchos a muchos entre reportes y actividades.'
    };
  }
}

export { REPORTE_ACTIVIDADES_TABLE, ReporteActividadSchema, ReporteActividad };