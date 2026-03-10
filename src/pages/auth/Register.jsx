import { useState } from "react";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register({ userType }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    number: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
    // Combine first_name and last_name into a single 'name' field
    const payload = {
      name: formData.first_name + " " + formData.last_name,
      email: formData.email,
      password: formData.password,
      number: formData.number,
      role: userType,
    };

    // Send to backend
    await api.post("/auth/register", payload);

    setSuccess("Registration successful! Redirecting to login...");
    setTimeout(() => navigate(`/${userType}-login`), 1500);
  } catch (err) {
    setError(err.response?.data?.message || "Registration failed");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 rounded shadow-md bg-white w-full max-w-md"
      >
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <input
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          name="number"
          placeholder="Phone Number"
          value={formData.number}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          Register as {userType || "User"}
        </button>

        {/* Role-specific login link */}
        <div className="text-center mt-4">
          {userType === "student" && (
            <Link
              to="/student-login"
              className="text-blue-600 hover:underline"
            >
              ← Back to Student Login
            </Link>
          )}
          {userType === "company" && (
            <Link
              to="/company-login"
              className="text-blue-600 hover:underline"
            >
              ← Back to Company Login
            </Link>
          )}
          {userType === "admin" && (
            <Link
              to="/admin-login"
              className="text-blue-600 hover:underline"
            >
              ← Back to Admin Login
            </Link>
          )}
        </div>

        {/* Generic back to home */}
        <div className="text-center mt-2">
          <Link to="/" className="text-gray-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </form>
    </div>
  );
}