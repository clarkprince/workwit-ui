"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthResponse, validateToken } from "@/services/auth";
import { removeAuthCookie, getAuthCookie, setUserCookie, clearUserCookies, getUserCookies } from "@/lib/cookies";
import { Loader } from "@/components/ui/loader";

interface AuthContextType {
  user: AuthResponse | null;
  setUser: (user: AuthResponse | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateAuth = async () => {
      const isValid = await validateToken();
      const token = getAuthCookie();
      const userData = getUserCookies();

      if (isValid && token && userData.name && userData.email) {
        setUserState({
          token,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          tenant: userData.tenant,
        });
      } else {
        setUserState(null);
      }
      setLoading(false);
    };

    validateAuth();
  }, []);

  const setUser = (userData: AuthResponse | null) => {
    setUserState(userData);
    if (userData) {
      setUserCookie(userData.name, userData.email, userData.role, userData.tenant);
    } else {
      clearUserCookies();
    }
  };

  const logout = () => {
    setUserState(null);
    clearUserCookies();
    removeAuthCookie();
  };

  if (loading) {
    return <Loader />;
  }

  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
