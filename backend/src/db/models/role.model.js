const { Model, DataTypes } = require('sequelize');
const { ROLES_TABLE } = require('./role.model');

const ROLES_TABLE = 'roles';

const RoleSchema = {
  id_rol: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field: 'id_rol'
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
  }
};

class Role extends Model {
  static associate(models) {
    // Un rol puede tener muchos usuarios
    this.hasMany(models.User, {
      as: 'usuarios',
      foreignKey: 'id_rol'
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
      timestamps: false, // No usamos timestamps automáticos
      comment: 'Catálogo de roles en el sistema.'
    };
  }
}

module.exports = { ROLES_TABLE, RoleSchema, Role };
