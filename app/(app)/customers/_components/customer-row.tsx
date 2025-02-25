"use client";

import { type Customer } from "@/types/customer";
import { useSearchParams } from "next/navigation";

export function CustomerRow({ customer }: { customer: Customer }) {
  const searchParams = useSearchParams();
  const tenant = searchParams.get("tenant");
  const customerUrl = tenant ? `/customers/${customer.CustomerNumber}?tenant=${tenant}` : `/customers/${customer.CustomerNumber}`;

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 cursor-pointer" onClick={() => (window.location.href = customerUrl)}>
      <td className="px-6 py-4 font-semibold text-sm">{customer.Name}</td>
      <td className="px-6 py-4">{customer.CustomerNumber}</td>
      <td className="px-6 py-4">{customer.OrganisationNumber}</td>
      <td className="px-6 py-4">{customer.City}</td>
    </tr>
  );
}
