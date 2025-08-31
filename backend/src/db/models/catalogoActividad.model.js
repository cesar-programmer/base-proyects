import { Model, DataTypes } from 'sequelize';

const CATALOGO_ACTIVIDADES_TABLE = 'catalogo_actividades';

const CatalogoActividadSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field: 'id'
  },
  titulo: {
    allowNull: false,
    type: DataTypes.STRING(255),
    comment: 'Título de la actividad predefinida'
  },
  descripcion: {
    allowNull: true,
    type: DataTypes.TEXT,
    comment: 'Descripción de la actividad'
  },
  categoria: {
    allowNull: false,
    type: DataTypes.ENUM('DOCENCIA', 'INVESTIGACION', 'TUTORIAS', 'GESTION_ACADEMICA', 'EXTENSION', 'CAPACITACION'),
    comment: 'Categoría de la actividad'
  },
  horas_estimadas: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'horas_estimadas',
    comment: 'Horas estimadas para la actividad'
  },
  activo: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Si la actividad del catálogo está disponible'
  },
  fecha_creacion: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'fecha_creacion'
  }
};

class CatalogoActividad extends Model {
  static associate(models) {
    // Comentado temporalmente - no hay relación directa con Actividades
    // this.hasMany(models.Actividad, {
    //   as: 'actividades',
    //   foreignKey: 'id_catalogo'
    // });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CATALOGO_ACTIVIDADES_TABLE,
      modelName: 'CatalogoActividad',
      timestamps: false,
      comment: 'Catálogo de actividades predefinidas que los docentes pueden seleccionar'
    };
  }
}

export { CATALOGO_ACTIVIDADES_TABLE, CatalogoActividadSchema, CatalogoActividad };
