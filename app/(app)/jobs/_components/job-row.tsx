"use client";

import { type Job } from "@/types/job";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";

// Helper function to trim text
const trimText = (text: string | null | undefined, maxLength: number): string => {
  if (!text) return "-";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export function JobRow({ job }: { job: Job }) {
  const searchParams = useSearchParams();
  const tenant = searchParams.get("tenant");
  const jobUrl = tenant ? `/jobs/${job.id}?tenant=${tenant}` : `/jobs/${job.id}`;

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 cursor-pointer" onClick={() => (window.location.href = jobUrl)}>
      <td className="px-6 py-4">{job.num}</td>
      <td className="px-6 py-4">{trimText(job.description, 50)}</td>
      <td className="px-6 py-4 font-semibold text-sm">{job.customer.name}</td>
      <td className="px-6 py-4">{job.status}</td>
      <td className="px-6 py-4">{format(new Date(job.scheduledStart), "yyyy-MM-dd HH:mm")}</td>
      <td className="px-6 py-4">{job.technician.name}</td>
    </tr>
  );
}
