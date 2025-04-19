"use client";

import { useEffect, useState, useCallback } from "react";
import { API_ENDPOINTS } from "@/config/api";
import { PaginationBar } from "@/components/ui/pagination";
import { Loader } from "@/components/ui/loader";
import { useAuth } from "@/app/contexts/auth-context";
import { useSearchParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { QueuedPartsResponse, QueuedPart } from "@/types/part";

export function QueuedPartsList({ size }: { size: number }) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<QueuedPartsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const tenant = user?.role === "0" ? searchParams.get("tenant") || user?.tenant : user?.tenant;

  const fetchQueuedParts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("size", size.toString());
      params.append("page", page.toString());

      const res = await fetch(`${API_ENDPOINTS.parts}/synchroteam/queued?${params}`, {
        headers: {
          tenant: tenant || "",
          email: user?.email || "",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch queued parts");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching queued parts:", error);
      setData({ content: [], totalElements: 0, totalPages: 0, size: 0, number: 0 });
    } finally {
      setLoading(false);
    }
  }, [page, size, tenant, user?.email]);

  // Initial fetch
  useEffect(() => {
    if (!tenant || tenant === "null") return;
    fetchQueuedParts();
  }, [tenant, fetchQueuedParts]);

  // Polling effect with stable polling function
  const poll = useCallback(() => {
    if (!tenant || tenant === "null") return;
    if (!data?.content?.some((item) => ["PENDING", "PROCESSING"].includes(item.status))) {
      return;
    }
    fetchQueuedParts();
  }, [tenant, data?.content, fetchQueuedParts]);

  useEffect(() => {
    const pollInterval = setInterval(poll, 30000);
    return () => clearInterval(pollInterval);
  }, [poll]);

  const calculateProgress = (queueItem: QueuedPart) => {
    if (queueItem.status === "FAILED") return 0;
    if (!queueItem.totalParts || queueItem.totalParts === 0) return 0;
    const progress = Math.floor((queueItem.processedParts / queueItem.totalParts) * 100);
    return Math.min(progress, 100); // Ensure progress never exceeds 100%
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500 text-green-100";
      case "FAILED":
        return "bg-red-500 text-red-100";
      case "PENDING":
        return "bg-blue-500 text-blue-100";
      default:
        return "bg-yellow-500 text-yellow-100";
    }
  };

  if (!tenant || tenant === "null") return null;
  if (loading) return <Loader />;
  if (!data) return null;

  return (
    <>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-800 uppercase bg-slate-100">
          <tr>
            <th scope="col" className="px-6 py-3">
              Queue ID
            </th>
            <th scope="col" className="px-6 py-3">
              File Name
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Progress
            </th>
            <th scope="col" className="px-6 py-3">
              Created At
            </th>
          </tr>
        </thead>
        <tbody>
          {!data.content || data.content.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 pt-10 pb-4 text-center">
                No queued parts found
              </td>
            </tr>
          ) : (
            data.content.map((item) => (
              <tr key={item.queueId} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{item.queueId}</td>
                <td className="px-6 py-4">{item.fileName}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium mr-2 ${getStatusColor(item.status)}`}></span>
                  <span className="capitalize">{item.status.toLowerCase()}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="w-full max-w-[200px]">
                    <Progress value={calculateProgress(item)} className={`h-2 ${item.status === "FAILED" ? "bg-red-200" : ""}`} />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        {item.processedParts}/{item.totalParts} parts
                      </span>
                      {item.status !== "FAILED" && <span className="text-xs text-gray-500">{calculateProgress(item)}%</span>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{new Date(item.createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {data.content && data.content.length > 0 && (
        <div className="mt-6">
          <PaginationBar currentPage={page} totalPages={data.totalPages || 1} onPageChange={setPage} />
        </div>
      )}
    </>
  );
}
