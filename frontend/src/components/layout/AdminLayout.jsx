/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import AdminNavbar from '../ui/AdminNavbar';
import { Outlet } from "react-router-dom";


export default function AdminLayout({ children }) {
  return (
    <div>
      <AdminNavbar />
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  )
}