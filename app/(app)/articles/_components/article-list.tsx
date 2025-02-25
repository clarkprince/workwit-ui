"use client";

import { useEffect, useState } from "react";
import { ArticleRow } from "./article-row";
import { API_ENDPOINTS } from "@/config/api";
import { PaginationBar } from "@/components/ui/pagination";
import { Loader } from "@/components/ui/loader";
import { type ArticleListResponse } from "@/types/article";

interface ArticleListProps {
  initialPage: number;
  size: number;
  from?: string;
  tenant?: string;
}

export function ArticleList({ initialPage, size, from, tenant }: ArticleListProps) {
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState<ArticleListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (size) params.append("size", size.toString());
        if (page && size) {
          const offset = (page - 1) * size;
          params.append("offset", offset.toString());
        }
        if (from) params.append("from", from);

        const res = await fetch(`${API_ENDPOINTS.parts}/list?${params}`, {
          headers: {
            tenant: tenant || "",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch articles");
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load articles");
      } finally {
        setLoading(false);
      }
    };

    if (tenant) {
      fetchArticles();
    }
  }, [page, size, from, tenant]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading)
    return (
      <div className="text-center p-4">
        <Loader />
      </div>
    );
  if (!tenant) return <div className="text-center p-4">Please select a tenant first</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!data) return null;

  const totalRecords = data.MetaInformation["@TotalResources"];

  return (
    <>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-800 uppercase bg-slate-100 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3">
              Article Number
            </th>
            <th scope="col" className="px-6 py-3">
              Unit
            </th>
            <th scope="col" className="px-6 py-3">
              Stock
            </th>
            <th scope="col" className="px-6 py-3">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {data.Articles.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 pt-10 pb-4 text-center text-gray-500">
                No results found
              </td>
            </tr>
          ) : (
            data.Articles.map((article) => <ArticleRow key={article.ArticleNumber} article={article} />)
          )}
        </tbody>
      </table>
      {data.Articles.length > 0 && (
        <div className="mt-6">
          <PaginationBar currentPage={page} totalPages={Math.max(1, Math.ceil(totalRecords / size))} onPageChange={handlePageChange} />
        </div>
      )}
    </>
  );
}
