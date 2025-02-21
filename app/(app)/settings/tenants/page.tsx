import { TenantListClient } from "./_components/tenant-list-client";
import { API_ENDPOINTS } from "@/config/api";
import { type Tenant } from "@/types/tenant";
import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";

// Opt out of static rendering
export const dynamic = "force-dynamic";

async function getTenants(): Promise<Tenant[]> {
  try {
    const res = await fetch(API_ENDPOINTS.tenants, {
      cache: "no-store", // Disable caching
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch tenants:", error);
    return []; // Return empty array instead of throwing
  }
}

export default async function TenantsPage() {
  const tenants = await getTenants();

  return (
    <Suspense fallback={<Loader />}>
      <TenantListClient tenants={tenants} />
    </Suspense>
  );
}
