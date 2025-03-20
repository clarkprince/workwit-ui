"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "../contexts/auth-context";
import App from "./App";

const PUBLIC_ROUTES = ["/activate", "/create-user"];

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
