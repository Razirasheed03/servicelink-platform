import React, { createContext, useState, useEffect, useContext } from "react";
import { type Role } from "@/types/user";

interface AuthUser {
  _id?: string;
  username?: string;
  email?: string;
  role?: Role;
  phone?: string;
  serviceType?: string;
  experience?: number;
  location?: string;
  isBlocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("auth_token"));
  const [user, setUser] = useState<AuthUser | null>(
    localStorage.getItem("auth_user") ? JSON.parse(localStorage.getItem("auth_user") || "{}") : null
  );

  useEffect(() => {
    if (token) localStorage.setItem("auth_token", token);
    else localStorage.removeItem("auth_token");

    if (user) localStorage.setItem("auth_user", JSON.stringify(user));
    else localStorage.removeItem("auth_user");
  }, [token, user]);

  const login = (newToken: string, userObj: AuthUser) => {
    setToken(newToken);
    setUser(userObj);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
