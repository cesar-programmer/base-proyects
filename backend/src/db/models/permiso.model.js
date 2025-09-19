import { Model, DataTypes } from 'sequelize';

const PERMISOS_TABLE = 'Permisos';

const PermisoSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
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
  },
  modulo: {
    allowNull: false,
    type: DataTypes.STRING(50)
  },
  accion: {
    allowNull: false,
    type: DataTypes.STRING(50)
  },
  activo: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
};

class Permiso extends Model {
  static associate(models) {
    // Un permiso puede pertenecer a muchos roles (N:M)
    this.belongsToMany(models.Role, {
      as: 'roles',
      through: 'RolPermisos',
      foreignKey: 'permisoId',
      otherKey: 'rolId'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PERMISOS_TABLE,
      modelName: 'Permiso',
      timestamps: true,
      comment: 'Catálogo de permisos específicos.'
    };
  }
}

export { PERMISOS_TABLE, PermisoSchema, Permiso };
