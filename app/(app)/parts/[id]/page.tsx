"use client";

import { useSearchParams, useParams } from "next/navigation";
import { PageHeader } from "@/app/components/page-header";
import { API_ENDPOINTS } from "@/config/api";
import { type Part } from "@/types/part";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/loader";
import { useAuth } from "@/app/contexts/auth-context";

const PartPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const [part, setPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPart = async () => {
      try {
        const tenant = user?.role === "0" ? searchParams.get("tenant") || "" : user?.tenant;
        const id = params.id as string;
        const res = await fetch(`${API_ENDPOINTS.parts}/synchroteam/${id}`, {
          headers: {
            tenant: tenant || "",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch part");
        const data = await res.json();
        setPart(data);
      } catch (error) {
        console.error("Error fetching part:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPart();
  }, [params.id, searchParams, user]);

  const backUrl = searchParams.get("tenant") ? `/parts?tenant=${searchParams.get("tenant")}` : "/parts";

  if (loading) return <Loader />;
  if (!part) return <div className="p-6">Failed to load part</div>;

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { title: "Synchroteam", href: "#" },
          { title: "Parts", href: backUrl },
          { title: part.reference, href: "#" },
        ]}
      />
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <a href={backUrl}>
              <ArrowLeft className="h-4 w-4" />
            </a>
          </Button>
          <h1 className="font-semibold">{part.name}</h1>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-black mb-4">Basic Information</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Reference</dt>
                  <dd className="mt-1 text-[13px]">{part.reference}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Name</dt>
                  <dd className="mt-1 text-[13px]">{part.name}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Description</dt>
                  <dd className="mt-1 text-[13px]">{part.description || "-"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Price</dt>
                  <dd className="mt-1 text-[13px]">{part.price}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Category</dt>
                  <dd className="mt-1 text-[13px]">{part.category.name}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[13px] text-gray-500">Status</dt>
                  <dd className="mt-1 text-[13px]">{part.status}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PartPage;
