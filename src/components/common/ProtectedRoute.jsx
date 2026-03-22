import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function ProtectedRoute({ roles = [], children }) {
  const { user, token, loading } = useContext(AuthContext);

  // ✅ Wait until auth is restored
  if (loading) {
    return <p>Loading...</p>;
  }

  // ❌ No token → redirect to correct login
  if (!token) {
    if (roles.includes("student")) return <Navigate to="/student-login" replace />;
    if (roles.includes("company")) return <Navigate to="/company-login" replace />;
    if (roles.includes("admin")) return <Navigate to="/admin-login" replace />;
    return <Navigate to="/" replace />;
  }

  // ❌ Role mismatch
  if (roles.length && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}