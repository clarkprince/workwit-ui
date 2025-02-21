"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { API_ENDPOINTS } from "@/config/api";
import { type Tenant } from "@/types/tenant";

interface TenantContextType {
  tenants: Tenant[];
  loading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType>({
  tenants: [],
  loading: true,
  error: null,
});

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(API_ENDPOINTS.tenants)
      .then((res) => res.json())
      .then((data) => {
        setTenants(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return <TenantContext.Provider value={{ tenants, loading, error }}>{children}</TenantContext.Provider>;
}

export const useTenants = () => useContext(TenantContext);
