"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/config/api";
import { type Tenant } from "@/types/tenant";

interface TenantContextType {
  tenants: Tenant[];
  loading: boolean;
  error: Error | null;
  defaultTenant: string | null;
}

const TenantContext = createContext<TenantContextType>({ tenants: [], loading: true, error: null, defaultTenant: null });

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [defaultTenant, setDefaultTenant] = useState<string | null>(null);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.tenants);
        if (!res.ok) throw new Error("Failed to fetch tenants");
        const data = await res.json();
        setTenants(data);

        // Set default tenant
        if (data.length > 0) {
          const savedTenant = localStorage.getItem("defaultTenant");
          const defaultTenantDomain = savedTenant && data.find((t: Tenant) => t.synchroteamDomain === savedTenant) ? savedTenant : data[0].synchroteamDomain;

          setDefaultTenant(defaultTenantDomain);
          localStorage.setItem("defaultTenant", defaultTenantDomain);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch tenants"));
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  return <TenantContext.Provider value={{ tenants, loading, error, defaultTenant }}>{children}</TenantContext.Provider>;
}

export function useTenants() {
  return useContext(TenantContext);
}
