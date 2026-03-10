import { NavLink } from "react-router-dom";

export default function StudentSidebar() {
  const links = [
    { to: "/student/dashboard", label: "Dashboard" },
    { to: "/student/jobs", label: "Jobs" },
    { to: "/student/applications", label: "Applications" },
    { to: "/student/interviews", label: "Interviews" },
    { to: "/student/profile", label: "Profile" },
  ];

  return (
    <aside className="w-64 hidden md:block bg-white shadow-sm border-r">
      <div className="p-5 border-b">
        <h2 className="text-xl font-bold">Placement Portal</h2>
        <p className="text-xs text-gray-500">Student Panel</p>
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