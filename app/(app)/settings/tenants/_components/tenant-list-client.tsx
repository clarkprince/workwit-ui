"use client";
import { PageHeader } from "@/app/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TenantRow } from "./tenant-row";
import { type Tenant } from "@/types/tenant";

interface TenantListClientProps {
  tenants: Tenant[];
}

export function TenantListClient({ tenants }: TenantListClientProps) {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { title: "Settings", href: "/settings" },
          { title: "Tenants", href: "/settings/tenants" },
        ]}
      />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-semibold tracking-tight">Tenants</h1>
          <Button asChild>
            <Link href="/settings/tenants/new">Add Tenant</Link>
          </Button>
        </div>
        {tenants.length === 0 ? (
          <div className="text-center py-6 text-gray-500">No tenants found. Add a tenant to get started.</div>
        ) : (
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-800 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Synchroteam Domain
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Synchroteam API Key
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Last Sync
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => (
                  <TenantRow key={tenant.id} tenant={tenant} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
