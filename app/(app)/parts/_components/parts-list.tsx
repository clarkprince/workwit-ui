"use client";

import { useEffect, useState, useCallback } from "react";
import { API_ENDPOINTS } from "@/config/api";
import { PaginationBar } from "@/components/ui/pagination";
import { Loader } from "@/components/ui/loader";
import { type PartListResponse } from "@/types/part";
import { PartsRow } from "./parts-row";

interface PartsListProps {
  initialPage: number;
  size: number;
  tenant?: string;
}

export function PartsList({ initialPage, size, tenant }: PartsListProps) {
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState<PartListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (size) params.append("size", size.toString());
      if (page) params.append("page", page.toString());

      const res = await fetch(`${API_ENDPOINTS.parts}/synchroteam/list?${params}`, {
        headers: {
          tenant: tenant || "",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch parts");
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load parts");
    } finally {
      setLoading(false);
    }
  }, [page, size, tenant]);

  useEffect(() => {
    if (tenant) {
      fetchParts();
    }
  }, [tenant, fetchParts]);

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
        <thead className="text-xs text-gray-800 uppercase bg-slate-100 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Reference
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3">
              Price
            </th>
            <th scope="col" className="px-6 py-3">
              Category
            </th>
            <th scope="col" className="px-6 py-3">
              Status
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
            data.data.map((part) => <PartsRow key={part.id} part={part} />)
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
