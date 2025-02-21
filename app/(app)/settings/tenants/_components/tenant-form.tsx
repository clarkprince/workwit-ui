"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/config/api";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";

const formSchema = z.object({
  id: z.number(),
  synchroteamDomain: z.string().min(1, "Domain is required"),
  synchroteamAPIKey: z.string().min(1, "API Key is required"),
});

type FormData = z.infer<typeof formSchema>;

export function TenantForm({ id }: { id: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      synchroteamDomain: "",
      synchroteamAPIKey: "",
    },
  });

  useEffect(() => {
    if (id === "new") return;

    const loadTenant = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_ENDPOINTS.tenants}/${id}`);
        if (!res.ok) throw new Error("Failed to load tenant");
        const tenant = await res.json();
        form.reset(tenant);
      } catch (error) {
        console.error("Failed to load tenant:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTenant();
  }, [id, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const url = id === "new" ? API_ENDPOINTS.tenants : `${API_ENDPOINTS.tenants}/${id}`;
      const method = id === "new" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to save tenant");

      toast.success(id === "new" ? "Tenant created successfully" : "Tenant updated successfully");

      router.push("/settings/tenants");
      router.refresh();
    } catch (error) {
      toast.error("Failed to save tenant");
      console.error("Failed to save tenant:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading && <Loader />}
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push("/settings/tenants")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-semibold">Tenant Settings</h1>
        </div>

        <Card>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField control={form.control} name="id" render={({ field }) => <Input type="hidden" {...field} />} />
                <FormField
                  control={form.control}
                  name="synchroteamDomain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="synchroteamAPIKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit">Save Changes</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
