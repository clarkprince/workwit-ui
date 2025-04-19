"use client";

import { PageHeader } from "@/app/components/page-header";
import { PartsList } from "./_components/parts-list";
import { PartsFilters } from "./_components/parts-filters";
import { TenantProvider } from "../customers/_components/tenant-context";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/auth-context";
import { useTenants } from "../customers/_components/tenant-context";
import { Loader } from "@/components/ui/loader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { QueuedPartsList } from "./_components/queued-parts-list";

const PartsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { tenants } = useTenants();
  const [listKey, setListKey] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "parts");
  const [uploadStatus, setUploadStatus] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);

  const sizeStr = searchParams.get("size") || "10";
  const from = searchParams.get("from") || "";

  const size = Number.isNaN(parseInt(sizeStr)) ? 10 : parseInt(sizeStr);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("tab", value);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/parts${query}`);
  };

  useEffect(() => {
    if (user?.role === "0" && tenants.length > 0 && !searchParams.get("tenant")) {
      const query = `?tenant=${tenants[0].synchroteamDomain}`;
      router.push(`/parts${query}`);
    } else {
      setIsInitialized(true);
    }
  }, [user, tenants, searchParams, router]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <TenantProvider>
      <PageHeader
        breadcrumbs={[
          { title: "Synchroteam", href: "#" },
          { title: "Parts", href: "/parts" },
        ]}
      />
      <div className="p-6">
        <div className="mb-6">
          <h1 className="font-semibold tracking-tight">Parts</h1>
        </div>
        <div className="mb-6">
          <Suspense fallback={<div>Loading filters...</div>}>
            <PartsFilters
              onRefresh={() => setListKey((prev) => prev + 1)}
              onUploadComplete={(message) => {
                setUploadStatus({ status: "success", message });
                setActiveTab("queued");
              }}
              onUploadError={(message) => {
                setUploadStatus({ status: "error", message });
              }}
            />
          </Suspense>
        </div>

        {uploadStatus && (
          <div className="mb-6">
            <Alert variant={uploadStatus.status === "success" ? "default" : "destructive"}>
              {uploadStatus.status === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{uploadStatus.message}</AlertDescription>
            </Alert>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="parts">Parts</TabsTrigger>
            <TabsTrigger value="queued">Queued Parts</TabsTrigger>
          </TabsList>

          <TabsContent value="parts" className="relative overflow-x-auto">
            <PartsList key={listKey} initialPage={1} size={size} from={from} />
          </TabsContent>

          <TabsContent value="queued" className="relative overflow-x-auto">
            <QueuedPartsList size={size} />
          </TabsContent>
        </Tabs>
      </div>
    </TenantProvider>
  );
};

export default PartsPage;
