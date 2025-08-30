# Sistema de Reportes Académicos - Backend

API REST para el sistema de gestión de reportes académicos universitarios.

## 🚀 Características

- **Autenticación JWT** con roles de usuario
- **Base de datos MySQL** con Sequelize ORM
- **Validación de datos** con Joi
- **Manejo de archivos** con Multer
- **Seguridad** con Helmet, CORS y Rate Limiting
- **Logging** con Winston
- **Migraciones y Seeders** con Sequelize CLI

## 📋 Requisitos

- Node.js >= 16.0.0
- MySQL >= 8.0
- npm >= 8.0.0

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus configuraciones:
```env
# Servidor
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:8082

# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=reportes_db

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_EXPIRES_IN=24h

# Logging
LOG_LEVEL=info
```

4. **Configurar base de datos**
```bash
# Ejecutar migraciones
npm run db:migrate

# Ejecutar seeders
npm run db:seed
```

5. **Iniciar el servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📚 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/login` | Iniciar sesión | No |
| POST | `/api/v1/auth/register` | Registrar usuario | No |
| POST | `/api/v1/auth/verify-token` | Verificar token | No |
| POST | `/api/v1/auth/change-password` | Cambiar contraseña | Sí |
| POST | `/api/v1/auth/logout` | Cerrar sesión | Sí |

### Usuarios

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| GET | `/api/v1/users/profile` | Obtener perfil | Sí | Todos |
| PUT | `/api/v1/users/profile` | Actualizar perfil | Sí | Todos |
| GET | `/api/v1/users/by-role/:role` | Usuarios por rol | Sí | Docente+ |
| GET | `/api/v1/users` | Listar usuarios | Sí | Admin |
| GET | `/api/v1/users/stats` | Estadísticas usuarios | Sí | Admin |
| GET | `/api/v1/users/:id` | Usuario por ID | Sí | Admin |
| POST | `/api/v1/users` | Crear usuario | Sí | Admin |
| PUT | `/api/v1/users/:id` | Actualizar usuario | Sí | Admin |
| DELETE | `/api/v1/users/:id` | Eliminar usuario | Sí | Admin |
| PATCH | `/api/v1/users/:id/toggle-status` | Cambiar estado | Sí | Admin |

### Reportes

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| GET | `/api/v1/reportes/my-reports` | Mis reportes | Sí | Todos |
| GET | `/api/v1/reportes` | Listar reportes | Sí | Docente+ |
| GET | `/api/v1/reportes/stats` | Estadísticas | Sí | Docente+ |
| GET | `/api/v1/reportes/pending` | Reportes pendientes | Sí | Admin |
| GET | `/api/v1/reportes/by-teacher/:id` | Por docente | Sí | Docente+ |
| GET | `/api/v1/reportes/by-period/:id` | Por período | Sí | Docente+ |
| GET | `/api/v1/reportes/:id` | Reporte por ID | Sí | Docente+ |
| POST | `/api/v1/reportes` | Crear reporte | Sí | Docente+ |
| PUT | `/api/v1/reportes/:id` | Actualizar reporte | Sí | Docente+ |
| DELETE | `/api/v1/reportes/:id` | Eliminar reporte | Sí | Docente+ |
| PATCH | `/api/v1/reportes/:id/status` | Cambiar estado | Sí | Admin |

### Archivos

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| POST | `/api/v1/files/upload` | Subir archivo | Sí | Todos |
| POST | `/api/v1/files/upload-multiple` | Subir múltiples | Sí | Todos |
| GET | `/api/v1/files/download/:filename` | Descargar archivo | Sí | Todos |
| GET | `/api/v1/files/view/:filename` | Ver archivo | Sí | Todos |
| GET | `/api/v1/files` | Listar archivos | Sí | Admin |
| DELETE | `/api/v1/files/:filename` | Eliminar archivo | Sí | Admin |

## 🔐 Autenticación

### JWT Token
Todos los endpoints protegidos requieren un token JWT en el header:
```
Authorization: Bearer <token>
```

### Roles de Usuario
- **ADMINISTRADOR**: Acceso completo al sistema
- **COORDINADOR**: Gestión de reportes y usuarios
- **DOCENTE**: Gestión de sus propios reportes

## 📝 Ejemplos de Uso

### Iniciar Sesión
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@universidad.edu",
    "password": "Admin123!"
  }'
```

### Crear Reporte
```bash
curl -X POST http://localhost:3000/api/v1/reportes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "id_periodo": 1,
    "tipo": "SEMESTRAL",
    "semestre": 1
  }'
```

### Subir Archivo
```bash
curl -X POST http://localhost:3000/api/v1/files/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@documento.pdf" \
  -F "description=Evidencia de actividad"
```

## 🗄️ Base de Datos

### Migraciones
```bash
# Ejecutar migraciones
npm run db:migrate

# Revertir última migración
npm run db:migrate:undo

# Revertir todas las migraciones
npm run db:migrate:undo:all
```

### Seeders
```bash
# Ejecutar seeders
npm run db:seed

# Revertir seeders
npm run db:seed:undo

# Resetear base de datos
npm run db:reset
```

### Usuarios por Defecto

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@universidad.edu | Admin123! | ADMINISTRADOR |
| coordinador@universidad.edu | Coord123! | COORDINADOR |
| docente1@universidad.edu | Docente123! | DOCENTE |

## 📁 Estructura del Proyecto

```
src/
├── config/          # Configuraciones
│   ├── config.js     # Config general
│   ├── security.js   # Config de seguridad
│   └── upload.js     # Config de archivos
├── controllers/      # Controladores
│   ├── auth.controller.js
│   ├── user.controller.js
│   └── reporte.controller.js
├── db/              # Base de datos
│   ├── models/      # Modelos Sequelize
│   ├── migrations/  # Migraciones
│   └── seeders/     # Seeders
├── middleware/      # Middlewares
│   ├── auth.middleware.js
│   ├── error.handler.js
│   └── validator.handler.js
├── routes/          # Rutas
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── reporte.routes.js
│   ├── files.routes.js
│   └── index.js
├── schemas/         # Esquemas de validación
│   ├── auth.schema.js
│   ├── user.schema.js
│   ├── reporte.schema.js
│   ├── actividad.schema.js
│   └── file.schema.js
├── services/        # Servicios
└── index.js         # Punto de entrada
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar con nodemon
npm start           # Iniciar en producción

# Base de datos
npm run db:migrate   # Ejecutar migraciones
npm run db:seed      # Ejecutar seeders
npm run db:reset     # Resetear BD
npm run db:setup     # Configurar BD

# Calidad de código
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir errores ESLint
npm run format       # Formatear código

# Testing
npm test            # Ejecutar tests
npm run test:watch  # Tests en modo watch
npm run test:coverage # Coverage de tests
```

## 🛡️ Seguridad

- **Rate Limiting**: Límites de requests por IP
- **CORS**: Configurado para dominios específicos
- **Helmet**: Headers de seguridad
- **Validación**: Joi para validar entrada
- **Autenticación**: JWT con expiración
- **Autorización**: Control de acceso por roles

## 📊 Logging

Los logs se generan con Winston y incluyen:
- Requests HTTP (Morgan)
- Errores de aplicación
- Accesos de autenticación
- Operaciones de base de datos

## 🚀 Despliegue

### Docker
```bash
# Construir imagen
docker build -t reportes-backend .

# Ejecutar contenedor
docker run -p 3000:3000 reportes-backend
```

### Variables de Entorno de Producción
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=<secret_muy_seguro>
DB_HOST=<host_produccion>
DB_PASSWORD=<password_seguro>
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

ISC License - ver archivo LICENSE para detalles.

## 👥 Autor

Cesar Cordova - cesarcordova.developer@gmail.com

---

**Nota**: Este es un sistema académico. Asegúrate de configurar adecuadamente las variables de entorno y la seguridad antes del despliegue en producción.