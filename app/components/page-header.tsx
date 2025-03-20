"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import React from "react";

interface PageHeaderProps {
  breadcrumbs: Array<{
    title: string;
    href?: string;
  }>;
}

export function PageHeader({ breadcrumbs }: PageHeaderProps) {
  return (
    <header className="flex py-5 shrink-0 items-center px-6 border-b fixed top-0 inset-x-0 left-[16rem] bg-background z-10">
      <Breadcrumb>
        <BreadcrumbList className="text-[13px]">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>{crumb.href ? <BreadcrumbLink href={crumb.href}>{crumb.title}</BreadcrumbLink> : <span>{crumb.title}</span>}</BreadcrumbItem>
              {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
