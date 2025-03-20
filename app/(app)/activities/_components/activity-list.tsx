"use client";

import { useEffect, useState } from "react";
import { ActivityRow } from "./activity-row";
import { API_ENDPOINTS } from "@/config/api";
import { PaginationBar } from "@/components/ui/pagination";
import { Loader } from "@/components/ui/loader";
import { type ActivityListResponse } from "@/types/activity";
import { Checkbox } from "@/components/ui/checkbox";

interface ActivityListProps {
  initialPage: number;
  size: number;
  tenant?: string;
  q?: string;
  from?: string;
  to?: string;
  process?: string;
  selectedActivities: number[];
  setSelectedActivities: React.Dispatch<React.SetStateAction<number[]>>;
}

export function ActivityList({ initialPage, size, tenant, q, from, to, process, selectedActivities, setSelectedActivities }: ActivityListProps) {
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState<ActivityListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reset page when search parameters change
  useEffect(() => {
    setPage(1);
  }, [q, from, to, tenant, process]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (size) params.append("size", size.toString());
        if (page) params.append("page", page.toString());
        if (q) params.append("q", q);
        if (from) params.append("from", from);
        if (to) params.append("to", to);
        if (process && process !== "All") params.append("process", process);

        const res = await fetch(`${API_ENDPOINTS.activities}/list?${params}`, {
          headers: { tenant: tenant || "" },
        });

        if (!res.ok) throw new Error("Failed to fetch activities");
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load activities");
      } finally {
        setLoading(false);
      }
    };

    if (tenant) {
      fetchActivities();
    }
  }, [page, size, tenant, q, from, to, process]);

  const toggleSelectAll = () => {
    if (!data) return;
    if (selectedActivities.length === data.data.length) {
      setSelectedActivities([]);
    } else {
      setSelectedActivities(data.data.map((a) => a.id));
    }
  };

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
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-800 uppercase bg-slate-100 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              <Checkbox checked={data?.data.length === selectedActivities.length} onCheckedChange={toggleSelectAll} />
            </th>
            <th scope="col" className="px-6 py-3">
              ID
            </th>
            <th scope="col" className="px-6 py-3">
              Process
            </th>
            <th scope="col" className="px-6 py-3">
              From
            </th>
            <th scope="col" className="px-6 py-3">
              To
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Created At
            </th>
          </tr>
        </thead>
        <tbody>
          {data.data.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 pt-10 pb-4 text-center text-gray-500">
                No results found
              </td>
            </tr>
          ) : (
            data.data.map((activity) => (
              <ActivityRow
                key={activity.id}
                activity={activity}
                selected={selectedActivities.includes(activity.id)}
                onSelectedChange={(checked) => {
                  if (checked) {
                    setSelectedActivities((prev) => [...prev, activity.id]);
                  } else {
                    setSelectedActivities((prev) => prev.filter((id) => id !== activity.id));
                  }
                }}
              />
            ))
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
