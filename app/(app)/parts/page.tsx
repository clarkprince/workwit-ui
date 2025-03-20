"use client";

import { PageHeader } from "@/app/components/page-header";
import { PartsList } from "./_components/parts-list";
import { PartsFilters } from "./_components/parts-filters";
import { TenantProvider } from "../customers/_components/tenant-context";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

const PartsPage = () => {
  const searchParams = useSearchParams();
  const [listKey, setListKey] = useState(0);
  const sizeStr = searchParams.get("size") || "25";
  const tenant = searchParams.get("tenant") || "";
  const size = Number.isNaN(parseInt(sizeStr)) ? 25 : parseInt(sizeStr);

  return (
    <TenantProvider>
      <PageHeader
        breadcrumbs={[
          { title: "Synchroteam", href: "#" },
          { title: "Parts", href: "/parts" },
        ]}
      />
      <div className="p-6">
        <div className="mb-6">
          <h1 className="font-semibold tracking-tight">Parts</h1>
        </div>
        <div className="mb-6">
          <Suspense fallback={<div>Loading filters...</div>}>
            <PartsFilters skipInitialTenant={!!tenant} onRefresh={() => setListKey((prev) => prev + 1)} />
          </Suspense>
        </div>
        <div className="relative overflow-x-auto">
          <PartsList key={listKey} initialPage={1} size={size} tenant={tenant} />
        </div>
      </div>
    </TenantProvider>
  );
};

export default PartsPage;
