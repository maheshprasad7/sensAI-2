import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

console.log("Supabase Init:", { 
  rawUrlLength: rawUrl.length, 
  anonKeyLength: supabaseAnonKey.length 
});

// True only when real credentials are provided
export const isSupabaseConfigured =
  rawUrl.startsWith('http') &&
  !rawUrl.includes('placeholder') &&
  rawUrl !== 'YOUR_SUPABASE_URL' &&
  supabaseAnonKey !== '' &&
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

const supabaseUrl = isSupabaseConfigured ? rawUrl : 'https://placeholder.supabase.co';

export const supabase = createClient(supabaseUrl, supabaseAnonKey || 'placeholder');
