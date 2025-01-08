"use client";

import { SolanaWalletProvider } from "@/components/providers/SolanaWalletProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { FC, ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

export const ClientProviders: FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SolanaWalletProvider>
        <Toaster />
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SolanaWalletProvider>
    </ThemeProvider>
  );
};
