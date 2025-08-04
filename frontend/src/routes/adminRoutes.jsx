import AdminLayout from "../components/layout/AdminLayout"
import AdminDashboard from "../pages/admin/AdminDashboard"
import EstadisticasDashboard from "../pages/admin/EstadisticasDashboard"
import ConfiguracionRecordatorioDashboard from "../pages/admin/ConfiguracionRecordatorioDashboard"
import GestionUsuariosDashboard from "../pages/admin/GestionUsuariosDashboard"
import ConfiguracionFechasDashboard from "../pages/admin/ConfiguracionFechasDasboard"
import CorreccionesDashboard from "../pages/admin/CorreccionesDashboard"
import RevisionActividadesDashboard from "../pages/admin/RevisionActividadesDashboard"
export const adminRoutes = [
  {
    path: "/admin", //ruta padre
    element: <AdminLayout />, //layout del contenedor
    children: [ //rutas hijas
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "estadisticas", element: <EstadisticasDashboard /> },
      { path: "configuracion-recordatorio", element: <ConfiguracionRecordatorioDashboard /> },
      { path: "gestion-usuarios", element: <GestionUsuariosDashboard /> },
      { path: "configuracion-fechas", element: <ConfiguracionFechasDashboard /> },
      { path: "correcciones", element: <CorreccionesDashboard /> },
      { path: "historial-reportes", element: <RevisionActividadesDashboard /> },
    ],
  },
]