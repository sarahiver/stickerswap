import { createClient } from '@supabase/supabase-js';

// ============================================================
// Supabase Client
// Umgebungsvariablen aus .env (nie hardcoden!)
// ============================================================

const supabaseUrl  = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey  = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[StickerSwap] Supabase nicht konfiguriert.\n' +
    'Kopiere .env.example zu .env und trage deine Keys ein.'
  );
}

export const supabase = createClient(
  supabaseUrl  || 'https://placeholder.supabase.co',
  supabaseKey  || 'placeholder-key',
  {
    auth: {
      // Token automatisch in localStorage persistieren
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
