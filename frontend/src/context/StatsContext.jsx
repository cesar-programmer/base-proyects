/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useCallback } from 'react';
import estadisticaService from '../services/estadisticaService';

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
      // ⭐ Ahora obtenemos TODAS las estadísticas de una vez
      console.log('🟢 [StatsContext] Iniciando fetch de dashboard stats...');
      const dashboardData = await estadisticaService.getDashboardStats();
      console.log('📦 [StatsContext] Datos completos del dashboard (response.data.data):', dashboardData);
      if (dashboardData?.general) {
        const g = dashboardData.general;
        console.log('🔹 [StatsContext] General:', {
          totalUsuarios: g.totalUsuarios,
          usuariosActivos: g.usuariosActivos,
          totalReportes: g.totalReportes,
          totalActividades: g.totalActividades,
          totalNotificaciones: g.totalNotificaciones,
        });
      }
      if (dashboardData?.actividades) {
        const a = dashboardData.actividades;
        console.log('🔹 [StatsContext] Actividades:', {
          total: a.total,
          aprobadas: a.aprobadas,
          pendientes: a.pendientes,
          devueltas: a.devueltas,
        });
      }
      
      // Transformamos para mantener compatibilidad con el código existente
      const transformedStats = estadisticaService.transformActivityStatsForDashboard(dashboardData);
      console.log('🧮 [StatsContext] Stats transformadas para gráfico:', transformedStats);
      
      // Guardamos tanto los datos transformados como los completos
      setStats({
        ...transformedStats,
        _fullDashboardData: dashboardData // Datos completos disponibles si se necesitan
      });
      console.log('✅ [StatsContext] Stats guardadas en contexto.');
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Error al cargar las estadísticas del dashboard');
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