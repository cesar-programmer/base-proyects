# TUTORIAL COMPLETO - SISTEMA DE REPORTES

## CONFIGURACIÓN Y MANEJO DE BASE DE DATOS CON DOCKER

### Arquitectura de la Base de Datos

El proyecto utiliza **MySQL 8.0** como sistema de gestión de base de datos, ejecutándose en un contenedor Docker junto con **phpMyAdmin** para administración web.

#### Servicios Configurados:
- **MySQL**: Base de datos principal en puerto 3306
- **phpMyAdmin**: Interfaz web de administración en puerto 8081
- **Backend**: API Node.js conectada a MySQL
- **Frontend**: Aplicación React (puerto 8082)

### Manual de Procedimientos

#### 1. Requisitos Previos
```bash
# Verificar que Docker esté instalado
docker --version
docker-compose --version
```

#### 2. Configuración de Variables de Entorno
```bash
# Copiar archivo de configuración
cp backend/.env.example backend/.env
```

**Variables importantes en .env:**
```env
# Base de datos
DB_HOST=mysql
DB_PORT=3306
DB_USER=user
DB_PASSWORD=password
DB_NAME=reportesdb

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
JWT_EXPIRES_IN=24h
```

#### 3. Levantar la Base de Datos

**Opción A: Solo base de datos**
```bash
# Levantar solo MySQL y phpMyAdmin
docker-compose up mysql phpmyadmin -d
```

**Opción B: Todos los servicios**
```bash
# Levantar toda la aplicación
docker-compose up -d
```

**Verificar estado de los servicios:**
```bash
docker-compose ps
```

#### 4. Acceso a los Servicios

- **phpMyAdmin**: http://localhost:8081
  - Usuario: `user`
  - Contraseña: `password`
  - Servidor: `mysql`

- **MySQL directo**:
  ```bash
  # Conectar desde línea de comandos
  docker exec -it base-proyects-mysql-1 mysql -u user -p
  ```

- **Backend API**: http://localhost:3000
- **Frontend**: http://localhost:8082

### Persistencia de Datos

#### Volúmenes Docker
Los datos se persisten mediante volúmenes Docker:

```yaml
volumes:
  mysql_data:  # Volumen nombrado para datos MySQL
```

**Ubicación de datos:**
- **Windows**: `C:\\ProgramData\\docker\\volumes\\base-proyects_mysql_data\\_data`
- **Linux/Mac**: `/var/lib/docker/volumes/base-proyects_mysql_data/_data`

#### Comandos de Gestión de Volúmenes

```bash
# Listar volúmenes
docker volume ls

# Inspeccionar volumen específico
docker volume inspect base-proyects_mysql_data

# Backup de la base de datos
docker exec base-proyects-mysql-1 mysqldump -u user -p reportesdb > backup.sql

# Restaurar backup
docker exec -i base-proyects-mysql-1 mysql -u user -p reportesdb < backup.sql
```

### Inicialización y Poblado de Datos

#### Scripts de Inicialización
El archivo `mysql/init/init.sql` se ejecuta automáticamente al crear el contenedor:

```sql
-- Crea la base de datos
CREATE DATABASE IF NOT EXISTS reportesdb;
USE reportesdb;

-- Crea tablas principales
CREATE TABLE users (...)
CREATE TABLE reports (...)

-- Inserta datos de prueba
INSERT INTO users ...
```

#### Migraciones con Sequelize

```bash
# Ejecutar migraciones (desde el backend)
npm run db:migrate

# Ejecutar seeders
npm run db:seed

# Revertir migraciones
npm run db:migrate:undo
```

### Administración con phpMyAdmin

#### Acceso y Configuración
1. Abrir http://localhost:8081
2. Credenciales:
   - **Servidor**: `mysql`
   - **Usuario**: `user`
   - **Contraseña**: `password`

#### Funcionalidades Principales
- **Explorar tablas**: Navegar por la estructura de datos
- **Ejecutar consultas**: Panel SQL para queries personalizadas
- **Importar/Exportar**: Gestión de backups y restauraciones
- **Gestión de usuarios**: Administrar permisos de base de datos
- **Monitoreo**: Ver estadísticas y rendimiento

### Comandos de Mantenimiento

#### Gestión de Contenedores
```bash
# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (¡CUIDADO: Borra datos!)
docker-compose down -v

# Reconstruir contenedores
docker-compose up --build

# Ver logs
docker-compose logs mysql
docker-compose logs phpmyadmin

# Reiniciar servicio específico
docker-compose restart mysql
```

#### Monitoreo y Debugging
```bash
# Verificar salud de MySQL
docker exec base-proyects-mysql-1 mysqladmin ping -h localhost

# Conectar al contenedor MySQL
docker exec -it base-proyects-mysql-1 bash

# Ver configuración de MySQL
docker exec base-proyects-mysql-1 mysql -u root -p -e "SHOW VARIABLES LIKE '%version%';"
```

### Solución de Problemas Comunes

#### Error de Conexión
```bash
# Verificar que MySQL esté corriendo
docker-compose ps mysql

# Verificar logs de errores
docker-compose logs mysql

# Reiniciar MySQL
docker-compose restart mysql
```

#### Problemas de Permisos
```sql
-- Conectar como root y verificar usuarios
SELECT user, host FROM mysql.user;

-- Otorgar permisos si es necesario
GRANT ALL PRIVILEGES ON reportesdb.* TO 'user'@'%';
FLUSH PRIVILEGES;
```

#### Reset Completo
```bash
# Detener todo y eliminar volúmenes
docker-compose down -v

# Eliminar imágenes (opcional)
docker rmi $(docker images -q)

# Levantar desde cero
docker-compose up --build
```

---

## GUÍA COMPLETA DE SCRIPTS NPM

### Scripts de Desarrollo
- **`npm run dev`**: Inicia el servidor en modo desarrollo con nodemon
- **`npm start`**: Inicia el servidor en modo producción

### Scripts de Base de Datos
- **`npm run db:migrate`**: Ejecuta las migraciones de Sequelize
- **`npm run db:seed`**: Ejecuta los seeders para poblar datos
- **`npm run db:migrate:undo`**: Revierte la última migración

### Scripts de Testing
- **`npm test`**: Ejecuta todos los tests con Jest
- **`npm run test:watch`**: Ejecuta tests en modo watch
- **`npm run test:coverage`**: Genera reporte de cobertura

---

## GUÍA COMPLETA DE DEPENDENCIAS

### Dependencias de Producción

#### Frameworks y Librerías Core
- **express** (^4.18.2): Framework web minimalista y flexible para Node.js
- **cors** (^2.8.5): Middleware para habilitar CORS (Cross-Origin Resource Sharing)
- **helmet** (^7.1.0): Middleware de seguridad que establece varios headers HTTP
- **compression** (^1.7.4): Middleware para comprimir respuestas HTTP

#### Base de Datos y ORM
- **mysql2** (^3.6.5): Cliente MySQL para Node.js con soporte para promesas
- **sequelize** (^6.35.2): ORM (Object-Relational Mapping) para Node.js

#### Autenticación y Seguridad
- **bcryptjs** (^2.4.3): Librería para hashear contraseñas de forma segura
- **jsonwebtoken** (^9.0.2): Implementación de JSON Web Tokens para autenticación

#### Validación y Middleware
- **joi** (^17.11.0): Librería de validación de esquemas para JavaScript
- **express-rate-limit** (^7.1.5): Middleware para limitar la tasa de peticiones

#### Utilidades
- **dotenv** (^16.3.1): Carga variables de entorno desde archivo .env
- **winston** (^3.11.0): Librería de logging versátil y configurable

### Dependencias de Desarrollo

#### Testing
- **jest** (^29.7.0): Framework de testing para JavaScript
- **supertest** (^6.3.4): Librería para testing de APIs HTTP

#### Linting y Formateo
- **eslint** (^8.56.0): Herramienta de linting para identificar patrones problemáticos
- **prettier** (^3.1.1): Formateador de código automático
- **eslint-config-prettier** (^9.1.0): Configuración de ESLint compatible con Prettier
- **eslint-plugin-prettier** (^5.1.2): Plugin de ESLint para integrar Prettier

#### Desarrollo
- **nodemon** (^3.0.2): Herramienta que reinicia automáticamente la aplicación al detectar cambios
- **cross-env** (^7.0.3): Establece variables de entorno de forma multiplataforma