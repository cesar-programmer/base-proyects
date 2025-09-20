import { Model, DataTypes } from 'sequelize';
import { REPORTES_TABLE } from './reporte.model.js';
import { CATALOGO_ACTIVIDADES_TABLE } from './catalogoActividad.model.js';

const ACTIVIDADES_TABLE = 'Actividades';

const ActividadSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field: 'id'
  },
  usuarioId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'usuarioId'
  },
  periodoAcademicoId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'periodoAcademicoId'
  },
  titulo: {
    allowNull: false,
    type: DataTypes.STRING(255)
  },
  descripcion: {
    allowNull: true,
    type: DataTypes.TEXT
  },
  categoria: {
    allowNull: false,
    type: DataTypes.ENUM('DOCENCIA', 'INVESTIGACION', 'TUTORIAS', 'GESTION_ACADEMICA', 'EXTENSION', 'CAPACITACION', 'POSGRADO', 'OTRO'),
    comment: 'Agregadas EXTENSION y CAPACITACION para coincidir con las vistas'
  },


  fechaInicio: {
    allowNull: true,
    type: DataTypes.DATEONLY,
    field: 'fechaInicio'
  },
  fechaFin: {
    allowNull: true,
    type: DataTypes.DATEONLY,
    field: 'fechaFin'
  },
  ubicacion: {
    allowNull: true,
    type: DataTypes.STRING(255),
    field: 'ubicacion'
  },
  presupuesto: {
    allowNull: true,
    type: DataTypes.DECIMAL(10,2),
    field: 'presupuesto'
  },
  participantesEsperados: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'participantesEsperados'
  },
  archivoAdjunto: {
    allowNull: true,
    type: DataTypes.STRING(255),
    field: 'archivoAdjunto'
  },
  estado_realizado: {
    allowNull: true,
    type: DataTypes.ENUM('pendiente', 'aprobada', 'devuelta'),
    defaultValue: 'pendiente',
    field: 'estado_realizado'
  },
  comentarios_revision: {
    allowNull: true,
    type: DataTypes.TEXT,
    field: 'comentarios_revision'
  },
  fecha_revision: {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'fecha_revision'
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

class Actividad extends Model {
  static associate(models) {
    // Una actividad pertenece a un usuario
    this.belongsTo(models.User, {
      as: 'usuario',
      foreignKey: 'usuarioId'
    });
    
    // Una actividad pertenece a un periodo académico
    this.belongsTo(models.PeriodoAcademico, {
      as: 'periodoAcademico',
      foreignKey: 'periodoAcademicoId'
    });
    
    // Una actividad puede tener muchos reportes
    this.hasMany(models.Reporte, {
      as: 'reportes',
      foreignKey: 'actividadId'
    });
    
    // Una actividad puede tener muchos archivos
    this.hasMany(models.Archivo, {
      as: 'archivos',
      foreignKey: 'actividadId'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: 'Actividades',
      modelName: 'Actividad',
      timestamps: true,
      comment: 'Actividades académicas del sistema.'
    };
  }
}

export { ACTIVIDADES_TABLE, ActividadSchema, Actividad };
