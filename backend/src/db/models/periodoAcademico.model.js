import { Model, DataTypes } from 'sequelize';

const PERIODOS_ACADEMICOS_TABLE = 'PeriodosAcademicos';

const PeriodoAcademicoSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field: 'id'
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING(50),
    unique: true,
    comment: 'Ej: "2025-1", "2025-2"'
  },
  fechaInicio: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'fechaInicio'
  },
  fechaFin: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'fechaFin'
  },
  descripcion: {
    allowNull: true,
    type: DataTypes.TEXT,
    field: 'descripcion'
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
    // this.hasMany(models.Reporte, {
    //   as: 'reportes',
    //   foreignKey: 'id_periodo'
    // });
    
    // Un periodo puede tener muchas fechas límite
    // this.hasMany(models.FechaLimite, {
    //   as: 'fechas_limite',
    //   foreignKey: 'id_periodo'
    // });
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
