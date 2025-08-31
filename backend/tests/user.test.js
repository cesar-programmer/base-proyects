import request from 'supertest';
import app from '../src/index.js';
import { User, Role } from '../src/db/models/index.js';
import bcrypt from 'bcryptjs';

describe('User Controller', () => {
  let testUser;
  let adminRole;
  let authToken;
  
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
    
    // Obtener token de autenticación
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'Test123!'
      });
    
    authToken = loginResponse.body.token;
  });
  
  describe('GET /api/v1/users', () => {
    it('should get all users with authentication', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
    
    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/v1/users');
      
      expect(response.status).toBe(401);
    });
  });
  
  describe('GET /api/v1/users/:id', () => {
    it('should get user by id', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${testUser.id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.email).toBe('test@test.com');
    });
    
    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/v1/users/99999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        nombre: 'Nuevo',
        apellido: 'Usuario',
        email: 'nuevo@test.com',
        password: 'NewUser123!',
        cedula: '87654321',
        rolId: adminRole.id
      };
      
      const response = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newUser);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.email).toBe('nuevo@test.com');
    });
    
    it('should fail with duplicate email', async () => {
      const duplicateUser = {
        nombre: 'Usuario',
        apellido: 'Duplicado',
        email: 'test@test.com', // Email ya existe
        password: 'Test123!',
        cedula: '11111111',
        rolId: adminRole.id
      };
      
      const response = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(duplicateUser);
      
      expect(response.status).toBe(400);
    });
  });
  
  describe('PUT /api/v1/users/:id', () => {
    it('should update user successfully', async () => {
      const updateData = {
        nombre: 'Usuario',
        apellido: 'Actualizado'
      };
      
      const response = await request(app)
        .put(`/api/v1/users/${testUser.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.nombre).toBe('Usuario');
      expect(response.body.data.apellido).toBe('Actualizado');
    });
    
    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .put('/api/v1/users/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ nombre: 'Test', apellido: 'User' });
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('DELETE /api/v1/users/:id', () => {
    it('should delete user successfully', async () => {
      const response = await request(app)
        .delete(`/api/v1/users/${testUser.id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
    
    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .delete('/api/v1/users/99999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });
  });
});