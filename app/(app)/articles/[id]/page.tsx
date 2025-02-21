"use client";

import { useSearchParams, useParams } from "next/navigation";
import { PageHeader } from "@/app/components/page-header";
import { API_ENDPOINTS } from "@/config/api";
import { type Article } from "@/types/article";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/loader";

const ArticlePage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const tenant = searchParams.get("tenant") || "";
        const id = params.id as string;
        const res = await fetch(`${API_ENDPOINTS.parts}/${id}`, {
          headers: {
            tenant: tenant,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch article");
        const data = await res.json();
        setArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.id, searchParams]);

  const backUrl = searchParams.get("tenant") ? `/articles?tenant=${searchParams.get("tenant")}` : "/articles";

  if (loading) {
    return <Loader />;
  }

  if (!article) {
    return <div className="p-6">Failed to load article</div>;
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { title: "Articles", href: backUrl },
          { title: article.Description, href: "#" },
        ]}
      />
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <a href={backUrl}>
              <ArrowLeft className="h-4 w-4" />
            </a>
          </Button>
          <h1 className="font-semibold">{article.Description}</h1>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-black mb-4">Basic Information</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Article Number</dt>
                  <dd className="mt-1 text-[13px]">{article.ArticleNumber}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Description</dt>
                  <dd className="mt-1 text-[13px]">{article.Description}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Type</dt>
                  <dd className="mt-1 text-[13px]">{article.Type}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Unit</dt>
                  <dd className="mt-1 text-[13px]">{article.Unit}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Status</dt>
                  <dd className="mt-1 text-[13px]">{article.Active ? "Active" : "Inactive"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-black mb-4">Stock Information</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Quantity in Stock</dt>
                  <dd className="mt-1 text-[13px]">{article.QuantityInStock}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Reserved Quantity</dt>
                  <dd className="mt-1 text-[13px]">{article.ReservedQuantity}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Stock Value</dt>
                  <dd className="mt-1 text-[13px]">{article.StockValue}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Stock Point</dt>
                  <dd className="mt-1 text-[13px]">{article.DefaultStockPoint}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-black mb-4">Pricing</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Sales Price</dt>
                  <dd className="mt-1 text-[13px]">{article.SalesPrice}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Purchase Price</dt>
                  <dd className="mt-1 text-[13px]">{article.PurchasePrice}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">VAT</dt>
                  <dd className="mt-1 text-[13px]">{article.VAT}%</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Direct Cost</dt>
                  <dd className="mt-1 text-[13px]">{article.DirectCost}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-black mb-4">Supplier Information</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Supplier Name</dt>
                  <dd className="mt-1 text-[13px]">{article.SupplierName}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Supplier Number</dt>
                  <dd className="mt-1 text-[13px]">{article.SupplierNumber}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ArticlePage;
