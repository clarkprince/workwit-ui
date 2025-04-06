"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTenants } from "../../customers/_components/tenant-context";
import { Loader } from "@/components/ui/loader";
import { useEffect, useCallback, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Search } from "lucide-react";
import { API_ENDPOINTS } from "@/config/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/app/contexts/auth-context";

export function PartsFilters({ skipInitialTenant = false, onRefresh }: { skipInitialTenant?: boolean; onRefresh?: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
    if (user?.role === "0" && tenants.length > 0 && !skipInitialTenant && (!searchParams.get("tenant") || searchParams.get("tenant") == "null")) {
      const defaultTenant = user.tenant && user.tenant !== "null" ? user.tenant : tenants[0].synchroteamDomain; // Use user's tenant if available and not "null"
      updateFilters(defaultTenant);
    }
  }, [tenants, skipInitialTenant, searchParams, updateFilters, user]);

  if (loading) return <Loader />;
  if (error) return <div>Error loading tenants</div>;
  if (tenants.length === 0) return null;

  const currentTenant = searchParams.get("tenant") || tenants[0].synchroteamDomain;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const tenant = user?.role === "0" ? searchParams.get("tenant") || "" : user?.tenant;

    try {
      setUploading(true);
      toast.loading("Uploading parts prices...");

      const res = await fetch(`${API_ENDPOINTS.parts}/synchroteam/parts/upload`, {
        method: "POST",
        headers: {
          tenant: tenant || "", // Use tenant based on role and searchParams
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;

    const tenant = user?.role === "0" ? searchParams.get("tenant") || "" : user?.tenant;

    try {
      const res = await fetch(`${API_ENDPOINTS.parts}/synchroteam/search?reference=${encodeURIComponent(searchTerm)}`, {
        headers: {
          tenant: tenant || "",
        },
      });

      if (res.status === 404) {
        toast.error("Part not found");
        return;
      }

      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();
      if (data && data.id) {
        router.push(`/parts/${data.id}?tenant=${tenant}`);
      } else {
        toast.error("Part not found");
      }
    } catch (error) {
      toast.error("Failed to search part");
      console.error("Search error:", error);
    }
  };

  return (
    <div className="flex gap-4 mb-4 items-center justify-between">
      <div className="flex gap-4 items-center">
        {user?.role === "0" && (
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

        <form onSubmit={handleSearch} className="flex gap-2 items-center">
          <div className="relative">
            <Input type="search" placeholder="Search by reference..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-[300px] pl-10" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>
        </form>
      </div>

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
