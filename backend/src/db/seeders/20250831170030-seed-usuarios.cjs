'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash de contraseñas
    const saltRounds = 10;
    const adminPassword = await bcrypt.hash('admin123', saltRounds);
    const coordinadorPassword = await bcrypt.hash('coord123', saltRounds);
    const docentePassword = await bcrypt.hash('docente123', saltRounds);

    // Obtener los IDs de los roles
    const roles = await queryInterface.sequelize.query(
      "SELECT id, nombre FROM Roles ORDER BY id",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const rolMap = {};
    roles.forEach(rol => {
      rolMap[rol.nombre] = rol.id;
    });

    await queryInterface.bulkInsert('Usuarios', [
      {
        nombre: 'Administrador',
        apellido: 'Sistema',
        email: 'admin@universidad.edu',
        password: adminPassword,
        telefono: '3001234567',
        cedula: '12345678',
        direccion: 'Campus Universitario',
        fechaNacimiento: '1980-01-01',
        activo: true,
        rolId: rolMap['ADMINISTRADOR'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'María',
        apellido: 'González',
        email: 'maria.gonzalez@universidad.edu',
        password: coordinadorPassword,
        telefono: '3007654321',
        cedula: '87654321',
        direccion: 'Calle 123 #45-67',
        fechaNacimiento: '1985-03-15',
        activo: true,
        rolId: rolMap['COORDINADOR'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Carlos',
        apellido: 'Rodríguez',
        email: 'carlos.rodriguez@universidad.edu',
        password: docentePassword,
        telefono: '3009876543',
        cedula: '11223344',
        direccion: 'Carrera 89 #12-34',
        fechaNacimiento: '1978-07-22',
        activo: true,
        rolId: rolMap['DOCENTE'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Ana',
        apellido: 'Martínez',
        email: 'ana.martinez@universidad.edu',
        password: docentePassword,
        telefono: '3005432109',
        cedula: '44332211',
        direccion: 'Avenida 56 #78-90',
        fechaNacimiento: '1982-11-08',
        activo: true,
        rolId: rolMap['DOCENTE'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Luis',
        apellido: 'Pérez',
        email: 'luis.perez@universidad.edu',
        password: docentePassword,
        telefono: '3002468135',
        cedula: '55667788',
        direccion: 'Diagonal 34 #56-78',
        fechaNacimiento: '1975-05-30',
        activo: true,
        rolId: rolMap['DOCENTE'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Usuarios', null, {});
  }
};