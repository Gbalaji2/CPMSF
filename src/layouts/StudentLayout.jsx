import { Outlet, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function StudentLayout() {
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
          Placement Portal (Student)
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

      {/* Body Section */}
      <div className="flex flex-1">
        
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm p-4 hidden md:block">
          <nav className="space-y-2">
            <NavLink to="/student/dashboard" className={linkClass}>
              Dashboard
            </NavLink>

            <NavLink to="/student/profile" className={linkClass}>
              Profile
            </NavLink>

            <NavLink to="/student/jobs" className={linkClass}>
              Jobs
            </NavLink>

            <NavLink to="/student/applications" className={linkClass}>
              Applications
            </NavLink>

            <NavLink to="/student/interviews" className={linkClass}>
              Interviews
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}