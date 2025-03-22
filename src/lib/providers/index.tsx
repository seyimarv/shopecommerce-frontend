"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { RegionProvider } from "../context/region-context";

export function Provider({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <RegionProvider>{children}</RegionProvider>
    </QueryClientProvider>
  );
}
