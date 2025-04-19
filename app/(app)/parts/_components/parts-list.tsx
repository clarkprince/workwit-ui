"use client";

import { useEffect, useState, useCallback } from "react";
import { API_ENDPOINTS } from "@/config/api";
import { PaginationBar } from "@/components/ui/pagination";
import { Loader } from "@/components/ui/loader";
import { type PartListResponse } from "@/types/part";
import { PartsRow } from "./parts-row";
import { useAuth } from "@/app/contexts/auth-context";
import { useSearchParams } from "next/navigation"; // Import for URL params

interface PartsListProps {
  initialPage: number;
  size: number;
  from: string;
}

export function PartsList({ initialPage, size, from }: PartsListProps) {
  const { user } = useAuth();
  const searchParams = useSearchParams(); // Access URL parameters
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState<PartListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine tenant
  const tenant = user?.role == "0" ? searchParams.get("tenant") || user?.tenant : user?.tenant;

  const fetchParts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (size) params.append("size", size.toString());
      if (page) params.append("page", page.toString());
      if (from) params.append("from", from);

      const res = await fetch(`${API_ENDPOINTS.parts}/synchroteam/list?${params}`, {
        headers: {
          ...(tenant ? { tenant } : {}),
        },
      });

      if (!res.ok) throw new Error("Failed to fetch parts");
      const result = await res.json();

      // Update this section to handle the response correctly
      setData({
        data: result.data || [], // Direct access to data array
        recordsTotal: result.recordsTotal || 0,
        page: result.page || page,
        pageSize: result.pageSize || size,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load parts");
      setData({
        data: [],
        recordsTotal: 0,
        page: page,
        pageSize: size,
      });
    } finally {
      setLoading(false);
    }
  }, [page, size, from, tenant]);

  useEffect(() => {
    if (!tenant || tenant === "null") return;
    fetchParts();
  }, [tenant, fetchParts]);

  if (!tenant || tenant === "null") return null;
  if (loading)
    return (
      <div className="text-center p-4">
        <Loader />
      </div>
    );
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!data || !data.data) return null;

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
          {!data.data || data.data.length === 0 ? (
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
      {data.data && data.data.length > 0 && (
        <div className="mt-6">
          <PaginationBar currentPage={page} totalPages={Math.max(1, Math.ceil((data.recordsTotal || 0) / size))} onPageChange={setPage} />
        </div>
      )}
    </>
  );
}
