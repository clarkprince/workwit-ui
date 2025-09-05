"use client";

import { PageHeader } from "@/app/components/page-header";
import { ArticleFilters } from "./_components/article-filters";
import { ArticleList } from "./_components/article-list";
import { TenantProvider } from "../customers/_components/tenant-context";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/auth-context";
import { useTenants } from "../customers/_components/tenant-context";
import { Loader } from "@/components/ui/loader";

const ArticlesPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { tenants } = useTenants();
  const [isInitialized, setIsInitialized] = useState(false);

  const sizeStr = searchParams.get("size") || "10";
  const rawTenant = searchParams.get("tenant") || "";
  const from = searchParams.get("from") || "";

  const size = Number.isNaN(parseInt(sizeStr)) ? 3 : parseInt(sizeStr);

  // Determine the correct tenant based on user role
  const tenant = user?.role === "0" ? rawTenant : user?.tenant || "";

  useEffect(() => {
    if (user?.role === "0" && tenants.length > 0 && !searchParams.get("tenant")) {
      const query = `?tenant=${tenants[0].synchroteamDomain}`;
      router.push(`/articles${query}`);
    } else {
      setIsInitialized(true);
    }
  }, [user, tenants, searchParams, router]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <TenantProvider>
      <PageHeader breadcrumbs={[{ title: "Articles", href: "/articles" }]} />
      <div className="p-6">
        <div className="mb-6">
          <h1 className="font-semibold tracking-tight">Articles</h1>
        </div>
        <div className="mb-6">
          <Suspense fallback={<div>Loading filters...</div>}>
            <ArticleFilters skipInitialTenant={!!rawTenant} />
          </Suspense>
        </div>
        <div className="relative overflow-x-auto">
          <ArticleList initialPage={1} size={size} from={from} tenant={tenant} />
        </div>
      </div>
    </TenantProvider>
  );
};

export default ArticlesPage;
