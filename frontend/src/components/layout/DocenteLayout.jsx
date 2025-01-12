/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import DocenteNavbar from '../ui/DocenteNavbar';
import { Outlet } from "react-router-dom";


export default function DocenteLayout({ children }) {
  return (
    <div>
      <DocenteNavbar />
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  )
}