import { Model, DataTypes } from 'sequelize';
import { USUARIOS_TABLE } from './user.model.js';
import { FECHAS_LIMITE_TABLE } from './fechaLimite.model.js';

const NOTIFICACIONES_TABLE = 'notificaciones';

const NotificacionSchema = {
  id_notificacion: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field: 'id_notificacion'
  },
  id_usuario_destino: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'id_usuario_destino',
    references: {
      model: USUARIOS_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  mensaje: {
    allowNull: false,
    type: DataTypes.TEXT
  },
  tipo: {
    allowNull: false,
    type: DataTypes.ENUM('RECORDATORIO', 'APROBACION', 'DEVOLUCION', 'SISTEMA', 'FECHA_LIMITE'),
    comment: 'Agregado FECHA_LIMITE para recordatorios automáticos'
  },
  leido: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  fecha_creacion: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'fecha_creacion'
  },
  id_fecha_limite: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'id_fecha_limite',
    comment: 'Referencia a la fecha límite si es un recordatorio',
    references: {
      model: FECHAS_LIMITE_TABLE,
      key: 'id_fecha_limite'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
};

class Notificacion extends Model {
  static associate(models) {
    // Una notificación pertenece a un usuario
    this.belongsTo(models.User, {
      as: 'usuario_destino',
      foreignKey: 'id_usuario_destino'
    });
    
    // Una notificación puede estar relacionada con una fecha límite
    this.belongsTo(models.FechaLimite, {
      as: 'fecha_limite',
      foreignKey: 'id_fecha_limite'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: NOTIFICACIONES_TABLE,
      modelName: 'Notificacion',
      timestamps: false,
      comment: 'Notificaciones para los usuarios dentro de la aplicación.'
    };
  }
}

export { NOTIFICACIONES_TABLE, NotificacionSchema, Notificacion };
