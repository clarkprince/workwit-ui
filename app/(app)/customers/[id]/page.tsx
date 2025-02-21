"use client";

import { useSearchParams, useParams } from "next/navigation";
import { PageHeader } from "@/app/components/page-header";
import { API_ENDPOINTS } from "@/config/api";
import { type Customer } from "@/types/customer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/loader";

const CustomerPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const tenant = searchParams.get("tenant") || "";
        const id = params.id as string;
        const res = await fetch(`${API_ENDPOINTS.customers}/${id}`, {
          headers: {
            tenant: tenant,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch customer");
        const data = await res.json();
        setCustomer(data);
      } catch (error) {
        console.error("Error fetching customer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [params.id, searchParams]);

  const backUrl = searchParams.get("tenant") ? `/customers?tenant=${searchParams.get("tenant")}` : "/customers";

  if (loading) {
    return <Loader />;
  }

  if (!customer) {
    return <div className="p-6">Failed to load customer</div>;
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { title: "Customers", href: backUrl },
          { title: customer.Name, href: "#" },
        ]}
      />
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <a href={backUrl}>
              <ArrowLeft className="h-4 w-4" />
            </a>
          </Button>
          <h1 className="font-semibold">{customer.Name}</h1>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-black mb-4">Basic Information</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Name</dt>
                  <dd className="mt-1 text-[13px]">{customer.Name}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Customer Number</dt>
                  <dd className="mt-1 text-[13px]">{customer.CustomerNumber}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Organization Number</dt>
                  <dd className="mt-1 text-[13px]">{customer.OrganisationNumber}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">VAT Number</dt>
                  <dd className="mt-1 text-[13px]">{customer.VATNumber || "-"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Type</dt>
                  <dd className="mt-1 text-[13px]">{customer.Type}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Status</dt>
                  <dd className="mt-1 text-[13px]">{customer.Active ? "Active" : "Inactive"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">VAT Type</dt>
                  <dd className="mt-1 text-[13px]">{customer.VATType}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Show Price VAT Included</dt>
                  <dd className="mt-1 text-[13px]">{customer.ShowPriceVATIncluded ? "Yes" : "No"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Cost Center</dt>
                  <dd className="mt-1 text-[13px]">{customer.CostCenter || "-"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Project</dt>
                  <dd className="mt-1 text-[13px]">{customer.Project || "-"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Sales Account</dt>
                  <dd className="mt-1 text-[13px]">{customer.SalesAccount || "-"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">External Reference</dt>
                  <dd className="mt-1 text-[13px]">{customer.ExternalReference || "-"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-black mb-4">References</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Your Reference</dt>
                  <dd className="mt-1 text-[13px]">{customer.YourReference || "-"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Our Reference</dt>
                  <dd className="mt-1 text-[13px]">{customer.OurReference || "-"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">GLN</dt>
                  <dd className="mt-1 text-[13px]">{customer.GLN || "-"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">GLN Delivery</dt>
                  <dd className="mt-1 text-[13px]">{customer.GLNDelivery || "-"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-black mb-4">Contact Information</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Primary Address</dt>
                  <dd className="mt-1 text-[13px]">
                    {customer.Address1}
                    {customer.Address2 && <br />}
                    {customer.Address2}
                    <br />
                    {customer.ZipCode} {customer.City}
                    <br />
                    {customer.Country} ({customer.CountryCode})
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Delivery Address</dt>
                  <dd className="mt-1 text-[13px]">
                    {customer.DeliveryName && (
                      <>
                        {customer.DeliveryName}
                        <br />
                      </>
                    )}
                    {customer.DeliveryAddress1 || "Same as primary address"}
                    {customer.DeliveryAddress2 && <br />}
                    {customer.DeliveryAddress2}
                    {customer.DeliveryZipCode && (
                      <>
                        <br />
                        {customer.DeliveryZipCode} {customer.DeliveryCity}
                      </>
                    )}
                    {customer.DeliveryCountry && (
                      <>
                        <br />
                        {customer.DeliveryCountry} ({customer.DeliveryCountryCode})
                      </>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Phone Numbers</dt>
                  <dd className="mt-1 text-[13px]">
                    {customer.Phone1 && (
                      <>
                        Primary: {customer.Phone1}
                        <br />
                      </>
                    )}
                    {customer.Phone2 && (
                      <>
                        Secondary: {customer.Phone2}
                        <br />
                      </>
                    )}
                    {customer.Fax && `Fax: ${customer.Fax}`}
                    {!customer.Phone1 && !customer.Phone2 && !customer.Fax && "-"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Email Addresses</dt>
                  <dd className="mt-1 text-[13px]">
                    {customer.Email && (
                      <>
                        General: {customer.Email}
                        <br />
                      </>
                    )}
                    {customer.EmailInvoice && (
                      <>
                        Invoice: {customer.EmailInvoice}
                        <br />
                      </>
                    )}
                    {customer.EmailOrder && (
                      <>
                        Order: {customer.EmailOrder}
                        <br />
                      </>
                    )}
                    {customer.EmailOffer && `Offer: ${customer.EmailOffer}`}
                    {!customer.Email && !customer.EmailInvoice && !customer.EmailOrder && !customer.EmailOffer && "-"}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-black mb-4">Invoice Settings</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Invoice Administration Fee</dt>
                  <dd className="mt-1 text-[13px]">{customer.InvoiceAdministrationFee || "-"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Invoice Discount</dt>
                  <dd className="mt-1 text-[13px]">{customer.InvoiceDiscount || "-"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Invoice Freight</dt>
                  <dd className="mt-1 text-[13px]">{customer.InvoiceFreight || "-"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Comments</dt>
                  <dd className="mt-1 text-[13px]">{customer.Comments || "-"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-black mb-4">Business Details</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Currency</dt>
                  <dd className="mt-1 text-[13px]">{customer.Currency}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Price List</dt>
                  <dd className="mt-1 text-[13px]">{customer.PriceList}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Terms of Payment</dt>
                  <dd className="mt-1 text-[13px]">{customer.TermsOfPayment || "-"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Terms of Delivery</dt>
                  <dd className="mt-1 text-[13px]">{customer.TermsOfDelivery || "-"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Way of Delivery</dt>
                  <dd className="mt-1 text-[13px]">{customer.WayOfDelivery || "-"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Invoice Remark</dt>
                  <dd className="mt-1 text-[13px]">{customer.InvoiceRemark || "-"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-black mb-4">Visiting Address</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Address</dt>
                  <dd className="mt-1 text-[13px]">
                    {customer.VisitingAddress || "-"}
                    <br />
                    {customer.VisitingZipCode} {customer.VisitingCity}
                    <br />
                    {customer.VisitingCountry && `${customer.VisitingCountry} (${customer.VisitingCountryCode})`}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Website</dt>
                  <dd className="mt-1 text-[13px]">{customer.WWW || "-"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CustomerPage;
