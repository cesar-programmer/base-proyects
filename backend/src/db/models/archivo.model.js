import { Model, DataTypes } from 'sequelize';
import { ACTIVIDADES_TABLE } from './actividad.model.js';

const ARCHIVOS_TABLE = 'archivos';

const ArchivoSchema = {
  id_archivo: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field: 'id_archivo'
  },
  id_actividad: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'id_actividad',
    references: {
      model: ACTIVIDADES_TABLE,
      key: 'id_actividad'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  nombre_original: {
    allowNull: false,
    type: DataTypes.STRING(255),
    field: 'nombre_original'
  },
  nombre_almacenado: {
    allowNull: false,
    type: DataTypes.STRING(255),
    unique: true,
    field: 'nombre_almacenado',
    comment: 'Nombre único del archivo en el servidor para evitar colisiones.'
  },
  ruta_almacenamiento: {
    allowNull: false,
    type: DataTypes.STRING(255),
    field: 'ruta_almacenamiento'
  },
  tipo_mime: {
    allowNull: false,
    type: DataTypes.STRING(100),
    field: 'tipo_mime',
    comment: 'Ej: "application/pdf", "image/jpeg"'
  },
  tamano_bytes: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'tamano_bytes'
  },
  fecha_subida: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'fecha_subida'
  }
};

class Archivo extends Model {
  static associate(models) {
    // Un archivo pertenece a una actividad
    this.belongsTo(models.Actividad, {
      as: 'actividad',
      foreignKey: 'id_actividad'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ARCHIVOS_TABLE,
      modelName: 'Archivo',
      timestamps: false,
      comment: 'Almacena la metadata de los archivos de evidencia.'
    };
  }
}

export { ARCHIVOS_TABLE, ArchivoSchema, Archivo };
