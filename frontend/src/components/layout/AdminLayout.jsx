/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import AdminNavbar from '../ui/AdminNavbar';
import { Outlet } from "react-router-dom";


export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}