const { Model, DataTypes } = require('sequelize');

const CONFIGURACIONES_TABLE = 'configuraciones';

const ConfiguracionSchema = {
  clave: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING(100)
  },
  valor: {
    allowNull: false,
    type: DataTypes.STRING(255)
  },
  descripcion: {
    allowNull: true,
    type: DataTypes.TEXT
  },
  fecha_modificacion: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'fecha_modificacion'
  }
};

class Configuracion extends Model {
  static associate(models) {
    // Este modelo no tiene relaciones con otros modelos
    // Es una tabla de configuración global del sistema
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CONFIGURACIONES_TABLE,
      modelName: 'Configuracion',
      timestamps: false,
      comment: 'Almacena configuraciones globales del sistema. Ej: min_actividades, email_admin'
    };
  }
}

module.exports = { CONFIGURACIONES_TABLE, ConfiguracionSchema, Configuracion };
