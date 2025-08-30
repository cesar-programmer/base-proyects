# 📚 Tutorial Completo - Backend Sistema de Reportes Académicos

## 🎯 ¿Qué contiene este tutorial?

Este tutorial está diseñado para usuarios de todos los niveles técnicos. Explica desde conceptos básicos hasta implementación avanzada del backend, incluyendo:

1. **Conceptos básicos**: Para qué sirven las migraciones y dependencias
2. **Pruebas del código**: Cómo verificar que todo funciona correctamente
3. **Arquitectura del sistema**: Cómo está organizado el proyecto
4. **Guía de ejecución**: Pasos para poner en marcha la aplicación

---

## 🔰 **CONCEPTOS BÁSICOS PARA PRINCIPIANTES**

### 🗄️ **¿Qué son las Migraciones y para qué sirven?**

Las migraciones son como un **"sistema de control de versiones para tu base de datos"**. Imagina que tu base de datos es como un edificio:

#### **Analogía simple:**
- **Sin migraciones**: Es como construir un edificio sin planos. Cada persona construye como quiere.
- **Con migraciones**: Es como tener planos arquitectónicos que todos siguen paso a paso.

#### **¿Qué te permiten hacer?**
✅ **Crear y modificar tablas** de forma estructurada y ordenada  
✅ **Mantener un historial** de todos los cambios en la base de datos  
✅ **Trabajar en equipo** sin conflictos - todos tienen la misma estructura  
✅ **Revertir cambios** si algo sale mal (como un "Ctrl+Z" para la base de datos)  
✅ **Sincronizar** entre desarrollo, testing y producción  

#### **Ejemplo práctico:**
```
Día 1: Crear tabla "usuarios" → Migración 001
Día 5: Agregar columna "teléfono" → Migración 002
Día 10: Crear tabla "reportes" → Migración 003
```

Cada migración es un paso que se puede aplicar o deshacer.

### 📦 **Dependencias: ¿Qué son y por qué las usamos?**

Las dependencias son como **"herramientas especializadas"** que otros programadores ya crearon y que podemos usar en nuestro proyecto.

#### **Analogía simple:**
Es como construir una casa:
- **Sin dependencias**: Tendrías que fabricar tus propios clavos, martillos, etc.
- **Con dependencias**: Compras herramientas ya hechas y te enfocas en construir.

#### **Dependencias principales de nuestro proyecto:**

| Dependencia | ¿Qué hace? | Analogía |
|-------------|------------|----------|
| **Express** | Framework principal para crear el servidor web | Es como el "esqueleto" de una casa |
| **Sequelize** | Herramienta para hablar con la base de datos | Es como un "traductor" entre tu código y la base de datos |
| **bcryptjs** | Encripta contraseñas para seguridad | Es como una "caja fuerte" para passwords |
| **jsonwebtoken** | Maneja la autenticación de usuarios | Es como un "pase de seguridad" temporal |
| **joi** | Valida que los datos sean correctos | Es como un "inspector de calidad" |
| **multer** | Maneja la subida de archivos | Es como un "cartero" para archivos |
| **cors** | Permite que el frontend se conecte al backend | Es como un "portero" que decide quién puede entrar |
| **helmet** | Agrega seguridad extra | Es como "sistemas de alarma" adicionales |
| **morgan** | Registra todas las peticiones | Es como una "cámara de seguridad" que graba todo |
| **dotenv** | Maneja configuraciones sensibles | Es como un "archivo secreto" para passwords |

#### **Dependencias de desarrollo:**
| Dependencia | ¿Qué hace? |
|-------------|------------|
| **nodemon** | Reinicia automáticamente el servidor cuando cambias código |
| **jest** | Herramienta para hacer pruebas automáticas |
| **supertest** | Prueba las APIs sin usar el navegador |
| **eslint** | Revisa que el código esté bien escrito |
| **prettier** | Formatea el código para que se vea ordenado |

---

## 🧪 **PRUEBAS DEL CÓDIGO - ¿Cómo verificar que todo funciona?**

### **¿Por qué hacer pruebas?**
Las pruebas son como **"revisiones médicas"** para tu código:
- Detectan problemas antes de que los usuarios los vean
- Te dan confianza de que los cambios no rompen nada
- Documentan cómo debe funcionar cada parte

### **A. Pruebas Unitarias** 🔬
**¿Qué son?** Prueban una función específica de forma aislada.

**Ejemplo simple:**
```javascript
// Función a probar
function sumar(a, b) {
  return a + b;
}

// Prueba unitaria
test('sumar 2 + 3 debe dar 5', () => {
  expect(sumar(2, 3)).toBe(5);
});
```

**En nuestro proyecto:**
```javascript
// Probar validación de contraseña
test('contraseña fuerte debe ser válida', () => {
  const resultado = validarPassword('MiPassword123!');
  expect(resultado.esValida).toBe(true);
});
```

### **B. Pruebas de Integración** 🔗
**¿Qué son?** Prueban que varios componentes trabajen juntos correctamente.

**Ejemplo en nuestro proyecto:**
```javascript
// Probar login completo (controlador + servicio + base de datos)
test('login con credenciales correctas', async () => {
  const respuesta = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'usuario@test.com',
      password: 'Password123!'
    });
  
  expect(respuesta.status).toBe(200);
  expect(respuesta.body.token).toBeDefined();
});
```

### **C. Pruebas End-to-End (E2E)** 🎭
**¿Qué son?** Simulan el comportamiento completo de un usuario real.

**Ejemplo de flujo completo:**
```javascript
test('flujo completo: login → crear reporte → eliminar reporte', async () => {
  // 1. Usuario se loguea
  const login = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'docente@test.com', password: 'Test123!' });
  
  const token = login.body.token;
  
  // 2. Usuario crea un reporte
  const nuevoReporte = await request(app)
    .post('/api/v1/reportes')
    .set('Authorization', `Bearer ${token}`)
    .send({
      titulo: 'Mi Reporte de Prueba',
      descripcion: 'Descripción del reporte'
    });
  
  // 3. Usuario elimina el reporte
  const eliminar = await request(app)
    .delete(`/api/v1/reportes/${nuevoReporte.body.id}`)
    .set('Authorization', `Bearer ${token}`);
  
  expect(eliminar.status).toBe(200);
});
```

### **Comandos para ejecutar pruebas:**
```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas y ver cobertura
npm run test:coverage

# Ejecutar pruebas en modo "watch" (se ejecutan automáticamente al cambiar código)
npm run test:watch
```

---

## 🏗️ **ARQUITECTURA DEL BACKEND**

### **¿Cómo está organizado el proyecto?**

Nuestro backend sigue el patrón **MVC (Model-View-Controller)** y está organizado como una **"fábrica bien estructurada"**:

```
backend/
├── src/
│   ├── config/          # 🔧 "Sala de configuraciones"
│   ├── controllers/     # 🎮 "Gerentes" - manejan las peticiones
│   ├── db/             # 🗄️ "Almacén" - base de datos
│   ├── middleware/     # 🛡️ "Guardias de seguridad"
│   ├── routes/         # 🛣️ "Mapas de rutas"
│   ├── schemas/        # ✅ "Inspectores de calidad"
│   ├── services/       # ⚙️ "Trabajadores especializados"
│   └── libs/           # 🧰 "Caja de herramientas"
└── tests/              # 🧪 "Laboratorio de pruebas"
```

### **Flujo de una petición (Request Flow):**

```
1. 📱 Cliente (Frontend) envía petición
        ↓
2. 🛣️ Routes recibe y dirige la petición
        ↓
3. 🛡️ Middleware verifica permisos y valida datos
        ↓
4. 🎮 Controller procesa la lógica de la petición
        ↓
5. ⚙️ Service ejecuta la lógica de negocio
        ↓
6. 🗄️ Model interactúa con la base de datos
        ↓
7. 📤 Respuesta regresa al cliente
```

### **Responsabilidades de cada capa:**

#### **🛣️ Routes (Rutas)**
- **¿Qué hacen?** Definen qué URL responde a qué función
- **Ejemplo:** `GET /api/v1/usuarios` → función para obtener usuarios

#### **🛡️ Middleware**
- **¿Qué hacen?** Son "filtros" que procesan las peticiones antes de llegar al controlador
- **Ejemplos:**
  - Verificar que el usuario esté logueado
  - Validar que los datos sean correctos
  - Registrar la petición en los logs

#### **🎮 Controllers (Controladores)**
- **¿Qué hacen?** Son los "gerentes" que coordinan todo
- **Responsabilidades:**
  - Recibir la petición
  - Llamar al servicio apropiado
  - Formatear la respuesta

#### **⚙️ Services (Servicios)**
- **¿Qué hacen?** Contienen la lógica de negocio pura
- **Ejemplo:** Calcular el promedio de calificaciones, enviar emails, etc.

#### **🗄️ Models (Modelos)**
- **¿Qué hacen?** Representan las tablas de la base de datos
- **Ejemplo:** Modelo `Usuario` representa la tabla `usuarios`

### **Patrones de Diseño Implementados:**

#### **1. MVC (Model-View-Controller)**
```
Model (Sequelize) ←→ Controller ←→ View (JSON Response)
```

#### **2. Repository Pattern**
```javascript
// En lugar de acceder directamente a la BD desde el controller:
// ❌ MAL
const usuario = await Usuario.findByPk(id);

// ✅ BIEN - usando service
const usuario = await UsuarioService.obtenerPorId(id);
```

#### **3. Middleware Pattern**
```javascript
// Cadena de middleware
router.post('/reportes',
  verificarToken,        // ¿Está logueado?
  validarEsquema,       // ¿Los datos son correctos?
  verificarRol,         // ¿Tiene permisos?
  crearReporte          // Crear el reporte
);
```

---

## 🗄️ **SISTEMA DE MIGRACIONES - Guía Detallada**

### **¿Cómo funcionan las migraciones paso a paso?**

#### **Paso 1: Crear una migración**
```bash
# Crear migración para nueva tabla
npx sequelize-cli migration:generate --name crear-tabla-usuarios

# Esto crea un archivo como:
# 20240120150000-crear-tabla-usuarios.js
```

#### **Paso 2: Escribir la migración**
```javascript
// 20240120150000-crear-tabla-usuarios.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ⬆️ SUBIR: Crear la tabla
    await queryInterface.createTable('usuarios', {
      id_usuario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre_completo: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    // ⬇️ BAJAR: Eliminar la tabla (rollback)
    await queryInterface.dropTable('usuarios');
  }
};
```

#### **Paso 3: Aplicar la migración**
```bash
# Aplicar todas las migraciones pendientes
npm run db:migrate

# Ver estado de migraciones
npx sequelize-cli db:migrate:status
```

### **Comandos útiles de migraciones:**

```bash
# 📋 Ver estado actual
npx sequelize-cli db:migrate:status

# ⬆️ Aplicar migraciones
npm run db:migrate

# ⬇️ Revertir última migración
npm run db:migrate:undo

# ⬇️ Revertir todas las migraciones
npm run db:migrate:undo:all

# 🌱 Aplicar seeders (datos iniciales)
npm run db:seed

# 🔄 Reset completo (revertir todo + aplicar todo + seeders)
npm run db:reset
```

### **Buenas prácticas para migraciones:**

✅ **SÍ hacer:**
- Siempre probar en desarrollo antes de producción
- Hacer backup antes de aplicar en producción
- Usar nombres descriptivos para las migraciones
- Escribir siempre la función `down` para rollback

❌ **NO hacer:**
- Modificar migraciones ya aplicadas en producción
- Eliminar migraciones que ya están en producción
- Hacer cambios destructivos sin backup

---

## 🚀 **GUÍA DE EJECUCIÓN - Paso a Paso**

### **Requisitos del Sistema**

#### **Software necesario:**
- **Node.js** v18.0.0 o superior → [Descargar aquí](https://nodejs.org/)
- **MySQL** v8.0 o superior → [Descargar aquí](https://dev.mysql.com/downloads/)
- **Git** → [Descargar aquí](https://git-scm.com/)

#### **Verificar instalaciones:**
```bash
# Verificar Node.js
node --version
# Debe mostrar algo como: v18.17.0

# Verificar npm
npm --version
# Debe mostrar algo como: 9.6.7

# Verificar MySQL
mysql --version
# Debe mostrar la versión de MySQL
```

### **Configuración Inicial - Paso a Paso**

#### **Paso 1: Preparar el proyecto**
```bash
# Navegar a la carpeta del backend
cd backend

# Instalar todas las dependencias
npm install
```

#### **Paso 2: Configurar variables de entorno**
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar el archivo .env con tus datos
# En Windows: notepad .env
# En Mac/Linux: nano .env
```

**Ejemplo de archivo .env:**
```env
# Configuración del servidor
PORT=3000
NODE_ENV=development

# Configuración de base de datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=reportes_db
DB_USER=root
DB_PASSWORD=tu_password_mysql

# Configuración JWT (cambiar por algo seguro)
JWT_SECRET=mi_clave_super_secreta_y_larga_123456789
JWT_EXPIRES_IN=24h

# Configuración de logs
LOG_LEVEL=info
```

#### **Paso 3: Configurar la base de datos**
```bash
# Conectar a MySQL
mysql -u root -p

# Crear las bases de datos
CREATE DATABASE reportes_db;
CREATE DATABASE reportes_db_test;

# Salir de MySQL
exit
```

#### **Paso 4: Ejecutar migraciones y seeders**
```bash
# Aplicar todas las migraciones (crear tablas)
npm run db:migrate

# Insertar datos iniciales
npm run db:seed
```

### **Iniciar la Aplicación**

#### **Modo Desarrollo:**
```bash
# Iniciar servidor en modo desarrollo (con auto-reload)
npm run dev

# Deberías ver algo como:
# 🚀 Servidor corriendo en puerto 3000
# 📊 Base de datos conectada
# 🔗 API disponible en: http://localhost:3000
```

#### **Modo Producción:**
```bash
# Iniciar en modo producción
npm start
```

### **Verificar que todo funciona**

#### **1. Health Check:**
```bash
# En otra terminal, verificar que el servidor responde
curl http://localhost:3000/health

# Respuesta esperada:
{
  "status": "OK",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "database": "connected"
}
```

#### **2. Probar endpoint de API:**
```bash
# Obtener información de la API
curl http://localhost:3000/api/v1

# Respuesta esperada:
{
  "message": "API Sistema de Reportes v1.0",
  "version": "1.0.0",
  "endpoints": ["/auth", "/users", "/reportes", "/files"]
}
```

#### **3. Ejecutar pruebas:**
```bash
# Ejecutar todas las pruebas (método estándar)
npm test

# Ejecutar pruebas con soporte completo para ES Modules
node --experimental-vm-modules ./node_modules/jest/bin/jest.js

# Si todo está bien configurado, verás:
# ✓ Auth Controller tests running
# Tests: 13 total (pueden fallar sin BD de testing)
```

### **Comandos Útiles para el Día a Día**

```bash
# 🚀 Desarrollo
npm run dev              # Iniciar servidor desarrollo
npm test                 # Ejecutar pruebas
npm run test:watch       # Pruebas en modo watch

# 🗄️ Base de datos
npm run db:migrate       # Aplicar migraciones
npm run db:seed          # Insertar datos iniciales
npm run db:reset         # Reset completo de BD

# 🔍 Debugging
npm run lint             # Revisar código
npm run format           # Formatear código

# 📦 Producción
npm start                # Iniciar en producción
npm run build            # Preparar para producción
```

---

## 🧪 **PRUEBAS AUTOMATIZADAS (TESTING)**

### **¿Qué son las pruebas automatizadas?**

Las pruebas automatizadas son como **"inspectores de calidad"** que verifican que tu código funcione correctamente de forma automática.

#### **Analogía simple:**
- **Sin pruebas**: Es como enviar un producto sin revisarlo - puede tener defectos
- **Con pruebas**: Es como tener inspectores que revisan cada parte antes de enviar

### **¿Por qué son importantes?**

✅ **Detectan errores** antes de que lleguen a los usuarios  
✅ **Ahorran tiempo** - no tienes que probar manualmente cada función  
✅ **Dan confianza** para hacer cambios sin romper nada  
✅ **Documentan** cómo debe funcionar el código  
✅ **Facilitan el trabajo en equipo** - todos saben qué debe funcionar  

### **Comandos para Ejecutar Pruebas**

#### **Método Estándar:**
```bash
npm test
```

#### **Método con ES Modules (Recomendado):**
```bash
node --experimental-vm-modules ./node_modules/jest/bin/jest.js
```

**¿Por qué necesitamos el segundo comando?**  
Nuestro proyecto usa **ES Modules** (la forma moderna de importar código en JavaScript). Jest necesita un flag especial para entender esta sintaxis.

### **¿Qué Prueban Nuestros Tests?**

#### **🔐 Pruebas de Autenticación (Auth Controller)**

Nuestras pruebas verifican que el sistema de login funcione correctamente:

**1. Login Exitoso:**
```javascript
// Prueba: ¿Puede un usuario válido iniciar sesión?
test('should login successfully with valid credentials')
```

**2. Login Fallido:**
```javascript
// Prueba: ¿Se rechaza a usuarios con credenciales incorrectas?
test('should fail with invalid email')
test('should fail with invalid password')
```

**3. Validaciones:**
```javascript
// Prueba: ¿Se validan correctamente los datos de entrada?
test('should validate email format')
test('should validate password requirements')
```

**4. Tokens JWT:**
```javascript
// Prueba: ¿Se generan tokens de seguridad válidos?
test('should generate valid JWT token')
```

### **Resultados de las Pruebas**

#### **✅ Cuando todo funciona:**
```
🧪 Running tests...

✓ Auth Controller
  ✓ should login successfully with valid credentials
  ✓ should fail with invalid email  
  ✓ should fail with invalid password
  ✓ should generate valid JWT token
  ✓ should register new user successfully
  ✓ should validate email format
  ✓ should validate password requirements
  ...

Tests: 13 passed, 13 total
Time: 2.5s
```

#### **❌ Fallos Esperados (Sin Base de Datos):**
```
🧪 Running tests...

✗ Auth Controller  
  ✗ should login successfully with valid credentials
  ✗ should fail with invalid email
  ✗ should register new user successfully
  ...

Tests: 0 passed, 13 failed
Time: 1.8s
```

**¿Por qué fallan las pruebas?**  
Las pruebas fallan porque **no hay una base de datos de testing configurada**. Esto es normal y esperado en este proyecto.

### **¿Qué Significan los Resultados?**

#### **🎯 Lo Importante:**
1. **Las pruebas se ejecutan** - significa que el código está sintácticamente correcto
2. **Los módulos ES se cargan** - la conversión a ES Modules fue exitosa
3. **Jest funciona** - el framework de testing está configurado correctamente

#### **🔧 Para que las pruebas pasen completamente:**
1. Configurar base de datos de testing
2. Crear datos de prueba (seeders)
3. Configurar variables de entorno para testing

### **Interpretación de Mensajes**

```bash
# ✅ Mensaje exitoso
"Jest ran successfully with --experimental-vm-modules"
# Significa: La conversión a ES Modules funciona

# ⚠️ Mensaje de advertencia
"Tests failed due to database connection"
# Significa: El código está bien, falta configurar la BD

# ❌ Mensaje de error crítico
"SyntaxError: Unexpected token"
# Significa: Hay un problema de sintaxis en el código
```

### **Monitoreo y Logs**

#### **Ver logs en tiempo real:**
```bash
# Ver todos los logs
tail -f logs/app.log

# Ver solo errores
tail -f logs/error.log

# En Windows (PowerShell)
Get-Content logs/app.log -Wait
```

#### **Logs importantes a revistar:**
- **Info**: Operaciones normales (login, creación de reportes)
- **Warning**: Situaciones sospechosas (intentos de login fallidos)
- **Error**: Errores que requieren atención (fallos de BD, errores 500)

---

## 🔧 **SOLUCIÓN DE PROBLEMAS COMUNES**

### **Error: "Cannot connect to database"**
```bash
# Verificar que MySQL esté corriendo
# Windows:
net start mysql80

# Mac:
brew services start mysql

# Linux:
sudo systemctl start mysql

# Verificar credenciales en .env
# Asegúrate de que DB_USER, DB_PASSWORD, DB_HOST sean correctos
```

### **Error: "Port 3000 already in use"**
```bash
# Encontrar qué proceso usa el puerto
# Windows:
netstat -ano | findstr :3000

# Mac/Linux:
lsof -i :3000

# Cambiar puerto en .env
PORT=3001
```

### **Error: "JWT_SECRET is required"**
```bash
# Verificar que el archivo .env existe y tiene JWT_SECRET
cat .env | grep JWT_SECRET

# Si no existe, agregarlo:
echo "JWT_SECRET=mi_clave_secreta_123" >> .env
```

### **Error en migraciones**
```bash
# Ver estado de migraciones
npx sequelize-cli db:migrate:status

# Si hay migraciones pendientes
npm run db:migrate

# Si hay errores, revertir y volver a aplicar
npm run db:migrate:undo
npm run db:migrate
```

---

## 📚 **RECURSOS ADICIONALES**

### **Documentación oficial:**
- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Jest Testing](https://jestjs.io/)
- [Node.js](https://nodejs.org/docs/)

### **Herramientas recomendadas:**
- **Postman**: Para probar APIs → [Descargar](https://www.postman.com/)
- **MySQL Workbench**: Para gestionar la base de datos → [Descargar](https://dev.mysql.com/downloads/workbench/)
- **VS Code**: Editor de código → [Descargar](https://code.visualstudio.com/)

### **Extensiones útiles para VS Code:**
- **REST Client**: Para probar APIs desde VS Code
- **MySQL**: Para conectar a la base de datos
- **Jest**: Para ejecutar pruebas
- **ESLint**: Para revisar código
- **Prettier**: Para formatear código

---

## 🎯 **PRÓXIMOS PASOS**

Una vez que tengas el backend funcionando:

1. **Familiarízate con la API** usando Postman
2. **Explora los endpoints** disponibles en `/api/v1`
3. **Revisa los logs** para entender el flujo de datos
4. **Ejecuta las pruebas** para ver cómo funcionan
5. **Modifica algo pequeño** y observa los cambios



**¿Necesitas ayuda?** 
- Revisa los logs en `logs/app.log`
- Ejecuta las pruebas con `npm test`
- Verifica la configuración en `.env`
- Consulta este tutorial para recordar los conceptos

