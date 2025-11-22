/**
 * React Query Configuration
 * 
 * Sets up the global QueryClient for managing server state (data fetching).
 * While this prototype mainly uses mock data, this setup is production-ready
 * for when real API endpoints are connected.
 */

import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
 * Helper to check response status and throw error if not OK.
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

/**
 * Generic API Request Wrapper
 * 
 * Standardizes fetch calls with:
 * - Content-Type headers
 * - JSON body stringification
 * - Error handling
 * - Credential inclusion (cookies)
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

/**
 * Default Query Function Generator
 * 
 * Creates a default fetcher for React Query that:
 * - Uses the query key as the URL path
 * - Handles 401 (Unauthorized) specifically if needed
 * - Throws on other errors
 */
type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

/**
 * Global Query Client Instance
 * 
 * Configured with conservative defaults:
 * - No automatic refetching on window focus (can be distracting)
 * - Infinite stale time (data stays fresh until manually invalidated)
 * - No retries (fail fast)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
