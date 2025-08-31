import request from 'supertest';
import app from '../src/index.js';
import { Actividad, User, Role, PeriodoAcademico } from '../src/db/models/index.js';
import bcrypt from 'bcryptjs';

describe('Actividad Controller', () => {
  let testUser;
  let adminRole;
  let periodoAcademico;
  let testActividad;
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
    
    // Crear período académico
    periodoAcademico = await PeriodoAcademico.create({
      nombre: 'Período 2024-1',
      fecha_inicio: '2024-01-01',
      fecha_fin: '2024-06-30',
      activo: true,
      descripcion: 'Primer período académico 2024'
    });
    
    // Crear actividad de prueba
    testActividad = await Actividad.create({
      titulo: 'Actividad de Prueba',
      descripcion: 'Descripción de la actividad de prueba',
      fecha_inicio: '2024-02-01',
      fecha_fin: '2024-02-28',
      estado: 'planificada',
      categoria: 'academica',
      ubicacion: 'Aula 101',
      objetivos: 'Objetivos de la actividad',
      recursos_necesarios: 'Recursos necesarios',
      presupuesto_estimado: 1000.00,
      participantes_esperados: 25,
      id_docente: testUser.id,
      id_periodo_academico: periodoAcademico.id_periodo_academico
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
  
  describe('GET /api/v1/actividades', () => {
    it('should get all activities with authentication', async () => {
      const response = await request(app)
        .get('/api/v1/actividades')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
    
    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/v1/actividades');
      
      expect(response.status).toBe(401);
    });
  });
  
  describe('GET /api/v1/actividades/:id', () => {
    it('should get activity by id', async () => {
      const response = await request(app)
        .get(`/api/v1/actividades/${testActividad.id_actividad}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.titulo).toBe('Actividad de Prueba');
    });
    
    it('should return 404 for non-existent activity', async () => {
      const response = await request(app)
        .get('/api/v1/actividades/99999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('POST /api/v1/actividades', () => {
    it('should create a new activity', async () => {
      const newActivity = {
        titulo: 'Nueva Actividad',
        descripcion: 'Descripción de nueva actividad',
        fecha_inicio: '2024-03-01',
        fecha_fin: '2024-03-31',
        estado: 'planificada',
        categoria: 'cultural',
        ubicacion: 'Auditorio',
        objetivos: 'Objetivos de la nueva actividad',
        recursos_necesarios: 'Recursos para la nueva actividad',
        presupuesto_estimado: 2000.00,
        participantes_esperados: 50,
        id_periodo_academico: periodoAcademico.id_periodo_academico
      };
      
      const response = await request(app)
        .post('/api/v1/actividades')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newActivity);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.titulo).toBe('Nueva Actividad');
    });
    
    it('should fail with invalid data', async () => {
      const invalidActivity = {
        titulo: '', // Título vacío
        descripcion: 'Descripción'
      };
      
      const response = await request(app)
        .post('/api/v1/actividades')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidActivity);
      
      expect(response.status).toBe(400);
    });
  });
  
  describe('PUT /api/v1/actividades/:id', () => {
    it('should update activity successfully', async () => {
      const updateData = {
        titulo: 'Actividad Actualizada',
        estado: 'en_progreso'
      };
      
      const response = await request(app)
        .put(`/api/v1/actividades/${testActividad.id_actividad}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.titulo).toBe('Actividad Actualizada');
    });
    
    it('should return 404 for non-existent activity', async () => {
      const response = await request(app)
        .put('/api/v1/actividades/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ titulo: 'Test' });
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('DELETE /api/v1/actividades/:id', () => {
    it('should delete activity successfully', async () => {
      const response = await request(app)
        .delete(`/api/v1/actividades/${testActividad.id_actividad}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
    
    it('should return 404 for non-existent activity', async () => {
      const response = await request(app)
        .delete('/api/v1/actividades/99999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('GET /api/v1/actividades/periodo/:periodoId', () => {
    it('should get activities by academic period', async () => {
      const response = await request(app)
        .get(`/api/v1/actividades/periodo/${periodoAcademico.id_periodo_academico}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
  
  describe('GET /api/v1/actividades/usuario/:usuarioId', () => {
    it('should get activities by user', async () => {
      const response = await request(app)
        .get(`/api/v1/actividades/usuario/${testUser.id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});