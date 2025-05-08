"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { RegionProvider } from "../context/region-context";
import { Toaster } from 'react-hot-toast';

export function Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <RegionProvider>{children}</RegionProvider>
      <Toaster />
    </QueryClientProvider>
  );
}
