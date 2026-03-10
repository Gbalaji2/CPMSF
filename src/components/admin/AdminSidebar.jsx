import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-xl text-sm font-medium transition ${
      isActive
        ? "bg-black text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <NavLink to="/admin/dashboard" className={linkClass}>
        Dashboard
      </NavLink>

      <NavLink to="/admin/students" className={linkClass}>
        Students
      </NavLink>

      <NavLink to="/admin/companies" className={linkClass}>
        Companies
      </NavLink>

      <NavLink to="/admin/jobs" className={linkClass}>
        Jobs
      </NavLink>

      <NavLink to="/admin/drives" className={linkClass}>
        Drives
      </NavLink>

      <NavLink to="/admin/reports" className={linkClass}>
        Reports
      </NavLink>
    </div>
  );
}