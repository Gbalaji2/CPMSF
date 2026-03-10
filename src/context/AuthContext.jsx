import React, { createContext, useEffect, useState } from "react";
import { getMe } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await getMe();
        setUser(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await getMe();
      setUser(res.user);
      localStorage.setItem("user", JSON.stringify(res.user));
    } catch (err) {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}