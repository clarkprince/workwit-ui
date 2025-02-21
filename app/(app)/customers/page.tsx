"use client";

import { PageHeader } from "@/app/components/page-header";
import { CustomerFilters } from "./_components/customer-filters";
import { CustomerList } from "./_components/customer-list";
import { TenantProvider } from "./_components/tenant-context";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const CustomersPage = () => {
  const searchParams = useSearchParams();

  const sizeStr = searchParams.get("size") || "10";
  const tenant = searchParams.get("tenant") || "";
  const from = searchParams.get("from") || "";

  const size = Number.isNaN(parseInt(sizeStr)) ? 3 : parseInt(sizeStr);

  return (
    <TenantProvider>
      <PageHeader breadcrumbs={[{ title: "Customers", href: "/customers" }]} />
      <div className="p-6">
        <div className="mb-6">
          <h1 className="font-semibold tracking-tight">Customers</h1>
        </div>
        <div className="mb-6">
          <Suspense fallback={<div>Loading filters...</div>}>
            <CustomerFilters skipInitialTenant={!!tenant} />
          </Suspense>
        </div>
        <div className="relative overflow-x-auto">
          <CustomerList initialPage={1} size={size} from={from} tenant={tenant} />
        </div>
      </div>
    </TenantProvider>
  );
};

export default CustomersPage;
