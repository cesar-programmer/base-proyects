# Manual de Docker - Sistema de Gestión de Reportes Académicos

## Índice
1. [Introducción a Docker](#introducción-a-docker)
2. [Configuración del Proyecto](#configuración-del-proyecto)
3. [Servicios Configurados](#servicios-configurados)
4. [Comandos Principales](#comandos-principales)
5. [Relación con la Base de Datos](#relación-con-la-base-de-datos)
6. [Credenciales y Configuración](#credenciales-y-configuración)
7. [Solución de Problemas](#solución-de-problemas)
8. [Mantenimiento](#mantenimiento)

## Introducción a Docker

### ¿Qué es Docker?
Docker es una plataforma de contenedores que permite empaquetar aplicaciones y sus dependencias en contenedores ligeros y portables. En este proyecto, Docker se utiliza para:

- **Aislar el entorno de desarrollo**
- **Garantizar consistencia entre diferentes máquinas**
- **Simplificar la configuración de la base de datos**
- **Facilitar el despliegue y la colaboración**

### Beneficios en este Proyecto
- ✅ **MySQL preconfigurado** sin instalación local
- ✅ **Persistencia de datos** a través de volúmenes
- ✅ **Configuración automática** de red entre servicios
- ✅ **Aislamiento** del sistema host
- ✅ **Fácil reset** del entorno de desarrollo

## Configuración del Proyecto

### Archivo docker-compose.yml
El proyecto utiliza Docker Compose para orquestar los servicios. La configuración se encuentra en el archivo `docker-compose.yml` en la raíz del proyecto.

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: gestion_reportes_mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: gestion_reportes_academicos
      MYSQL_USER: app_user
      MYSQL_PASSWORD: app_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - app_network
    command: --default-authentication-plugin=mysql_native_password

volumes:
  mysql_data:
    driver: local

networks:
  app_network:
    driver: bridge
```

### Estructura de Archivos Docker
```
proyecto/
├── docker-compose.yml          # Configuración principal de Docker
├── .env                        # Variables de entorno
├── init.sql                    # Script de inicialización (opcional)
└── backend/
    ├── src/
    └── ...
```

## Servicios Configurados

### Servicio MySQL

#### Características
- **Imagen:** mysql:8.0 (versión estable y moderna)
- **Nombre del contenedor:** gestion_reportes_mysql
- **Puerto expuesto:** 3306 (puerto estándar de MySQL)
- **Reinicio automático:** unless-stopped
- **Plugin de autenticación:** mysql_native_password (compatibilidad)

#### Variables de Entorno
- `MYSQL_ROOT_PASSWORD`: Contraseña del usuario root
- `MYSQL_DATABASE`: Base de datos creada automáticamente
- `MYSQL_USER`: Usuario adicional de la aplicación
- `MYSQL_PASSWORD`: Contraseña del usuario de la aplicación

#### Volúmenes
- **mysql_data**: Persistencia de datos de MySQL
- **init.sql**: Script de inicialización (si existe)

#### Red
- **app_network**: Red bridge personalizada para comunicación entre servicios

## Comandos Principales

### Gestión de Contenedores

```bash
# Iniciar todos los servicios
docker-compose up -d

# Iniciar servicios en primer plano (ver logs)
docker-compose up

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: elimina datos)
docker-compose down -v

# Reiniciar servicios
docker-compose restart

# Reiniciar solo MySQL
docker-compose restart mysql
```

### Monitoreo y Logs

```bash
# Ver estado de los servicios
docker-compose ps

# Ver logs de todos los servicios
docker-compose logs

# Ver logs de MySQL en tiempo real
docker-compose logs -f mysql

# Ver logs de las últimas 100 líneas
docker-compose logs --tail=100 mysql
```

### Gestión de Datos

```bash
# Crear backup de la base de datos
docker-compose exec mysql mysqldump -u root -prootpassword gestion_reportes_academicos > backup.sql

# Restaurar backup
docker-compose exec -T mysql mysql -u root -prootpassword gestion_reportes_academicos < backup.sql

# Acceder a la consola de MySQL
docker-compose exec mysql mysql -u root -prootpassword

# Acceder a la base de datos específica
docker-compose exec mysql mysql -u root -prootpassword gestion_reportes_academicos
```

### Limpieza y Mantenimiento

```bash
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes no utilizadas
docker image prune

# Eliminar volúmenes no utilizados
docker volume prune

# Limpieza completa del sistema Docker
docker system prune -a
```

## Relación con la Base de Datos

### Flujo de Configuración

1. **Docker Compose levanta MySQL**
   - Crea el contenedor con MySQL 8.0
   - Configura las variables de entorno
   - Crea automáticamente la base de datos `gestion_reportes_academicos`

2. **Aplicación Backend se conecta**
   - Lee las credenciales del archivo `.env`
   - Se conecta a MySQL en `localhost:3306`
   - Utiliza Sequelize como ORM

3. **Migraciones y Seeders**
   - Se ejecutan contra la base de datos en Docker
   - Crean la estructura de tablas
   - Poblan con datos iniciales

### Ventajas de usar Docker para la BD

- **Aislamiento**: La base de datos no interfiere con otras instalaciones
- **Consistencia**: Misma versión de MySQL en todos los entornos
- **Facilidad**: No requiere instalación manual de MySQL
- **Limpieza**: Fácil reset del entorno de desarrollo
- **Portabilidad**: Funciona igual en Windows, Mac y Linux

### Persistencia de Datos

Los datos se almacenan en un volumen Docker llamado `mysql_data`, que:
- **Persiste** entre reinicios del contenedor
- **Se mantiene** aunque se elimine el contenedor
- **Se elimina** solo con `docker-compose down -v`

## Credenciales y Configuración

### Credenciales de MySQL en Docker

```bash
# Usuario Root (administrador completo)
Usuario: root
Contraseña: rootpassword
Base de datos: gestion_reportes_academicos
Host: localhost
Puerto: 3306

# Usuario de Aplicación (permisos limitados)
Usuario: app_user
Contraseña: app_password
Base de datos: gestion_reportes_academicos
Host: localhost
Puerto: 3306
```

### Configuración en .env

El archivo `.env` debe contener:

```env
# Configuración de Base de Datos (para conectar con Docker)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gestion_reportes_academicos
DB_USER=root
DB_PASSWORD=rootpassword
DB_DIALECT=mysql

# Alternativa con usuario de aplicación
# DB_USER=app_user
# DB_PASSWORD=app_password
```

### Configuración de Sequelize

En `src/config/database.js`:

```javascript
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: console.log
  }
};
```

## Solución de Problemas

### Error: "Port 3306 is already in use"
**Causa:** Otro servicio MySQL está ejecutándose en el puerto 3306.

**Soluciones:**
```bash
# Opción 1: Detener MySQL local
sudo systemctl stop mysql  # Linux
brew services stop mysql   # Mac
# Windows: Detener desde Servicios

# Opción 2: Cambiar puerto en docker-compose.yml
ports:
  - "3307:3306"  # Usar puerto 3307 externamente
```

### Error: "Connection refused"
**Causa:** El contenedor MySQL no está ejecutándose o no está listo.

**Soluciones:**
```bash
# Verificar estado del contenedor
docker-compose ps

# Ver logs para identificar problemas
docker-compose logs mysql

# Reiniciar el servicio
docker-compose restart mysql

# Esperar a que MySQL esté completamente iniciado
docker-compose exec mysql mysqladmin ping -h localhost
```

### Error: "Access denied for user"
**Causa:** Credenciales incorrectas en el archivo `.env`.

**Soluciones:**
1. Verificar las credenciales en `.env`
2. Asegurar que coincidan con `docker-compose.yml`
3. Reiniciar la aplicación backend

### Error: "Database does not exist"
**Causa:** La base de datos no se creó automáticamente.

**Soluciones:**
```bash
# Recrear el contenedor
docker-compose down
docker-compose up -d

# Crear manualmente la base de datos
docker-compose exec mysql mysql -u root -prootpassword -e "CREATE DATABASE IF NOT EXISTS gestion_reportes_academicos;"
```

### Contenedor no inicia
**Causas comunes:**
- Puerto ocupado
- Volumen corrupto
- Configuración incorrecta

**Soluciones:**
```bash
# Eliminar y recrear todo
docker-compose down -v
docker-compose up -d

# Ver logs detallados
docker-compose logs mysql
```

## Mantenimiento

### Rutinas de Mantenimiento

#### Backup Regular
```bash
# Script de backup diario
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec mysql mysqldump -u root -prootpassword gestion_reportes_academicos > "backup_${DATE}.sql"
```

#### Limpieza de Logs
```bash
# Limpiar logs de Docker
docker system prune

# Rotar logs de MySQL (configurar en docker-compose.yml)
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

#### Actualización de Imagen
```bash
# Actualizar a la última versión de MySQL 8.0
docker-compose pull mysql
docker-compose up -d mysql
```

### Monitoreo de Recursos

```bash
# Ver uso de recursos
docker stats gestion_reportes_mysql

# Ver espacio usado por volúmenes
docker system df

# Información detallada del contenedor
docker inspect gestion_reportes_mysql
```

### Configuración de Producción

Para producción, considerar:

1. **Credenciales seguras**
   ```yaml
   environment:
     MYSQL_ROOT_PASSWORD_FILE: /run/secrets/mysql_root_password
   secrets:
     mysql_root_password:
       file: ./secrets/mysql_root_password.txt
   ```

2. **Límites de recursos**
   ```yaml
   deploy:
     resources:
       limits:
         memory: 1G
         cpus: '0.5'
   ```

3. **Configuración de red**
   ```yaml
   networks:
     app_network:
       driver: bridge
       ipam:
         config:
           - subnet: 172.20.0.0/16
   ```

## Comandos de Desarrollo Frecuentes

### Flujo de Trabajo Típico

```bash
# 1. Iniciar entorno
docker-compose up -d

# 2. Verificar que MySQL esté listo
docker-compose logs mysql | grep "ready for connections"

# 3. Ejecutar migraciones
cd backend
npx sequelize-cli db:migrate

# 4. Poblar con datos
npx sequelize-cli db:seed:all

# 5. Iniciar aplicación
npm run dev

# 6. Al finalizar el día
docker-compose stop
```

### Reset Completo del Entorno

```bash
# CUIDADO: Esto elimina todos los datos
docker-compose down -v
docker-compose up -d
# Esperar a que MySQL esté listo
cd backend
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

---

**Nota Importante:** Docker facilita enormemente el desarrollo al proporcionar un entorno MySQL consistente y aislado. Asegúrate de hacer backups regulares de tus datos importantes y mantén actualizadas las imágenes de Docker para obtener las últimas correcciones de seguridad.