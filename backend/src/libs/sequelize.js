import { Sequelize } from 'sequelize';
import { config } from '../config/config.js';
import { setupUserModel } from '../db/models/index.js';
// sequelize es un ORM que permite interactuar con la base de datos de una forma mas sencilla
// aqui impotamos el cliente de sequelize y la configuracion de la base de datos que esta en el archivo config.js

// aqui se configura la base de datos
const USER = encodeURIComponent(config.dbUser);
// encodeURIComponent es para que si el usuario tiene caracteres especiales, no se rompa la conexion
// protege la conexion a la base de datos de ataques de inyeccion de codigo sql y de ataques de cross site scripting
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

const sequelize = new Sequelize(URI, {
  dialect: 'postgres',
  logging: true
});

// aqui se configura el modelo de la base de datos
setupUserModel(sequelize);

// aqui se guardan todos los modelos de la base de datos en una variable para poder acceder a ellos desde cualquier parte de la aplicacion
const models = sequelize.models;

export { sequelize, models };
