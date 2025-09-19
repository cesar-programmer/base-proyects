import React, { createContext, useContext, useState, useEffect } from 'react';
import activityService from '../services/activityService';
import { useAuth } from './AuthContext';

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
  const { user, token } = useAuth();

  const fetchStats = async () => {
    console.log('🔄 StatsContext: Iniciando fetchStats...');
    console.log('🔐 StatsContext: Verificando autenticación - user:', !!user, 'token:', !!token);
    
    if (!user || !token) {
      console.log('⚠️ StatsContext: Usuario no autenticado, saltando fetchStats');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('📡 StatsContext: Llamando a activityService.getActivityStatsByStatus()...');
      const response = await activityService.getActivityStatsByStatus();
      
      console.log('📊 StatsContext: Respuesta completa recibida:', response);
      console.log('📊 StatsContext: Tipo de respuesta:', typeof response);
      console.log('📊 StatsContext: Keys de la respuesta:', Object.keys(response || {}));
      
      if (response && response.data) {
        console.log('✅ StatsContext: Respuesta tiene propiedad data');
        console.log('📋 StatsContext: Contenido de response.data:', response.data);
        console.log('📋 StatsContext: Tipo de response.data:', typeof response.data);
        console.log('📋 StatsContext: Keys de response.data:', Object.keys(response.data || {}));
        
        if (response.data.porcentajes) {
          console.log('📈 StatsContext: Porcentajes encontrados:', response.data.porcentajes);
        }
        if (response.data.conteos) {
          console.log('🔢 StatsContext: Conteos encontrados:', response.data.conteos);
        }
        
        setStats(response.data);
      } else if (response) {
        console.log('⚠️ StatsContext: Respuesta no tiene propiedad data, usando respuesta directa');
        console.log('📋 StatsContext: Contenido directo de response:', response);
        
        if (response.porcentajes) {
          console.log('📈 StatsContext: Porcentajes encontrados (directo):', response.porcentajes);
        }
        if (response.conteos) {
          console.log('🔢 StatsContext: Conteos encontrados (directo):', response.conteos);
        }
        
        setStats(response);
      } else {
        console.log('❌ StatsContext: Respuesta vacía o null');
        setStats(null);
      }
      
      console.log('✅ StatsContext: Stats actualizados exitosamente');
      
    } catch (err) {
      console.error('❌ StatsContext: Error al obtener estadísticas:', err);
      console.error('❌ StatsContext: Detalles del error:', {
        message: err.message,
        stack: err.stack,
        response: err.response?.data
      });
      setError(err.message || 'Error al cargar estadísticas');
      setStats(null);
    } finally {
      setLoading(false);
      console.log('🏁 StatsContext: fetchStats completado');
    }
  };

  useEffect(() => {
    console.log('🚀 StatsContext: Componente montado o auth cambió, verificando si ejecutar fetchStats...');
    console.log('🔐 StatsContext: Estado de auth - user:', !!user, 'token:', !!token);
    
    if (user && token) {
      console.log('✅ StatsContext: Usuario autenticado, ejecutando fetchStats...');
      fetchStats();
    } else {
      console.log('⚠️ StatsContext: Usuario no autenticado, esperando...');
    }
  }, [user, token]);

  const value = {
    stats,
    loading,
    error,
    refetch: fetchStats
  };

  console.log('🔄 StatsContext: Renderizando provider con value:', {
    hasStats: !!stats,
    loading,
    error,
    statsKeys: stats ? Object.keys(stats) : null
  });

  return (
    <StatsContext.Provider value={value}>
      {children}
    </StatsContext.Provider>
  );
};

export default StatsContext;