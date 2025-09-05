"use client";

import * as React from "react";
import { BookOpen, Bot, GalleryVerticalEnd, Settings2, SquareTerminal } from "lucide-react";
import { useAuth } from "../contexts/auth-context";

import { NavMain } from "@/app/components/nav-main";
import { NavUser } from "@/app/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar";

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
          title: "Parts",
          url: "/parts",
        },
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
  const { user } = useAuth();

  const userData = user
    ? {
        name: user.name,
        email: user.email,
        avatar: "",
      }
    : data.user;

  // Filter menu items based on role
  const filteredNavMain =
    user?.role === "1"
      ? [
          // Include Activity for role 1 users
          data.navMain.find((item) => item.title === "Activity"),
          // Include Fortnox section for role 1 users
          data.navMain.find((item) => item.title === "Fortnox"),
          // Include full Synchroteam section for role 1 users
          data.navMain.find((item) => item.title === "Synchroteam"),
        ].filter((item): item is NonNullable<typeof item> => item !== undefined)
      : data.navMain;

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
        <NavMain items={filteredNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
