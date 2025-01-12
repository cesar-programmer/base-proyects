import AdminLayout from "../components/layout/AdminLayout"
import AdminDashboard from "../pages/admin/AdminDashboard"

export const adminRoutes = [
  {
    path: "/admin", //ruta padre
    element: <AdminLayout />, //layout del contenedor
    children: [ //rutas hijas
      { path: "dashboard", element: <AdminDashboard /> },
    ],
  },
]