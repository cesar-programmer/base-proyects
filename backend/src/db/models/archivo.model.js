import { Model, DataTypes } from 'sequelize';
import { ACTIVIDADES_TABLE } from './actividad.model.js';
import { REPORTES_TABLE } from './reporte.model.js';

const ARCHIVOS_TABLE = 'archivos';

const ArchivoSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field: 'id_archivo'
  },
  actividadId: {
    allowNull: true, // Ahora es nullable para permitir archivos de reportes
    type: DataTypes.INTEGER,
    field: 'id_actividad',
    references: {
      model: ACTIVIDADES_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  reporteId: {
    allowNull: true, // Nullable para permitir archivos de actividades
    type: DataTypes.INTEGER,
    field: 'reporteId',
    references: {
      model: REPORTES_TABLE,
      key: 'id'
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
  },
  descripcion: {
    allowNull: true,
    type: DataTypes.TEXT,
    field: 'descripcion',
    comment: 'Descripción opcional del archivo'
  },
  categoria: {
    allowNull: false,
    type: DataTypes.ENUM('evidencia', 'documento', 'imagen', 'otro'),
    defaultValue: 'evidencia',
    field: 'categoria',
    comment: 'Categoría del archivo para organización'
  },
  usuarioSubida: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'usuarioSubida',
    references: {
      model: 'Usuarios',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    comment: 'Usuario que subió el archivo'
  }
};

class Archivo extends Model {
  static associate(models) {
    // Un archivo puede pertenecer a una actividad (nullable)
    this.belongsTo(models.Actividad, {
      as: 'actividad',
      foreignKey: 'actividadId'
    });

    // Un archivo puede pertenecer a un reporte (nullable)
    this.belongsTo(models.Reporte, {
      as: 'reporte',
      foreignKey: 'reporteId'
    });

    // Un archivo fue subido por un usuario
    this.belongsTo(models.User, {
      as: 'usuarioQueSubio',
      foreignKey: 'usuarioSubida'
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
