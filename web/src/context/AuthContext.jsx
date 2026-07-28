// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // проверка токена при старте
  const [permissions, setPermissions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [permsLoaded, setPermsLoaded] = useState(false);

  const fetchPermissions = useCallback(async (t) => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/permissions/me`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPermissions(Array.isArray(data.permissions) ? data.permissions : []);
        setIsAdmin(!!data.isAdmin);
      } else {
        setPermissions([]);
        setIsAdmin(false);
      }
    } catch {
      setPermissions([]);
      setIsAdmin(false);
    } finally {
      setPermsLoaded(true);
    }
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setToken(savedToken);
          setUser(decoded);
          fetchPermissions(savedToken);
        } else {
          localStorage.removeItem("token");
          setPermsLoaded(true);
        }
      } catch {
        localStorage.removeItem("token");
        setPermsLoaded(true);
      }
    } else {
      setPermsLoaded(true);
    }
    setLoading(false);
  }, [fetchPermissions]);

  const login = (newToken) => {
    setToken(newToken);
    setUser(jwtDecode(newToken));
    localStorage.setItem("token", newToken);
    setPermsLoaded(false);
    fetchPermissions(newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setPermissions([]);
    setIsAdmin(false);
    localStorage.removeItem("token");
  };

  // Проверка наличия права (admin имеет всё)
  const can = useCallback(
    (key) => isAdmin || permissions.includes(key),
    [isAdmin, permissions]
  );

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, loading, permissions, isAdmin, permsLoaded, can, refreshPermissions: () => token && fetchPermissions(token) }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
