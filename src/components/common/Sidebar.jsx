import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Sidebar() {
  const { user } = useAuth();

  const role = user?.role;

  const studentLinks = [
    { to: "/student/dashboard", label: "Dashboard" },
    { to: "/student/jobs", label: "Jobs" },
    { to: "/student/applications", label: "Applications" },
    { to: "/student/interviews", label: "Interviews" },
    { to: "/student/profile", label: "Profile" },
  ];

  const companyLinks = [
    { to: "/company/dashboard", label: "Dashboard" },
    { to: "/company/jobs", label: "My Jobs" },
    { to: "/company/jobs/new", label: "Post Job" },
    { to: "/company/interviews", label: "Interviews" },
    { to: "/company/profile", label: "Profile" },
  ];

  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/students", label: "Students" },
    { to: "/admin/companies", label: "Companies" },
    { to: "/admin/drives", label: "Drives" },
    { to: "/admin/reports", label: "Reports" },
  ];

  const links =
    role === "student" ? studentLinks : role === "company" ? companyLinks : adminLinks;

  return (
    <aside className="w-64 hidden md:block bg-white shadow-sm border-r">
      <div className="p-5 border-b">
        <h2 className="text-xl font-bold">Portal</h2>
        <p className="text-xs text-gray-500 capitalize">{role} Panel</p>
      </div>

      <nav className="p-4 space-y-2">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}