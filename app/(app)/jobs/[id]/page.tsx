"use client";

import { useSearchParams, useParams } from "next/navigation";
import { PageHeader } from "@/app/components/page-header";
import { API_ENDPOINTS } from "@/config/api";
import { type Job } from "@/types/job";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/loader";

const JobPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const tenant = searchParams.get("tenant") || "";
        const id = params.id as string;
        const res = await fetch(`${API_ENDPOINTS.jobs}/${id}`, {
          headers: {
            tenant: tenant,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch job");
        const data = await res.json();
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [params.id, searchParams]);

  const backUrl = searchParams.get("tenant") ? `/jobs?tenant=${searchParams.get("tenant")}` : "/jobs";

  if (loading) {
    return <Loader />;
  }

  if (!job) {
    return <div className="p-6">Failed to load job</div>;
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { title: "Jobs", href: backUrl },
          { title: `Job #${job.num}`, href: "#" },
        ]}
      />
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <a href={backUrl}>
              <ArrowLeft className="h-4 w-4" />
            </a>
          </Button>
          <h1 className="font-semibold">Job #{job.num}</h1>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-black mb-4">Basic Information</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Job Number</dt>
                  <dd className="mt-1 text-[13px]">{job.num}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Description</dt>
                  <dd className="mt-1 text-[13px]">{job.description || "-"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Status</dt>
                  <dd className="mt-1 text-[13px]">{job.status}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Priority</dt>
                  <dd className="mt-1 text-[13px]">{job.priority}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Type</dt>
                  <dd className="mt-1 text-[13px]">{job.type.name}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Template</dt>
                  <dd className="mt-1 text-[13px]">{job.reportTemplate.name}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-black mb-4">Schedule</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Scheduled Start</dt>
                  <dd className="mt-1 text-[13px]">{format(new Date(job.scheduledStart), "yyyy-MM-dd HH:mm")}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Scheduled End</dt>
                  <dd className="mt-1 text-[13px]">{format(new Date(job.scheduledEnd), "yyyy-MM-dd HH:mm")}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Actual Start</dt>
                  <dd className="mt-1 text-[13px]">{job.actualStart ? format(new Date(job.actualStart), "yyyy-MM-dd HH:mm") : "-"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Actual End</dt>
                  <dd className="mt-1 text-[13px]">{job.actualEnd ? format(new Date(job.actualEnd), "yyyy-MM-dd HH:mm") : "-"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-black mb-4">Customer Information</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Customer</dt>
                  <dd className="mt-1 text-[13px]">{job.customer.name}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Address</dt>
                  <dd className="mt-1 text-[13px]">{job.address}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Contact</dt>
                  <dd className="mt-1 text-[13px]">{job.contactFirstName || job.contactLastName ? `${job.contactFirstName || ""} ${job.contactLastName || ""}`.trim() : "-"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Contact Details</dt>
                  <dd className="mt-1 text-[13px]">
                    {job.contactPhone && `Phone: ${job.contactPhone}`}
                    {job.contactMobile && <br />}
                    {job.contactMobile && `Mobile: ${job.contactMobile}`}
                    {job.contactEmail && <br />}
                    {job.contactEmail && `Email: ${job.contactEmail}`}
                    {!job.contactPhone && !job.contactMobile && !job.contactEmail && "-"}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-black mb-4">Assignment</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Technician</dt>
                  <dd className="mt-1 text-[13px]">{job.technician.name}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Created By</dt>
                  <dd className="mt-1 text-[13px]">{job.createdBy.name}</dd>
                </div>
                {job.validateBy && (
                  <div>
                    <dt className="font-semibold text-[13px] text-gray-500">Validated By</dt>
                    <dd className="mt-1 text-[13px]">
                      {job.validateBy.name} ({format(new Date(job.validateBy.date), "yyyy-MM-dd HH:mm")})
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {job.parts.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-sm font-medium text-black mb-4">Parts Used</h2>
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Reference
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Serial Numbers
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {job.parts.map((part) => (
                      <tr key={part.id} className="bg-white border-b">
                        <td className="px-6 py-4">{part.reference}</td>
                        <td className="px-6 py-4">{part.quantity}</td>
                        <td className="px-6 py-4">{part.serialNumbers || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {job.timeEntries.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-sm font-medium text-black mb-4">Time Entries</h2>
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Technician
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Start
                      </th>
                      <th scope="col" className="px-6 py-3">
                        End
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {job.timeEntries.map((entry, index) => (
                      <tr key={index} className="bg-white border-b">
                        <td className="px-6 py-4">{entry.user.name}</td>
                        <td className="px-6 py-4">{format(new Date(entry.start), "yyyy-MM-dd HH:mm")}</td>
                        <td className="px-6 py-4">{format(new Date(entry.stop), "yyyy-MM-dd HH:mm")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default JobPage;
