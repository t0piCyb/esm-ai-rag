import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Layout } from "@/features/page/layout";
import type { PropsWithChildren } from "react";
import { OrgSidebar } from "./org-sidebar";

export async function OrgNavigation({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <OrgSidebar />
      <SidebarInset className="border border-accent">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <Layout>
            <SidebarTrigger className="-ml-1" />
          </Layout>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
