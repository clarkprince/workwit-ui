import { API_ENDPOINTS } from "@/config/api";
import { getAuthCookie } from "@/lib/cookies";

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
  role: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(API_ENDPOINTS.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return {
    token: data.token,
    name: data.name,
    email: data.email,
    role: data.role,
  };
};

export const validateToken = async (): Promise<boolean> => {
  const token = getAuthCookie();
  return !!token;
};

interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tenant: string;
}

export const createUser = async (userData: CreateUserRequest): Promise<void> => {
  const response = await fetch(API_ENDPOINTS.createUser, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || "Failed to create user");
  }
};
