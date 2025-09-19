/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useCallback } from 'react';
import activityService from '../services/activityService';

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
    console.log('🔄 StatsContext: Iniciando fetchStats...');
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('📡 StatsContext: Llamando a activityService.getActivityStatsByStatus()...');
      const response = await activityService.getActivityStatsByStatus();
      
      console.log('📊 StatsContext: Respuesta recibida:', response);
      
      if (response && response.data) {
        console.log('✅ StatsContext: Usando response.data');
        setStats(response.data);
      } else if (response) {
        console.log('✅ StatsContext: Usando response directo');
        setStats(response);
      } else {
        console.log('❌ StatsContext: Respuesta vacía');
        setStats(null);
      }
      
      console.log('✅ StatsContext: Stats actualizados exitosamente');
      
    } catch (err) {
      console.error('❌ StatsContext: Error:', err.message);
      setError(err.message || 'Error al cargar estadísticas');
      setStats(null);
    } finally {
      setLoading(false);
      console.log('🏁 StatsContext: fetchStats completado');
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