import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
// These variables will be loaded from your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is missing. Please add them to your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
