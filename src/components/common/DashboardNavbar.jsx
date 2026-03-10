import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b shadow-sm px-4 md:px-6 py-4 flex items-center justify-between">
      <h1 className="font-bold text-lg">Placement Management</h1>

      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-600 hidden md:block">
          {user?.name} ({user?.role})
        </p>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl bg-black text-white text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
}