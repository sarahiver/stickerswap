// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL     = process.env.REACT_APP_SUPABASE_URL     ?? '';
const SUPABASE_ANON    = process.env.REACT_APP_SUPABASE_ANON_KEY ?? '';

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.error('[Supabase] Missing env vars — check .env.local');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    persistSession:    true,
    autoRefreshToken:  true,
    detectSessionInUrl: true,
    storage:           window.localStorage,
  },
  realtime: {
    params: { eventsPerSecond: 10 },
  },
});
