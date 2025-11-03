# Troubleshooting - Problemas Comunes

## Error: "No se encuentran los entry points para migrations/seeders"

### Problema
Cuando intentas ejecutar `npm run db:migrate` o `npm run db:seed` en una computadora diferente, aparece un error diciendo que no encuentra las rutas de migrations o seeders.

### Causas Comunes

1. **Archivo `.sequelizerc` no se encuentra o no se lee correctamente**
2. **Variables de entorno no configuradas**
3. **Dependencias no instaladas**
4. **Estructura de directorios incorrecta**

### Solución Paso a Paso

#### 1. Verificar que existe el archivo `.sequelizerc` en la raíz del proyecto backend

```bash
cd backend
ls -la .sequelizerc
# o en Windows
dir .sequelizerc
```

El archivo debe estar en `backend/.sequelizerc` y debe contener:

```javascript
const path = require('path');

module.exports = {
  'config': path.resolve('src', 'db', 'config.cjs'),
  'models-path': path.resolve('src', 'db', 'models'),
  'seeders-path': path.resolve('src', 'db', 'seeders'),
  'migrations-path': path.resolve('src', 'db', 'migrations')
};
```

#### 2. Verificar estructura de directorios

Asegúrate de que existen estas carpetas:

```
backend/
├── .sequelizerc
├── src/
│   └── db/
│       ├── config.cjs
│       ├── models/
│       ├── migrations/
│       └── seeders/
```

#### 3. Instalar todas las dependencias

```bash
cd backend
npm install
```

Esto instalará `sequelize-cli` que está en las devDependencies.

#### 4. Configurar variables de entorno

Crea un archivo `.env` en la carpeta `backend/` si no existe:

```env
# Base de datos
DB_HOST=localhost
DB_USER=user
DB_PASSWORD=password
DB_NAME=reportesdb
DB_PORT=3306
DB_DIALECT=mysql

# Node
NODE_ENV=development
PORT=3000

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui

# Frontend
FRONTEND_URL=http://localhost:5173
```

#### 5. Verificar que MySQL está corriendo

```bash
# En Docker
docker-compose up mysql -d

# O verifica el servicio local
mysql -u user -p
```

#### 6. Ejecutar migrations y seeders manualmente

```bash
cd backend

# Ejecutar migraciones
npm run db:migrate

# Si falla, prueba con npx directamente
npx sequelize-cli db:migrate --config src/db/config.cjs

# Ejecutar seeders
npm run db:seed

# O con npx
npx sequelize-cli db:seed:all --config src/db/config.cjs
```

#### 7. Si usas Docker, reconstruir los contenedores

```bash
# Desde la raíz del proyecto
docker-compose down -v
docker-compose build --no-cache backend
docker-compose up -d
```

### Verificación del Script docker-entrypoint.sh

El script mejorado ahora:

- ✅ Verifica que `.sequelizerc` existe
- ✅ Verifica la estructura de directorios
- ✅ Usa `npx sequelize-cli` con la configuración explícita
- ✅ Muestra mensajes de error claros
- ✅ Sale con código de error si falla

### Comandos de Diagnóstico

```bash
# Ver estructura de directorios
cd backend
tree -L 3 src/db
# o en Windows
tree /F src\db

# Verificar que sequelize-cli está instalado
npx sequelize-cli --version

# Ver configuración de Sequelize
node -e "console.log(require('./.sequelizerc'))"

# Probar conexión a la base de datos
npm run test:connection
```

### Errores Comunes y Soluciones

#### Error: "ENOENT: no such file or directory, open '.sequelizerc'"
**Solución**: Asegúrate de estar en la carpeta `backend/` cuando ejecutes los comandos.

```bash
cd backend
pwd  # Debe mostrar .../backend
```

#### Error: "Cannot find module 'sequelize-cli'"
**Solución**: Instala las dependencias.

```bash
npm install
# o
npm install --save-dev sequelize-cli
```

#### Error: "Access denied for user"
**Solución**: Verifica las credenciales en `.env` o en `docker-compose.yml`.

#### Error: "Database 'reportesdb' doesn't exist"
**Solución**: Crea la base de datos manualmente.

```bash
# Conéctate a MySQL
mysql -u root -p

# Crea la base de datos
CREATE DATABASE reportesdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON reportesdb.* TO 'user'@'%';
FLUSH PRIVILEGES;
EXIT;
```

### Verificación Final

Para verificar que todo está funcionando correctamente:

```bash
# 1. Verificar estructura
ls -la src/db/migrations/*.js
ls -la src/db/seeders/*.js

# 2. Verificar configuración
cat src/db/config.cjs

# 3. Probar migrations
npm run db:migrate

# 4. Probar seeders
npm run db:seed

# 5. Iniciar servidor
npm run dev
```

## Soporte Adicional

Si el problema persiste:

1. Revisa los logs completos del error
2. Verifica que tienes los permisos correctos en los archivos
3. Asegúrate de que no hay espacios o caracteres especiales en las rutas
4. Prueba clonar el repositorio en una ubicación diferente
5. Verifica que tu versión de Node.js es compatible (v16+)

```bash
# Verificar versiones
node --version  # Debe ser v16 o superior
npm --version
mysql --version
```
