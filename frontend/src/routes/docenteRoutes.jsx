import DocenteLayout from "../components/layout/DocenteLayout";
import DocenteDashboard from "../pages/docente/DocenteDashboard";
import HistorialReportesDasboard from "../pages/docente/HistorialReportesDasboard";

export const docenteRoutes = [
  {
    path: "/docente", //ruta padre
    element: <DocenteLayout />, //layout del contenedor
    children: [ //rutas hijas
      { path: "dashboard", element: <DocenteDashboard /> },
      { path: "historial-reportes", element: <HistorialReportesDasboard /> },
    ],
  },
]