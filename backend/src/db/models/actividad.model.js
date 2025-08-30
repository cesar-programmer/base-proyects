import { Model, DataTypes } from 'sequelize';
import { REPORTES_TABLE } from './reporte.model.js';
import { CATALOGO_ACTIVIDADES_TABLE } from './catalogoActividad.model.js';

const ACTIVIDADES_TABLE = 'actividades';

const ActividadSchema = {
  id_actividad: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field: 'id_actividad'
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
  es_personalizada: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'es_personalizada',
    comment: 'TRUE si fue agregada por el docente, FALSE si viene del catálogo.'
  },
  id_catalogo: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'id_catalogo',
    comment: 'Referencia a la actividad del catálogo si no es personalizada',
    references: {
      model: CATALOGO_ACTIVIDADES_TABLE,
      key: 'id_catalogo'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  fecha_inicio_estimada: {
    allowNull: true,
    type: DataTypes.DATEONLY,
    field: 'fecha_inicio_estimada'
  },
  fecha_fin_estimada: {
    allowNull: true,
    type: DataTypes.DATEONLY,
    field: 'fecha_fin_estimada'
  },
  horas_estimadas: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'horas_estimadas'
  },
  estado_realizado: {
    allowNull: true,
    type: DataTypes.ENUM('COMPLETADA', 'INCOMPLETA', 'NO_REALIZADA'),
    field: 'estado_realizado',
    comment: 'Se usa en el reporte de actividades realizadas.'
  },
  fecha_creacion: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'fecha_creacion'
  }
};

class Actividad extends Model {
  static associate(models) {
    // Una actividad pertenece a un reporte
    this.belongsTo(models.Reporte, {
      as: 'reporte',
      foreignKey: 'id_reporte'
    });
    
    // Una actividad puede referenciar una actividad del catálogo
    this.belongsTo(models.CatalogoActividad, {
      as: 'catalogo',
      foreignKey: 'id_catalogo'
    });
    
    // Una actividad puede tener muchos archivos
    this.hasMany(models.Archivo, {
      as: 'archivos',
      foreignKey: 'id_actividad'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ACTIVIDADES_TABLE,
      modelName: 'Actividad',
      timestamps: false,
      comment: 'Cada una de las actividades registradas dentro de un reporte.'
    };
  }
}

export { ACTIVIDADES_TABLE, ActividadSchema, Actividad };
