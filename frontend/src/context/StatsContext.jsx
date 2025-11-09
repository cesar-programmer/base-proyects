/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useCallback } from 'react';
import reportService from '../services/reportService';

const StatsContext = createContext();

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats debe ser usado dentro de un StatsProvider');
  }
  return context;
};

export const StatsProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // ⭐ Obtenemos estadísticas generales de REPORTES
      console.log('🟢 [StatsContext] Iniciando fetch de estadísticas de reportes...');
      const reportStats = await reportService.getReportStats();
      console.log('📦 [StatsContext] Estadísticas de reportes (response.data.data):', reportStats);
      
      // Transformamos los datos de reportes al formato esperado por el dashboard
      const transformedStats = {
        completadas: reportStats.completados || 0,  // Reportes aprobados
        pendientes: reportStats.pendientes || 0,     // Reportes pendientes
        devueltas: reportStats.devueltos || 0,       // Reportes devueltos
        total: reportStats.total || 0,
        porcentajes: {
          completadas: reportStats.porcentajes?.completados || 0,
          pendientes: reportStats.porcentajes?.pendientes || 0,
          devueltas: reportStats.porcentajes?.devueltos || 0
        }
      };
      
      console.log('🧮 [StatsContext] Stats de reportes transformadas para gráfico:', transformedStats);
      
      setStats({
        ...transformedStats,
        _fullReportData: reportStats // Datos completos disponibles si se necesitan
      });
      console.log('✅ [StatsContext] Stats de reportes guardadas en contexto.');
    } catch (err) {
      console.error('❌ [StatsContext] Error fetching report stats:', err);
      setError('Error al cargar las estadísticas de reportes');
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    stats,
    loading,
    error,
    fetchStats
  };

  return (
    <StatsContext.Provider value={value}>
      {children}
    </StatsContext.Provider>
  );
};

export default StatsContext;