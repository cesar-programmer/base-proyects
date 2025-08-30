import { Model, DataTypes } from 'sequelize';

const PERIODOS_ACADEMICOS_TABLE = 'periodos_academicos';

const PeriodoAcademicoSchema = {
  id_periodo: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field: 'id_periodo'
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING(50),
    unique: true,
    comment: 'Ej: "2025-1", "2025-2"'
  },
  fecha_inicio_plan: {
    allowNull: false,
    type: DataTypes.DATEONLY,
    field: 'fecha_inicio_plan',
    comment: 'Inicio del periodo para registrar actividades planificadas'
  },
  fecha_fin_plan: {
    allowNull: false,
    type: DataTypes.DATEONLY,
    field: 'fecha_fin_plan',
    comment: 'Fin del periodo para registrar actividades planificadas'
  },
  fecha_inicio_reporte: {
    allowNull: false,
    type: DataTypes.DATEONLY,
    field: 'fecha_inicio_reporte',
    comment: 'Inicio del periodo para reportar actividades realizadas'
  },
  fecha_fin_reporte: {
    allowNull: false,
    type: DataTypes.DATEONLY,
    field: 'fecha_fin_reporte',
    comment: 'Fin del periodo para reportar actividades realizadas'
  },
  activo: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Indica si el periodo es el actual.'
  }
};

class PeriodoAcademico extends Model {
  static associate(models) {
    // Un periodo puede tener muchos reportes
    this.hasMany(models.Reporte, {
      as: 'reportes',
      foreignKey: 'id_periodo'
    });
    
    // Un periodo puede tener muchas fechas límite
    this.hasMany(models.FechaLimite, {
      as: 'fechas_limite',
      foreignKey: 'id_periodo'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PERIODOS_ACADEMICOS_TABLE,
      modelName: 'PeriodoAcademico',
      timestamps: false,
      comment: 'Define los semestres y sus fechas clave.'
    };
  }
}

export { PERIODOS_ACADEMICOS_TABLE, PeriodoAcademicoSchema, PeriodoAcademico };
