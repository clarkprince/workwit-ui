"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTenants } from "../../customers/_components/tenant-context";
import { Loader } from "@/components/ui/loader";
import { useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";

export function JobFilters({ skipInitialTenant = false }: { skipInitialTenant?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tenants, loading, error } = useTenants();

  const updateFilters = useCallback(
    (tenant?: string, from?: string) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      if (tenant) current.set("tenant", tenant);
      if (from) current.set("from", from);
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`/jobs${query}`);
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

  return (
    <div className="flex gap-4 mb-4 items-center justify-between">
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

      <div className="gap-2 flex items-center">
        <Label htmlFor="from-date" className="text-[13px]">
          From Date
        </Label>
        <Input id="from-date" type="date" className="w-auto" onChange={(e) => updateFilters(undefined, e.target.value)} defaultValue={searchParams.get("from") || ""} />
      </div>
    </div>
  );
}
