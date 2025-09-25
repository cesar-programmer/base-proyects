import { Route } from 'react-router-dom';
import AdminLayout from "../components/layout/AdminLayout"
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from "../pages/admin/AdminDashboard"
import EstadisticasDashboard from "../pages/admin/EstadisticasDashboard"
import ConfiguracionRecordatorioDashboard from "../pages/admin/ConfiguracionRecordatorioDashboard"
import GestionUsuariosDashboard from "../pages/admin/GestionUsuariosDashboard"
import ConfiguracionFechasDashboard from "../pages/admin/ConfiguracionFechasDasboard"
import RevisionActividadesDashboard from "../pages/admin/RevisionActividadesDashboard"
import CorreccionesDashboard from "../pages/admin/CorreccionesDashboard"
const adminRoutes = (
  <Route path="/admin" element={
    <ProtectedRoute requiredRole="ADMINISTRADOR">
      <AdminLayout />
    </ProtectedRoute>
  }>
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="estadisticas" element={<EstadisticasDashboard />} />
    <Route path="configuracion-recordatorio" element={<ConfiguracionRecordatorioDashboard />} />
    <Route path="gestion-usuarios" element={<GestionUsuariosDashboard />} />
    <Route path="configuracion-fechas" element={<ConfiguracionFechasDashboard />} />
    <Route path="revision-actividades" element={<RevisionActividadesDashboard />} />
    <Route path="revision-reportes" element={<CorreccionesDashboard />} />
  </Route>
);

export { adminRoutes };