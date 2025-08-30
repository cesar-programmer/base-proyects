import { Model, DataTypes } from 'sequelize';
import { USUARIOS_TABLE } from './user.model.js';
import { PERIODOS_ACADEMICOS_TABLE } from './periodoAcademico.model.js';

const REPORTES_TABLE = 'reportes';

const ReporteSchema = {
  id_reporte: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field: 'id_reporte'
  },
  id_docente: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'id_docente',
    references: {
      model: USUARIOS_TABLE,
      key: 'id_usuario'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  id_periodo: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'id_periodo',
    references: {
      model: PERIODOS_ACADEMICOS_TABLE,
      key: 'id_periodo'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },
  tipo: {
    allowNull: false,
    type: DataTypes.ENUM('PLANIFICACION', 'REALIZADO'),
    comment: 'Tipo de reporte'
  },
  estado: {
    allowNull: false,
    type: DataTypes.ENUM('BORRADOR', 'EN_REVISION', 'APROBADO', 'DEVUELTO', 'PENDIENTE'),
    defaultValue: 'BORRADOR',
    comment: 'Estado del reporte - agregado PENDIENTE para las vistas'
  },
  fecha_creacion: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'fecha_creacion'
  },
  fecha_envio: {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'fecha_envio'
  },
  fecha_ultima_modificacion: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'fecha_ultima_modificacion'
  },
  observaciones_admin: {
    allowNull: true,
    type: DataTypes.TEXT,
    field: 'observaciones_admin',
    comment: 'Comentarios del admin cuando devuelve un reporte.'
  },
  semestre: {
    allowNull: true,
    type: DataTypes.STRING(10),
    comment: 'Semestre específico del reporte (ej: "2024-2")'
  }
};

class Reporte extends Model {
  static associate(models) {
    // Un reporte pertenece a un docente
    this.belongsTo(models.User, {
      as: 'docente',
      foreignKey: 'id_docente'
    });
    
    // Un reporte pertenece a un periodo académico
    this.belongsTo(models.PeriodoAcademico, {
      as: 'periodo',
      foreignKey: 'id_periodo'
    });
    
    // Un reporte puede tener muchas actividades
    this.hasMany(models.Actividad, {
      as: 'actividades',
      foreignKey: 'id_reporte'
    });
    
    // Un reporte puede tener muchos cambios en el historial
    this.hasMany(models.HistorialCambio, {
      as: 'historial_cambios',
      foreignKey: 'id_reporte'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: REPORTES_TABLE,
      modelName: 'Reporte',
      timestamps: false,
      comment: 'Representa cada formulario/reporte que un docente crea por semestre.'
    };
  }
}

export { REPORTES_TABLE, ReporteSchema, Reporte };
