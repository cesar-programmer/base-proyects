'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash de contraseñas por defecto
    const defaultPassword = await bcrypt.hash('Admin123!', 10);
    const docentePassword = await bcrypt.hash('Docente123!', 10);
    const coordinadorPassword = await bcrypt.hash('Coord123!', 10);

    await queryInterface.bulkInsert('usuarios', [
      {
        id_usuario: 1,
        nombre_completo: 'Administrador del Sistema',
        email: 'admin@universidad.edu',
        password_hash: defaultPassword,
        id_rol: 1, // ADMINISTRADOR
        activo: true,
        fecha_creacion: new Date(),
        ultimo_login: null
      },
      {
        id_usuario: 2,
        nombre_completo: 'Dr. María González',
        email: 'coordinador@universidad.edu',
        password_hash: coordinadorPassword,
        id_rol: 2, // COORDINADOR
        activo: true,
        fecha_creacion: new Date(),
        ultimo_login: null
      },
      {
        id_usuario: 3,
        nombre_completo: 'Prof. Juan Pérez',
        email: 'docente1@universidad.edu',
        password_hash: docentePassword,
        id_rol: 3, // DOCENTE
        activo: true,
        fecha_creacion: new Date(),
        ultimo_login: null
      },
      {
        id_usuario: 4,
        nombre_completo: 'Dra. Ana Rodríguez',
        email: 'docente2@universidad.edu',
        password_hash: docentePassword,
        id_rol: 3, // DOCENTE
        activo: true,
        fecha_creacion: new Date(),
        ultimo_login: null
      },
      {
        id_usuario: 5,
        nombre_completo: 'Prof. Carlos López',
        email: 'docente3@universidad.edu',
        password_hash: docentePassword,
        id_rol: 3, // DOCENTE
        activo: true,
        fecha_creacion: new Date(),
        ultimo_login: null
      }
    ], {
      ignoreDuplicates: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};