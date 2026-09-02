"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { GoogleAuthSync } from "@/components/auth/google-auth-sync";

const QueryProvider = ({ children }: { children: ReactNode }) => {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 30,
            refetchOnReconnect: "always",
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      <GoogleAuthSync />
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;
