const { Model, DataTypes } = require('sequelize');
const { ROLES_TABLE } = require('./role.model');

const USUARIOS_TABLE = 'usuarios';

const UserSchema = {
  id_usuario: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field: 'id_usuario'
  },
  nombre_completo: {
    allowNull: false,
    type: DataTypes.STRING(255)
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING(255),
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    allowNull: false,
    type: DataTypes.STRING(255),
    field: 'password_hash'
  },
  id_rol: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'id_rol',
    references: {
      model: ROLES_TABLE,
      key: 'id_rol'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },
  activo: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  fecha_creacion: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'fecha_creacion'
  },
  ultimo_login: {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'ultimo_login'
  }
};

class User extends Model {
  static associate(models) {
    // Un usuario pertenece a un rol
    this.belongsTo(models.Role, {
      as: 'rol',
      foreignKey: 'id_rol'
    });
    
    // Un usuario puede crear muchos reportes
    this.hasMany(models.Reporte, {
      as: 'reportes',
      foreignKey: 'id_docente'
    });
    
    // Un usuario puede recibir muchas notificaciones
    this.hasMany(models.Notificacion, {
      as: 'notificaciones',
      foreignKey: 'id_usuario_destino'
    });
    
    // Un usuario puede hacer muchos cambios en el historial
    this.hasMany(models.HistorialCambio, {
      as: 'historial_cambios',
      foreignKey: 'id_usuario_modificador'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USUARIOS_TABLE,
      modelName: 'User',
      timestamps: false,
      comment: 'Tabla central de usuarios del sistema.'
    };
  }
}

module.exports = { USUARIOS_TABLE, UserSchema, User };
