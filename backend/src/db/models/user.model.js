import { Model, DataTypes } from 'sequelize';

const USUARIOS_TABLE = 'Usuarios';

const UserSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING(100)
  },
  apellido: {
    allowNull: false,
    type: DataTypes.STRING(100)
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING(150),
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING(255)
  },
  telefono: {
    allowNull: true,
    type: DataTypes.STRING(20)
  },
  cedula: {
    allowNull: false,
    type: DataTypes.STRING(20),
    unique: true
  },
  fechaNacimiento: {
    allowNull: true,
    type: DataTypes.DATE
  },
  direccion: {
    allowNull: true,
    type: DataTypes.TEXT
  },
  activo: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  ultimoAcceso: {
    allowNull: true,
    type: DataTypes.DATE
  },
  rolId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'Roles',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
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

class User extends Model {
  static associate(models) {
    // Un usuario pertenece a un rol
    this.belongsTo(models.Role, {
      as: 'rol',
      foreignKey: 'rolId'
    });
    
    // Un usuario puede crear muchos reportes
    this.hasMany(models.Reporte, {
      as: 'reportes',
      foreignKey: 'usuarioId'
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
    
    // Un usuario puede subir muchos archivos
    this.hasMany(models.Archivo, {
      as: 'archivosSubidos',
      foreignKey: 'usuarioSubida'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USUARIOS_TABLE,
      modelName: 'User',
      timestamps: true,
      comment: 'Tabla central de usuarios del sistema.'
    };
  }
}

export { USUARIOS_TABLE, UserSchema, User };
