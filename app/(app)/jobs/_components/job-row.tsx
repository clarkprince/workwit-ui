"use client";

import { type Job } from "@/types/job";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";

export function JobRow({ job }: { job: Job }) {
  const searchParams = useSearchParams();
  const tenant = searchParams.get("tenant");
  const jobUrl = tenant ? `/jobs/${job.id}?tenant=${tenant}` : `/jobs/${job.id}`;

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 cursor-pointer" onClick={() => (window.location.href = jobUrl)}>
      <td className="px-6 py-4">{job.num}</td>
      <td className="px-6 py-4">{job.description || "-"}</td>
      <td className="px-6 py-4">{job.customer.name}</td>
      <td className="px-6 py-4">{job.status}</td>
      <td className="px-6 py-4">{format(new Date(job.scheduledStart), "yyyy-MM-dd HH:mm")}</td>
      <td className="px-6 py-4">{job.technician.name}</td>
    </tr>
  );
}
