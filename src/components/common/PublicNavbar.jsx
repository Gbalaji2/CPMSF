// src/components/common/PublicNavbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function PublicNavbar() {
  // Mobile menu open/close
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Desktop dropdown states
  const [desktopLoginOpen, setDesktopLoginOpen] = useState(false);
  const [desktopRegisterOpen, setDesktopRegisterOpen] = useState(false);

  // Mobile dropdown states
  const [mobileLoginOpen, setMobileLoginOpen] = useState(false);
  const [mobileRegisterOpen, setMobileRegisterOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleDesktopLogin = () => setDesktopLoginOpen(!desktopLoginOpen);
  const toggleDesktopRegister = () => setDesktopRegisterOpen(!desktopRegisterOpen);
  const toggleMobileLogin = () => setMobileLoginOpen(!mobileLoginOpen);
  const toggleMobileRegister = () => setMobileRegisterOpen(!mobileRegisterOpen);

  // Close all dropdowns when navigating
  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    setDesktopLoginOpen(false);
    setDesktopRegisterOpen(false);
    setMobileLoginOpen(false);
    setMobileRegisterOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold"
            onClick={handleLinkClick}
          >
            <img
              src="/images/logo.png"
              alt="Placement Portal Logo"
              className="h-8 w-8 object-contain"
            />
            Placement Portal
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg hover:bg-blue-500 transition"
              onClick={handleLinkClick}
            >
              Home
            </Link>

            {/* Login Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDesktopLogin}
                className="px-4 py-2 rounded-lg bg-white text-blue-600 font-semibold hover:bg-gray-100 transition"
              >
                Login
              </button>
              {desktopLoginOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg z-20">
                  <Link to="/student-login" className="block px-4 py-2 hover:bg-gray-200" onClick={handleLinkClick}>Student</Link>
                  <Link to="/company-login" className="block px-4 py-2 hover:bg-gray-200" onClick={handleLinkClick}>Company</Link>
                  <Link to="/admin-login" className="block px-4 py-2 hover:bg-gray-200" onClick={handleLinkClick}>Admin</Link>
                </div>
              )}
            </div>

            {/* Register Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDesktopRegister}
                className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
              >
                Register
              </button>
              {desktopRegisterOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg z-20">
                  <Link to="/student-register" className="block px-4 py-2 hover:bg-gray-200" onClick={handleLinkClick}>Student</Link>
                  <Link to="/company-register" className="block px-4 py-2 hover:bg-gray-200" onClick={handleLinkClick}>Company</Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="focus:outline-none text-2xl">
              {mobileMenuOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-500 px-4 pb-4 space-y-2">
          <Link to="/" className="block px-4 py-2 rounded-lg hover:bg-blue-400" onClick={handleLinkClick}>Home</Link>

          {/* Mobile Login Dropdown */}
          <div className="space-y-1">
            <button
              onClick={toggleMobileLogin}
              className="w-full text-left px-4 py-2 rounded-lg bg-white text-blue-600 font-semibold hover:bg-gray-100 transition"
            >
              Login
            </button>
            {mobileLoginOpen && (
              <div className="pl-4 space-y-1">
                <Link to="/student-login" className="block px-4 py-2 hover:bg-gray-200" onClick={handleLinkClick}>Student</Link>
                <Link to="/company-login" className="block px-4 py-2 hover:bg-gray-200" onClick={handleLinkClick}>Company</Link>
                <Link to="/admin-login" className="block px-4 py-2 hover:bg-gray-200" onClick={handleLinkClick}>Admin</Link>
              </div>
            )}
          </div>

          {/* Mobile Register Dropdown */}
          <div className="space-y-1">
            <button
              onClick={toggleMobileRegister}
              className="w-full text-left px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
            >
              Register
            </button>
            {mobileRegisterOpen && (
              <div className="pl-4 space-y-1">
                <Link to="/student-register" className="block px-4 py-2 hover:bg-gray-200" onClick={handleLinkClick}>Student</Link>
                <Link to="/company-register" className="block px-4 py-2 hover:bg-gray-200" onClick={handleLinkClick}>Company</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}