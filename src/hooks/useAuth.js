import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    // ✅ Clear ONLY auth data
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    // ✅ Force full reload (important)
    window.location.href = "/";
  };

  return { user, token, role, logout };
}