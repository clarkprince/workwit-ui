"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Login from "./Login";
import Activate from "./Activate";
import { useAuth } from "../contexts/auth-context";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const publicRoutes = ["/login", "/activate"];

interface AppProps {
  children?: React.ReactNode;
}

const App: React.FC<AppProps> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user && !publicRoutes.includes(pathname)) {
      router.replace("/login");
    } else if (user && pathname === "/login") {
      const defaultPath = "/activities";
      const tenantParam = user.role === "0" && user.tenant ? `?tenant=${user.tenant}` : "";
      router.replace(`${defaultPath}${tenantParam}`);
    }
  }, [user, router, pathname]);

  if (pathname === "/activate") {
    return <Activate />;
  } else if (pathname === "/login" || !user) {
    return <Login />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
  );
};

export default App;
