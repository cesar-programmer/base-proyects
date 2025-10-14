import { Route } from 'react-router-dom';
import DocenteLayout from "../components/layout/DocenteLayout";
import ProtectedRoute from '../components/ProtectedRoute';
import DocenteDashboard from "../pages/docente/DocenteDashboard";
import HistorialReportesDasboard from "../pages/docente/HistorialReportesDasboard";
import ReportesPendientesDashboard from "../pages/docente/ReportesPendientesDashboard";
import ActividadesPlanificadasDashboard from "../pages/docente/ActividadesPlanificadasDashboard";
import MisActividadesPeriodoActivo from "../pages/docente/MisActividadesPeriodoActivo";

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
    <Route path="mis-actividades-periodo" element={<MisActividadesPeriodoActivo />} />
  </Route>
);

export { docenteRoutes };