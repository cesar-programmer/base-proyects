import { Route } from 'react-router-dom';
import DocenteLayout from "../components/layout/DocenteLayout";
import ProtectedRoute from '../components/ProtectedRoute';
import DocenteDashboard from "../pages/docente/DocenteDashboard";
import HistorialReportesDasboard from "../pages/docente/HistorialReportesDasboard";
import ReportesPendientesDashboard from "../pages/docente/ReportesPendientesDashboard";
import ActividadesPlanificadasDashboard from "../pages/docente/ActividadesPlanificadasDashboard";
import EstadisticasDashboard from "../pages/docente/EstadisticasDashboard";

const docenteRoutes = (
  <Route path="/docente" element={
    <ProtectedRoute requiredRole="DOCENTE">
      <DocenteLayout />
    </ProtectedRoute>
  }>
    <Route path="dashboard" element={<DocenteDashboard />} />
    <Route path="historial-reportes" element={<HistorialReportesDasboard />} />
    <Route path="reportes-pendientes" element={<ReportesPendientesDashboard />} />
    <Route path="actividades-planificadas" element={<ActividadesPlanificadasDashboard />} />
    <Route path="estadisticas" element={<EstadisticasDashboard />} />
  </Route>
);

export { docenteRoutes };