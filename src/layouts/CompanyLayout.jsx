import { Outlet, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function CompanyLayout() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-xl ${
      isActive ? "bg-black text-white" : "hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">Placement Portal (Company)</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600">
            {user?.name} ({user?.role})
          </p>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex">
        <aside className="w-64 bg-white min-h-[calc(100vh-64px)] p-4 shadow-sm">
          <nav className="space-y-2">
            <NavLink to="/company/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/company/profile" className={linkClass}>
              Profile
            </NavLink>
            <NavLink to="/company/jobs" className={linkClass}>
              Manage Jobs
            </NavLink>
            <NavLink to="/company/interviews" className={linkClass}>
              Interviews
            </NavLink>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}