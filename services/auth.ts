import { API_ENDPOINTS } from "@/config/api";
import { getAuthCookie } from "@/lib/cookies";

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(API_ENDPOINTS.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
};

export const validateToken = async (): Promise<boolean> => {
  const token = getAuthCookie();
  return !!token;
};
