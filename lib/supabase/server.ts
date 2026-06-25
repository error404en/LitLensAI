import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { auth } from '@clerk/nextjs/server';
import { env } from '../env';

export async function createClient() {
  const cookieStore = await cookies();
  const { getToken } = await auth();
  
  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        fetch: async (url, options = {}) => {
          let clerkToken = null;
          try {
            clerkToken = await getToken({ template: 'supabase' });
          } catch (e) {
            console.warn("Clerk JWT Template 'supabase' not found. Please create it in the Clerk Dashboard.");
          }
          const headers = new Headers(options?.headers);
          if (clerkToken) {
            headers.set('Authorization', `Bearer ${clerkToken}`);
          }
          return fetch(url, { ...options, headers });
        }
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored
          }
        },
      },
    }
  );
}
