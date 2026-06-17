import { createClient } from '@supabase/supabase-js';

// The service role key bypasses RLS policies. NEVER use this on the client.
export const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
