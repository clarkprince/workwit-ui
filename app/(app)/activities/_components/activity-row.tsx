"use client";

import { type Activity } from "@/types/activity";
import { format } from "date-fns";
import { JSX, useMemo } from "react";
import { useSearchParams } from "next/navigation";

const getProcessBadgeColors = (process: string) => {
  switch (process.toLowerCase()) {
    case "parts":
      return "bg-blue-100 text-blue-800 font-semibold";
    case "jobs":
      return "bg-purple-100 text-purple-800 font-semibold";
    case "customers":
      return "bg-yellow-100 text-green-800 font-semibold";
    case "invoices":
      return "bg-orange-100 text-orange-800 font-semibold";
    default:
      return "bg-gray-100 text-gray-800 font-semibold";
  }
};

export function ActivityRow({ activity }: { activity: Activity }) {
  const searchParams = useSearchParams();
  const tenant = searchParams.get("tenant");
  const activityUrl = tenant ? `/activities/${activity.id}?tenant=${tenant}` : `/activities/${activity.id}`;

  const { activity1Id, activity2Id } = useMemo(
    () => ({
      activity1Id: extractIdFromJson(activity.activity1, false, activity.process),
      activity2Id: extractIdFromJson(activity.activity2, true, activity.process),
    }),
    [activity.activity1, activity.activity2, activity.process]
  );

  return (
    <tr className="bg-white border-b hover:bg-gray-50 cursor-pointer" onClick={() => (window.location.href = activityUrl)}>
      <td className="px-6 py-4">{activity.id}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs ${getProcessBadgeColors(activity.process)}`}>{activity.process}</span>
      </td>
      <td className="px-6 py-4">{activity1Id}</td>
      <td className="px-6 py-4">{activity2Id}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs ${activity.successful ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{activity.successful ? "Success" : "Failed"}</span>
      </td>
      <td className="px-6 py-4">{format(new Date(activity.createdAt), "yyyy-MM-dd HH:mm")}</td>
    </tr>
  );
}

function extractIdFromJson(jsonString: string, isActivity2: boolean, process: string): JSX.Element | string {
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
