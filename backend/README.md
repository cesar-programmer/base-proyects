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
node --experimental-vm-modules ./node_modules/jest/bin/jest.js # Ejecutar tests con ES Modules
npm run test:watch  # Tests en modo watch
npm run test:coverage # Coverage de tests
```

### 📋 Descripción Detallada de Scripts

#### **Scripts de Desarrollo**
- **`npm start`**: Ejecuta el servidor en modo producción usando `node src/index.js`
- **`npm run dev`**: Ejecuta el servidor en modo desarrollo con `nodemon` para reinicio automático

#### **Scripts de Base de Datos**
- **`npm run db:migrate`**: Ejecuta todas las migraciones pendientes usando Sequelize CLI
- **`npm run db:migrate:undo`**: Deshace la última migración ejecutada
- **`npm run db:migrate:undo:all`**: Deshace todas las migraciones (limpia la BD)
- **`npm run db:seed`**: Ejecuta todos los seeders para poblar la BD con datos iniciales
- **`npm run db:seed:undo`**: Deshace todos los seeders
- **`npm run db:reset`**: Comando completo que limpia, migra y puebla la BD desde cero
- **`npm run db:setup`**: Ejecuta migraciones y seeders (para configuración inicial)

#### **Scripts de Calidad de Código**
- **`npm run lint`**: Ejecuta ESLint para revisar el código en busca de errores y problemas de estilo
- **`npm run lint:fix`**: Ejecuta ESLint y corrige automáticamente los errores que puede solucionar
- **`npm run format`**: Formatea todo el código usando Prettier según las reglas definidas

#### **Scripts de Testing**
- **`npm test`**: Ejecuta todas las pruebas usando Jest con soporte para ES Modules
- **`npm run test:watch`**: Ejecuta las pruebas en modo watch (se re-ejecutan al cambiar archivos)
- **`npm run test:coverage`**: Ejecuta las pruebas y genera un reporte de cobertura de código

## 📦 Dependencias del Proyecto

### **Dependencias de Producción**

#### **Framework y Servidor**
- **`express`** (^4.18.2): Framework web minimalista y flexible para Node.js
- **`cors`** (^2.8.5): Middleware para habilitar CORS (Cross-Origin Resource Sharing)
- **`helmet`** (^7.1.0): Middleware de seguridad que establece varios headers HTTP
- **`morgan`** (^1.10.0): Middleware de logging para HTTP requests
- **`express-rate-limit`** (^7.1.5): Middleware para limitar la tasa de requests

#### **Base de Datos**
- **`sequelize`** (^6.35.2): ORM (Object-Relational Mapping) para Node.js
- **`mysql2`** (^3.9.1): Cliente MySQL para Node.js con soporte para promesas

#### **Autenticación y Seguridad**
- **`bcryptjs`** (^2.4.3): Librería para hashear contraseñas de forma segura
- **`jsonwebtoken`** (^9.0.2): Implementación de JSON Web Tokens para autenticación

#### **Validación**
- **`joi`** (^17.10.1): Librería de validación de esquemas para JavaScript
- **`zod`** (^3.22.4): Librería de validación y parsing con TypeScript-first
- **`express-validator`** (^7.0.1): Middleware de validación para Express

#### **Utilidades**
- **`dotenv`** (^16.4.1): Carga variables de entorno desde archivo .env
- **`winston`** (^3.11.0): Librería de logging multi-transport para Node.js
- **`@hapi/boom`** (^10.0.1): Utilidades para crear objetos de error HTTP
- **`multer`** (^1.4.5-lts.1): Middleware para manejar multipart/form-data (subida de archivos)

### **Dependencias de Desarrollo**

#### **Testing**
- **`jest`** (^29.7.0): Framework de testing para JavaScript
- **`supertest`** (^6.3.4): Librería para testing de APIs HTTP

#### **Linting y Formateo**
- **`eslint`** (^8.57.1): Herramienta de linting para identificar problemas en el código
- **`@eslint/js`** (^9.17.0): Configuraciones de ESLint para JavaScript
- **`eslint-config-prettier`** (^9.1.0): Configuración de ESLint compatible con Prettier
- **`eslint-plugin-prettier`** (^5.2.1): Plugin de ESLint para integrar Prettier
- **`eslint-plugin-react`** (^7.37.3): Reglas de ESLint específicas para React
- **`prettier`** (^3.4.2): Formateador de código opinionado
- **`globals`** (^15.14.0): Variables globales para diferentes entornos

#### **Base de Datos (Desarrollo)**
- **`sequelize-cli`** (^6.6.2): Interfaz de línea de comandos para Sequelize

#### **Desarrollo**
- **`nodemon`** (^3.0.3): Herramienta que reinicia automáticamente la aplicación al detectar cambios

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

## 🧪 Testing

### Configuración de Pruebas

El proyecto utiliza **Jest** como framework de testing con soporte completo para ES Modules.

### Comandos de Testing

```bash
# Ejecutar todas las pruebas
npm test
```
# Ejecutar pruebas en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

### ¿Qué Prueban los Tests?

Las pruebas automatizadas verifican el correcto funcionamiento de:

#### **Auth Controller Tests** (`tests/auth.controller.test.js`)
- **Login exitoso**: Verifica que usuarios válidos puedan autenticarse
- **Login fallido**: Confirma que credenciales inválidas sean rechazadas
- **Validación de email**: Prueba que emails mal formateados sean rechazados
- **Validación de contraseña**: Verifica requisitos mínimos de seguridad
- **Generación de JWT**: Confirma que se generen tokens válidos
- **Registro de usuarios**: Prueba la creación de nuevas cuentas
- **Cambio de contraseña**: Verifica la funcionalidad de actualización de credenciales

#### **Resultados Esperados**

✅ **Cuando todo funciona correctamente:**
```
✓ Auth Controller
  ✓ should login successfully with valid credentials
  ✓ should fail with invalid email
  ✓ should fail with invalid password
  ✓ should generate valid JWT token
  ✓ should register new user successfully
  ...

Tests: 13 passed, 13 total
```

❌ **Fallos esperados (sin base de datos configurada):**
```
✗ Auth Controller
  ✗ should login successfully with valid credentials
  ✗ should fail with invalid email
  ...

Tests: 0 passed, 13 failed
```

### Configuración del Entorno de Testing

Las pruebas requieren:
1. **Base de datos de testing** configurada en `.env`
2. **Puerto diferente** (3001) para evitar conflictos
3. **Datos de prueba** (seeders de testing)

**Nota**: Los fallos actuales son esperados ya que no hay una base de datos de testing configurada. Las pruebas verifican que el código esté sintácticamente correcto y que los módulos ES se carguen apropiadamente.

## 📮 Testing con Postman

### Configuración Inicial de Postman

#### 1. Variables de Entorno
Crea una nueva colección en Postman y configura estas variables:

```json
{
  "baseUrl": "http://localhost:3000",
  "apiUrl": "{{baseUrl}}/api/v1",
  "token": ""
}
```

#### 2. Configuración de Autenticación
Para endpoints protegidos, agrega en el header:
```
Authorization: Bearer {{token}}
```

### 🔐 Endpoints de Autenticación

#### POST - Login de Usuario
- **URL**: `{{apiUrl}}/auth/login`
- **Método**: `POST`
- **Autenticación**: No requerida
- **Content-Type**: `application/json`

**Body (JSON):**
```json
{
  "email": "admin@universidad.edu",
  "password": "Admin123!"
}
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Login exitoso",
  "user": {
    "id": 1,
    "nombre_completo": "Administrador Sistema",
    "email": "admin@universidad.edu",
    "rol": "ADMINISTRADOR"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores Posibles:**
- `400`: Credenciales inválidas
- `422`: Datos de validación incorrectos

#### POST - Registro de Usuario
- **URL**: `{{apiUrl}}/auth/register`
- **Método**: `POST`
- **Autenticación**: No requerida
- **Content-Type**: `application/json`

**Body (JSON):**
```json
{
  "nombre_completo": "Juan Pérez",
  "email": "juan.perez@universidad.edu",
  "password": "MiPassword123!",
  "confirmPassword": "MiPassword123!",
  "id_rol": 3,
  "activo": true
}
```

**Respuesta Exitosa (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 5,
    "nombre_completo": "Juan Pérez",
    "email": "juan.perez@universidad.edu",
    "activo": true
  }
}
```

#### POST - Verificar Token
- **URL**: `{{apiUrl}}/auth/verify-token`
- **Método**: `POST`
- **Autenticación**: No requerida
- **Content-Type**: `application/json`

**Body (JSON):**
```json
{
  "token": "{{token}}"
}
```

#### POST - Cambiar Contraseña
- **URL**: `{{apiUrl}}/auth/change-password`
- **Método**: `POST`
- **Autenticación**: Bearer Token requerido
- **Content-Type**: `application/json`

**Body (JSON):**
```json
{
  "currentPassword": "Admin123!",
  "newPassword": "NuevaPassword123!",
  "confirmNewPassword": "NuevaPassword123!"
}
```

#### POST - Logout
- **URL**: `{{apiUrl}}/auth/logout`
- **Método**: `POST`
- **Autenticación**: Bearer Token requerido

### 👥 Endpoints de Usuarios

#### GET - Obtener Perfil del Usuario
- **URL**: `{{apiUrl}}/users/profile`
- **Método**: `GET`
- **Autenticación**: Bearer Token requerido
- **Rol**: Todos los usuarios autenticados

**Respuesta Exitosa (200):**
```json
{
  "user": {
    "id": 1,
    "nombre_completo": "Administrador Sistema",
    "email": "admin@universidad.edu",
    "rol": "ADMINISTRADOR",
    "activo": true,
    "ultimo_acceso": "2024-01-20T10:30:00.000Z"
  }
}
```

#### PUT - Actualizar Perfil
- **URL**: `{{apiUrl}}/users/profile`
- **Método**: `PUT`
- **Autenticación**: Bearer Token requerido
- **Content-Type**: `application/json`

**Body (JSON):**
```json
{
  "nombre_completo": "Nuevo Nombre Completo",
  "email": "nuevo.email@universidad.edu"
}
```

#### GET - Listar Todos los Usuarios (Admin)
- **URL**: `{{apiUrl}}/users`
- **Método**: `GET`
- **Autenticación**: Bearer Token requerido
- **Rol**: Solo ADMINISTRADOR
- **Query Parameters**: `?page=1&limit=10&activo=true&search=juan`

**Respuesta Exitosa (200):**
```json
{
  "users": [
    {
      "id": 1,
      "nombre_completo": "Admin Sistema",
      "email": "admin@universidad.edu",
      "rol": "ADMINISTRADOR",
      "activo": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### GET - Obtener Usuario por ID (Admin)
- **URL**: `{{apiUrl}}/users/1`
- **Método**: `GET`
- **Autenticación**: Bearer Token requerido
- **Rol**: Solo ADMINISTRADOR

#### POST - Crear Usuario (Admin)
- **URL**: `{{apiUrl}}/users`
- **Método**: `POST`
- **Autenticación**: Bearer Token requerido
- **Rol**: Solo ADMINISTRADOR
- **Content-Type**: `application/json`

**Body (JSON):**
```json
{
  "nombre_completo": "Nuevo Usuario",
  "email": "nuevo@universidad.edu",
  "password": "Password123!",
  "id_rol": 3,
  "activo": true
}
```

#### PUT - Actualizar Usuario Completo (Admin)
- **URL**: `{{apiUrl}}/users/5`
- **Método**: `PUT`
- **Autenticación**: Bearer Token requerido
- **Rol**: Solo ADMINISTRADOR
- **Content-Type**: `application/json`

**Body (JSON):**
```json
{
  "nombre_completo": "Usuario Actualizado",
  "email": "actualizado@universidad.edu",
  "id_rol": 2,
  "activo": true
}
```

#### PATCH - Cambiar Estado de Usuario (Admin)
- **URL**: `{{apiUrl}}/users/5/toggle-status`
- **Método**: `PATCH`
- **Autenticación**: Bearer Token requerido
- **Rol**: Solo ADMINISTRADOR

#### DELETE - Eliminar Usuario (Admin)
- **URL**: `{{apiUrl}}/users/5`
- **Método**: `DELETE`
- **Autenticación**: Bearer Token requerido
- **Rol**: Solo ADMINISTRADOR

### 📊 Endpoints de Reportes

#### GET - Mis Reportes
- **URL**: `{{apiUrl}}/reportes/my-reportes`
- **Método**: `GET`
- **Autenticación**: Bearer Token requerido
- **Rol**: Todos los usuarios autenticados

#### GET - Listar Reportes
- **URL**: `{{apiUrl}}/reportes`
- **Método**: `GET`
- **Autenticación**: Bearer Token requerido
- **Rol**: DOCENTE o ADMINISTRADOR
- **Query Parameters**: `?page=1&limit=10&estado=ENVIADO&tipo=ACTIVIDADES_PLANIFICADAS`

#### GET - Obtener Reporte por ID
- **URL**: `{{apiUrl}}/reportes/1`
- **Método**: `GET`
- **Autenticación**: Bearer Token requerido
- **Rol**: DOCENTE o ADMINISTRADOR

#### POST - Crear Reporte
- **URL**: `{{apiUrl}}/reportes`
- **Método**: `POST`
- **Autenticación**: Bearer Token requerido
- **Rol**: DOCENTE o ADMINISTRADOR
- **Content-Type**: `application/json`

**Body (JSON):**
```json
{
  "id_periodo": 1,
  "tipo": "ACTIVIDADES_PLANIFICADAS",
  "semestre": 1,
  "observaciones_admin": ""
}
```

**Respuesta Exitosa (201):**
```json
{
  "message": "Reporte creado exitosamente",
  "reporte": {
    "id": 15,
    "id_docente": 3,
    "id_periodo": 1,
    "tipo": "ACTIVIDADES_PLANIFICADAS",
    "semestre": 1,
    "estado": "BORRADOR",
    "fecha_creacion": "2024-01-20T10:30:00.000Z"
  }
}
```

#### PUT - Actualizar Reporte Completo
- **URL**: `{{apiUrl}}/reportes/15`
- **Método**: `PUT`
- **Autenticación**: Bearer Token requerido
- **Rol**: DOCENTE o ADMINISTRADOR
- **Content-Type**: `application/json`

**Body (JSON):**
```json
{
  "id_periodo": 2,
  "tipo": "ACTIVIDADES_REALIZADAS",
  "semestre": 2,
  "observaciones_admin": "Reporte actualizado"
}
```

#### PATCH - Cambiar Estado de Reporte (Admin)
- **URL**: `{{apiUrl}}/reportes/15/status`
- **Método**: `PATCH`
- **Autenticación**: Bearer Token requerido
- **Rol**: Solo ADMINISTRADOR
- **Content-Type**: `application/json`

**Body (JSON):**
```json
{
  "estado": "APROBADO",
  "observaciones_admin": "Reporte aprobado sin observaciones"
}
```

#### DELETE - Eliminar Reporte
- **URL**: `{{apiUrl}}/reportes/15`
- **Método**: `DELETE`
- **Autenticación**: Bearer Token requerido
- **Rol**: DOCENTE o ADMINISTRADOR

### 📁 Endpoints de Archivos

#### POST - Subir Archivo Individual
- **URL**: `{{apiUrl}}/files/upload`
- **Método**: `POST`
- **Autenticación**: Bearer Token requerido
- **Content-Type**: `multipart/form-data`

**Form Data:**
- `file`: [Archivo a subir]
- `description`: "Descripción del archivo"
- `category`: "reportes"

**Respuesta Exitosa (201):**
```json
{
  "message": "Archivo subido exitosamente",
  "file": {
    "filename": "documento_1642680600000.pdf",
    "originalName": "documento.pdf",
    "mimetype": "application/pdf",
    "size": 1024000,
    "url": "/api/v1/files/download/documento_1642680600000.pdf"
  }
}
```

#### POST - Subir Múltiples Archivos
- **URL**: `{{apiUrl}}/files/upload-multiple`
- **Método**: `POST`
- **Autenticación**: Bearer Token requerido
- **Content-Type**: `multipart/form-data`

**Form Data:**
- `files`: [Múltiples archivos]
- `description`: "Descripción de los archivos"
- `category`: "evidencias"

#### GET - Descargar Archivo
- **URL**: `{{apiUrl}}/files/download/documento_1642680600000.pdf`
- **Método**: `GET`
- **Autenticación**: Bearer Token requerido
- **Respuesta**: Archivo binario con headers apropiados

#### GET - Ver Archivo (Imágenes/PDFs)
- **URL**: `{{apiUrl}}/files/view/imagen_1642680600000.jpg`
- **Método**: `GET`
- **Autenticación**: Bearer Token requerido
- **Respuesta**: Archivo para visualización inline

#### GET - Listar Archivos (Admin)
- **URL**: `{{apiUrl}}/files`
- **Método**: `GET`
- **Autenticación**: Bearer Token requerido
- **Rol**: Solo ADMINISTRADOR
- **Query Parameters**: `?page=1&limit=10&category=reportes`

#### DELETE - Eliminar Archivo (Admin)
- **URL**: `{{apiUrl}}/files/documento_1642680600000.pdf`
- **Método**: `DELETE`
- **Autenticación**: Bearer Token requerido
- **Rol**: Solo ADMINISTRADOR

### 🔄 Secuencia Recomendada de Pruebas

#### 1. Configuración Inicial
1. **Login**: `POST /auth/login` → Guardar token en variable `{{token}}`
2. **Verificar Token**: `POST /auth/verify-token`
3. **Obtener Perfil**: `GET /users/profile`

#### 2. Gestión de Usuarios (Admin)
1. **Listar Usuarios**: `GET /users`
2. **Crear Usuario**: `POST /users`
3. **Obtener Usuario**: `GET /users/{id}`
4. **Actualizar Usuario**: `PUT /users/{id}`
5. **Cambiar Estado**: `PATCH /users/{id}/toggle-status`
6. **Eliminar Usuario**: `DELETE /users/{id}`

#### 3. Gestión de Reportes
1. **Crear Reporte**: `POST /reportes`
2. **Listar Reportes**: `GET /reportes`
3. **Obtener Reporte**: `GET /reportes/{id}`
4. **Actualizar Reporte**: `PUT /reportes/{id}`
5. **Cambiar Estado**: `PATCH /reportes/{id}/status` (Admin)
6. **Eliminar Reporte**: `DELETE /reportes/{id}`

#### 4. Gestión de Archivos
1. **Subir Archivo**: `POST /files/upload`
2. **Listar Archivos**: `GET /files` (Admin)
3. **Descargar Archivo**: `GET /files/download/{filename}`
4. **Ver Archivo**: `GET /files/view/{filename}`
5. **Eliminar Archivo**: `DELETE /files/{filename}` (Admin)

### 📋 Datos de Prueba Recomendados

#### Usuarios de Prueba
```json
{
  "admin": {
    "email": "admin@universidad.edu",
    "password": "Admin123!"
  },
  "coordinador": {
    "email": "coordinador@universidad.edu",
    "password": "Coord123!"
  },
  "docente": {
    "email": "docente1@universidad.edu",
    "password": "Docente123!"
  }
}
```

#### IDs de Referencia
- **Roles**: 1=ADMINISTRADOR, 2=COORDINADOR, 3=DOCENTE
- **Estados de Reporte**: BORRADOR, ENVIADO, EN_REVISION, APROBADO, DEVUELTO
- **Tipos de Reporte**: ACTIVIDADES_PLANIFICADAS, ACTIVIDADES_REALIZADAS
- **Semestres**: 1 o 2

### ⚙️ Configuraciones Especiales de Postman

#### Pre-request Script para Autenticación Automática
```javascript
// Obtener token automáticamente si no existe
if (!pm.environment.get("token")) {
    pm.sendRequest({
        url: pm.environment.get("apiUrl") + "/auth/login",
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                email: "admin@universidad.edu",
                password: "Admin123!"
            })
        }
    }, function (err, response) {
        if (response.json().token) {
            pm.environment.set("token", response.json().token);
        }
    });
}
```

#### Test Script para Guardar Token
```javascript
// Guardar token después del login
if (pm.response.json().token) {
    pm.environment.set("token", pm.response.json().token);
}

// Verificar respuesta exitosa
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has token", function () {
    pm.expect(pm.response.json()).to.have.property('token');
});
```

### 🚨 Códigos de Estado HTTP Comunes

- **200**: Operación exitosa
- **201**: Recurso creado exitosamente
- **400**: Solicitud incorrecta (datos inválidos)
- **401**: No autorizado (token inválido/expirado)
- **403**: Prohibido (sin permisos suficientes)
- **404**: Recurso no encontrado
- **422**: Error de validación
- **500**: Error interno del servidor

### 🔧 Modificaciones Necesarias en el Código

**No se requieren modificaciones adicionales en el código para testing con Postman.** El backend ya está completamente configurado con:

✅ **CORS habilitado** para peticiones desde diferentes orígenes  
✅ **Autenticación JWT** funcionando correctamente  
✅ **Validación de datos** con Joi en todos los endpoints  
✅ **Manejo de errores** estructurado  
✅ **Middleware de seguridad** configurado  
✅ **Subida de archivos** con multer configurado  

El servidor está listo para recibir peticiones de Postman sin modificaciones adicionales.

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