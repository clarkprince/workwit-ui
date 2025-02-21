"use client";

import { useEffect, useState } from "react";
import { JobRow } from "./job-row";
import { API_ENDPOINTS } from "@/config/api";
import { PaginationBar } from "@/components/ui/pagination";
import { Loader } from "@/components/ui/loader";
import { type JobListResponse } from "@/types/job";

interface JobListProps {
  initialPage: number;
  size: number;
  from?: string;
  tenant?: string;
}

export function JobList({ initialPage, size, from, tenant }: JobListProps) {
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState<JobListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (size) params.append("size", size.toString());
        if (page) params.append("page", page.toString());
        if (from) params.append("from", from);

        const res = await fetch(`${API_ENDPOINTS.jobs}/list?${params}`, {
          headers: {
            tenant: tenant || "",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch jobs");
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    if (tenant) {
      fetchJobs();
    }
  }, [page, size, from, tenant]);

  if (loading)
    return (
      <div className="text-center p-4">
        <Loader />
      </div>
    );
  if (!tenant) return <div className="text-center p-4">Please select a tenant first</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!data) return null;

  return (
    <>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Number
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3">
              Customer
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Scheduled Start
            </th>
            <th scope="col" className="px-6 py-3">
              Technician
            </th>
          </tr>
        </thead>
        <tbody>
          {data.data.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 pt-10 pb-4 text-center text-gray-500">
                No results found
              </td>
            </tr>
          ) : (
            data.data.map((job) => <JobRow key={job.id} job={job} />)
          )}
        </tbody>
      </table>
      {data.data.length > 0 && (
        <div className="mt-6">
          <PaginationBar currentPage={page} totalPages={Math.max(1, Math.ceil(data.recordsTotal / size))} onPageChange={setPage} />
        </div>
      )}
    </>
  );
}
