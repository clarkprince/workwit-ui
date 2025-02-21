"use client";

import { useEffect, useState } from "react";
import { CustomerRow } from "./customer-row";
import { API_ENDPOINTS } from "@/config/api";
import { type CustomerListResponse } from "@/types/customer";
import { PaginationBar } from "@/components/ui/pagination";
import { Loader } from "@/components/ui/loader";

interface CustomerListProps {
  initialPage: number;
  size: number;
  from?: string;
  tenant?: string;
}

export function CustomerList({ initialPage, size, from, tenant }: CustomerListProps) {
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState<CustomerListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
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
        const res = await fetch(`${API_ENDPOINTS.customers}/list?${params}`, {
          headers: {
            tenant: tenant || "",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch customers");
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    if (tenant) {
      fetchCustomers();
    }
  }, [page, size, from, tenant]);

  if (loading) {
    return (
      <div className="text-center p-4">
        <Loader />
      </div>
    );
  }

  if (!tenant) {
    return <div className="text-center p-4">Please select a tenant first</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!data) {
    return null;
  }

  const totalRecords = data.MetaInformation["@TotalResources"];

  return (
    <>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Customer Number
            </th>
            <th scope="col" className="px-6 py-3">
              Organization Number
            </th>
            <th scope="col" className="px-6 py-3">
              City
            </th>
          </tr>
        </thead>
        <tbody>
          {data.Customers.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 pt-10 pb-4 text-center text-gray-500">
                No results found
              </td>
            </tr>
          ) : (
            data.Customers.map((customer) => <CustomerRow key={customer.CustomerNumber} customer={customer} />)
          )}
        </tbody>
      </table>
      {data.Customers.length > 0 && (
        <div className="mt-6">
          <PaginationBar currentPage={page} totalPages={Math.max(1, Math.ceil(totalRecords / size))} onPageChange={setPage} />
        </div>
      )}
    </>
  );
}
