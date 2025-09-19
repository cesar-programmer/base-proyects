# 🚀 Guía Rápida para Ejecutar el Proyecto

## 📋 Requisitos Previos
- **Docker** y **Docker Compose**
- **Node.js** (versión 18 o superior) - solo si ejecutas sin Docker
- **Git**

## 🐳 Opción 1: Ejecutar con Docker (RECOMENDADO)

### 1. Clonar el Proyecto
```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd base-proyects
```

### 2. Levantar los Contenedores
```bash
# Levantar MySQL y phpMyAdmin
docker-compose up mysql phpmyadmin -d

# Esperar unos segundos para que MySQL esté listo
# Luego instalar dependencias del backend
cd backend
npm install

# Ejecutar migraciones y seeders
npm run db:migrate
npm run db:seed

# Volver al directorio raíz
cd ..

# Instalar dependencias del frontend
cd frontend
npm install
cd ..
```

### 3. Servicios Disponibles con Docker
- **MySQL**: `localhost:3306`
  - Usuario: `user`
  - Password: `password`
  - Base de datos: `reportesdb`
  - Root password: `rootpassword`

- **phpMyAdmin**: http://localhost:8081
  - Servidor: `mysql`
  - Usuario: `user` o `root`
  - Password: `password` o `rootpassword`

### 3. Ejecutar Migraciones y Seeders (Solo Opción 2)
```bash
# Desde la carpeta backend
cd backend

# Ejecutar migraciones (crear tablas)
npm run db:migrate

# Ejecutar seeders (datos iniciales)
npm run db:seed
```

## 🚀 Ejecutar el Proyecto

### Con Docker (Opción 1):

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```
El servidor backend estará en: `http://localhost:3000`

#### Terminal 2 - Frontend:
```bash
cd frontend
npm start
```
La aplicación frontend estará en: `http://localhost:5173`

#### Servicios adicionales:
- **phpMyAdmin**: http://localhost:8081
- **MySQL**: `localhost:3306`

### Sin Docker (Opción 2):

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```
El servidor backend estará en: `http://localhost:3000`

#### Terminal 2 - Frontend:
```bash
cd frontend
npm start
```
La aplicación frontend estará en: `http://localhost:5173`

## 🛠️ Opción 2: Instalación Local (Sin Docker)

### 1. Clonar y Configurar el Proyecto
```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd base-proyects

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

### 2. Configurar Base de Datos Local

#### Crear la base de datos en MySQL:
```sql
CREATE DATABASE reportesdb;
CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON reportesdb.* TO 'user'@'localhost';
FLUSH PRIVILEGES;
```

#### Configurar variables de entorno:
```bash
# En la carpeta backend, crear archivo .env
cd backend
cp .env.example .env
```

Editar el archivo `.env` con tus datos:
```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=reportesdb
DB_USER=user
DB_PASSWORD=password

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro

# Puerto del servidor
PORT=3000

# Entorno
NODE_ENV=development
```

## 📁 Estructura del Proyecto

```
base-proyects/
├── backend/          # API REST con Node.js + Express
├── frontend/         # React + Vite + Tailwind
├── mysql/           # Scripts de inicialización para Docker
└── docker-compose.yml # Configuración de Docker
```

## 🔧 Comandos Útiles

### Docker:
```bash
# Levantar solo MySQL y phpMyAdmin
docker-compose up mysql phpmyadmin -d

# Levantar todos los servicios
docker-compose up -d

# Ver logs de un servicio
docker-compose logs mysql
docker-compose logs phpmyadmin

# Parar servicios
docker-compose down

# Parar y eliminar volúmenes (CUIDADO: borra datos)
docker-compose down -v

# Reiniciar un servicio
docker-compose restart mysql
```

### Backend:
```bash
# Desarrollo
npm run dev

# Ver estado de migraciones
npx sequelize-cli db:migrate:status

# Revertir última migración
npm run db:migrate:undo

# Reset completo de BD
npm run db:reset

# Ejecutar tests
npm test
```

### Frontend:
```bash
# Desarrollo
npm start

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🌐 URLs Importantes

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **phpMyAdmin**: http://localhost:8081 (solo con Docker)
- **API Docs**: Revisar `backend/API_DOCUMENTATION.md`

## 🐛 Solución de Problemas Comunes

### Con Docker:

#### Error de conexión a BD:
```bash
# Verificar que los contenedores estén corriendo
docker-compose ps

# Ver logs de MySQL
docker-compose logs mysql

# Reiniciar MySQL
docker-compose restart mysql
```

#### Error de puertos ocupados:
```bash
# Verificar qué está usando el puerto
netstat -ano | findstr :3306
netstat -ano | findstr :8081

# Cambiar puertos en docker-compose.yml si es necesario
```

### Sin Docker:

#### Error de conexión a BD:
```bash
# Verificar que MySQL esté corriendo
# Verificar credenciales en .env
# Verificar que la BD existe
```

#### Error de puertos ocupados:
```bash
# Cambiar puerto en .env (backend)
# Cambiar puerto en vite.config.js (frontend)
```

### General:

#### Error de migraciones:
```bash
# Reset completo
npm run db:migrate:undo:all
npm run db:migrate
npm run db:seed
```

#### Problemas con dependencias:
```bash
# Limpiar cache de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## ✅ Verificar que Todo Funciona

### Con Docker:
1. ✅ Contenedores corriendo: `docker-compose ps`
2. ✅ MySQL disponible en puerto 3306
3. ✅ phpMyAdmin accesible en http://localhost:8081
4. ✅ Backend corriendo en puerto 3000
5. ✅ Frontend corriendo en puerto 5173
6. ✅ Puedes hacer login con los usuarios de prueba
7. ✅ Puedes navegar por las diferentes secciones
8. ✅ No hay errores en la consola del navegador

### Sin Docker:
1. ✅ MySQL local corriendo
2. ✅ Backend corriendo en puerto 3000
3. ✅ Frontend corriendo en puerto 5173
4. ✅ Puedes hacer login con los usuarios de prueba
5. ✅ Puedes navegar por las diferentes secciones
6. ✅ No hay errores en la consola del navegador

## 🎯 Inicio Rápido con Docker (Resumen)

```bash
# 1. Clonar proyecto
git clone [URL_DEL_REPOSITORIO]
cd base-proyects

# 2. Levantar MySQL y phpMyAdmin
docker-compose up mysql phpmyadmin -d

# 3. Configurar backend
cd backend
npm install
npm run db:migrate
npm run db:seed
npm run dev

# 4. En otra terminal - configurar frontend
cd frontend
npm install
npm start
```

¡Listo! El proyecto debería estar funcionando correctamente. 🎉

### 🔗 Accesos Rápidos:
- **App**: http://localhost:5173
- **API**: http://localhost:3000
- **phpMyAdmin**: http://localhost:8081 (user: `user`, pass: `password`)