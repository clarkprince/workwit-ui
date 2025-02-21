"use client";

import { PageHeader } from "@/app/components/page-header";
import { ArticleFilters } from "./_components/article-filters";
import { ArticleList } from "./_components/article-list";
import { TenantProvider } from "../customers/_components/tenant-context";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const ArticlesPage = () => {
  const searchParams = useSearchParams();

  const sizeStr = searchParams.get("size") || "10";
  const tenant = searchParams.get("tenant") || "";
  const from = searchParams.get("from") || "";

  const size = Number.isNaN(parseInt(sizeStr)) ? 3 : parseInt(sizeStr);

  return (
    <TenantProvider>
      <PageHeader breadcrumbs={[{ title: "Articles", href: "/articles" }]} />
      <div className="p-6">
        <div className="mb-6">
          <h1 className="font-semibold tracking-tight">Articles</h1>
        </div>
        <div className="mb-6">
          <Suspense fallback={<div>Loading filters...</div>}>
            <ArticleFilters skipInitialTenant={!!tenant} />
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
