import { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Login({ userType }) {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ Only reset inputs (DO NOT clear token)
  useEffect(() => {
    setEmail("");
    setPassword("");
    setError("");
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

      console.log("LOGIN RESPONSE FULL:", data);

      const token = data.accessToken || data.token;

      if (!token) {
        setError("No token received from server");
        return;
      }

      // ✅ Use context (IMPORTANT)
      login({
        token,
        user: data.user,
      });

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
        {error && <p className="text-red-500 text-center">{error}</p>}

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

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Login as {userType}
        </button>

        <div className="text-center mt-4 space-y-2">
          {userType === "student" && (
            <Link to="/student-register" className="text-blue-600">
              ← Register as Student
            </Link>
          )}

          {userType === "company" && (
            <Link to="/company-register" className="text-blue-600">
              ← Register as Company
            </Link>
          )}

          {userType === "admin" && (
            <Link to="/admin-login" className="text-blue-600">
              ← Admin Login
            </Link>
          )}
        </div>

        <div className="text-center mt-2">
          <Link to="/" className="text-gray-600">
            ← Back to Home
          </Link>
        </div>
      </form>
    </div>
  );
}