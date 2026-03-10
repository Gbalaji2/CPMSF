import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function CompanyNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b px-4 md:px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="font-semibold text-gray-800">Company Portal</h1>
        <p className="text-xs text-gray-500">
          Logged in as {user?.name || "Company"}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-xl bg-black text-white text-sm"
      >
        Logout
      </button>
    </header>
  );
}