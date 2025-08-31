CREATE DATABASE IF NOT EXISTS reportesdb;
USE reportesdb;

-- Tabla de roles
CREATE TABLE IF NOT EXISTS Roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    cedula VARCHAR(20) NOT NULL UNIQUE,
    fechaNacimiento DATE,
    direccion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    ultimoAcceso TIMESTAMP NULL,
    rolId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rolId) REFERENCES Roles(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Tabla de reportes
CREATE TABLE IF NOT EXISTS Reportes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    estado ENUM('borrador', 'enviado', 'aprobado', 'rechazado') DEFAULT 'borrador',
    usuarioId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuarioId) REFERENCES Usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Índices
CREATE INDEX idx_reportes_usuario ON Reportes(usuarioId);
CREATE INDEX idx_reportes_estado ON Reportes(estado);

-- Insertar datos de prueba
INSERT INTO Roles (nombre, descripcion) VALUES
('Administrador', 'Acceso completo al sistema'),
('Docente', 'Puede crear y gestionar reportes'),
('Coordinador', 'Puede revisar y aprobar reportes');

INSERT INTO Usuarios (nombre, apellido, email, password, cedula, rolId) VALUES
('Admin', 'Sistema', 'admin@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '12345678', 1),
('Test', 'User', 'test@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '87654321', 2);