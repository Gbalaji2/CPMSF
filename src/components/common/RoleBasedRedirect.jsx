import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function RoleBasedRedirect() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (user.role === "student") return <Navigate to="/student" />;
  if (user.role === "company") return <Navigate to="/company" />;
  if (user.role === "admin" || user.role === "tpo")
    return <Navigate to="/admin" />;

  return <Navigate to="/login" />;
}