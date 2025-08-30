// Configuración de variables de entorno para testing
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'reportes_db_test';
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.LOG_LEVEL = 'error';
process.env.PORT = '3001';