"use client";

import { PageHeader } from "@/app/components/page-header";
import { InvoiceList } from "./_components/invoice-list";
import { InvoiceFilters } from "./_components/invoice-filters";
import { TenantProvider } from "../customers/_components/tenant-context";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/auth-context";
import { useTenants } from "../customers/_components/tenant-context";
import { Loader } from "@/components/ui/loader";

const InvoicesPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { tenants } = useTenants();
  const [isInitialized, setIsInitialized] = useState(false);

  const sizeStr = searchParams.get("size") || "10";
  const rawTenant = searchParams.get("tenant") || "";
  const from = searchParams.get("from") || "";

  const size = Number.isNaN(parseInt(sizeStr)) ? 5 : parseInt(sizeStr);

  // Determine the correct tenant based on user role
  const tenant = user?.role === "0" ? rawTenant : user?.tenant || "";

  useEffect(() => {
    if (user?.role === "0" && tenants.length > 0 && !searchParams.get("tenant")) {
      const query = `?tenant=${tenants[0].synchroteamDomain}`;
      router.push(`/invoices${query}`);
    } else {
      setIsInitialized(true);
    }
  }, [user, tenants, searchParams, router]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <TenantProvider>
      <PageHeader
        breadcrumbs={[
          { title: "Synchroteam", href: "#" },
          { title: "Invoices", href: "/invoices" },
        ]}
      />
      <div className="p-6">
        <div className="mb-6">
          <h1 className="font-semibold tracking-tight">Invoices</h1>
        </div>
        <div className="mb-6">
          <Suspense fallback={<div>Loading filters...</div>}>
            <InvoiceFilters skipInitialTenant={!!rawTenant} />
          </Suspense>
        </div>
        <div className="relative overflow-x-auto">
          <InvoiceList initialPage={1} size={size} from={from} tenant={tenant} />
        </div>
      </div>
    </TenantProvider>
  );
};

export default InvoicesPage;
