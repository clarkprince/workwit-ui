"use client";

import { PageHeader } from "@/app/components/page-header";
import { ActivityList } from "./_components/activity-list";
import { ActivityFilters } from "./_components/activity-filters";
import { TenantProvider } from "../customers/_components/tenant-context";
import { Suspense } from "react";
import { ProcessMonitor } from "./_components/process-monitor";
import { useSearchParams } from "next/navigation";
import { Loader } from "@/components/ui/loader";

const ActivitiesPage = () => {
  const searchParams = useSearchParams();

  const pageStr = searchParams.get("page") || "1";
  const sizeStr = searchParams.get("size") || "10";
  const tenant = searchParams.get("tenant") || "";
  const q = searchParams.get("q") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const process = searchParams.get("process") || "";

  const page = Number.isNaN(parseInt(pageStr)) ? 1 : parseInt(pageStr);
  const size = Number.isNaN(parseInt(sizeStr)) ? 10 : parseInt(sizeStr);

  return (
    <TenantProvider>
      <PageHeader breadcrumbs={[{ title: "Activities", href: "/activities" }]} />
      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-semibold tracking-tight">Activities</h1>
          <ProcessMonitor tenant={tenant} />
        </div>
        <div className="mb-6">
          <Suspense fallback={<Loader />}>
            <ActivityFilters />
          </Suspense>
        </div>
        <div className="relative overflow-x-auto">
          <ActivityList initialPage={page} size={size} tenant={tenant} q={q} from={from} to={to} process={process} />
        </div>
      </div>
    </TenantProvider>
  );
};

export default ActivitiesPage;
