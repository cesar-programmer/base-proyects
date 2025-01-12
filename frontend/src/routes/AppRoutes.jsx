import { Routes, Route } from "react-router-dom";
import { adminRoutes } from './adminRoutes';
import { docenteRoutes } from './docenteRoutes';
import HomePage from "../pages/Home";
import LoginPageDocente from "../pages/docente/Login";
import LoginPageAdmin from "../pages/admin/Login";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/docente/login" element={<LoginPageDocente/>} />
      <Route path="/admin/login" element={<LoginPageAdmin/>} />


      {/* Rutas de administrador */}
      {/* se recorre el arreglo de rutas de adminRoutes y se renderiza cada ruta padre y sus rutas hijas */}
      {adminRoutes.map((route) => (
        <Route key={route.path} path={route.path}>
          <Route element={route.element}>
            {route.children.map((child) => (
              <Route
                key={child.path}
                path={child.path}
                element={child.element}
              />
            ))}
          </Route>
        </Route>
      ))}

      {/* Rutas de docente */}
      {docenteRoutes.map((route) => (
        <Route key={route.path} path={route.path}>
          <Route element={route.element}>
            {route.children.map((child) => (
              <Route
                key={child.path}
                path={child.path}
                element={child.element}
              />
            ))}
          </Route>
        </Route>
      ))}
    </Routes>
  )
}