"use client";

import * as React from "react";
import { BookOpen, Bot, GalleryVerticalEnd, Settings2, SquareTerminal } from "lucide-react";

import { NavMain } from "@/app/components/nav-main";
import { NavUser } from "@/app/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Joakim Zachen",
    email: "joakim.zachen@workwit.net",
    avatar: "",
  },
  navMain: [
    {
      title: "Activity",
      url: "/activities",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Fortnox",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Customers",
          url: "/customers",
        },
        {
          title: "Articles",
          url: "/articles",
        },
      ],
    },
    {
      title: "Synchroteam",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Jobs",
          url: "/jobs",
        },
        {
          title: "Invoices",
          url: "/invoices",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/settings/general",
        },
        {
          title: "Tenants",
          url: "/settings/tenants",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Workwit</span>
                <span className="text-[12px]">v1.0.0</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
