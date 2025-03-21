"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTenants } from "../../customers/_components/tenant-context";
import { Loader } from "@/components/ui/loader";
import { useEffect, useCallback, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { API_ENDPOINTS } from "@/config/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/app/contexts/auth-context";

export function PartsFilters({ skipInitialTenant = false, onRefresh }: { skipInitialTenant?: boolean; onRefresh?: () => void }) {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tenants, loading, error } = useTenants();
  const { user } = useAuth();

  const updateFilters = useCallback(
    (tenant?: string, from?: string) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      if (tenant) current.set("tenant", tenant);
      if (from) current.set("from", from);
      else if (from === "") current.delete("from");
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`/parts${query}`);
    },
    [searchParams, router]
  );

  useEffect(() => {
    if (tenants.length > 0 && !skipInitialTenant && !searchParams.get("tenant")) {
      updateFilters(tenants[0].synchroteamDomain);
    }
  }, [tenants, skipInitialTenant, searchParams, updateFilters]);

  if (loading) return <Loader />;
  if (error) return <div>Error loading tenants</div>;
  if (tenants.length === 0) return null;

  const currentTenant = searchParams.get("tenant") || tenants[0].synchroteamDomain;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      toast.loading("Uploading parts prices...");

      const res = await fetch(`${API_ENDPOINTS.parts}/synchroteam/prices/upload`, {
        method: "POST",
        headers: {
          tenant: currentTenant,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      toast.dismiss();
      toast.success("Parts uploaded successfully");
      onRefresh?.();
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to upload parts");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="flex gap-4 mb-4 items-center justify-between">
      {user?.role !== "1" && (
        <div className="gap-2 flex items-center">
          <Label htmlFor="tenant-select" className="text-[13px]">
            Tenant
          </Label>
          <Select value={currentTenant} onValueChange={(value) => updateFilters(value, undefined)}>
            <SelectTrigger id="tenant-select" className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tenants.map((tenant) => (
                <SelectItem key={tenant.synchroteamDomain} value={tenant.synchroteamDomain}>
                  {tenant.synchroteamDomain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="gap-2 flex items-center">
          <Label htmlFor="from-date" className="text-[13px]">
            From Date
          </Label>
          <Input id="from-date" type="date" className="w-auto" onChange={(e) => updateFilters(undefined, e.target.value)} defaultValue={searchParams.get("from") || ""} />
        </div>

        <div className="flex items-center gap-2">
          <input type="file" accept=".csv,.xlsx,.xls,.txt" onChange={handleFileUpload} className="hidden" id="file-upload" />
          <Button variant="outline" size="sm" onClick={() => document.getElementById("file-upload")?.click()} disabled={uploading}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Part Prices
          </Button>
        </div>
      </div>
    </div>
  );
}
