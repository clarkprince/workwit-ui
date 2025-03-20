"use client";

import { type Part } from "@/types/part";
import { useSearchParams } from "next/navigation";

export function PartsRow({ part }: { part: Part }) {
  const searchParams = useSearchParams();
  const tenant = searchParams.get("tenant");
  const statusColors = part.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  const href = tenant ? `/parts/${part.id}?tenant=${tenant}` : `/parts/${part.id}`;

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 cursor-pointer" onClick={() => (window.location.href = href)}>
      <td className="px-6 py-4">{part.reference}</td>
      <td className="px-6 py-4">{part.name}</td>
      <td className="px-6 py-4">{part.description || "-"}</td>
      <td className="px-6 py-4">{part.price}</td>
      <td className="px-6 py-4">{part.category.name}</td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${statusColors}`}>{part.status}</span>
      </td>
    </tr>
  );
}
