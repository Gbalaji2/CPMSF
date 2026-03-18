// src/pages/auth/Login.jsx
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ userType }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ Reset form + clear old tokens when role changes
  useEffect(() => {
  setEmail("");
  setPassword("");
  setError("");

  // ✅ clear only once
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
}, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const { data } = await api.post("/auth/login", {
      email,
      password,
      role: userType,
    });

    console.log("LOGIN RESPONSE FULL:", JSON.stringify(data, null, 2));

    // ✅ Handle both token formats
    const token = data.accessToken || data.token;

    if (!token) {
      setError("No token received from server");
      return;
    }

    // ✅ Save properly
    localStorage.setItem("token", token);
    localStorage.setItem("role", userType);
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate(`/${userType}/dashboard`);

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
        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login as {userType}
        </button>

        {/* Role-specific Links */}
        <div className="text-center mt-4 space-y-2">
          {userType === "student" && (
            <Link
              to="/student-register"
              className="text-blue-600 hover:underline"
            >
              ← Register as Student
            </Link>
          )}

          {userType === "company" && (
            <Link
              to="/company-register"
              className="text-blue-600 hover:underline"
            >
              ← Register as Company
            </Link>
          )}

          {userType === "admin" && (
            <Link
              to="/admin-login"
              className="text-blue-600 hover:underline"
            >
              ← Admin Login
            </Link>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-2">
          <Link to="/" className="text-gray-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </form>
    </div>
  );
}