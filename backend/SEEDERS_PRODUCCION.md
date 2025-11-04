# Seeders de Producción

## Resumen de Cambios

Los seeders han sido limpiados para producción. Solo se insertarán datos esenciales para el funcionamiento inicial del sistema.

## Seeders Activos (Con Datos)

### 1. **20250831170000-seed-roles.cjs**
- ✅ **ACTIVO** - Inserta 3 roles básicos:
  - ADMINISTRADOR
  - COORDINADOR
  - DOCENTE

### 2. **20250831170010-seed-permisos.cjs**
- ✅ **ACTIVO** - Inserta todos los permisos del sistema:
  - Permisos de usuarios (crear, leer, actualizar, eliminar)
  - Permisos de reportes (crear, leer, actualizar, eliminar, aprobar)
  - Permisos de actividades (crear, leer, actualizar, eliminar)
  - Permisos de configuración (leer, actualizar)

### 3. **20250831170020-seed-rol-permisos.cjs**
- ✅ **ACTIVO** - Asigna permisos a cada rol:
  - **ADMINISTRADOR**: Todos los permisos
  - **COORDINADOR**: Permisos de gestión (sin eliminar usuarios)
  - **DOCENTE**: Permisos básicos de lectura y creación

### 4. **20250831170030-seed-usuarios.cjs**
- ✅ **ACTIVO** - Inserta 2 usuarios iniciales:
  - **María González** (COORDINADOR)
    - Email: `maria.gonzalez@universidad.edu`
    - Contraseña: `Password123`
    - Cédula: `87654321`
  - **Carlos Rodríguez** (DOCENTE)
    - Email: `carlos.rodriguez@universidad.edu`
    - Contraseña: `Password123`
    - Cédula: `11223344`

## Seeders Vacíos (Sin Datos)

Los siguientes seeders están configurados para **NO insertar datos** en producción:

### 5. **20250831170040-seed-periodos-academicos.cjs**
- ❌ **VACÍO** - Los períodos académicos se crearán manualmente en producción

### 6. **20250831170050-seed-catalogo-actividades.cjs**
- ❌ **VACÍO** - El catálogo de actividades se creará según necesidad

### 7. **20250831170060-seed-actividades.cjs**
- ❌ **VACÍO** - Las actividades las crearán los usuarios

### 8. **20250831170070-seed-reportes.cjs**
- ❌ **VACÍO** - Los reportes los crearán los usuarios

### 9. **20250831170080-seed-configuraciones.cjs**
- ❌ **VACÍO** - Las configuraciones se crearán según necesidad

### 10. **20250831170085-seed-fechas-limite.cjs**
- ❌ **VACÍO** - Las fechas límite se crearán por período académico

### 11. **20250831170090-seed-archivos.cjs**
- ❌ **VACÍO** - Los archivos se subirán según actividades

### 12. **20250831170105-seed-historial-cambios.cjs**
- ❌ **VACÍO** - El historial se genera automáticamente

### 13. **20250831170120-seed-notificaciones.cjs**
- ❌ **VACÍO** - Las notificaciones se generan automáticamente

## Ejecutar Seeders en Producción

Para ejecutar los seeders en producción:

```bash
# Desde el contenedor Docker
docker-compose exec backend npx sequelize-cli db:seed:all --config src/db/config.cjs

# O manualmente desde el backend
cd backend
npx sequelize-cli db:seed:all --config src/db/config.cjs
```

## Revertir Seeders (Si es necesario)

```bash
# Revertir todos los seeders
npx sequelize-cli db:seed:undo:all --config src/db/config.cjs

# Revertir un seeder específico
npx sequelize-cli db:seed:undo --seed nombre-del-seeder.cjs --config src/db/config.cjs
```

## Estado Inicial de la Base de Datos

Después de ejecutar las migraciones y seeders, la base de datos tendrá:

- ✅ **3 Roles** (ADMINISTRADOR, COORDINADOR, DOCENTE)
- ✅ **16 Permisos** (distribuidos entre usuarios, reportes, actividades, configuración)
- ✅ **Asignación de permisos a roles**
- ✅ **2 Usuarios** (1 coordinador, 1 docente)
- ❌ **0 Períodos Académicos** (se crearán manualmente)
- ❌ **0 Actividades** (se crearán por los usuarios)
- ❌ **0 Reportes** (se crearán por los usuarios)
- ❌ **0 Fechas Límite** (se crearán por período)
- ❌ **0 Archivos** (se subirán según necesidad)
- ❌ **0 Notificaciones** (se generarán automáticamente)
- ❌ **0 Historial de Cambios** (se generará automáticamente)
- ❌ **0 Configuraciones** (se crearán manualmente)

## Credenciales de Acceso Inicial

### Usuario Coordinador
- **Email**: `maria.gonzalez@universidad.edu`
- **Contraseña**: `Password123`
- **Rol**: COORDINADOR

### Usuario Docente
- **Email**: `carlos.rodriguez@universidad.edu`
- **Contraseña**: `Password123`
- **Rol**: DOCENTE

## Notas Importantes

1. **Seguridad**: Cambiar las contraseñas después del primer acceso en producción
2. **Emails**: Actualizar los emails a direcciones reales institucionales
3. **Datos Personales**: Los campos opcionales (teléfono, dirección, fecha de nacimiento) están en `null`
4. **Sin Administrador**: No hay usuario ADMINISTRADOR por defecto. Se debe crear manualmente si es necesario
5. **Base Limpia**: Ideal para iniciar en producción sin datos de prueba

## Recomendaciones Post-Despliegue

1. Crear el primer período académico activo
2. Configurar las fechas límite para ese período
3. Crear el catálogo de actividades predeterminadas
4. Configurar los parámetros del sistema en la tabla `configuraciones`
5. Cambiar las contraseñas predeterminadas de los usuarios iniciales
