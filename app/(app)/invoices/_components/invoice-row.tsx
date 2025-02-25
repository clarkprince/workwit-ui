"use client";

import { type Invoice } from "@/types/invoice";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";

export function InvoiceRow({ invoice }: { invoice: Invoice }) {
  const searchParams = useSearchParams();
  const tenant = searchParams.get("tenant");
  const invoiceUrl = tenant ? `/invoices/${invoice.id}?tenant=${tenant}` : `/invoices/${invoice.id}`;

  return (
    <tr className="bg-white border-b hover:bg-gray-50 cursor-pointer" onClick={() => (window.location.href = invoiceUrl)}>
      <td className="px-6 py-4">{invoice.num}</td>
      <td className="px-6 py-4 font-semibold text-sm">{invoice.customer.name}</td>
      <td className="px-6 py-4">{invoice.job.num}</td>
      <td className="px-6 py-4">{invoice.status}</td>
      <td className="px-6 py-4">{format(new Date(invoice.dateCreated), "yyyy-MM-dd HH:mm")}</td>
      <td className="px-6 py-4">{invoice.total.toFixed(2)}</td>
    </tr>
  );
}
