const { Model, DataTypes } = require('sequelize');
const { PERIODOS_ACADEMICOS_TABLE } = require('./periodoAcademico.model');

const FECHAS_LIMITE_TABLE = 'fechas_limite';

const FechaLimiteSchema = {
  id_fecha_limite: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field: 'id_fecha_limite'
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING(255),
    comment: 'Ej: "Registro de actividades planificadas"'
  },
  descripcion: {
    allowNull: true,
    type: DataTypes.TEXT,
    comment: 'Descripción detallada de la fecha límite'
  },
  fecha_limite: {
    allowNull: false,
    type: DataTypes.DATEONLY,
    field: 'fecha_limite',
    comment: 'Fecha límite específica'
  },
  categoria: {
    allowNull: false,
    type: DataTypes.ENUM('REGISTRO', 'ENTREGA', 'REVISION', 'EVALUACION'),
    comment: 'Tipo de fecha límite'
  },
  id_periodo: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'id_periodo',
    comment: 'Periodo académico al que pertenece',
    references: {
      model: PERIODOS_ACADEMICOS_TABLE,
      key: 'id_periodo'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  semestre: {
    allowNull: true,
    type: DataTypes.STRING(10),
    comment: 'Semestre específico (ej: "2024-2") para mejor identificación'
  },
  dias_recordatorio: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 7,
    field: 'dias_recordatorio',
    comment: 'Días antes para enviar recordatorio'
  },
  activo: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Si la fecha límite está vigente'
  },
  fecha_creacion: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'fecha_creacion'
  },
  fecha_modificacion: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'fecha_modificacion'
  }
};

class FechaLimite extends Model {
  static associate(models) {
    // Una fecha límite pertenece a un periodo académico
    this.belongsTo(models.PeriodoAcademico, {
      as: 'periodo',
      foreignKey: 'id_periodo'
    });
    
    // Una fecha límite puede generar muchas notificaciones
    this.hasMany(models.Notificacion, {
      as: 'notificaciones',
      foreignKey: 'id_fecha_limite'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: FECHAS_LIMITE_TABLE,
      modelName: 'FechaLimite',
      timestamps: false,
      comment: 'Fechas límite configurables del sistema para diferentes actividades'
    };
  }
}

module.exports = { FECHAS_LIMITE_TABLE, FechaLimiteSchema, FechaLimite };
