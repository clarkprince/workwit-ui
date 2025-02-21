"use client";

import { useSearchParams, useParams } from "next/navigation";
import { PageHeader } from "@/app/components/page-header";
import { API_ENDPOINTS } from "@/config/api";
import { type Activity } from "@/types/activity";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/loader";

function JsonDisplay({ data }: { data: string }) {
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
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const tenant = searchParams.get("tenant") || "";
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
  }, [params.id, searchParams]);

  const backUrl = searchParams.get("tenant") ? `/activities?tenant=${searchParams.get("tenant")}` : "/activities";

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
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <a href={backUrl}>
              <ArrowLeft className="h-4 w-4" />
            </a>
          </Button>
          <h1 className="font-semibold">Activity #{activity.id}</h1>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-black mb-4">Activity Information</h2>
              <dl className="grid grid-cols-4 gap-4">
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Process</dt>
                  <dd className="mt-1 text-[13px]">{activity.process}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Status</dt>
                  <dd className="mt-1 text-[13px]">
                    <span className={`px-2 py-1 rounded-full text-xs ${activity.successful ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{activity.successful ? "Success" : "Failed"}</span>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Created At</dt>
                  <dd className="mt-1 text-[13px]">{format(new Date(activity.createdAt), "yyyy-MM-dd HH:mm")}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Message</dt>
                  <dd className="mt-1 text-[13px] text-gray-600">{activity.message || "-"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

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

          {activity.message && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-sm font-medium text-black mb-4">Message</h2>
                <p className="text-[13px] text-red-500">{activity.message}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default ActivityPage;
