// src/layouts/AuthLayout.jsx
import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";

export default function AuthLayout() {
  const location = useLocation();

  // 🎯 Detect role
  const getRole = () => {
    if (location.pathname.includes("student")) return "Student";
    if (location.pathname.includes("company")) return "Company";
    if (location.pathname.includes("admin")) return "Admin";
    return "User";
  };

  // 🎯 Dynamic logo
  const getLogo = () => {
    if (location.pathname.includes("student")) return "/Student.png";
    if (location.pathname.includes("company")) return "/Company.jpg";
    if (location.pathname.includes("admin")) return "/Admin.jpg";
    return "/Logo1.png";
  };

  // 🎯 Title
  const getTitle = () => {
    if (location.pathname.includes("login")) {
      if (location.pathname.includes("student")) return "Student Login";
      if (location.pathname.includes("company")) return "Company Login";
      if (location.pathname.includes("admin")) return "Admin Login";
      return "Login";
    }
    if (location.pathname.includes("register")) {
      if (location.pathname.includes("student")) return "Student Registration";
      if (location.pathname.includes("company")) return "Company Registration";
      return "Register";
    }
    return "";
  };

  const getSubtitle = () => {
    if (location.pathname.includes("login"))
      return "Enter your credentials to access your dashboard.";
    if (location.pathname.includes("register"))
      return "Create a new account to get started.";
    return "";
  };

  const role = getRole();

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute w-72 h-72 bg-blue-400 rounded-full -top-24 -left-24 opacity-30 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full -bottom-32 -right-32 opacity-20 animate-pulse"></div>
      </div>

      {/* LEFT SIDE */}
      <div className="flex-1 flex items-center justify-center z-10 bg-white p-6 md:p-12">
        <div className="w-full max-w-md">

          {/* 🔥 LOGO + BADGE */}
          <div className="flex flex-col items-center mb-6 space-y-2">
            <Link to="/">
              <img
                key={getLogo()} // 🔥 triggers animation on change
                src={getLogo()}
                alt="Logo"
                className="h-14 w-auto transition-all duration-500 ease-in-out transform hover:scale-110"
              />
            </Link>

            {/* 🎯 Role Badge */}
            <span
              className={`px-3 py-1 text-sm rounded-full font-semibold text-white
                ${role === "Student" && "bg-blue-500"}
                ${role === "Admin" && "bg-red-500"}
                ${role === "Company" && "bg-green-500"}
              `}
            >
              {role}
            </span>
          </div>

          {/* HEADER */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              {getTitle()}
            </h1>
            <p className="text-gray-500 mt-2">{getSubtitle()}</p>
          </div>

          {/* FORM */}
          <Outlet />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 hidden md:flex items-center justify-center z-10 bg-gradient-to-br from-blue-400 to-purple-500 text-white p-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">Welcome Back!</h2>
          <p className="text-lg">
            Manage placements, track progress, and access your dashboard easily.
          </p>
        </div>
      </div>
    </div>
  );
}