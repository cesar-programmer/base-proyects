# Manual de Base de Datos - Sistema de Gestión de Reportes Académicos

## Índice
1. [Configuración Inicial](#configuración-inicial)
2. [Migraciones](#migraciones)
3. [Seeders](#seeders)
4. [Comandos Principales](#comandos-principales)
5. [Posibles Errores y Soluciones](#posibles-errores-y-soluciones)
6. [Estructura de la Base de Datos](#estructura-de-la-base-de-datos)

## Configuración Inicial

### Variables de Entorno
El archivo `.env` debe contener las siguientes variables para la base de datos:

```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gestion_reportes_academicos
DB_USER=root
DB_PASSWORD=rootpassword
DB_DIALECT=mysql

# Para testing (opcional)
DB_TEST_NAME=gestion_reportes_test
```

### Configuración de Sequelize
La configuración se encuentra en `src/config/database.js` y utiliza las variables de entorno para conectarse a la base de datos.

## Migraciones

### ¿Qué son las Migraciones?
Las migraciones son scripts que permiten versionar y modificar la estructura de la base de datos de manera controlada. Cada migración representa un cambio específico en el esquema de la base de datos.

### Estructura de Migraciones
Las migraciones se encuentran en `src/db/migrations/` y siguen el formato:
`YYYYMMDDHHMMSS-descripcion.cjs`

### Migraciones Existentes
1. **20250831170000-create-roles.cjs** - Crea la tabla de roles
2. **20250831170015-create-usuarios.cjs** - Crea la tabla de usuarios
3. **20250831170030-create-periodos-academicos.cjs** - Crea períodos académicos
4. **20250831170045-create-catalogo-actividades.cjs** - Catálogo de actividades
5. **20250831170060-create-fechas-limite.cjs** - Fechas límite
6. **20250831170075-create-actividades.cjs** - Actividades principales
7. **20250831170090-create-archivos.cjs** - Gestión de archivos
8. **20250831170105-create-historial-cambios.cjs** - Historial de cambios
9. **20250831170120-create-notificaciones.cjs** - Sistema de notificaciones
10. **20250831170135-create-configuraciones.cjs** - Configuraciones del sistema
11. **20250831170150-create-reportes.cjs** - Reportes académicos

### Comandos de Migraciones

```bash
# Ejecutar todas las migraciones pendientes
npx sequelize-cli db:migrate

# Revertir la última migración
npx sequelize-cli db:migrate:undo

# Revertir todas las migraciones
npx sequelize-cli db:migrate:undo:all

# Revertir hasta una migración específica
npx sequelize-cli db:migrate:undo:all --to YYYYMMDDHHMMSS-nombre-migracion.cjs

# Ver estado de las migraciones
npx sequelize-cli db:migrate:status
```

## Seeders

### ¿Qué son los Seeders?
Los seeders son scripts que insertan datos iniciales en la base de datos. Son útiles para poblar la base de datos con información de prueba o datos necesarios para el funcionamiento del sistema.

### Seeders Existentes
1. **20250831170015-seed-roles.cjs** - Roles del sistema (ADMINISTRADOR, COORDINADOR, DOCENTE)
2. **20250831170030-seed-usuarios.cjs** - Usuarios de prueba con diferentes roles
3. **20250831170045-seed-periodos-academicos.cjs** - Períodos académicos de ejemplo
4. **20250831170060-seed-catalogo-actividades.cjs** - Catálogo de tipos de actividades
5. **20250831170075-seed-fechas-limite.cjs** - Fechas límite para actividades
6. **20250831170090-seed-archivos.cjs** - Archivos de ejemplo
7. **20250831170105-seed-historial-cambios.cjs** - Historial de cambios de ejemplo
8. **20250831170120-seed-notificaciones.cjs** - Notificaciones del sistema

### Características Importantes de los Seeders
- **Todos los seeders incluyen `ignoreDuplicates: true`** para evitar errores de duplicación
- Los seeders están ordenados para respetar las dependencias entre tablas
- Incluyen datos realistas para testing y desarrollo

### Comandos de Seeders

```bash
# Ejecutar todos los seeders
npx sequelize-cli db:seed:all

# Ejecutar un seeder específico
npx sequelize-cli db:seed --seed 20250831170015-seed-roles.cjs

# Revertir todos los seeders
npx sequelize-cli db:seed:undo:all

# Revertir un seeder específico
npx sequelize-cli db:seed:undo --seed 20250831170015-seed-roles.cjs
```

## Comandos Principales

### Configuración Inicial Completa
```bash
# 1. Crear la base de datos
npx sequelize-cli db:create

# 2. Ejecutar migraciones
npx sequelize-cli db:migrate

# 3. Poblar con datos iniciales
npx sequelize-cli db:seed:all
```

### Resetear Base de Datos
```bash
# Opción 1: Revertir todo y volver a crear
npx sequelize-cli db:seed:undo:all
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:drop
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

# Opción 2: Solo revertir seeders y volver a poblar
npx sequelize-cli db:seed:undo:all
npx sequelize-cli db:seed:all
```

### Crear Nuevas Migraciones y Seeders
```bash
# Crear nueva migración
npx sequelize-cli migration:generate --name nombre-de-la-migracion

# Crear nuevo seeder
npx sequelize-cli seed:generate --name nombre-del-seeder
```

## Posibles Errores y Soluciones

### Error: "Database does not exist"
**Causa:** La base de datos no ha sido creada.
**Solución:**
```bash
npx sequelize-cli db:create
```

### Error: "SequelizeConnectionError"
**Causa:** Problemas de conexión a la base de datos.
**Soluciones:**
1. Verificar que MySQL esté ejecutándose
2. Comprobar las credenciales en el archivo `.env`
3. Verificar que el puerto 3306 esté disponible

### Error: "Duplicate entry" en seeders
**Causa:** Intentar insertar datos que ya existen.
**Solución:** Los seeders ya incluyen `ignoreDuplicates: true`, pero si persiste:
```bash
npx sequelize-cli db:seed:undo:all
npx sequelize-cli db:seed:all
```

### Error: "Migration already executed"
**Causa:** Intentar ejecutar una migración que ya fue aplicada.
**Solución:** Verificar el estado de las migraciones:
```bash
npx sequelize-cli db:migrate:status
```

### Error: "Foreign key constraint fails"
**Causa:** Violación de restricciones de clave foránea.
**Soluciones:**
1. Verificar el orden de ejecución de seeders
2. Asegurar que las tablas referenciadas existan
3. Verificar que los IDs referenciados existan

### Error: "Table doesn't exist"
**Causa:** Intentar acceder a una tabla que no ha sido creada.
**Solución:**
```bash
npx sequelize-cli db:migrate
```

## Estructura de la Base de Datos

### Tablas Principales

#### Roles
- **Propósito:** Define los roles del sistema
- **Tabla:** `Roles`
- **Campos:** id, nombre, descripcion, activo, createdAt, updatedAt
- **Datos:** ADMINISTRADOR, COORDINADOR, DOCENTE
- **Relaciones:** Tiene muchos usuarios, puede tener muchos permisos (N:M)

#### Permisos
- **Propósito:** Catálogo de permisos específicos
- **Tabla:** `permisos`
- **Campos:** id_permiso, nombre, descripcion
- **Ejemplos:** "REPORTES_APROBAR", "USUARIOS_CREAR"
- **Relaciones:** Puede pertenecer a muchos roles (N:M)

#### Usuarios
- **Propósito:** Gestión de usuarios del sistema
- **Tabla:** `Usuarios`
- **Campos:** id, nombre, apellido, email, password, telefono, cedula, fechaNacimiento, direccion, activo, ultimoAcceso, rolId, createdAt, updatedAt
- **Relaciones:** Pertenece a un rol, puede crear muchos reportes, puede recibir muchas notificaciones

#### Periodos_Academicos
- **Propósito:** Períodos académicos del sistema
- **Tabla:** `PeriodosAcademicos`
- **Campos:** id, nombre, fechaInicio, fechaFin, descripcion, activo
- **Ejemplos:** "2025-1", "2025-2"
- **Relaciones:** Puede tener muchas fechas límite

#### Catalogo_Actividades
- **Propósito:** Tipos de actividades disponibles
- **Tabla:** `catalogo_actividades`
- **Campos:** id, nombre, descripcion, activo
- **Relaciones:** Actualmente sin relaciones directas

#### Actividades
- **Propósito:** Actividades académicas principales
- **Tabla:** `Actividades`
- **Campos:** id, usuarioId, periodoAcademicoId, titulo, descripcion, categoria (ENUM), fechaInicio, fechaFin, ubicacion, presupuesto, participantesEsperados, estado, createdAt, updatedAt
- **Categorías:** DOCENCIA, INVESTIGACION, TUTORIAS, GESTION_ACADEMICA, EXTENSION, CAPACITACION, POSGRADO, OTRO
- **Relaciones:** Pertenece a un usuario y a un período académico, puede tener muchos archivos

#### Reportes
- **Propósito:** Reportes académicos del sistema
- **Tabla:** `Reportes`
- **Campos:** id, titulo, descripcion, fechaRealizacion, participantesReales, resultados, observaciones, recomendaciones, estado (ENUM), evidencias (JSON), fechaEnvio, fechaRevision, comentariosRevision, actividadId, usuarioId, createdAt, updatedAt
- **Estados:** borrador, enviado, revisado, aprobado, rechazado
- **Relaciones:** Pertenece a un usuario y a una actividad, puede tener historial de cambios

#### Archivos
- **Propósito:** Gestión de archivos de evidencia
- **Tabla:** `archivos`
- **Campos:** id, actividadId, nombre_original, nombre_almacenado, ruta_almacenamiento, tipo_mime, tamano_bytes, fecha_subida
- **Relaciones:** Pertenece a una actividad

#### Fechas_Limite
- **Propósito:** Fechas límite configurables del sistema
- **Tabla:** `fechas_limite`
- **Campos:** id_fecha_limite, nombre, descripcion, fecha_limite, categoria (ENUM), id_periodo, semestre, dias_recordatorio, activo
- **Categorías:** REGISTRO, ENTREGA, REVISION, EVALUACION
- **Relaciones:** Pertenece a un período académico, puede generar notificaciones

#### Notificaciones
- **Propósito:** Sistema de notificaciones
- **Tabla:** `notificaciones`
- **Campos:** id_notificacion, id_usuario_destino, mensaje, tipo (ENUM), leido, fecha_creacion, id_fecha_limite
- **Tipos:** RECORDATORIO, APROBACION, DEVOLUCION, SISTEMA, FECHA_LIMITE
- **Relaciones:** Pertenece a un usuario, puede estar relacionada con una fecha límite

#### Historial_Cambios
- **Propósito:** Auditoría de cambios en reportes
- **Tabla:** `historial_cambios`
- **Campos:** id_historial, id_reporte, id_usuario_modificador, descripcion_cambio, fecha_cambio
- **Relaciones:** Pertenece a un reporte y a un usuario modificador

#### Configuraciones
- **Propósito:** Configuraciones globales del sistema
- **Tabla:** `configuraciones`
- **Campos:** clave (PK), valor, descripcion, fecha_modificacion
- **Ejemplos:** min_actividades, email_admin
- **Relaciones:** Sin relaciones (tabla independiente)

### Relaciones Importantes

#### Relaciones Principales
- **Usuarios → Roles** (muchos a uno): Cada usuario tiene un rol específico
- **Roles ↔ Permisos** (muchos a muchos): Los roles pueden tener múltiples permisos
- **Actividades → Usuarios** (muchos a uno): Cada actividad pertenece a un usuario
- **Actividades → Periodos_Academicos** (muchos a uno): Cada actividad pertenece a un período académico
- **Reportes → Usuarios** (muchos a uno): Cada reporte es creado por un usuario
- **Reportes → Actividades** (muchos a uno): Cada reporte está asociado a una actividad
- **Archivos → Actividades** (muchos a uno): Los archivos de evidencia pertenecen a actividades

#### Relaciones de Sistema
- **Notificaciones → Usuarios** (muchos a uno): Las notificaciones van dirigidas a usuarios específicos
- **Notificaciones → Fechas_Limite** (muchos a uno): Las notificaciones pueden estar relacionadas con fechas límite
- **Fechas_Limite → Periodos_Academicos** (muchos a uno): Las fechas límite pertenecen a períodos académicos
- **Historial_Cambios → Reportes** (muchos a uno): El historial rastrea cambios en reportes
- **Historial_Cambios → Usuarios** (muchos a uno): Cada cambio es realizado por un usuario

#### Diagrama de Relaciones Simplificado
```
Roles ←→ Permisos (N:M)
  ↓
Usuarios (1:N)
  ↓
Actividades ← Periodos_Academicos
  ↓
Reportes
  ↓
Historial_Cambios

Actividades → Archivos (1:N)
Usuarios → Notificaciones (1:N)
Fechas_Limite → Notificaciones (1:N)
Periodos_Academicos → Fechas_Limite (1:N)
```

## Usuarios de Prueba

### Credenciales por Defecto
```
Administrador:
- Email: admin@universidad.edu
- Password: admin123
- Rol: ADMINISTRADOR

Coordinador:
- Email: maria.gonzalez@universidad.edu
- Password: coord123
- Rol: COORDINADOR

Docente:
- Email: carlos.rodriguez@universidad.edu
- Password: docente123
- Rol: DOCENTE
```

## Mantenimiento

### Respaldo de Base de Datos
```bash
# Crear respaldo
mysqldump -u root -p gestion_reportes_academicos > backup.sql

# Restaurar respaldo
mysql -u root -p gestion_reportes_academicos < backup.sql
```

### Limpieza de Datos de Prueba
```bash
# Limpiar solo datos de seeders
npx sequelize-cli db:seed:undo:all

# Poblar con datos frescos
npx sequelize-cli db:seed:all
```

---

**Nota:** Este manual debe actualizarse cada vez que se agreguen nuevas migraciones, seeders o se modifique la estructura de la base de datos.