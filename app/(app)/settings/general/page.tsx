import { SettingsForm } from "@/app/(app)/settings/general/settings-form";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/app/components/page-header";

export default function GeneralSettingsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { title: "Settings", href: "/settings" },
          { title: "General", href: "/settings/general" },
        ]}
      />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-semibold">General Settings</h1>
        </div>
        <Card>
          <CardContent className="mt-8">
            <SettingsForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
