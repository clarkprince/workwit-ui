"use client";

import { PageHeader } from "@/app/components/page-header";
import { PartsList } from "./_components/parts-list";
import { PartsFilters } from "./_components/parts-filters";
import { TenantProvider } from "../customers/_components/tenant-context";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/auth-context";
import { useTenants } from "../customers/_components/tenant-context";
import { Loader } from "@/components/ui/loader";

const PartsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { tenants } = useTenants();
  const [listKey, setListKey] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const sizeStr = searchParams.get("size") || "10";
  const from = searchParams.get("from") || "";

  const size = Number.isNaN(parseInt(sizeStr)) ? 10 : parseInt(sizeStr);

  useEffect(() => {
    if (user?.role === "0" && tenants.length > 0 && !searchParams.get("tenant")) {
      const query = `?tenant=${tenants[0].synchroteamDomain}`;
      router.push(`/parts${query}`);
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
          { title: "Parts", href: "/parts" },
        ]}
      />
      <div className="p-6">
        <div className="mb-6">
          <h1 className="font-semibold tracking-tight">Parts</h1>
        </div>
        <div className="mb-6">
          <Suspense fallback={<div>Loading filters...</div>}>
            <PartsFilters onRefresh={() => setListKey((prev) => prev + 1)} />
          </Suspense>
        </div>
        <div className="relative overflow-x-auto">
          <PartsList key={listKey} initialPage={1} size={size} from={from} />
        </div>
      </div>
    </TenantProvider>
  );
};

export default PartsPage;
