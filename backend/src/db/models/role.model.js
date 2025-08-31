import { Model, DataTypes } from 'sequelize';

const ROLES_TABLE = 'Roles';

const RoleSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING(50),
    unique: true,
    comment: 'Ej: "Administrador", "Docente"'
  },
  descripcion: {
    allowNull: true,
    type: DataTypes.TEXT
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

class Role extends Model {
  static associate(models) {
    // Un rol puede tener muchos usuarios
    this.hasMany(models.User, {
      as: 'usuarios',
      foreignKey: 'rolId'
    });
    
    // Un rol puede tener muchos permisos (N:M)
    this.belongsToMany(models.Permiso, {
      as: 'permisos',
      through: 'rol_permiso',
      foreignKey: 'id_rol',
      otherKey: 'id_permiso'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ROLES_TABLE,
      modelName: 'Role',
      timestamps: true,
      comment: 'Catálogo de roles en el sistema.'
    };
  }
}

export { ROLES_TABLE, RoleSchema, Role };
