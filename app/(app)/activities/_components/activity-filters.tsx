"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTenants } from "../../customers/_components/tenant-context";
import { Loader } from "@/components/ui/loader";
import { useEffect, useCallback, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search, Redo } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActivityFiltersProps {
  selectedCount: number;
  onRerunSelected: () => void;
}

export function ActivityFilters({ selectedCount, onRerunSelected }: ActivityFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tenants, loading, error, defaultTenant } = useTenants();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  const updateFilters = useCallback(
    (updates: { tenant?: string; q?: string; from?: string; to?: string; process?: string }) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      if (updates.tenant) current.set("tenant", updates.tenant);
      if (updates.q) current.set("q", updates.q);
      else if (updates.q === "") current.delete("q");
      if (updates.from) current.set("from", updates.from);
      else if (updates.from === "") current.delete("from");
      if (updates.to) current.set("to", updates.to);
      else if (updates.to === "") current.delete("to");
      if (updates.process) current.set("process", updates.process);
      else if (updates.process === "All") current.delete("process");

      // Reset page when filters change
      current.delete("page");

      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`/activities${query}`);
    },
    [searchParams, router]
  );

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    updateFilters({ q: searchTerm });
  };

  // Update searchTerm when URL parameter changes
  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    if (tenants.length > 0 && !searchParams.get("tenant") && defaultTenant) {
      updateFilters({ tenant: defaultTenant });
    }
  }, [tenants, searchParams, updateFilters, defaultTenant]);

  if (loading) return <Loader />;
  if (error) return <div>Error loading tenants</div>;
  if (tenants.length === 0) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-4 items-center">
        <div className="flex gap-2 items-center">
          <Label htmlFor="tenant-select" className="text-[13px]">
            Tenant
          </Label>
          <Select value={searchParams.get("tenant") || tenants[0].synchroteamDomain} onValueChange={(value) => updateFilters({ tenant: value })}>
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

        <div className="flex gap-2 items-center">
          <Label htmlFor="process-select" className="text-[13px]">
            Process
          </Label>
          <Select value={searchParams.get("process") || "All"} onValueChange={(value) => updateFilters({ process: value })}>
            <SelectTrigger id="process-select" className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Customers">Customers</SelectItem>
              <SelectItem value="Parts">Parts</SelectItem>
              <SelectItem value="Jobs">Jobs</SelectItem>
              <SelectItem value="Invoices">Invoices</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 items-center">
          <div className="relative">
            <Input type="search" placeholder="Search activities..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-[300px] pl-10" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>
        </form>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex gap-2 items-center">
          <Label htmlFor="from-date" className="text-[13px]">
            From
          </Label>
          <Input id="from-date" type="date" className="w-auto" value={searchParams.get("from") || ""} onChange={(e) => updateFilters({ from: e.target.value })} />
        </div>

        <div className="flex gap-2 items-center">
          <Label htmlFor="to-date" className="text-[13px]">
            To
          </Label>
          <Input id="to-date" type="date" className="w-auto" value={searchParams.get("to") || ""} onChange={(e) => updateFilters({ to: e.target.value })} />
        </div>

        {selectedCount > 0 && (
          <Button onClick={onRerunSelected} variant="secondary" size="sm" className="ml-4">
            <Redo className="h-4 w-4 mr-2" />
            Re-run {selectedCount} {selectedCount === 1 ? "activity" : "activities"}
          </Button>
        )}
      </div>
    </div>
  );
}
