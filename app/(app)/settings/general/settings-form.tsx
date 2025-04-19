"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Schedule, ScheduleUtils } from "@/types/schedule";
import { API_ENDPOINTS } from "@/config/api";
import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import { type Setting } from "@/types/settings";

const formSchema = z.object({
  fortnox_client_id: z.string().min(1, "Client ID is required"),
  fortnox_client_secret: z.string().min(1, "Client Secret is required"),
  schedule: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export function SettingsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fortnox_client_id: "",
      fortnox_client_secret: "",
      schedule: "300", // Default to 5 minutes
    },
  });

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_ENDPOINTS.settings}`);
        if (!res.ok) throw new Error("Failed to load settings");
        const settings: Setting[] = await res.json();

        const formValues: Partial<FormData> = {};
        settings.forEach((setting) => {
          const key = setting.setting.trim() as keyof FormData;
          if (key in formSchema.shape) {
            formValues[key] = setting.value;
          }
        });

        form.reset(formValues as FormData);
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [form]);

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    try {
      const settings = Object.entries(values).map(([key, value]) => ({
        setting: key,
        value: value.toString(),
        section: "general",
        tenant: null,
      }));

      const res = await fetch(API_ENDPOINTS.settings, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to save settings");
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  }

  const getScheduleDisplay = (seconds: string) => {
    try {
      return ScheduleUtils.fromSeconds(parseInt(seconds)).displayName;
    } catch {
      return "Select schedule";
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="schedule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sync Schedule</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue>{getScheduleDisplay(field.value)}</SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(Schedule).map((schedule) => (
                      <SelectItem key={schedule.seconds} value={schedule.seconds.toString()}>
                        {schedule.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fortnox_client_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fortnox Client ID</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fortnox_client_secret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fortnox Client Secret</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit">Save Changes</Button>
        </form>
      </Form>
    </>
  );
}
