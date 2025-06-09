"use client";

import { Toaster } from "@/components/ui/sonner";
import { AlertDialogRenderer } from "@/features/alert-dialog/alert-dialog-renderer";
import { SearchParamsMessageToastSuspended } from "@/features/searchparams-message/search-params-message-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { PropsWithChildren } from "react";

const queryClient = new QueryClient();

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <AlertDialogRenderer />
          <SearchParamsMessageToastSuspended />
          {children}
        </QueryClientProvider>
      </NuqsAdapter>
    </ThemeProvider>
  );
};
