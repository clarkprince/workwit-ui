"use client";

import { type Activity } from "@/types/activity";
import { format } from "date-fns";
import { JSX, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

const getProcessBadgeColors = (process: string) => {
  switch (process.toLowerCase()) {
    case "parts":
      return "bg-blue-700 text-white ";
    case "jobs":
      return "bg-purple-700 text-white";
    case "customers":
      return "bg-yellow-700 text-white";
    case "invoices":
      return "bg-orange-700 text-white";
    default:
      return "bg-gray-700 text-white";
  }
};

interface ActivityRowProps {
  activity: Activity;
  selected?: boolean;
  onSelectedChange?: (checked: boolean) => void;
}

const truncateText = (text: string | null, limit: number) => {
  if (!text) return "N/A"; // Handle null or undefined text
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

export function ActivityRow({ activity, selected, onSelectedChange }: ActivityRowProps) {
  const searchParams = useSearchParams();
  const tenant = searchParams.get("tenant");
  const activityUrl = tenant ? `/activities/${activity.id}?tenant=${tenant}` : `/activities/${activity.id}`;

  const { activity1Id, activity2Id } = useMemo(
    () => ({
      activity1Id: extractIdFromJson(activity.activity1, false, activity.process),
      activity2Id: !activity.activity2 ? <span className="font-semibold text-orange-600">{truncateText(activity.message, 50) || "No activity 2"}</span> : extractIdFromJson(activity.activity2, true, activity.process),
    }),
    [activity.activity1, activity.activity2, activity.process, activity.message]
  );

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking the checkbox cell
    const target = e.target as HTMLElement;
    if (target.closest("td:first-child")) return;

    window.location.href = activityUrl;
  };

  return (
    <tr className="bg-white border-b hover:bg-gray-50 cursor-pointer" onClick={handleRowClick}>
      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={selected} onCheckedChange={onSelectedChange} className="translate-y-0" />
      </td>
      <td className="px-6 py-4">{activity.id}</td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getProcessBadgeColors(activity.process)}`}>{activity.process}</span>
      </td>
      <td className="px-6 py-4">{activity1Id}</td>
      <td className="px-6 py-4">{activity2Id}</td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 font-semibold rounded-full text-xs ${activity.successful ? "bg-green-200 text-green-950" : "bg-red-200 text-red-950"}`}>{activity.successful ? "Success" : "Failed"}</span>
      </td>
      <td className="px-6 py-4">{format(new Date(activity.createdAt), "yyyy-MM-dd HH:mm")}</td>
    </tr>
  );
}

function extractIdFromJson(jsonString: string, isActivity2: boolean, process: string): JSX.Element | string {
  // Return early if jsonString is null, empty or just whitespace
  if (!jsonString || jsonString.trim() === "") {
    return isActivity2 ? "N/A" : "N/A";
  }

  try {
    const data = JSON.parse(jsonString);

    // For activity2 of invoices and jobs, check for DocumentNumber in Order object
    if (isActivity2 && (process.toLowerCase() === "invoices" || process.toLowerCase() === "jobs") && data.Order?.DocumentNumber) {
      return (
        <>
          DocumentNumber =&gt; <span className="font-semibold">{data.Order.DocumentNumber}</span>
        </>
      );
    }

    if (data.ArticleNumber)
      return (
        <>
          ArticleNumber =&gt; <span className="font-semibold">{data.ArticleNumber}</span>
        </>
      );
    if (data.CustomerNumber)
      return (
        <>
          CustomerNumber =&gt; <span className="font-semibold">{data.CustomerNumber}</span>
        </>
      );
    if (data.id)
      return (
        <>
          id =&gt; <span className="font-semibold">{data.id}</span>
        </>
      );
    if (data.myId)
      return (
        <>
          myId =&gt; <span className="font-semibold">{data.myId}</span>
        </>
      );
    return "N/A";
  } catch (e) {
    return "Invalid " + e;
  }
}
