"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/config/api";
import { useRouter } from "next/navigation";
import { type Tenant } from "@/types/tenant";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { useState } from "react";

export function TenantRow({ tenant }: { tenant: Tenant }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this tenant?")) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.tenants}/${tenant.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete tenant");

      toast.success("Tenant deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete tenant");
      console.error("Failed to delete tenant:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td className="px-6 py-4">{tenant.synchroteamDomain}</td>
        <td className="px-6 py-4">{tenant.synchroteamAPIKey}</td>
        <td className="px-6 py-4">
          <Badge variant={tenant.tenantActive ? "success" : "failure"}>{tenant.tenantActive ? "Active" : "Inactive"}</Badge>
        </td>
        <td className="px-6 py-4">{tenant.lastSync}</td>
        <td className="px-6 py-4">
          <div className="flex gap-2">
            <Button asChild variant="ghost" size="sm" className="bg-slate-50 text-slate-600 hover:bg-slate-100">
              <Link href={`/settings/tenants/${tenant.id}`}>Edit</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete} className="bg-slate-50 text-slate-600 hover:bg-slate-100">
              Delete
            </Button>
          </div>
        </td>
      </tr>
    </>
  );
}
