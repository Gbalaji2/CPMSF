import { useNavigate } from "react-router-dom";

export default function StudentTopbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-white border-b shadow-sm px-4 md:px-6 py-4 flex items-center justify-between">
      <h1 className="font-semibold text-gray-800">Student Portal</h1>

      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-xl bg-black text-white text-sm"
      >
        Logout
      </button>
    </header>
  );
}