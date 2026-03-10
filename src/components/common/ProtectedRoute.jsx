import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ roles = [], children }) {
  const studentToken = localStorage.getItem("studentToken");
  const companyToken = localStorage.getItem("companyToken");
  const adminToken = localStorage.getItem("adminToken");

  let userRole = null;

  if (studentToken) userRole = "student";
  else if (companyToken) userRole = "company";
  else if (adminToken) userRole = "admin";

  // No token -> redirect to correct login page
  if (!userRole) {
    if (roles.includes("student")) return <Navigate to="/student-login" replace />;
    if (roles.includes("company")) return <Navigate to="/company-login" replace />;
    if (roles.includes("admin")) return <Navigate to="/admin-login" replace />;
    return <Navigate to="/" replace />;
  }

  // Token exists but wrong role
  if (!roles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}