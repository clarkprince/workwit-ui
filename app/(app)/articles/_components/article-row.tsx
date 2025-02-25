"use client";

import { type Article } from "@/types/article";
import { useSearchParams } from "next/navigation";

export function ArticleRow({ article }: { article: Article }) {
  const searchParams = useSearchParams();
  const tenant = searchParams.get("tenant");
  const articleUrl = tenant ? `/articles/${article.ArticleNumber}?tenant=${tenant}` : `/articles/${article.ArticleNumber}`;

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 cursor-pointer" onClick={() => (window.location.href = articleUrl)}>
      <td className="px-6 py-4 font-semibold text-sm">{article.Description}</td>
      <td className="px-6 py-4">{article.ArticleNumber}</td>
      <td className="px-6 py-4">{article.Unit || "-"}</td>
      <td className="px-6 py-4">{article.QuantityInStock}</td>
      <td className="px-6 py-4">{article.SalesPrice} kr</td>
    </tr>
  );
}
