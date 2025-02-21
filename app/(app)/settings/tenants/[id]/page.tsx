"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/app/components/page-header";
import { TenantForm } from "../_components/tenant-form";

const TenantDetailPage = () => {
  const params = useParams();

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { title: "Settings", href: "/settings" },
          { title: "Tenants", href: "/settings/tenants" },
          { title: "Edit Tenant", href: `/settings/tenants/${params.id}` },
        ]}
      />
      <div className="p-6">
        <TenantForm id={params.id as string} />
      </div>
    </>
  );
};

export default TenantDetailPage;
