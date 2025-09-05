"use client";

import { useSearchParams, useParams } from "next/navigation";
import { PageHeader } from "@/app/components/page-header";
import { API_ENDPOINTS } from "@/config/api";
import { type Activity } from "@/types/activity";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Redo } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import { useAuth } from "@/app/contexts/auth-context";

function JsonDisplay({ data }: { data: string }) {
  if (!data || data.trim() === "") {
    return <div className="text-sm">No data available</div>;
  }

  try {
    const parsed = JSON.parse(data);
    return (
      <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-[600px] text-xs">
        <code>{JSON.stringify(parsed, null, 2)}</code>
      </pre>
    );
  } catch {
    return <div className="text-red-500">Invalid JSON</div>;
  }
}

const ActivityPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const rawTenant = searchParams.get("tenant") || "";
        const tenant = user?.role === "0" ? rawTenant : user?.tenant || "";
        const id = params.id as string;
        const res = await fetch(`${API_ENDPOINTS.activities}/${id}`, {
          headers: {
            tenant: tenant,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch activity");
        const data = await res.json();
        setActivity(data);
      } catch (error) {
        console.error("Error fetching activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [params.id, searchParams, user?.role, user?.tenant]);

  const getProcessBadgeColors = (process: string) => {
    switch (process.toLowerCase()) {
      case "parts":
        return "bg-blue-800 text-white";
      case "jobs":
        return "bg-purple-800 text-white";
      case "customers":
        return "bg-yellow-800 text-white";
      case "invoices":
        return "bg-orange-800 text-white";
      default:
        return "bg-gray-800 text-white";
    }
  };

  const backUrl = user?.role === "0" && searchParams.get("tenant") ? `/activities?tenant=${searchParams.get("tenant")}` : "/activities";

  const handleRerun = async () => {
    if (!activity) return;

    const rawTenant = searchParams.get("tenant") || "";
    const tenant = user?.role === "0" ? rawTenant : user?.tenant || "";

    if (!tenant) return;

    try {
      const response = await fetch(API_ENDPOINTS.activitiesRerun, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          tenant: tenant,
        },
        body: JSON.stringify([activity.id]),
      });

      if (!response.ok) throw new Error("Failed to rerun activity");
      toast.success("Activity was successfully rerun");
    } catch (error) {
      console.error("Error rerunning activity:", error);
      toast.error("Failed to rerun activity");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!activity) {
    return <div className="p-6">Failed to load activity</div>;
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { title: "Activities", href: backUrl },
          { title: `Activity #${activity.id}`, href: "#" },
        ]}
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <a href={backUrl}>
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <h1 className="font-semibold">Activity #{activity.id}</h1>
          </div>
          <Button onClick={handleRerun} variant="secondary" size="sm">
            <Redo className="h-4 w-4 mr-2" />
            Re-run activity
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-black mb-4">Activity Information</h2>
              <dl className="grid grid-cols-3 gap-4">
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Process</dt>
                  <dd className="mt-1 text-[13px]">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getProcessBadgeColors(activity.process)}`}>{activity.process}</span>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Status</dt>
                  <dd className="mt-1 text-[13px]">
                    <span className={`px-2.5 py-1 font-semibold rounded-full text-xs ${activity.successful ? "bg-green-200 text-green-950" : "bg-red-200 text-red-950"}`}>{activity.successful ? "Success" : "Failed"}</span>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Created At</dt>
                  <dd className="mt-1 text-[13px]">{format(new Date(activity.createdAt), "yyyy-MM-dd HH:mm")}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {activity.message && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-sm font-medium text-black mb-4">Message</h2>
                <p className="text-[13px] text-red-500 font-semibold">{activity.message}</p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-sm font-medium text-black mb-4">From</h2>
                <JsonDisplay data={activity.activity1} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-sm font-medium text-black mb-4">To</h2>
                <JsonDisplay data={activity.activity2} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActivityPage;
