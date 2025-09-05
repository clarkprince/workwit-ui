"use client";

import { PageHeader } from "@/app/components/page-header";
import { ActivityList } from "./_components/activity-list";
import { ActivityFilters } from "./_components/activity-filters";
import { TenantProvider } from "../customers/_components/tenant-context";
import { API_ENDPOINTS } from "@/config/api";
import { Suspense, useState, useEffect } from "react";
import { ProcessMonitor } from "./_components/process-monitor";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import { useAuth } from "@/app/contexts/auth-context";
import { useTenants } from "../customers/_components/tenant-context";

const ActivitiesPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { tenants } = useTenants();
  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const pageStr = searchParams.get("page") || "1";
  const sizeStr = searchParams.get("size") || "10";
  const rawTenant = searchParams.get("tenant") || "";
  const q = searchParams.get("q") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const process = searchParams.get("process") || "";

  const page = Number.isNaN(parseInt(pageStr)) ? 1 : parseInt(pageStr);
  const size = Number.isNaN(parseInt(sizeStr)) ? 10 : parseInt(sizeStr);

  // Determine the correct tenant based on user role
  const tenant = user?.role === "0" ? rawTenant : user?.tenant || "";

  useEffect(() => {
    if (user?.role === "0" && tenants.length > 0 && !searchParams.get("tenant")) {
      const query = `?tenant=${tenants[0].synchroteamDomain}`;
      router.push(`/activities${query}`);
    } else {
      setIsInitialized(true);
    }
  }, [user, tenants, searchParams, router]);

  const handleRerunSelected = async () => {
    const currentTenant = user?.role === "0" ? searchParams.get("tenant") : user?.tenant;
    if (!currentTenant || selectedActivities.length === 0) return;

    try {
      const response = await fetch(API_ENDPOINTS.activitiesRerun, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          tenant: currentTenant,
        },
        body: JSON.stringify(selectedActivities),
      });

      if (!response.ok) throw new Error("Failed to rerun activities");
      toast.success("Activities have been rerun");
      setSelectedActivities([]);
    } catch (error) {
      console.error("Error rerunning activities:", error);
      toast.error("Failed to rerun activities");
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

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
            <ActivityFilters selectedCount={selectedActivities.length} onRerunSelected={handleRerunSelected} />
          </Suspense>
        </div>
        <div className="relative overflow-x-auto">
          <ActivityList initialPage={page} size={size} tenant={tenant} q={q} from={from} to={to} process={process} selectedActivities={selectedActivities} setSelectedActivities={setSelectedActivities} />
        </div>
      </div>
    </TenantProvider>
  );
};

export default ActivitiesPage;
