import { Outlet, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function AdminLayout() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-black text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Top Navbar */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">
          Placement Portal (Admin / TPO)
        </h1>

        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600">
            {user?.name} ({user?.role})
          </p>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1">
        
        {/* Sidebar (Hidden on Mobile) */}
        <aside className="hidden md:block w-64 bg-white border-r p-4">
          <nav className="space-y-2">
            <NavLink to="/admin/dashboard" className={linkClass}>
              Dashboard
            </NavLink>

            <NavLink to="/admin/students" className={linkClass}>
              Students
            </NavLink>

            <NavLink to="/admin/companies" className={linkClass}>
              Companies
            </NavLink>

            <NavLink to="/admin/drives" className={linkClass}>
              Drives
            </NavLink>

            <NavLink to="/admin/reports" className={linkClass}>
              Reports
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}