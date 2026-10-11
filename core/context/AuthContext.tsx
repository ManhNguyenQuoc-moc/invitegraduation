"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Role = "ADMIN" | "CLIENT";

interface User {
  id: string;
  email?: string;
  username?: string;
  name?: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Lấy token từ LocalStorage khi khởi tạo ứng dụng
    const storedToken = localStorage.getItem("jwt_token");
    const storedUser = localStorage.getItem("user_data");
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("jwt_token", newToken);
    localStorage.setItem("user_data", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_data");
    
    // Tùy chọn: Xoá Cookie hoặc redirect về /login
    window.location.href = "/login";
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook tuỳ chỉnh để sử dụng Auth dễ dàng ở bất kỳ Component nào
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }
  return context;
};

// Hàm tiện ích để setup HTTP Interceptor (dùng với fetch hoặc Axios)
export const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
