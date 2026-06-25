import { createBrowserClient } from '@supabase/ssr';

declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: (options: { template: string }) => Promise<string | null>;
      };
    };
  }
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: async (url, options = {}) => {
          let clerkToken = null;
          if (typeof window !== "undefined") {
            try {
              // Wait for Clerk to load if it hasn't (up to 2 seconds)
              let retries = 20;
              while (!window.Clerk?.session && retries > 0) {
                await new Promise(r => setTimeout(r, 100));
                retries--;
              }
              clerkToken = await window.Clerk?.session?.getToken({ template: 'supabase' });
            } catch (e) {
              console.error("Clerk JWT fetch failed:", e);
            }
          }
          const headers = new Headers(options?.headers);
          if (clerkToken) {
            headers.set('Authorization', `Bearer ${clerkToken}`);
          }
          return fetch(url, { ...options, headers });
        }
      }
    }
  );
}
