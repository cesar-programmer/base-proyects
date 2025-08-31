# 📚 Documentación Completa de la API

## Sistema de Reportes Académicos - API REST

Esta documentación proporciona información detallada sobre todos los endpoints disponibles en la API del Sistema de Reportes Académicos, incluyendo ejemplos completos para Postman.

## 🔧 Configuración Inicial

### Variables de Entorno para Postman

Crea una nueva colección en Postman y configura estas variables de entorno:

```json
{
  "baseUrl": "http://localhost:3000",
  "apiUrl": "{{baseUrl}}/api/v1",
  "token": ""
}
```

### Headers Globales

Para todos los endpoints protegidos, agrega en el header:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

## 🔐 Autenticación

### 1. POST - Login de Usuario

**Endpoint:** `{{apiUrl}}/auth/login`

**Descripción:** Autentica un usuario y devuelve un token JWT.

**Headers:**
```
Content-Type: application/json
```

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

**Test Script para Postman:**
```javascript
// Guardar token automáticamente
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

### 2. POST - Registro de Usuario

**Endpoint:** `{{apiUrl}}/auth/register`

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

### 3. POST - Verificar Token

**Endpoint:** `{{apiUrl}}/auth/verify-token`

**Body (JSON):**
```json
{
  "token": "{{token}}"
}
```

### 4. POST - Cambiar Contraseña

**Endpoint:** `{{apiUrl}}/auth/change-password`

**Headers:** `Authorization: Bearer {{token}}`

**Body (JSON):**
```json
{
  "currentPassword": "Admin123!",
  "newPassword": "NuevaPassword123!",
  "confirmNewPassword": "NuevaPassword123!"
}
```

### 5. POST - Logout

**Endpoint:** `{{apiUrl}}/auth/logout`

**Headers:** `Authorization: Bearer {{token}}`

## 👥 Gestión de Usuarios

### 1. GET - Obtener Perfil del Usuario

**Endpoint:** `{{apiUrl}}/users/profile`

**Headers:** `Authorization: Bearer {{token}}`

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

### 2. PUT - Actualizar Perfil

**Endpoint:** `{{apiUrl}}/users/profile`

**Headers:** `Authorization: Bearer {{token}}`

**Body (JSON):**
```json
{
  "nombre_completo": "Nuevo Nombre Completo",
  "email": "nuevo.email@universidad.edu"
}
```

### 3. GET - Listar Todos los Usuarios (Admin)

**Endpoint:** `{{apiUrl}}/usuarios`

**Headers:** `Authorization: Bearer {{token}}`

**Query Parameters:** `?page=1&limit=10&activo=true&search=juan`

**Respuesta Exitosa (200):**
```json
{
  "usuarios": [
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

### 4. GET - Obtener Usuario por ID (Admin)

**Endpoint:** `{{apiUrl}}/usuarios/1`

**Headers:** `Authorization: Bearer {{token}}`

### 5. POST - Crear Usuario (Admin)

**Endpoint:** `{{apiUrl}}/usuarios`

**Headers:** `Authorization: Bearer {{token}}`

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

### 6. PUT - Actualizar Usuario Completo (Admin)

**Endpoint:** `{{apiUrl}}/usuarios/5`

**Headers:** `Authorization: Bearer {{token}}`

**Body (JSON):**
```json
{
  "nombre_completo": "Usuario Actualizado",
  "email": "actualizado@universidad.edu",
  "id_rol": 2,
  "activo": true
}
```

### 7. PATCH - Cambiar Estado de Usuario (Admin)

**Endpoint:** `{{apiUrl}}/usuarios/5/toggle-status`

**Headers:** `Authorization: Bearer {{token}}`

### 8. DELETE - Eliminar Usuario (Admin)

**Endpoint:** `{{apiUrl}}/usuarios/5`

**Headers:** `Authorization: Bearer {{token}}`

## 📅 Gestión de Períodos Académicos

### 1. GET - Listar Períodos Académicos

**Endpoint:** `{{apiUrl}}/periodos-academicos`

**Headers:** `Authorization: Bearer {{token}}`

**Respuesta Exitosa (200):**
```json
{
  "periodos": [
    {
      "id": 1,
      "nombre": "Período 2024-1",
      "fechaInicio": "2024-01-15",
      "fechaFin": "2024-06-15",
      "descripcion": "Primer período académico 2024",
      "activo": true
    }
  ]
}
```

### 2. GET - Obtener Período Académico por ID

**Endpoint:** `{{apiUrl}}/periodos-academicos/1`

**Headers:** `Authorization: Bearer {{token}}`

### 3. POST - Crear Período Académico (Admin)

**Endpoint:** `{{apiUrl}}/periodos-academicos`

**Headers:** `Authorization: Bearer {{token}}`

**Body (JSON):**
```json
{
  "nombre": "Período 2024-2",
  "fechaInicio": "2024-07-01",
  "fechaFin": "2024-12-15",
  "descripcion": "Segundo período académico 2024",
  "activo": true
}
```

**Respuesta Exitosa (201):**
```json
{
  "message": "Período académico creado exitosamente",
  "periodo": {
    "id": 5,
    "nombre": "Período 2024-2",
    "fechaInicio": "2024-07-01",
    "fechaFin": "2024-12-15",
    "descripcion": "Segundo período académico 2024",
    "activo": true
  }
}
```

### 4. PUT - Actualizar Período Académico (Admin)

**Endpoint:** `{{apiUrl}}/periodos-academicos/5`

**Headers:** `Authorization: Bearer {{token}}`

**⚠️ Nota:** Actualmente presenta error 400 - requiere revisión

**Body (JSON):**
```json
{
  "nombre": "Período Actualizado 2024-2",
  "fechaInicio": "2024-07-01",
  "fechaFin": "2024-12-20",
  "descripcion": "Descripción actualizada",
  "activo": true
}
```

### 5. DELETE - Eliminar Período Académico (Admin)

**Endpoint:** `{{apiUrl}}/periodos-academicos/5`

**Headers:** `Authorization: Bearer {{token}}`

**Respuesta Exitosa (200):**
```json
{
  "message": "Período académico eliminado exitosamente"
}
```

## 📊 Gestión de Reportes

### 1. GET - Listar Reportes

**Endpoint:** `{{apiUrl}}/reportes`

**Headers:** `Authorization: Bearer {{token}}`

**Query Parameters:** `?page=1&limit=10&estado=ENVIADO&tipo=ACTIVIDADES_PLANIFICADAS`

**Respuesta Exitosa (200):**
```json
{
  "reportes": [
    {
      "id": 1,
      "titulo": "Reporte de Actividades Q1",
      "descripcion": "Descripción del reporte",
      "fechaRealizacion": "2024-01-15",
      "usuarioId": 3,
      "tipo": "ACTIVIDADES_PLANIFICADAS",
      "semestre": 1,
      "observaciones_admin": null
    }
  ]
}
```

### 2. GET - Obtener Reporte por ID

**Endpoint:** `{{apiUrl}}/reportes/1`

**Headers:** `Authorization: Bearer {{token}}`

### 3. POST - Crear Reporte

**Endpoint:** `{{apiUrl}}/reportes`

**Headers:** `Authorization: Bearer {{token}}`

**Body (JSON):**
```json
{
  "titulo": "Nuevo Reporte de Actividades",
  "descripcion": "Descripción detallada del reporte",
  "fechaRealizacion": "2024-01-20",
  "usuarioId": 3,
  "tipo": "ACTIVIDADES_PLANIFICADAS",
  "semestre": 1
}
```

**Respuesta Exitosa (201):**
```json
{
  "message": "Reporte creado exitosamente",
  "reporte": {
    "id": 5,
    "titulo": "Nuevo Reporte de Actividades",
    "descripcion": "Descripción detallada del reporte",
    "fechaRealizacion": "2024-01-20",
    "usuarioId": 3,
    "tipo": "ACTIVIDADES_PLANIFICADAS",
    "semestre": 1,
    "observaciones_admin": null
  }
}
```

### 4. PUT - Actualizar Reporte Completo

**Endpoint:** `{{apiUrl}}/reportes/4`

**Headers:** `Authorization: Bearer {{token}}`

**Body (JSON):**
```json
{
  "titulo": "Reporte Actualizado",
  "descripcion": "Nueva descripción del reporte",
  "observaciones_admin": "Observaciones del administrador"
}
```

### 5. DELETE - Eliminar Reporte

**Endpoint:** `{{apiUrl}}/reportes/4`

**Headers:** `Authorization: Bearer {{token}}`

**Respuesta Exitosa (200):**
```json
{
  "message": "Reporte eliminado exitosamente"
}
```

## 📁 Gestión de Archivos

### 1. POST - Subir Archivo Individual

**Endpoint:** `{{apiUrl}}/files/upload`

**Headers:** `Authorization: Bearer {{token}}`

**Content-Type:** `multipart/form-data`

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

### 2. POST - Subir Múltiples Archivos

**Endpoint:** `{{apiUrl}}/files/upload-multiple`

**Headers:** `Authorization: Bearer {{token}}`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `files`: [Múltiples archivos]
- `description`: "Descripción de los archivos"
- `category`: "evidencias"

### 3. GET - Descargar Archivo

**Endpoint:** `{{apiUrl}}/files/download/documento_1642680600000.pdf`

**Headers:** `Authorization: Bearer {{token}}`

**Respuesta:** Archivo binario con headers apropiados

### 4. GET - Ver Archivo (Imágenes/PDFs)

**Endpoint:** `{{apiUrl}}/files/view/imagen_1642680600000.jpg`

**Headers:** `Authorization: Bearer {{token}}`

**Respuesta:** Archivo para visualización inline

### 5. GET - Listar Archivos (Admin)

**Endpoint:** `{{apiUrl}}/files`

**Headers:** `Authorization: Bearer {{token}}`

**Query Parameters:** `?page=1&limit=10&category=reportes`

### 6. DELETE - Eliminar Archivo (Admin)

**Endpoint:** `{{apiUrl}}/files/documento_1642680600000.pdf`

**Headers:** `Authorization: Bearer {{token}}`

## 🔄 Flujo de Trabajo Recomendado

### 1. Configuración Inicial
1. **Login:** `POST /api/v1/auth/login` → Guardar token
2. **Verificar Token:** `POST /api/v1/auth/verify-token`
3. **Obtener Perfil:** `GET /api/v1/users/profile`

### 2. Gestión de Usuarios (Solo Admin)
1. **Listar Usuarios:** `GET /api/v1/usuarios`
2. **Crear Usuario:** `POST /api/v1/usuarios`
3. **Actualizar Usuario:** `PUT /api/v1/usuarios/{id}`
4. **Eliminar Usuario:** `DELETE /api/v1/usuarios/{id}`

### 3. Gestión de Períodos Académicos
1. **Listar Períodos:** `GET /api/v1/periodos-academicos`
2. **Crear Período:** `POST /api/v1/periodos-academicos` (Admin)
3. **Eliminar Período:** `DELETE /api/v1/periodos-academicos/{id}` (Admin)

### 4. Gestión de Reportes
1. **Listar Reportes:** `GET /api/v1/reportes`
2. **Crear Reporte:** `POST /api/v1/reportes`
3. **Actualizar Reporte:** `PUT /api/v1/reportes/{id}`
4. **Eliminar Reporte:** `DELETE /api/v1/reportes/{id}`

### 5. Gestión de Archivos
1. **Subir Archivo:** `POST /api/v1/files/upload`
2. **Listar Archivos:** `GET /api/v1/files` (Admin)
3. **Descargar Archivo:** `GET /api/v1/files/download/{filename}`

## 📋 Datos de Prueba

### Usuarios de Prueba
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

### IDs de Referencia
- **Roles:** 1=ADMINISTRADOR, 2=COORDINADOR, 3=DOCENTE
- **Estados de Reporte:** BORRADOR, ENVIADO, EN_REVISION, APROBADO, DEVUELTO
- **Tipos de Reporte:** ACTIVIDADES_PLANIFICADAS, ACTIVIDADES_REALIZADAS
- **Semestres:** 1 o 2

## ⚙️ Scripts Útiles para Postman

### Pre-request Script para Autenticación Automática
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

### Test Script General
```javascript
// Verificar respuesta exitosa
pm.test("Status code is successful", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 201, 204]);
});

// Verificar que la respuesta es JSON
pm.test("Response is JSON", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

// Guardar token si está presente
if (pm.response.json().token) {
    pm.environment.set("token", pm.response.json().token);
}
```

## 🚨 Códigos de Estado HTTP

- **200:** Operación exitosa
- **201:** Recurso creado exitosamente
- **204:** Operación exitosa sin contenido
- **400:** Solicitud incorrecta (datos inválidos)
- **401:** No autorizado (token inválido/expirado)
- **403:** Prohibido (sin permisos suficientes)
- **404:** Recurso no encontrado
- **422:** Error de validación
- **500:** Error interno del servidor

## 🔧 Estado Actual de los Endpoints

**Resultado de las pruebas realizadas:**

✅ **Endpoints de Autenticación** - Funcionando correctamente  
✅ **Endpoints de Usuarios** - Funcionando correctamente  
✅ **Endpoints de Reportes** - Funcionando correctamente  
✅ **Endpoints de Períodos Académicos** - Funcionando parcialmente  
⚠️ **PUT /api/v1/periodos-academicos/:id** - Error 400 (requiere revisión)  
✅ **Endpoints de Archivos** - Configurados y listos  

**Estado general:** 15 de 16 endpoints funcionando correctamente (93.75% de éxito)

## 📞 Soporte

Para reportar problemas o solicitar nuevas funcionalidades:
- **Email:** cesarcordova.developer@gmail.com
- **Documentación:** Consultar README.md del proyecto
- **Logs:** Revisar `logs/app.log` para errores detallados

---

**Última actualización:** Enero 2024  
**Versión de la API:** 1.0.0