import request from 'supertest';
import app from '../src/index.js';
import { PeriodoAcademico, User, Role } from '../src/db/models/index.js';
import bcrypt from 'bcryptjs';

describe('Periodo Academico Controller', () => {
  let testUser;
  let adminRole;
  let testPeriodo;
  let authToken;
  
  beforeEach(async () => {
    // Crear o encontrar rol de administrador
    [adminRole] = await Role.findOrCreate({
      where: { nombre: 'ADMINISTRADOR' },
      defaults: {
        nombre: 'ADMINISTRADOR',
        descripcion: 'Administrador del sistema'
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
    
    // Crear período académico de prueba
    testPeriodo = await PeriodoAcademico.create({
      nombre: 'Período 2024-1',
      fecha_inicio: '2024-01-01',
      fecha_fin: '2024-06-30',
      activo: true,
      descripcion: 'Primer período académico 2024'
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
  
  describe('GET /api/v1/periodos-academicos', () => {
    it('should get all academic periods with authentication', async () => {
      const response = await request(app)
        .get('/api/v1/periodos-academicos')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
    
    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/v1/periodos-academicos');
      
      expect(response.status).toBe(401);
    });
  });
  
  describe('GET /api/v1/periodos-academicos/:id', () => {
    it('should get academic period by id', async () => {
      const response = await request(app)
        .get(`/api/v1/periodos-academicos/${testPeriodo.id_periodo_academico}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.nombre).toBe('Período 2024-1');
    });
    
    it('should return 404 for non-existent period', async () => {
      const response = await request(app)
        .get('/api/v1/periodos-academicos/99999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('POST /api/v1/periodos-academicos', () => {
    it('should create a new academic period', async () => {
      const newPeriod = {
        nombre: 'Período 2024-2',
        fecha_inicio: '2024-07-01',
        fecha_fin: '2024-12-31',
        activo: true,
        descripcion: 'Segundo período académico 2024'
      };
      
      const response = await request(app)
        .post('/api/v1/periodos-academicos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newPeriod);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.nombre).toBe('Período 2024-2');
    });
    
    it('should fail with invalid data', async () => {
      const invalidPeriod = {
        nombre: '', // Nombre vacío
        fecha_inicio: '2024-01-01'
      };
      
      const response = await request(app)
        .post('/api/v1/periodos-academicos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidPeriod);
      
      expect(response.status).toBe(400);
    });
    
    it('should fail with invalid date range', async () => {
      const invalidPeriod = {
        nombre: 'Período Inválido',
        fecha_inicio: '2024-12-31',
        fecha_fin: '2024-01-01', // Fecha fin antes que fecha inicio
        activo: true,
        descripcion: 'Período con fechas inválidas'
      };
      
      const response = await request(app)
        .post('/api/v1/periodos-academicos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidPeriod);
      
      expect(response.status).toBe(400);
    });
  });
  
  describe('PUT /api/v1/periodos-academicos/:id', () => {
    it('should update academic period successfully', async () => {
      const updateData = {
        nombre: 'Período Actualizado',
        descripcion: 'Descripción actualizada'
      };
      
      const response = await request(app)
        .put(`/api/v1/periodos-academicos/${testPeriodo.id_periodo_academico}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.nombre).toBe('Período Actualizado');
    });
    
    it('should return 404 for non-existent period', async () => {
      const response = await request(app)
        .put('/api/v1/periodos-academicos/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ nombre: 'Test' });
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('DELETE /api/v1/periodos-academicos/:id', () => {
    it('should delete academic period successfully', async () => {
      const response = await request(app)
        .delete(`/api/v1/periodos-academicos/${testPeriodo.id_periodo_academico}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
    
    it('should return 404 for non-existent period', async () => {
      const response = await request(app)
        .delete('/api/v1/periodos-academicos/99999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('GET /api/v1/periodos-academicos/activo', () => {
    it('should get active academic periods', async () => {
      const response = await request(app)
        .get('/api/v1/periodos-academicos/activo')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
  
  describe('PUT /api/v1/periodos-academicos/:id/activar', () => {
    it('should activate academic period', async () => {
      // Primero desactivar el período
      await testPeriodo.update({ activo: false });
      
      const response = await request(app)
        .put(`/api/v1/periodos-academicos/${testPeriodo.id_periodo_academico}/activar`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.activo).toBe(true);
    });
  });
  
  describe('PUT /api/v1/periodos-academicos/:id/desactivar', () => {
    it('should deactivate academic period', async () => {
      const response = await request(app)
        .put(`/api/v1/periodos-academicos/${testPeriodo.id_periodo_academico}/desactivar`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.activo).toBe(false);
    });
  });
});