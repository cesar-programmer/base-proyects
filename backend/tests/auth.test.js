import request from 'supertest';
import app from '../src/index.js';
import { User, Role } from '../src/db/models/index.js';
import bcrypt from 'bcryptjs';

describe('Auth Controller', () => {
  let testUser;
  let adminRole;
  
  beforeEach(async () => {
    // Crear o encontrar rol de administrador
     [adminRole] = await Role.findOrCreate({
       where: { nombre: 'ADMINISTRADOR' },
       defaults: {
         nombre: 'ADMINISTRADOR',
         descripcion: 'Administrador del sistema',
         activo: true
       }
     });
    
    // Crear o encontrar usuario de prueba
    const hashedPassword = await bcrypt.hash('Test123!', 10);
    [testUser] = await User.findOrCreate({
      where: { email: 'test@test.com' },
      defaults: {
        nombre: 'Usuario',
        apellido: 'Test',
        email: 'test@test.com',
        password: hashedPassword,
        cedula: '12345678',
        rolId: adminRole.id,
        activo: true
      }
    });
  });
  
  describe('POST /api/v1/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@test.com',
          password: 'Test123!'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@test.com');
    });
    
    it('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'invalid@test.com',
          password: 'Test123!'
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
    
    it('should fail with invalid password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@test.com',
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
    
    it('should fail with missing fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@test.com'
          // password missing
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          nombre: 'Nuevo',
          apellido: 'Usuario',
          email: 'nuevo@test.com',
          password: 'NewUser123!',
          cedula: '87654321',
          rolId: adminRole.id
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('nuevo@test.com');
    });
    
    it('should fail with duplicate email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          nombre: 'Usuario',
          apellido: 'Duplicado',
          email: 'test@test.com', // Email ya existe
          password: 'Test123!',
          cedula: '11111111',
          rolId: adminRole.id
        });
      
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error');
    });
    
    it('should fail with invalid email format', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          nombre: 'Usuario',
          apellido: 'Test',
          email: 'invalid-email',
          password: 'Test123!',
          cedula: '22222222',
          rolId: adminRole.id
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
    
    it('should fail with weak password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          nombre: 'Usuario',
          apellido: 'Test',
          email: 'weak@test.com',
          password: '123', // Contraseña débil
          cedula: '33333333',
          rolId: adminRole.id
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('POST /api/v1/auth/verify-token', () => {
    let authToken;
    
    beforeEach(async () => {
      // Obtener token de autenticación
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@test.com',
          password: 'Test123!'
        });
      
      authToken = loginResponse.body.token;
    });
    
    it('should verify valid token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/verify-token')
        .send({
          token: authToken
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('valid', true);
      expect(response.body).toHaveProperty('user');
    });
    
    it('should reject invalid token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/verify-token')
        .send({
          token: 'invalid.token.here'
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('POST /api/v1/auth/change-password', () => {
    let authToken;
    
    beforeEach(async () => {
      // Obtener token de autenticación
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@test.com',
          password: 'Test123!'
        });
      
      authToken = loginResponse.body.token;
    });
    
    it('should change password successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'Test123!',
          newPassword: 'NewPassword123!'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
    
    it('should fail with wrong current password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'WrongPassword123!',
          newPassword: 'NewPassword123!'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
    
    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/auth/change-password')
        .send({
          currentPassword: 'Test123!',
          newPassword: 'NewPassword123!'
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
});