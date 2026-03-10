import { NavLink } from "react-router-dom";

export default function CompanySidebar() {
  const links = [
    { to: "/company/dashboard", label: "Dashboard" },
    { to: "/company/jobs", label: "My Jobs" },
    { to: "/company/jobs/new", label: "Post Job" },
    { to: "/company/profile", label: "Profile" },
  ];

  return (
    <aside className="w-64 hidden md:flex flex-col bg-white border-r">
      <div className="p-5 border-b">
        <h2 className="text-xl font-bold">Placement Portal</h2>
        <p className="text-xs text-gray-500">Company Panel</p>
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

      <div className="mt-auto p-4 text-xs text-gray-500">
        © {new Date().getFullYear()} Placement System
      </div>
    </aside>
  );
}