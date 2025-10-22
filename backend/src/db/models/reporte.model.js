import { Model, DataTypes } from 'sequelize';
import { USUARIOS_TABLE } from './user.model.js';

const REPORTES_TABLE = 'Reportes';

const ReporteSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  titulo: {
    allowNull: false,
    type: DataTypes.STRING(200)
  },
  descripcion: {
    allowNull: false,
    type: DataTypes.TEXT
  },
  resumenEjecutivo: {
    allowNull: true,
    type: DataTypes.TEXT,
    comment: 'Resumen ejecutivo del reporte con puntos principales y conclusiones'
  },
  fechaRealizacion: {
    allowNull: false,
    type: DataTypes.DATE
  },
  participantesReales: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  total_horas: {
    allowNull: true,
    type: DataTypes.DECIMAL(6,2),
    comment: 'Total de horas dedicadas sumadas de las actividades vinculadas'
  },
  resultados: {
    allowNull: true,
    type: DataTypes.TEXT
  },
  observaciones: {
    allowNull: true,
    type: DataTypes.TEXT
  },
  recomendaciones: {
    allowNull: true,
    type: DataTypes.TEXT
  },
  estado: {
    allowNull: false,
    type: DataTypes.ENUM('borrador', 'enviado', 'revisado', 'aprobado', 'devuelto'),
    defaultValue: 'borrador'
  },
  evidencias: {
    allowNull: true,
    type: DataTypes.JSON
  },
  fechaEnvio: {
    allowNull: true,
    type: DataTypes.DATE
  },
  fechaRevision: {
    allowNull: true,
    type: DataTypes.DATE
  },
  comentariosRevision: {
    allowNull: true,
    type: DataTypes.TEXT
  },
  actividadId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: 'Actividades',
      key: 'id'
    }
  },
  usuarioId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: USUARIOS_TABLE,
      key: 'id'
    }
  },
  revisadoPorId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: USUARIOS_TABLE,
      key: 'id'
    }
  },
  archivado: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  archivadoAt: {
    allowNull: true,
    type: DataTypes.DATE
  },
  archivadoPorId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: USUARIOS_TABLE,
      key: 'id'
    }
  },

};

class Reporte extends Model {
  static associate(models) {
    // Un reporte pertenece a un usuario
    this.belongsTo(models.User, {
      as: 'usuario',
      foreignKey: 'usuarioId'
    });
    
    // Un reporte puede ser revisado por un usuario
    this.belongsTo(models.User, {
      as: 'revisadoPor',
      foreignKey: 'revisadoPorId'
    });
    
    // Un reporte pertenece a una actividad (relación original - mantener para compatibilidad)
    this.belongsTo(models.Actividad, {
      as: 'actividad',
      foreignKey: 'actividadId',
      allowNull: true
    });
    
    // Un reporte puede tener muchas actividades (nueva relación muchos a muchos)
    this.belongsToMany(models.Actividad, {
      through: models.ReporteActividad,
      as: 'actividades',
      foreignKey: 'reporteId',
      otherKey: 'actividadId'
    });
    
    // Un reporte puede tener muchos archivos adjuntos
    this.hasMany(models.Archivo, {
      as: 'archivos',
      foreignKey: 'reporteId'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: REPORTES_TABLE,
      modelName: 'Reporte',
      timestamps: true,
      comment: 'Representa cada reporte de actividad realizada.'
    };
  }
}

export { REPORTES_TABLE, ReporteSchema, Reporte };
