"use client";

import { API_BASE_URL } from "@/config/api";
import { useEffect, useState } from "react";
import { Circle } from "lucide-react";

interface ProcessMonitorProps {
  tenant?: string;
}

interface MonitorStatus {
  successful: boolean;
  runAt: string;
}

export function ProcessMonitor({ tenant }: ProcessMonitorProps) {
  const [status, setStatus] = useState<MonitorStatus | null>(null);

  useEffect(() => {
    if (!tenant) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/process-monitors/tenant/${tenant}/latest`);
        if (!res.ok) {
          setStatus(null);
          return;
        }
        const data = await res.json();
        setStatus(data);
      } catch {
        setStatus(null);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Poll every minute

    return () => clearInterval(interval);
  }, [tenant]);

  return (
    <div className="flex items-center gap-2 text-sm">
      <span>Process Monitor:</span>
      {status ? (
        <>
          <Circle className={`h-3 w-3 fill-current ${status.successful ? "text-green-500" : "text-red-500"}`} />
          <span>{status.runAt}</span>
        </>
      ) : (
        <>
          <Circle className="h-3 w-3 fill-current text-red-500" />
          <span>N/A</span>
        </>
      )}
    </div>
  );
}
