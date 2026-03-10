// src/pages/auth/Login.jsx
import { useState } from "react";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ userType }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Role-based API endpoint
      const endpoint = "/auth/login";

      const { data } = await api.post(endpoint, { email, password });

      // Save token
      if (userType === "student") localStorage.setItem("studentToken", data.accessToken);
      else if (userType === "company") localStorage.setItem("companyToken", data.accessToken);
      else if (userType === "admin") localStorage.setItem("adminToken", data.accessToken);

      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to protected dashboard
      if (userType === "student") navigate("/student/dashboard");
      else if (userType === "company") navigate("/company/dashboard");
      else if (userType === "admin") navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 rounded shadow-md bg-white w-full max-w-md"
      >
        {error && <p className="text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Login as {userType}
        </button>

        {/* Role-specific links */}
        <div className="text-center mt-4 space-y-2">
          {userType === "student" && (
            <Link to="/student-register" className="text-blue-600 hover:underline">
              ← Register as Student
            </Link>
          )}
          {userType === "company" && (
            <Link to="/company-register" className="text-blue-600 hover:underline">
              ← Register as Company
            </Link>
          )}
          {userType === "admin" && (
            <Link to="/admin-login" className="text-blue-600 hover:underline">
              ← Admin Login
            </Link>
          )}
        </div>

        <div className="text-center mt-2">
          <Link to="/" className="text-gray-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </form>
    </div>
  );
}