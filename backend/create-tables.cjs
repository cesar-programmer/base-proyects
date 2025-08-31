async function createTables() {
  const { sequelize } = await import('./src/db/models/index.js');
  try {
    // Crear tabla catalogo_actividades
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS catalogo_actividades (
        id_catalogo INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT,
        categoria ENUM('DOCENCIA', 'INVESTIGACION', 'TUTORIAS', 'GESTION_ACADEMICA', 'EXTENSION', 'CAPACITACION', 'POSGRADO', 'OTRO') NOT NULL,
        horas_estimadas INT,
        activo BOOLEAN NOT NULL DEFAULT TRUE,
        fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Tabla catalogo_actividades creada exitosamente');
    
    // Crear tabla actividades
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS actividades (
        id_actividad INT AUTO_INCREMENT PRIMARY KEY,
        id_reporte INT NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT,
        categoria ENUM('DOCENCIA', 'INVESTIGACION', 'TUTORIAS', 'GESTION_ACADEMICA', 'EXTENSION', 'CAPACITACION', 'POSGRADO', 'OTRO') NOT NULL,
        es_personalizada BOOLEAN NOT NULL DEFAULT TRUE,
        id_catalogo INT,
        fecha_inicio_estimada DATE,
        fecha_fin_estimada DATE,
        horas_estimadas INT,
        estado_realizado ENUM('COMPLETADA', 'INCOMPLETA', 'NO_REALIZADA'),
        fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_reporte) REFERENCES reportes(id_reporte) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (id_catalogo) REFERENCES catalogo_actividades(id_catalogo) ON DELETE SET NULL ON UPDATE CASCADE
      )
    `);
    
    console.log('Tabla actividades creada exitosamente');
    
    // Insertar registros en SequelizeMeta para marcar las migraciones como ejecutadas
    await sequelize.query(`
      INSERT IGNORE INTO SequelizeMeta (name) VALUES 
      ('20250831151735-create-catalogo-actividades.cjs'),
      ('20250831151645-create-actividades.cjs')
    `);
    
    console.log('Migraciones marcadas como ejecutadas');
    
  } catch (error) {
    console.error('Error creando tablas:', error);
  } finally {
    await sequelize.close();
  }
}

createTables();