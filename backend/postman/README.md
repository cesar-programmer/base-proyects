# Colección de Postman - Sistema de Reportes Académicos

Esta carpeta contiene la colección completa de Postman para probar todos los endpoints del Sistema de Reportes Académicos.

## 📁 Archivos Incluidos

- `Sistema_Reportes_Academicos.postman_collection.json` - Colección principal con todos los endpoints
- `Sistema_Reportes_Academicos.postman_environment.json` - Entorno de variables para desarrollo local
- `README.md` - Este archivo con instrucciones de uso

## 🚀 Configuración Inicial

### 1. Importar en Postman

1. Abre Postman
2. Haz clic en "Import" en la esquina superior izquierda
3. Arrastra y suelta ambos archivos JSON o selecciónalos manualmente:
   - `Sistema_Reportes_Academicos.postman_collection.json`
   - `Sistema_Reportes_Academicos.postman_environment.json`
4. Confirma la importación

### 2. Configurar el Entorno

1. En Postman, selecciona el entorno "Sistema Reportes Académicos - Local" en el dropdown superior derecho
2. Verifica que las variables estén configuradas correctamente:
   - `apiUrl`: `http://localhost:3000/api/v1`
   - `baseUrl`: `http://localhost:3000`
   - `adminEmail`: `admin@universidad.edu`
   - `adminPassword`: `Admin123!`
   - `token`: (se llenará automáticamente al hacer login)

### 3. Iniciar el Servidor

Asegúrate de que el servidor backend esté ejecutándose:

```bash
cd backend
npm run dev
```

El servidor debe estar disponible en `http://localhost:3000`

## 🔐 Flujo de Autenticación

### Paso 1: Login
1. Ve a la carpeta "🔐 Autenticación"
2. Ejecuta la petición "Login"
3. El token se guardará automáticamente en la variable de entorno `token`
4. Este token se usará automáticamente en todas las peticiones subsecuentes

### Paso 2: Verificar Autenticación (Opcional)
- Puedes usar "Verificar Token" para confirmar que el token es válido

## 📋 Estructura de la Colección

### 🔐 Autenticación
- **Login** - Iniciar sesión y obtener token JWT
- **Registro** - Crear nueva cuenta de usuario
- **Verificar Token** - Validar token actual
- **Cambiar Contraseña** - Actualizar contraseña del usuario
- **Logout** - Cerrar sesión

### 👥 Usuarios
- **Obtener Perfil** - Ver información del usuario actual
- **Actualizar Perfil** - Modificar datos del perfil
- **Listar Usuarios (Admin)** - Ver todos los usuarios (solo administradores)
- **Obtener Usuario por ID (Admin)** - Ver usuario específico
- **Crear Usuario (Admin)** - Crear nuevo usuario
- **Actualizar Usuario (Admin)** - Modificar usuario existente
- **Cambiar Estado Usuario (Admin)** - Activar/desactivar usuario
- **Eliminar Usuario (Admin)** - Eliminar usuario

### 📅 Períodos Académicos
- **Listar Períodos Académicos** - Ver todos los períodos
- **Obtener Período por ID** - Ver período específico
- **Crear Período Académico (Admin)** - Crear nuevo período
- **Actualizar Período (Admin)** - ⚠️ **Error 400 conocido**
- **Eliminar Período (Admin)** - Eliminar período

### 📊 Reportes
- **Listar Reportes** - Ver todos los reportes
- **Obtener Reporte por ID** - Ver reporte específico
- **Crear Reporte** - Crear nuevo reporte
- **Actualizar Reporte** - Modificar reporte existente
- **Eliminar Reporte** - Eliminar reporte

### 📁 Archivos
- **Subir Archivo** - Subir archivo asociado a un reporte
- **Listar Archivos** - Ver todos los archivos
- **Descargar Archivo** - Descargar archivo específico
- **Eliminar Archivo** - Eliminar archivo

## 🔄 Flujo de Pruebas Recomendado

1. **Autenticación**
   - Ejecutar "Login" con credenciales de administrador
   - Verificar que el token se guarde automáticamente

2. **Gestión de Usuarios**
   - Listar usuarios existentes
   - Crear un nuevo usuario
   - Actualizar el usuario creado
   - Cambiar estado del usuario
   - Eliminar el usuario de prueba

3. **Períodos Académicos**
   - Listar períodos existentes
   - Crear un nuevo período
   - ⚠️ **Nota**: El endpoint PUT tiene un error 400 conocido
   - Eliminar el período de prueba

4. **Reportes**
   - Listar reportes existentes
   - Crear un nuevo reporte
   - Actualizar el reporte
   - Eliminar el reporte de prueba

5. **Archivos**
   - Subir un archivo de prueba
   - Listar archivos
   - Descargar el archivo
   - Eliminar el archivo de prueba

## ⚠️ Problemas Conocidos

### Error 400 en PUT /api/v1/periodos-academicos/:id
- **Descripción**: El endpoint de actualización de períodos académicos devuelve un error 400
- **Estado**: Identificado durante las pruebas
- **Workaround**: Usar DELETE y POST para "actualizar" (eliminar y recrear)

## 🔧 Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `apiUrl` | URL base de la API | `http://localhost:3000/api/v1` |
| `baseUrl` | URL base del servidor | `http://localhost:3000` |
| `token` | Token JWT (se llena automáticamente) | `` |
| `adminEmail` | Email del administrador | `admin@universidad.edu` |
| `adminPassword` | Contraseña del administrador | `Admin123!` |

## 📝 Scripts Automáticos

### Login Automático
La petición de "Login" incluye un script que:
- Guarda automáticamente el token JWT en la variable de entorno
- Verifica que la respuesta sea exitosa (status 200)
- Confirma que el token esté presente en la respuesta

### Configuración Global
La colección incluye scripts globales que:
- Configuran automáticamente la URL de la API si no está definida
- Manejan errores de respuesta mostrando información útil en la consola

## 🆘 Solución de Problemas

### El servidor no responde
1. Verifica que el servidor esté ejecutándose: `npm run dev`
2. Confirma que esté en el puerto 3000
3. Revisa los logs del servidor para errores

### Token expirado
1. Ejecuta nuevamente la petición "Login"
2. El nuevo token se guardará automáticamente

### Error 401 Unauthorized
1. Verifica que hayas hecho login
2. Confirma que la variable `token` tenga un valor
3. Ejecuta "Verificar Token" para validar el token actual

### Error 403 Forbidden
1. Verifica que tu usuario tenga los permisos necesarios
2. Algunas operaciones requieren rol de administrador

## 📞 Soporte

Para reportar problemas o solicitar nuevas funcionalidades, consulta la documentación principal del proyecto en el archivo `README.md` del directorio raíz del backend.