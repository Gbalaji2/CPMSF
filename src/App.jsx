import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";

/* Layouts */
import AuthLayout from "./layouts/AuthLayout";
import StudentLayout from "./layouts/StudentLayout";
import CompanyLayout from "./layouts/CompanyLayout";
import AdminLayout from "./layouts/AdminLayout";

/* Pages */
import Home from "./pages/Home";

/* Auth Pages */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

/* Student Pages */
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentJobs from "./pages/student/StudentJobs";
import StudentProfile from "./pages/student/StudentProfile";

/* Company Pages */
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyJobs from "./pages/company/CompanyJobs";

/* Admin Pages */
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <Routes>
      {/* Home page */}
      <Route path="/" element={<Home />} />

      {/* Auth Layout: public login/register pages */}
      <Route element={<AuthLayout />}>
        {/* Student */}
        <Route path="/student-login" element={<Login userType="student" />} />
        <Route path="/student-register" element={<Register userType="student" />} />

        {/* Company */}
        <Route path="/company-login" element={<Login userType="company" />} />
        <Route path="/company-register" element={<Register userType="company" />} />

        {/* Admin */}
        <Route path="/admin-login" element={<Login userType="admin" />} />
      </Route>

      {/* Protected Student Routes */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute roles={["student"]}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="jobs" element={<StudentJobs />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Protected Company Routes */}
      <Route
        path="/company/*"
        element={
          <ProtectedRoute roles={["company"]}>
            <CompanyLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CompanyDashboard />} />
        <Route path="jobs" element={<CompanyJobs />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<h1 className="text-center mt-20 text-3xl">404 Not Found</h1>} />
    </Routes>
  );
}