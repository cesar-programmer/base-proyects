const { Model, DataTypes } = require('sequelize');

const PERMISOS_TABLE = 'permisos';

const PermisoSchema = {
  id_permiso: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field: 'id_permiso'
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING(100),
    unique: true,
    comment: 'Ej: "REPORTES_APROBAR", "USUARIOS_CREAR"'
  },
  descripcion: {
    allowNull: true,
    type: DataTypes.TEXT
  }
};

class Permiso extends Model {
  static associate(models) {
    // Un permiso puede pertenecer a muchos roles (N:M)
    this.belongsToMany(models.Role, {
      as: 'roles',
      through: 'rol_permiso',
      foreignKey: 'id_permiso',
      otherKey: 'id_rol'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PERMISOS_TABLE,
      modelName: 'Permiso',
      timestamps: false,
      comment: 'Catálogo de permisos específicos.'
    };
  }
}

module.exports = { PERMISOS_TABLE, PermisoSchema, Permiso };
