"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthResponse, validateToken } from "@/services/auth";
import { setAuthCookie, removeAuthCookie, getAuthCookie } from "@/lib/cookies";
import { Loader } from "@/components/ui/loader";

interface AuthContextType {
  user: AuthResponse | null;
  setUser: (user: AuthResponse | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateAuth = async () => {
      const isValid = await validateToken();
      const token = getAuthCookie();
      setUser(isValid && token ? { token, name: "", email: "" } : null);
      setLoading(false);
    };
    validateAuth();
  }, []);

  const handleSetUser = (userData: AuthResponse | null) => {
    if (userData?.token) {
      setAuthCookie(userData.token);
    }
    setUser(userData);
  };

  const logout = () => {
    removeAuthCookie();
    setUser(null);
  };

  if (loading) {
    return <Loader />;
  }

  return <AuthContext.Provider value={{ user, setUser: handleSetUser, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
