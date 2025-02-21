import { AppSidebar } from "@/app/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="pt-[4rem]">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
