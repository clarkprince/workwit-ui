"use client";

import { useSearchParams, useParams } from "next/navigation";
import { PageHeader } from "@/app/components/page-header";
import { API_ENDPOINTS } from "@/config/api";
import { type Invoice } from "@/types/invoice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/loader";

const InvoicePage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const tenant = searchParams.get("tenant") || "";
        const id = params.id as string;
        const res = await fetch(`${API_ENDPOINTS.invoices}/${id}`, {
          headers: {
            tenant: tenant,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch invoice");
        const data = await res.json();
        setInvoice(data);
      } catch (error) {
        console.error("Error fetching invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [params.id, searchParams]);

  const backUrl = searchParams.get("tenant") ? `/invoices?tenant=${searchParams.get("tenant")}` : "/invoices";

  const formatCurrency = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value.replace(",", ".")) : value;
    return new Intl.NumberFormat("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
  };

  if (loading) {
    return <Loader />;
  }

  if (!invoice) {
    return <div className="p-6">Failed to load invoice</div>;
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { title: "Invoices", href: backUrl },
          { title: `Invoice #${invoice.num}`, href: "#" },
        ]}
      />
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <a href={backUrl}>
              <ArrowLeft className="h-4 w-4" />
            </a>
          </Button>
          <h1 className="font-semibold">Invoice #{invoice.num}</h1>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-black mb-4">Basic Information</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Invoice Number</dt>
                  <dd className="mt-1 text-[13px]">{invoice.num}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Job Number</dt>
                  <dd className="mt-1 text-[13px]">{invoice.job.num}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Status</dt>
                  <dd className="mt-1 text-[13px] capitalize">{invoice.status}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">VAT Number</dt>
                  <dd className="mt-1 text-[13px]">{invoice.vat}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Created Date</dt>
                  <dd className="mt-1 text-[13px]">{format(new Date(invoice.dateCreated), "yyyy-MM-dd HH:mm")}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Last Modified</dt>
                  <dd className="mt-1 text-[13px]">{format(new Date(invoice.dateChanged), "yyyy-MM-dd HH:mm")}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-black mb-4">Customer Information</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Customer</dt>
                  <dd className="mt-1 text-[13px]">{invoice.customer.name}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Customer ID</dt>
                  <dd className="mt-1 text-[13px]">{invoice.customer.myId}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-semibold text-[13px] text-gray-500">Address</dt>
                  <dd className="mt-1 text-[13px] whitespace-pre-line">{invoice.address}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-black mb-4">Invoice Lines</h2>
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Product Code
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Unit Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Tax Rate
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Tax Amount
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lines.map((line, index) => (
                    <tr key={index} className="bg-white border-b">
                      <td className="px-6 py-4">{line.description}</td>
                      <td className="px-6 py-4">{line.partProductCode}</td>
                      <td className="px-6 py-4">{formatCurrency(line.quantity)}</td>
                      <td className="px-6 py-4">{formatCurrency(line.unitPrice)}</td>
                      <td className="px-6 py-4">{formatCurrency(line.taxRate)}%</td>
                      <td className="px-6 py-4">{formatCurrency(line.taxAmt)}</td>
                      <td className="px-6 py-4">{formatCurrency(line.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="font-semibold">
                  <tr className="border-t">
                    <td colSpan={5} className="px-6 py-4 text-right">
                      Subtotal:
                    </td>
                    <td className="px-6 py-4">{formatCurrency(invoice.taxAmt)}</td>
                    <td className="px-6 py-4">{formatCurrency(invoice.subTotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-right">
                      Tax:
                    </td>
                    <td className="px-6 py-4">{formatCurrency(invoice.taxAmt)}</td>
                    <td className="px-6 py-4"></td>
                  </tr>
                  <tr className="border-t">
                    <td colSpan={5} className="px-6 py-4 text-right">
                      Total:
                    </td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4">{formatCurrency(invoice.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default InvoicePage;
