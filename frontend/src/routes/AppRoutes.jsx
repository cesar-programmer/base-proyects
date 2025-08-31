import { Routes, Route } from 'react-router-dom';
import { adminRoutes } from './adminRoutes';
import { docenteRoutes } from './docenteRoutes';
import Home from '../pages/Home';
import LoginDocente from '../pages/docente/Login';
import LoginAdmin from '../pages/admin/Login';

function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/docente/login" element={<LoginDocente />} />
      <Route path="/admin/login" element={<LoginAdmin />} />
      
      {/* Rutas protegidas */}
      {adminRoutes}
      {docenteRoutes}
    </Routes>
  );
}

export default AppRoutes;