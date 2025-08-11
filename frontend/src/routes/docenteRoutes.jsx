import DocenteLayout from "../components/layout/DocenteLayout";
import DocenteDashboard from "../pages/docente/DocenteDashboard";
import HistorialReportesDasboard from "../pages/docente/HistorialReportesDasboard";
import ReportesPendientesDashboard from "../pages/docente/ReportesPendientesDashboard";
import ActividadesPlanificadasDashboard from "../pages/docente/ActividadesPlanificadasDashboard";

export const docenteRoutes = [
  {
    path: "/docente", //ruta padre
    element: <DocenteLayout />, //layout del contenedor
    children: [ //rutas hijas
      { path: "dashboard", element: <DocenteDashboard /> },
      { path: "historial-reportes", element: <HistorialReportesDasboard /> },
      { path: "reportes-pendientes", element: <ReportesPendientesDashboard /> },
      { path: "actividades-planificadas", element: <ActividadesPlanificadasDashboard /> },
    ],
  },
]