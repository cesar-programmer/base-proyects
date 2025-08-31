import request from 'supertest';
import app from '../src/index.js';
import { Reporte, Actividad, User, Role, PeriodoAcademico } from '../src/db/models/index.js';
import bcrypt from 'bcryptjs';

describe('Reporte Controller', () => {
  let testUser;
  let adminRole;
  let periodoAcademico;
  let testActividad;
  let testReporte;
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
      estado: 'COMPLETADA',
      ubicacion: 'Aula 101',
      objetivos: 'Objetivos de la actividad',
      recursos_necesarios: 'Recursos necesarios',
      presupuesto_estimado: 1000.00,
      participantes_esperados: 25,
      id_docente: testUser.id,
      id_periodo_academico: periodoAcademico.id_periodo_academico
    });
    
    // Crear reporte de prueba
    testReporte = await Reporte.create({
      titulo: 'Reporte de Prueba',
      descripcion: 'Descripción del reporte de prueba',
      fecha_realizacion: '2024-02-15',
      participantes_reales: 23,
      resultados_obtenidos: 'Resultados obtenidos en la actividad',
      observaciones: 'Observaciones del reporte',
      recomendaciones: 'Recomendaciones para futuras actividades',
      estado: 'BORRADOR',
      id_actividad: testActividad.id_actividad,
      id_docente: testUser.id
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
  
  describe('GET /api/v1/reportes', () => {
    it('should get all reports with authentication', async () => {
      const response = await request(app)
        .get('/api/v1/reportes')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
    
    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/v1/reportes');
      
      expect(response.status).toBe(401);
    });
  });
  
  describe('GET /api/v1/reportes/:id', () => {
    it('should get report by id', async () => {
      const response = await request(app)
        .get(`/api/v1/reportes/${testReporte.id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.titulo).toBe('Reporte de Prueba');
    });
    
    it('should return 404 for non-existent report', async () => {
      const response = await request(app)
        .get('/api/v1/reportes/99999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('POST /api/v1/reportes', () => {
    it('should create a new report', async () => {
      const newReport = {
        titulo: 'Nuevo Reporte',
        descripcion: 'Descripción del nuevo reporte',
        fechaRealizacion: '2024-03-15',
        participantesReales: 30,
        resultados: 'Resultados del nuevo reporte',
        observaciones: 'Observaciones del nuevo reporte',
        recomendaciones: 'Recomendaciones del nuevo reporte',
        estado: 'borrador',
        evidencias: 'Evidencias del nuevo reporte',
        actividadId: testActividad.id
      };
      
      const response = await request(app)
        .post('/api/v1/reportes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newReport);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.titulo).toBe('Nuevo Reporte');
    });
    
    it('should fail with invalid data', async () => {
      const invalidReport = {
        titulo: '', // Título vacío
        descripcion: 'Descripción'
      };
      
      const response = await request(app)
        .post('/api/v1/reportes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidReport);
      
      expect(response.status).toBe(400);
    });
  });
  
  describe('PUT /api/v1/reportes/:id', () => {
    it('should update report successfully', async () => {
      const updateData = {
        titulo: 'Reporte Actualizado',
        estado: 'enviado'
      };
      
      const response = await request(app)
        .put(`/api/v1/reportes/${testReporte.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.titulo).toBe('Reporte Actualizado');
    });
    
    it('should return 404 for non-existent report', async () => {
      const response = await request(app)
        .put('/api/v1/reportes/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ titulo: 'Test' });
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('DELETE /api/v1/reportes/:id', () => {
    it('should delete report successfully', async () => {
      const response = await request(app)
        .delete(`/api/v1/reportes/${testReporte.id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
    
    it('should return 404 for non-existent report', async () => {
      const response = await request(app)
        .delete('/api/v1/reportes/99999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('GET /api/v1/reportes/actividad/:actividadId', () => {
    it('should get reports by activity', async () => {
      const response = await request(app)
        .get(`/api/v1/reportes/actividad/${testActividad.id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
  
  describe('GET /api/v1/reportes/usuario/:usuarioId', () => {
    it('should get reports by user', async () => {
      const response = await request(app)
        .get(`/api/v1/reportes/usuario/${testUser.id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
  
  describe('PUT /api/v1/reportes/:id/estado', () => {
    it('should update report status', async () => {
      const response = await request(app)
        .put(`/api/v1/reportes/${testReporte.id}/estado`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ estado: 'aprobado' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.estado).toBe('aprobado');
    });
  });
});