// src/pages/company/CompanyLogin.jsx
import React from "react";

export default function CompanyLogin() {
  return (
    <div className="bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Company Login</h2>
      <form>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded">
          Login
        </button>
      </form>
    </div>
  );
}