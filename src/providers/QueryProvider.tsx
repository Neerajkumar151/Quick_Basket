import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 30 seconds — prevents redundant refetches
      staleTime: 30_000,
      // Disable automatic retries for failed queries to prevent network spam when backend is down
      retry: false,
      // Disable refetching every time the user switches tabs/focuses the window
      refetchOnWindowFocus: false,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Export queryClient so pages can call queryClient.invalidateQueries after mutations
export { queryClient };
