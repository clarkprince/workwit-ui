"use client";

import { PageHeader } from "@/app/components/page-header";
import { JobFilters } from "./_components/job-filters";
import { JobList } from "./_components/job-list";
import { TenantProvider } from "../customers/_components/tenant-context";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const JobsPage = () => {
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
          { title: "Jobs", href: "/jobs" },
        ]}
      />
      <div className="p-6">
        <div className="mb-6">
          <h1 className="font-semibold tracking-tight">Jobs</h1>
        </div>
        <div className="mb-6">
          <Suspense fallback={<div>Loading filters...</div>}>
            <JobFilters skipInitialTenant={!!tenant} />
          </Suspense>
        </div>
        <div className="relative overflow-x-auto">
          <JobList initialPage={1} size={size} from={from} tenant={tenant} />
        </div>
      </div>
    </TenantProvider>
  );
};

export default JobsPage;
