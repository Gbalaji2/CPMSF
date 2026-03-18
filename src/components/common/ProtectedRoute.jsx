import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ roles = [], children }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // ❌ No token → redirect to login
  if (!token) {
    if (roles.includes("student")) return <Navigate to="/student-login" replace />;
    if (roles.includes("company")) return <Navigate to="/company-login" replace />;
    if (roles.includes("admin")) return <Navigate to="/admin-login" replace />;
    return <Navigate to="/" replace />;
  }

  // ❌ Role mismatch
  if (roles.length && !roles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}