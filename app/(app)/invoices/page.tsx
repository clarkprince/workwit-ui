"use client";

import { PageHeader } from "@/app/components/page-header";
import { InvoiceList } from "./_components/invoice-list";
import { InvoiceFilters } from "./_components/invoice-filters";
import { TenantProvider } from "../customers/_components/tenant-context";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const InvoicesPage = () => {
  const searchParams = useSearchParams();

  const sizeStr = searchParams.get("size") || "10";
  const tenant = searchParams.get("tenant") || "";
  const from = searchParams.get("from") || "";

  const size = Number.isNaN(parseInt(sizeStr)) ? 5 : parseInt(sizeStr);

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
            <InvoiceFilters skipInitialTenant={!!tenant} />
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
